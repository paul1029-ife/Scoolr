import { createNeonAuth, type NeonAuth } from "@neondatabase/auth/next/server";
import type { NextRequest, NextResponse } from "next/server";

/**
 * Server-side Neon Auth (Managed Better Auth).
 *
 * `NEON_AUTH_BASE_URL` is the Neon project's auth endpoint;
 * `NEON_AUTH_COOKIE_SECRET` signs session cookies and must be at least 32
 * characters (`openssl rand -base64 32`).
 */
function createAuth(): NeonAuth {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const secret = process.env.NEON_AUTH_COOKIE_SECRET;

  if (!baseUrl || !secret) {
    throw new Error(
      "Neon Auth is not configured. Set NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET — see .env.example."
    );
  }

  return createNeonAuth({ baseUrl, cookies: { secret } });
}

let instance: NeonAuth | undefined;

function getAuth(): NeonAuth {
  return (instance ??= createAuth());
}

/**
 * Initialises lazily, on first use rather than on import. `next build` imports
 * every route and middleware module to collect config, and CI does so without
 * auth secrets available — eager construction would fail the build.
 */
export const auth = new Proxy({} as NeonAuth, {
  get(_target, property) {
    const target = getAuth();
    const value = Reflect.get(target, property, target);
    return typeof value === "function" ? value.bind(target) : value;
  },
});

type Handler = ReturnType<NeonAuth["handler"]>;

let handler: Handler | undefined;

function getHandler(): Handler {
  return (handler ??= getAuth().handler());
}

/** Route handlers for `app/api/auth/[...path]/route.ts`, built on first request. */
export const authHandler = {
  GET: ((request, context) =>
    getHandler().GET(request, context)) as Handler["GET"],
  POST: ((request, context) =>
    getHandler().POST(request, context)) as Handler["POST"],
};

/** Middleware factory that defers construction until the first request. */
export function authMiddleware(config?: { loginUrl?: string }) {
  let middleware: ((request: NextRequest) => Promise<NextResponse>) | undefined;

  return (request: NextRequest) => {
    middleware ??= getAuth().middleware(config);
    return middleware(request);
  };
}
