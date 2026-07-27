/**
 * Setup dos testes de integração (Postgres real).
 *
 * Cria um schema efêmero único por execução, aplica o schema Prisma nele
 * (`prisma db push`) e derruba tudo no fim. Roda contra o mesmo Postgres
 * do docker-compose (`npm run db:up`) sem tocar nos dados de dev.
 */
import "dotenv/config";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll } from "vitest";

const schemaId = `test_int_${randomUUID().replace(/-/g, "")}`;

function buildDatabaseUrl(schema: string): string {
  const base = process.env.DATABASE_URL;
  if (!base) {
    throw new Error(
      "DATABASE_URL não definida. Suba o banco com `npm run db:up` e configure o .env.",
    );
  }
  const url = new URL(base);
  url.searchParams.set("schema", schema);
  return url.toString();
}

const databaseUrl = buildDatabaseUrl(schemaId);
process.env.DATABASE_URL = databaseUrl;

// Defaults exigidos pela validação de env (api/src/env) — irrelevantes p/ integração
process.env.JWT_SECRET =
  process.env.JWT_SECRET ?? "test-secret-for-integration-32";
process.env.ADMIN_REGISTRATION_KEY =
  process.env.ADMIN_REGISTRATION_KEY ?? "test-admin-key-1234";
process.env.CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME ?? "test-cloud";
process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY ?? "test-key";
process.env.CLOUDINARY_API_SECRET =
  process.env.CLOUDINARY_API_SECRET ?? "test-secret";
if (!process.env.NODE_ENV) {
  (process.env as Record<string, string>).NODE_ENV = "test";
}

beforeAll(() => {
  execSync("npx prisma db push --skip-generate", {
    cwd: __dirname.replace(/src[/\\]test$/, ""),
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: "pipe",
  });
}, 60_000);

afterAll(async () => {
  const { prisma } = await import("../lib/prisma");
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`,
  );
  await prisma.$disconnect();
}, 60_000);
