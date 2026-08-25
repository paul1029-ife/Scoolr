export type ActionResult = { ok: true } | { ok: false; error: string };

const SESSION_EXPIRED =
  "Your session has expired. Taking you to the sign-in page…";

const UNREACHABLE = "Could not reach the server. Please try again.";

/** Several actions can fail at once; only the first should navigate. */
let redirecting = false;

/**
 * Sends the user to sign in again, returning them to the page they were on.
 *
 * A full document load rather than a router push, so no stale authenticated
 * RSC payload survives the transition.
 */
function redirectToLogin() {
  if (typeof window === "undefined" || redirecting) return;

  // Already on an auth page — nothing to do, and redirecting would loop.
  if (/^\/(login|signup|invite)(\/|$)/.test(window.location.pathname)) return;

  redirecting = true;

  const next = window.location.pathname + window.location.search;
  // Deliberately a document load, not router.push(): the session has expired,
  // so every cached RSC payload in the client router was rendered for a user
  // who is no longer signed in and has to be discarded.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(
    `/login?reason=session-expired&next=${encodeURIComponent(next)}`
  );
}

/**
 * Calls a server action and always resolves to a usable result.
 *
 * When middleware redirects an action POST — which is what happens once a
 * session expires — Next.js resolves the call to `undefined`. Reading `.ok` off
 * that throws a TypeError and takes the page down with an unhandled runtime
 * error, so that case is turned into a redirect back to sign-in.
 */
export async function runAction<T extends ActionResult>(
  action: () => Promise<T>
): Promise<T | { ok: false; error: string }> {
  try {
    const result = await action();

    if (!result || typeof result !== "object" || !("ok" in result)) {
      redirectToLogin();
      return { ok: false, error: SESSION_EXPIRED };
    }

    return result;
  } catch {
    return { ok: false, error: UNREACHABLE };
  }
}
