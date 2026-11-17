import { createServer } from "node:http";
import { loadDotEnv, loadEnv } from "./config/env";

async function main() {
  loadDotEnv();
  const env = loadEnv();
  const { connectDatabase } = await import("./lib/prisma");
  await connectDatabase();
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
