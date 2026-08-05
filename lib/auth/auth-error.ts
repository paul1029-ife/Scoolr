/**
 * Recognises the auth failures that need a message of their own.
 *
 * `authClient` is typed as resolving `{ data, error }`, but at runtime
 * `@neondatabase/auth` *throws* for every failed response — it normalises them
 * into `AuthApiError`/`AuthError` (re-exported from `@supabase/auth-js`) inside
 * its fetch wrapper. So the `if (error)` branch never runs, and any form
 * relying on it alone goes completely silent on every failure: a wrong
 * password, a duplicate email, and the 403 an untrusted origin gets all looked
 * like a dead button.
 *
 * Both shapes are handled here, since the typed contract may start being
 * honoured in a later release. `AuthApiError` carries `status`, `code` and
 * `message`, which is all this needs, so it is read structurally rather than
 * with an `instanceof` against a transitive dependency.
 *
 * Returns `null` when there is nothing special to say, so the caller keeps
 * control of its own wording — sign-in in particular has to stay vague about
 * rejected credentials, and that is not a decision to make in here.
 */

/** The error shape `authClient` resolves with. */
type AuthErrorLike = {
  status?: number;
  code?: string;
  message?: string;
};

function asAuthError(source: unknown): AuthErrorLike | null {
  if (typeof source !== "object" || source === null) {
    return null;
  }

  const { status, code, message } = source as AuthErrorLike;

  return {
    status: typeof status === "number" ? status : undefined,
    code: typeof code === "string" ? code : undefined,
    message: typeof message === "string" ? message : undefined,
  };
}

/** The request never reached the auth server at all. */
function isTransportFailure(source: unknown): boolean {
  return (
    source instanceof TypeError ||
    (source instanceof Error &&
      /fetch|network|load failed/i.test(source.message))
  );
}

/**
 * An origin the auth server does not trust. Nothing the person at the keyboard
 * can fix, so it must not be reported as a credential problem.
 */
function isUntrustedOrigin(error: AuthErrorLike): boolean {
  return `${error.code ?? ""} ${error.message ?? ""}`
    .toLowerCase()
    .includes("origin");
}

/**
 * HTTP status behind a failure, whether it arrived as a resolved `{ error }`
 * or as a thrown `AuthApiError`. Callers need it to tell apart the cases this
 * module deliberately leaves to them (rejected credentials, duplicate email).
 */
export function authErrorStatus(source: unknown): number | undefined {
  return asAuthError(source)?.status;
}

/** Server-supplied text, when it is safe and useful to show verbatim. */
export function authErrorMessage(source: unknown): string | undefined {
  return asAuthError(source)?.message?.trim() || undefined;
}

export function describeAuthFailure(source: unknown): string | null {
  if (isTransportFailure(source)) {
    return "Could not reach the server. Check your connection and try again.";
  }

  const error = asAuthError(source);

  if (!error) {
    return null;
  }

  if (isUntrustedOrigin(error)) {
    // Name the host: it is the one detail whoever fixes the config needs, and
    // it turns a mystifying dead button into an actionable report.
    const host =
      typeof window === "undefined" ? "this address" : window.location.origin;
    return `Sign-in is not enabled for ${host}. This is a configuration problem on our side, not something you did — please contact support.`;
  }

  if (error.status === 429) {
    return "Too many attempts. Wait a moment and try again.";
  }

  if (typeof error.status === "number" && error.status >= 500) {
    return "The server had a problem. Please try again in a moment.";
  }

  return null;
}
