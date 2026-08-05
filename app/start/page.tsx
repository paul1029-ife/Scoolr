import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/tenant";

import { CreateSchoolForm } from "./CreateSchoolForm";

export const dynamic = "force-dynamic";

/**
 * Where someone lands after signing up without an invitation: they register
 * their own school and become its administrator.
 */
export default async function StartPage() {
  const { data } = await auth.getSession();

  if (!data?.user) {
    redirect("/login?next=/start");
  }

  // An invitation would already have created their account, so anyone who has
  // one belongs somewhere and should not be here.
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  // A live invitation they haven't opened yet: joining beats creating a
  // second, empty school.
  const invitation = await prisma.invitation.findFirst({
    where: {
      email: data.user.email.toLowerCase(),
      acceptedAt: null,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: { school: { select: { name: true } } },
  });

  return (
    <>
      <AuthShell
        title="Set up your school"
        subtitle="Create your school on Scoolr — it takes a minute."
      >
        {invitation && (
          <div className="mb-4 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
            You have a pending invitation to join{" "}
            <span className="font-medium">{invitation.school.name}</span>. Open
            the link in that email to join them instead of creating a new
            school.
          </div>
        )}
        <CreateSchoolForm email={data.user.email} />
      </AuthShell>
      <Toaster />
    </>
  );
}
