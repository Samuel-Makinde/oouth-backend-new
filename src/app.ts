import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { frontendOrigins, type Env } from "./config/env";
import { errorHandler } from "./lib/http";
import { createRouter } from "./routes";
import { openApiDocument } from "./openapi";
import swaggerUi from "swagger-ui-express";
import type { JobQueue, Mailer, ObjectStorage, PaystackClient } from "./providers";

export function createApp(env: Env, mailer: Mailer, storage: ObjectStorage, paystack: PaystackClient, queue: JobQueue) {
  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  const origins = frontendOrigins(env.FRONTEND_ORIGIN);
  app.use(cors({
    origin(origin, callback) {
      if (!origin || origins.includes(origin)) callback(null, true);
      else callback(null, false);
    },
    credentials: true,
  }));
  app.use(pinoHttp({ autoLogging: env.NODE_ENV !== "test" }));
  app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.get("/api/openapi.json", (_req, res) => res.json(openApiDocument));
  app.use("/api", createRouter(env, mailer, storage, paystack, queue));
  app.use(errorHandler);
  return app;
}
