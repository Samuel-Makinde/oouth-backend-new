import { PrismaClient } from "@prisma/client";

function databaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required. The API does not connect with PGHOST, PGUSER, PGPORT, or PGDATABASE.");
  }
  return url;
}

export function databaseTarget(url = databaseUrl()) {
  const parsed = new URL(url);
  const name = parsed.pathname.replace(/^\//, "") || "(default)";
  return `${parsed.hostname}:${parsed.port || "5432"}/${name}`;
}

export const prisma = new PrismaClient({
  datasources: {
    db: { url: databaseUrl() },
  },
});

export async function connectDatabase() {
  const target = databaseTarget();
  try {
    await prisma.$connect();
  } catch (error) {
    console.error(`Database connection failed using DATABASE_URL at ${target}`);
    throw error;
  }
  console.log(`Database connected using DATABASE_URL at ${target}`);
}
