import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { auth } from "@/lib/auth/server";

// Reads the session, so it cannot be prerendered.
export const dynamic = "force-dynamic";

/** Only allow same-origin paths, so `?next=` can't be used as an open redirect. */
function safeRedirect(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }
  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reason?: string }>;
}) {
  const { next, reason } = await searchParams;
  const redirectTo = safeRedirect(next);

  // Already signed in — don't show a sign-in form.
  const { data } = await auth.getSession();
  if (data?.user) {
    redirect(redirectTo);
  }

  // Set when a server action was rejected because the session had lapsed, so
  // the page can explain the sudden trip back here.
  const sessionExpired = reason === "session-expired";

  return (
    <AuthShell
      title={sessionExpired ? "Session expired" : "Welcome back"}
      subtitle={
        sessionExpired
          ? "Sign in again to pick up where you left off."
          : "Sign in to manage your school."
      }
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Create one
          </Link>
        </>
      }
    >
      {sessionExpired && (
        <div
          role="status"
          className="mb-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
        >
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            You were signed out because your session timed out. Anything you
            were part-way through will need to be entered again.
          </span>
        </div>
      )}
      <SignInForm redirectTo={redirectTo} />
    </AuthShell>
  );
}
