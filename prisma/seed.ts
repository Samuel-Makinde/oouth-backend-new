import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { ensurePreviewCatalog } from "../src/bootstrap/ensure-catalog";
import { loadDotEnv } from "../src/config/env";

loadDotEnv(path.resolve(__dirname, "../.env"));

const prisma = new PrismaClient();
const password = process.env.DEMO_STAFF_PASSWORD || "Preview#2026";

ensurePreviewCatalog(prisma, password)
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });
