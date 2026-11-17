import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { loadDotEnv, loadEnv } from "./config/env";

function applyMigrations() {
  const cli = path.resolve(process.cwd(), "node_modules/prisma/build/index.js");
  if (!existsSync(cli)) throw new Error("Prisma CLI is not installed, so the database schema cannot be created.");
  execFileSync(process.execPath, [cli, "migrate", "deploy"], { stdio: "inherit" });
}

async function main() {
  loadDotEnv();
  const env = loadEnv();
  if (env.NODE_ENV === "production") applyMigrations();
  const { connectDatabase, prisma } = await import("./lib/prisma");
  await connectDatabase();
  const { ensurePreviewCatalog } = await import("./bootstrap/ensure-catalog");
  await ensurePreviewCatalog(prisma, env.DEMO_STAFF_PASSWORD);
  const { createApp } = await import("./app");
  const { createInlineQueue, createMailer, createObjectStorage, createPaystack, createRedisQueue } = await import("./providers");
  const mailer = createMailer(env);
  const storage = createObjectStorage();
  const paystack = createPaystack(env);
  const queue = env.REDIS_URL
    ? await createRedisQueue(env.REDIS_URL, async (name, payload) => {
        if (name === "email") await mailer.send({ to: payload.to, subject: payload.subject, text: payload.text });
      })
    : createInlineQueue(async (name, payload) => {
        if (name === "email") await mailer.send({ to: payload.to, subject: payload.subject, text: payload.text });
      });
  const app = createApp(env, mailer, storage, paystack, queue);
  const server = createServer(app);
  const { attachCallSocket } = await import("./realtime/calls");
  attachCallSocket(server, env);
  server.listen(env.PORT, () => {
    console.log(`OOUTH API listening on ${env.PORT}`);
  });
}

void main();
