import { NextResponse, type NextRequest } from "next/server";

import { authMiddleware } from "@/lib/auth/server";

const guard = authMiddleware({ loginUrl: "/login" });

/**
 * Requires a session for page navigations under /dashboard.
 *
 * Only GET/HEAD go through the auth middleware. `@neondatabase/auth`
 * (0.4.2-beta) proxies its `get-session` check upstream using the *incoming*
 * request's method — so a server action POST hits that GET-only endpoint, the
 * proxy returns non-2xx, the session reads as null, and the action is
 * redirected to /login no matter how valid the session actually is. That made
 * every create/update/delete in the dashboard fail immediately after signing in.
 *
 * Skipping non-GET here does not weaken anything: mutations are authorised by
 * `ensurePermission()` at the top of every server action, which resolves the
 * session server-side and is the real boundary. Middleware was only ever
 * defence-in-depth for navigation.
 *
 * Revisit once the upstream fix lands; the package is pre-1.0.
 */
export default function middleware(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  return guard(request);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
