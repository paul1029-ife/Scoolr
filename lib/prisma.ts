import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/lib/generated/prisma/client";

/**
 * Prisma 7 requires a driver adapter. `@prisma/adapter-pg` talks to Neon over
 * the standard Postgres protocol, so point DATABASE_URL at Neon's *pooled*
 * connection string (the one containing `-pooler`) for serverless deployments.
 */
function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and add your Neon connection string."
    );
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>;

// Next.js hot-reloads modules in development, which would otherwise open a new
// pool on every edit and exhaust Neon's connection limit.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientSingleton;
};

let client: PrismaClientSingleton | undefined;

function getClient(): PrismaClientSingleton {
  if (client) return client;

  client = globalForPrisma.prisma ?? createPrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

/**
 * Connects lazily, on first query rather than on import. `next build` imports
 * every route module to collect its config, and does so without DATABASE_URL
 * available — eager construction would fail the build.
 */
export const prisma = new Proxy({} as PrismaClientSingleton, {
  get(_target, property) {
    const instance = getClient();
    const value = Reflect.get(instance, property, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
