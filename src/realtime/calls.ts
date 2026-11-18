import type { Server as HttpServer } from "node:http";
import { Server, type Socket } from "socket.io";
import { z } from "zod";
import { frontendOrigins, type Env } from "../config/env";
import { accessCookieName, readAccessToken } from "../lib/auth";
import { ApiError } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { createCallService, RING_MS, type CallView } from "../services/calls.service";

const initiateBody = z.object({ appointmentId: z.string().uuid(), type: z.enum(["audio", "video"]) });
const callIdBody = z.object({ callId: z.string().uuid() });
const descriptionBody = callIdBody.extend({
  sdp: z.object({ type: z.enum(["offer", "answer", "pranswer", "rollback"]), sdp: z.string().min(1) }),
});
const candidateBody = callIdBody.extend({
  candidate: z.object({
    candidate: z.string(),
    sdpMid: z.string().nullable().optional(),
    sdpMLineIndex: z.number().nullable().optional(),
    usernameFragment: z.string().nullable().optional(),
  }).nullable(),
});

const calls = createCallService(prisma);
const OFFLINE_GRACE_MS = 8_000;

export function attachCallSocket(server: HttpServer, env: Env) {
  const io = new Server(server, {
    cors: { origin: frontendOrigins(env.FRONTEND_ORIGIN), credentials: true },
  });
  const sockets = new Map<string, Set<string>>();
  const ringTimers = new Map<string, NodeJS.Timeout>();
  const offlineTimers = new Map<string, NodeJS.Timeout>();
  const signalHits = new Map<string, number[]>();

  io.use((socket, next) => {
    const presented = socket.handshake.auth?.token;
    const token = (typeof presented === "string" ? presented : "") || cookieValue(socket.handshake.headers.cookie, accessCookieName());
    const payload = token ? readAccessToken(env, token) : null;
    if (!payload) {
      next(new Error("Sign in to continue."));
      return;
    }
    socket.data.userId = payload.id;
    next();
  });

  io.on("connection", (socket) => {
    const userId = String(socket.data.userId || "");
    if (!userId) {
      socket.disconnect();
      return;
    }
    void connectUser(socket, userId);

    socket.on("call:initiate", (payload, ack) => {
      void handle(socket, ack, async () => {
        if (!allow(signalHits, userId, "initiate", 8, 60_000)) throw new ApiError(429, "rate_limit", "Too many call attempts. Wait a moment.");
        const input = initiateBody.parse(payload);
        const call = await calls.initiate(userId, input.appointmentId, input.type);
        io.to(room(call.receiverId)).emit("call:incoming", { call });
        scheduleRing(call);
        return { call };
      });
    });

    socket.on("call:accept", (payload, ack) => {
      void handle(socket, ack, async () => {
        const input = callIdBody.parse(payload);
        const call = await calls.accept(userId, input.callId);
        clearRing(call.id);
        emitCall(io, call, "call:accepted");
        return { call };
      });
    });

    socket.on("call:reject", (payload, ack) => {
      void handle(socket, ack, async () => {
        const input = callIdBody.parse(payload);
        const call = await calls.reject(userId, input.callId);
        clearRing(call.id);
        emitCall(io, call, "call:rejected");
        return { call };
      });
    });

    socket.on("call:cancel", (payload, ack) => {
      void handle(socket, ack, async () => {
        const input = callIdBody.parse(payload);
        const call = await calls.cancel(userId, input.callId);
        clearRing(call.id);
        emitCall(io, call, "call:cancelled");
        return { call };
      });
    });

    socket.on("call:end", (payload, ack) => {
      void handle(socket, ack, async () => {
        const input = callIdBody.parse(payload);
        const call = await calls.end(userId, input.callId);
        emitCall(io, call, "call:ended");
        return { call };
      });
    });

    socket.on("call:fail", (payload, ack) => {
      void handle(socket, ack, async () => {
        const input = callIdBody.parse(payload);
        const call = await calls.fail(userId, input.callId);
        emitCall(io, call, "call:ended");
        io.to(room(call.callerId)).to(room(call.receiverId)).emit("call:error", { message: "The media connection failed." });
        return { call };
      });
    });

    socket.on("webrtc:offer", (payload, ack) => {
      void relay(socket, ack, payload, descriptionBody, "offer", "webrtc:offer");
    });
    socket.on("webrtc:answer", (payload, ack) => {
      void relay(socket, ack, payload, descriptionBody, "answer", "webrtc:answer");
    });
    socket.on("webrtc:ice-candidate", (payload, ack) => {
      void relay(socket, ack, payload, candidateBody, "ice", "webrtc:ice-candidate");
    });

    socket.on("disconnect", () => {
      const set = sockets.get(userId);
      set?.delete(socket.id);
      if (set && set.size > 0) return;
      sockets.delete(userId);
      const timer = setTimeout(() => {
        offlineTimers.delete(userId);
        void userOffline(userId);
      }, OFFLINE_GRACE_MS);
      offlineTimers.set(userId, timer);
    });
  });

  function scheduleRing(call: CallView) {
    clearRing(call.id);
    const timer = setTimeout(() => {
      ringTimers.delete(call.id);
      void calls.miss(call.id).then((next) => {
        if (next.status === "missed") emitCall(io, next, "call:missed");
      }).catch(() => undefined);
    }, RING_MS);
    ringTimers.set(call.id, timer);
  }

  function clearRing(callId: string) {
    const timer = ringTimers.get(callId);
    if (!timer) return;
    clearTimeout(timer);
    ringTimers.delete(callId);
  }

  async function connectUser(socket: Socket, userId: string) {
    const pending = offlineTimers.get(userId);
    if (pending) {
      clearTimeout(pending);
      offlineTimers.delete(userId);
    }
    const set = sockets.get(userId) ?? new Set<string>();
    const wasOffline = set.size === 0;
    set.add(socket.id);
    sockets.set(userId, set);
    await socket.join(room(userId));
    const call = await calls.current(userId).catch(() => null);
    socket.emit("call:snapshot", { call });
    if (wasOffline) io.to(room(userId)).emit("user:online", { userId });
    if (wasOffline && call) {
      const other = call.callerId === userId ? call.receiverId : call.callerId;
      io.to(room(other)).emit("user:online", { userId });
    }
  }

  async function userOffline(userId: string) {
    const call = await calls.drop(userId).catch(() => null);
    io.to(room(userId)).emit("user:offline", { userId });
    if (!call) return;
    const event = eventFor(call.status);
    if (event) emitCall(io, call, event);
    const other = call.callerId === userId ? call.receiverId : call.callerId;
    io.to(room(other)).emit("user:offline", { userId });
  }

  async function relay(
    socket: Socket,
    ack: unknown,
    payload: unknown,
    schema: typeof descriptionBody | typeof candidateBody,
    direction: "offer" | "answer" | "ice",
    event: "webrtc:offer" | "webrtc:answer" | "webrtc:ice-candidate",
  ) {
    await handle(socket, ack, async () => {
      if (!allow(signalHits, userIdOf(socket), "signal", 120, 10_000)) throw new ApiError(429, "rate_limit", "Too many signaling messages.");
      const input = schema.parse(payload);
      const call = await calls.assertSignal(userIdOf(socket), input.callId, direction);
      const other = call.callerId === userIdOf(socket) ? call.receiverId : call.callerId;
      io.to(room(other)).emit(event, input);
      return { ok: true };
    });
  }

  return io;
}

function emitCall(io: Server, call: CallView, event: string) {
  io.to(room(call.callerId)).to(room(call.receiverId)).emit(event, { call });
}

function eventFor(status: CallView["status"]) {
  if (status === "cancelled") return "call:cancelled";
  if (status === "missed") return "call:missed";
  if (status === "ended" || status === "failed") return "call:ended";
  if (status === "rejected") return "call:rejected";
  return "";
}

function room(userId: string) {
  return `user:${userId}`;
}

function userIdOf(socket: Socket) {
  return String(socket.data.userId || "");
}

async function handle(socket: Socket, ack: unknown, work: () => Promise<Record<string, unknown>>) {
  try {
    const result = await work();
    if (typeof ack === "function") ack(result);
  } catch (error) {
    const message = error instanceof ApiError ? error.message : error instanceof z.ZodError ? "Check the call details." : "The call could not be completed.";
    socket.emit("call:error", { message });
    if (typeof ack === "function") ack({ error: message });
  }
}

function allow(hits: Map<string, number[]>, userId: string, key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = `${userId}:${key}`;
  const recent = (hits.get(bucket) ?? []).filter((at) => now - at < windowMs);
  if (recent.length >= limit) {
    hits.set(bucket, recent);
    return false;
  }
  recent.push(now);
  hits.set(bucket, recent);
  return true;
}

function cookieValue(header: string | undefined, name: string) {
  if (!header) return "";
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 1) continue;
    if (part.slice(0, eq).trim() === name) return decodeURIComponent(part.slice(eq + 1).trim());
  }
  return "";
}
