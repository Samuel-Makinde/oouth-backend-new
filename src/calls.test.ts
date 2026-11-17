import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ApiError } from "./lib/errors";
import { buildIceConfig, createCallService } from "./services/calls.service";

describe("call ICE configuration", () => {
  it("returns Google STUN when TURN is not configured", () => {
    const config = buildIceConfig({ TURN_SERVER_URL: "", TURN_USERNAME: "", TURN_CREDENTIAL: "" });
    expect(config.turn).toBe("off");
    expect(config.iceServers).toEqual([{ urls: "stun:stun.l.google.com:19302" }]);
  });

  it("adds one entry for each TURN URL when the credentials are complete", () => {
    const config = buildIceConfig({
      TURN_SERVER_URL: " stun:stun.relay.example:80, turn:relay.example:80, turns:relay.example:443?transport=tcp ",
      TURN_USERNAME: "turn-user",
      TURN_CREDENTIAL: "turn-secret",
    });
    expect(config.turn).toBe("ready");
    expect(config.iceServers[0]).toEqual({ urls: "stun:stun.l.google.com:19302" });
    expect(config.iceServers[1]).toEqual({ urls: "stun:stun.relay.example:80" });
    expect(config.iceServers[2]).toMatchObject({ urls: "turn:relay.example:80", username: "turn-user", credential: "turn-secret" });
    expect(config.iceServers[3]?.urls).toBe("turns:relay.example:443?transport=tcp");
  });

  it("keeps STUN available when TURN configuration is incomplete", () => {
    const config = buildIceConfig({ TURN_SERVER_URL: "turn:relay.example:80", TURN_USERNAME: "", TURN_CREDENTIAL: "" });
    expect(config.turn).toBe("incomplete");
    expect(config.iceServers).toEqual([{ urls: "stun:stun.l.google.com:19302" }]);
  });
});

describe("call authorization and state", () => {
  const prisma = new PrismaClient();
  const calls = createCallService(prisma);
  const stamp = Date.now();
  const patientId = `00000000-0000-4000-8000-${String(stamp).slice(-12).padStart(12, "0")}`;
  const consultantId = `00000000-0000-4000-8001-${String(stamp).slice(-12).padStart(12, "0")}`;
  const strangerId = `00000000-0000-4000-8002-${String(stamp).slice(-12).padStart(12, "0")}`;
  const appointmentId = `00000000-0000-4000-8003-${String(stamp).slice(-12).padStart(12, "0")}`;
  const secondAppointmentId = `00000000-0000-4000-8004-${String(stamp).slice(-12).padStart(12, "0")}`;

  beforeAll(async () => {
    await prisma.hospitalSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        consultationPerHourNaira: 30000,
        registrationFeeNaira: 20000,
        defaultDurationMinutes: 60,
        cancellationNoticeHours: 24,
        rescheduleNoticeHours: 24,
        joinMinutesBefore: 15,
        joinMinutesAfter: 30,
      },
      update: {},
    });
    const now = new Date();
    await prisma.user.createMany({
      data: [
        { id: patientId, role: "patient", firstName: "Ada", lastName: "Patient", email: `call.patient.${stamp}@patients.oouth.local`, passwordHash: "test" },
        { id: consultantId, role: "consultant", firstName: "Dayo", lastName: "Consultant", email: `call.consultant.${stamp}@staff.oouth.local`, passwordHash: "test", consultantSlug: `call-consultant-${stamp}` },
        { id: strangerId, role: "patient", firstName: "Other", lastName: "Person", email: `call.stranger.${stamp}@patients.oouth.local`, passwordHash: "test" },
      ],
    });
    const visit = {
      patientUserId: patientId,
      consultantSlug: `call-consultant-${stamp}`,
      consultationType: "virtual",
      startsAt: now,
      endsAt: new Date(now.getTime() + 60 * 60 * 1000),
      reason: "Headache",
      status: "confirmed",
      paymentStatus: "verified",
      privacyConsent: true,
      telemedicineConsent: true,
      suggestedDepartmentSlugs: [],
    };
    await prisma.appointment.create({ data: { id: appointmentId, reference: `CALL-${stamp}`, ...visit } });
    await prisma.appointment.create({ data: { id: secondAppointmentId, reference: `CALL-${stamp}-B`, ...visit } });
  });

  afterAll(async () => {
    await prisma.callLock.deleteMany({ where: { userId: { in: [patientId, consultantId, strangerId] } } });
    await prisma.call.deleteMany({ where: { appointmentId: { in: [appointmentId, secondAppointmentId] } } });
    await prisma.appointment.deleteMany({ where: { id: { in: [appointmentId, secondAppointmentId] } } });
    await prisma.user.deleteMany({ where: { id: { in: [patientId, consultantId, strangerId] } } });
    await prisma.$disconnect();
  });

  it("rejects a user who is not the patient or assigned consultant", async () => {
    await expect(calls.initiate(strangerId, appointmentId, "video")).rejects.toMatchObject({ status: 403 });
  });

  it("moves a call from ringing through accept and end, and blocks a second active call", async () => {
    const call = await calls.initiate(patientId, appointmentId, "video");
    expect(call.status).toBe("ringing");
    expect(call.callerId).toBe(patientId);
    expect(call.receiverId).toBe(consultantId);
    await expect(calls.initiate(patientId, secondAppointmentId, "audio")).rejects.toBeInstanceOf(ApiError);
    await expect(calls.accept(patientId, call.id)).rejects.toMatchObject({ status: 403 });
    const accepted = await calls.accept(consultantId, call.id);
    expect(accepted.status).toBe("accepted");
    expect(accepted.answeredAt).toBeTruthy();
    await expect(calls.assertSignal(strangerId, call.id, "ice")).rejects.toMatchObject({ status: 403 });
    await expect(calls.assertSignal(consultantId, call.id, "offer")).rejects.toMatchObject({ status: 403 });
    await expect(calls.assertSignal(patientId, call.id, "answer")).rejects.toMatchObject({ status: 403 });
    await expect(calls.assertSignal(patientId, call.id, "offer")).resolves.toMatchObject({ id: call.id });
    await expect(calls.assertSignal(consultantId, call.id, "answer")).resolves.toMatchObject({ id: call.id });
    const ended = await calls.end(patientId, call.id);
    expect(ended.status).toBe("ended");
    expect(ended.durationSeconds).not.toBeNull();
    const again = await calls.initiate(consultantId, secondAppointmentId, "audio");
    expect(again.callerId).toBe(consultantId);
    expect(again.receiverId).toBe(patientId);
    const rejected = await calls.reject(patientId, again.id);
    expect(rejected.status).toBe("rejected");
  });

  it("records cancel and missed calls", async () => {
    const cancelled = await calls.initiate(patientId, appointmentId, "audio");
    expect((await calls.cancel(patientId, cancelled.id)).status).toBe("cancelled");
    const missed = await calls.initiate(consultantId, appointmentId, "video");
    expect((await calls.miss(missed.id)).status).toBe("missed");
    expect((await calls.miss(missed.id)).status).toBe("missed");
  });
});
