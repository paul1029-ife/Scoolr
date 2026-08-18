import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, MailCheck, XCircle } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { hashToken } from "@/lib/auth/invitation-token";
import { roleLabel } from "@/lib/auth/permissions";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/tenant";

// Reads a one-time token and the session; never cached.
export const dynamic = "force-dynamic";

function Outcome({
  tone,
  title,
  children,
  action,
}: {
  tone: "success" | "error" | "info";
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  const Icon =
    tone === "success" ? CheckCircle2 : tone === "error" ? XCircle : MailCheck;
  const colours =
    tone === "success"
      ? "bg-green-100 text-green-600"
      : tone === "error"
      ? "bg-red-100 text-red-600"
      : "bg-blue-100 text-blue-600";

  return (
    <AuthShell title={title} withCard>
      <div className="text-center">
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${colours}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="text-sm text-gray-600">{children}</div>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </AuthShell>
  );
}

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // The stored value is a hash, so the raw token is looked up by hashing it.
  const invitation = await prisma.invitation.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      id: true,
      email: true,
      role: true,
      expiresAt: true,
      acceptedAt: true,
      revokedAt: true,
      school: { select: { name: true } },
    },
  });

  if (!invitation || invitation.revokedAt) {
    return (
      <Outcome
        tone="error"
        title="Invitation not valid"
        action={
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        }
      >
        This invitation link is not recognised, or it has been withdrawn. Ask
        your administrator to send a new one.
      </Outcome>
    );
  }

  if (invitation.acceptedAt) {
    return (
      <Outcome
        tone="info"
        title="Already accepted"
        action={
          <Button asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        }
      >
        This invitation has already been used. Sign in with{" "}
        <span className="font-medium">{invitation.email}</span>.
      </Outcome>
    );
  }

  if (invitation.expiresAt < new Date()) {
    return (
      <Outcome
        tone="error"
        title="Invitation expired"
        action={
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        }
      >
        This link has expired. Ask an administrator at {invitation.school.name}{" "}
        to invite you again.
      </Outcome>
    );
  }

  const { data } = await auth.getSession();

  // Not signed in yet — send them to sign up, then straight back here.
  if (!data?.user) {
    return (
      <Outcome
        tone="info"
        title={`Join ${invitation.school.name}`}
        action={
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href={`/signup?next=/invite/${token}`}>
                Create your account
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/login?next=/invite/${token}`}>
                I already have an account
              </Link>
            </Button>
          </div>
        }
      >
        You&apos;ve been invited to join{" "}
        <span className="font-medium">{invitation.school.name}</span> as a{" "}
        {roleLabel[invitation.role].toLowerCase()}. Use{" "}
        <span className="font-medium">{invitation.email}</span> when you sign up
        — the invitation is tied to that address.
      </Outcome>
    );
  }

  // Signed in as someone else: the invitation is bound to one address.
  if (data.user.email.toLowerCase() !== invitation.email.toLowerCase()) {
    return (
      <Outcome
        tone="error"
        title="Different account"
        action={
          <Button asChild variant="outline">
            <Link href="/login">Sign in as someone else</Link>
          </Button>
        }
      >
        This invitation is for{" "}
        <span className="font-medium">{invitation.email}</span>, but you are
        signed in as <span className="font-medium">{data.user.email}</span>.
        Sign out and sign in with the invited address.
      </Outcome>
    );
  }

  // Emails match — `getCurrentUser` consumes the invitation and creates the
  // account, so the dashboard is reachable immediately.
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <Outcome
      tone="error"
      title="Could not accept invitation"
      action={
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      }
    >
      Something went wrong setting up your account. Please try the link again.
    </Outcome>
  );
}
