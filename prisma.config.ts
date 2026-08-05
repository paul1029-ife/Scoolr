import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Read by the Prisma CLI only (migrate, db, studio, generate) — never at runtime.
 * The app itself connects through `lib/prisma.ts`.
 *
 * Migrations use Neon's DIRECT (unpooled) connection because PgBouncer does not
 * support the advisory locks Prisma takes while applying a migration. The app
 * keeps using the pooled DATABASE_URL.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DIRECT_DATABASE_URL"] ?? process.env["DATABASE_URL"],
    // `prisma migrate dev` diffs against a throwaway shadow database. Managed
    // Postgres (Neon included) usually won't let Prisma create one on the fly,
    // so point this at a second, empty database.
    shadowDatabaseUrl: process.env["SHADOW_DATABASE_URL"],
  },
});
