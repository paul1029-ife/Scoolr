import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
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

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  // Invitation links come through here as ?next=/invite/<token>, so a new
  // account lands back on the invitation instead of a dead end.
  const redirectTo = safeRedirect(next);

  const { data } = await auth.getSession();
  if (data?.user) {
    redirect(redirectTo);
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Get your school set up on Scoolr."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm redirectTo={redirectTo} />
    </AuthShell>
  );
}
