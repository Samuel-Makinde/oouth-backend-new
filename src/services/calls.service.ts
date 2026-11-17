import type { PrismaClient, User } from "@prisma/client";
import type { Env } from "../config/env";
import { writeAudit } from "../lib/audit";
import { badRequest, conflict, forbidden, notFound } from "../lib/errors";
import { requireUser, settings, SUPER_CONSULTANT_SLUG } from "./shared";

export const RING_MS = 45_000;

export type CallType = "audio" | "video";
export type CallStatus = "ringing" | "accepted" | "rejected" | "missed" | "cancelled" | "ended" | "failed";

export type CallView = {
  id: string;
  appointmentId: string;
  callerId: string;
  receiverId: string;
  callerName: string;
  receiverName: string;
  type: CallType;
  status: CallStatus;
  startedAt: string;
  answeredAt: string | null;
  endedAt: string | null;
  durationSeconds: number | null;
};

type CallRow = {
  id: string;
  appointmentId: string;
  callerId: string;
  receiverId: string;
  type: string;
  status: string;
  startedAt: Date;
  answeredAt: Date | null;
  endedAt: Date | null;
  durationSeconds: number | null;
  caller: User;
  receiver: User;
};

const include = { caller: true, receiver: true } as const;

export type IceServer = { urls: string; username?: string; credential?: string };

export function buildIceConfig(env: Pick<Env, "TURN_SERVER_URL" | "TURN_USERNAME" | "TURN_CREDENTIAL">) {
  const iceServers: IceServer[] = [{ urls: "stun:stun.l.google.com:19302" }];
  const urls = env.TURN_SERVER_URL.split(",").map((item) => item.trim()).filter(Boolean);
  const username = env.TURN_USERNAME.trim();
  const credential = env.TURN_CREDENTIAL.trim();
  const turnReady = urls.length > 0 && Boolean(username) && Boolean(credential);
  const turnIncomplete = !turnReady && (urls.length > 0 || Boolean(username) || Boolean(credential));
  if (turnReady) {
    for (const url of urls) {
      if (url.startsWith("turn:") || url.startsWith("turns:")) iceServers.push({ urls: url, username, credential });
      else iceServers.push({ urls: url });
    }
  }
  return { iceServers, turn: turnReady ? "ready" : turnIncomplete ? "incomplete" : "off" } as const;
}

export function createCallService(prisma: PrismaClient) {
  return {
    async current(userId: string) {
      const lock = await prisma.callLock.findUnique({ where: { userId }, include: { call: { include } } });
      return lock ? present(lock.call) : null;
    },

    async initiate(actorId: string, appointmentId: string, type: CallType) {
      const actor = await requireUser(prisma, actorId);
      const appointment = await openAppointment(prisma, appointmentId);
      const party = partyOf(actor, appointment);
      if (!party) throw forbidden("You cannot call on this visit.");
      const consultant = await prisma.user.findFirst({
        where: { role: "consultant", consultantSlug: appointment.consultantSlug, active: true, deletedAt: null },
      });
      const patient = await prisma.user.findFirst({ where: { id: appointment.patientUserId, active: true, deletedAt: null } });
      if (!patient) throw notFound("That patient was not found.");
      if (!consultant) throw badRequest("That consultant is not available.");
      const callerId = actor.id;
      const receiverId = party === "patient" ? consultant.id : patient.id;
      if (callerId === receiverId) throw conflict("You cannot call yourself.");
      try {
        const created = await prisma.$transaction(async (tx) => {
          const call = await tx.call.create({
            data: {
              appointmentId,
              callerId,
              receiverId,
              type,
              status: "ringing",
            },
          });
          await tx.callLock.createMany({ data: [{ userId: callerId, callId: call.id }, { userId: receiverId, callId: call.id }] });
          await writeAudit(tx, actor.id, "call.initiate", `Started a ${type} call`, { type: "call", id: call.id });
          return call;
        });
        return present(await load(prisma, created.id));
      } catch (error) {
        if (isUnique(error)) throw conflict("You are already in a call.");
        throw error;
      }
    },

    accept(actorId: string, callId: string) {
      return transition(prisma, actorId, callId, "ringing", "accepted", "receiver", "call.accept", "Accepted a call", { answeredAt: new Date() });
    },

    reject(actorId: string, callId: string) {
      return transition(prisma, actorId, callId, "ringing", "rejected", "receiver", "call.reject", "Rejected a call");
    },

    cancel(actorId: string, callId: string) {
      return transition(prisma, actorId, callId, "ringing", "cancelled", "caller", "call.cancel", "Cancelled a call");
    },

    end(actorId: string, callId: string) {
      return transition(prisma, actorId, callId, "accepted", "ended", "either", "call.end", "Ended a call");
    },

    fail(actorId: string, callId: string) {
      return transition(prisma, actorId, callId, "accepted", "failed", "either", "call.fail", "Call media failed");
    },

    async miss(callId: string) {
      const call = await load(prisma, callId);
      if (call.status !== "ringing") return present(call);
      await close(prisma, call, "missed", call.callerId, "call.miss", "Missed a call");
      return present(await load(prisma, callId));
    },

    async drop(userId: string) {
      const lock = await prisma.callLock.findUnique({ where: { userId } });
      if (!lock) return null;
      const call = await load(prisma, lock.callId);
      if (call.status === "ringing" && call.callerId === userId) return this.cancel(userId, call.id);
      if (call.status === "ringing" && call.receiverId === userId) {
        await close(prisma, call, "missed", userId, "call.miss", "Missed a call");
        return present(await load(prisma, call.id));
      }
      if (call.status === "accepted") return this.end(userId, call.id);
      return present(call);
    },

    async assertSignal(actorId: string, callId: string, direction: "offer" | "answer" | "ice") {
      const call = await load(prisma, callId);
      if (call.status !== "accepted") throw conflict("This call is not connected.");
      if (actorId !== call.callerId && actorId !== call.receiverId) throw forbidden("You are not on this call.");
      if (direction === "offer" && actorId !== call.callerId) throw forbidden("Only the caller can send the offer.");
      if (direction === "answer" && actorId !== call.receiverId) throw forbidden("Only the receiver can send the answer.");
      return present(call);
    },
  };
}

async function openAppointment(prisma: PrismaClient, appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment) throw notFound("That appointment was not found.");
  if (appointment.consultationType !== "virtual" || appointment.paymentStatus !== "verified") {
    throw forbidden("This video room is not open.");
  }
  if (["cancelled", "completed", "no_show"].includes(appointment.status)) throw forbidden("This visit can no longer take a call.");
  const hospital = await settings(prisma);
  const start = appointment.startsAt.getTime() - hospital.joinMinutesBefore * 60_000;
  const end = appointment.endsAt.getTime() + hospital.joinMinutesAfter * 60_000;
  const now = Date.now();
  if (now < start || now > end) throw forbidden("The join window is closed.");
  return appointment;
}

function partyOf(user: User, appointment: { patientUserId: string; consultantSlug: string }) {
  if (user.role === "patient" && user.id === appointment.patientUserId) return "patient" as const;
  if (user.role === "consultant" && (user.consultantSlug === appointment.consultantSlug || user.consultantSlug === SUPER_CONSULTANT_SLUG)) {
    return "consultant" as const;
  }
  return null;
}

async function transition(
  prisma: PrismaClient,
  actorId: string,
  callId: string,
  from: CallStatus,
  to: CallStatus,
  who: "caller" | "receiver" | "either",
  action: string,
  summary: string,
  extra: { answeredAt?: Date } = {},
) {
  const call = await load(prisma, callId);
  if (call.status === to) return present(call);
  if (call.status !== from) throw conflict("This call has already changed.");
  if (who === "caller" && call.callerId !== actorId) throw forbidden("Only the caller can do that.");
  if (who === "receiver" && call.receiverId !== actorId) throw forbidden("Only the person being called can do that.");
  if (who === "either" && call.callerId !== actorId && call.receiverId !== actorId) throw forbidden("You are not on this call.");
  await close(prisma, call, to, actorId, action, summary, extra.answeredAt);
  return present(await load(prisma, callId));
}

async function close(
  prisma: PrismaClient,
  call: CallRow,
  status: CallStatus,
  actorId: string,
  action: string,
  summary: string,
  answeredAt?: Date,
) {
  const endedAt = status === "accepted" ? null : new Date();
  const answer = answeredAt ?? call.answeredAt;
  const durationSeconds = endedAt && answer ? Math.max(0, Math.round((endedAt.getTime() - answer.getTime()) / 1000)) : status === "accepted" ? null : 0;
  await prisma.$transaction(async (tx) => {
    const updated = await tx.call.updateMany({
      where: { id: call.id, status: call.status },
      data: {
        status,
        answeredAt: answer,
        endedAt,
        durationSeconds,
      },
    });
    if (updated.count !== 1) throw conflict("This call has already changed.");
    if (status !== "accepted") await tx.callLock.deleteMany({ where: { callId: call.id } });
    await writeAudit(tx, actorId, action, summary, { type: "call", id: call.id });
  });
}

async function load(prisma: PrismaClient, id: string) {
  const call = await prisma.call.findUnique({ where: { id }, include });
  if (!call) throw notFound("That call was not found.");
  return call;
}

function present(call: CallRow): CallView {
  return {
    id: call.id,
    appointmentId: call.appointmentId,
    callerId: call.callerId,
    receiverId: call.receiverId,
    callerName: `${call.caller.firstName} ${call.caller.lastName}`.trim(),
    receiverName: `${call.receiver.firstName} ${call.receiver.lastName}`.trim(),
    type: call.type === "audio" ? "audio" : "video",
    status: call.status as CallStatus,
    startedAt: call.startedAt.toISOString(),
    answeredAt: call.answeredAt?.toISOString() ?? null,
    endedAt: call.endedAt?.toISOString() ?? null,
    durationSeconds: call.durationSeconds,
  };
}

function isUnique(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "P2002";
}
