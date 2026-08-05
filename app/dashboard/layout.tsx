import { redirect } from "next/navigation";

import { can, permissionsFor } from "@/lib/auth/permissions";
import { auth } from "@/lib/auth/server";
import { getCurrentUser } from "@/lib/tenant";
import { schoolNeedsOnboarding } from "@/lib/queries/onboarding";

import { DashboardShell } from "./DashboardShell";
import { NoAccess } from "./NoAccess";
import { SetupPending } from "./SetupPending";

// Every dashboard page depends on the signed-in user, so none of it can be
// prerendered.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await auth.getSession();

  // Middleware already redirects unauthenticated requests; this is the belt to
  // its braces.
  if (!data?.user) {
    redirect("/login");
  }

  // Resolving here means the account is set up on the first dashboard request,
  // whichever page the user lands on.
  const user = await getCurrentUser();

  // Signed in but not a member of any school: they register their own, which
  // is what makes them its admin.
  if (!user) {
    redirect("/start");
  }

  // Parents and students have no staff dashboard yet. Showing a stripped-back
  // version would be worse than saying so plainly.
  if (!can(user.role, "dashboard:access")) {
    return <NoAccess role={user.role} />;
  }

  // A school with no session, terms or classes cannot meaningfully be used —
  // every page would be an empty state. Admins are sent to finish setup;
  // teachers can't run the wizard, so they see what is outstanding instead.
  if (await schoolNeedsOnboarding()) {
    if (can(user.role, "school:manage")) {
      redirect("/onboarding");
    }
    return <SetupPending />;
  }

  return (
    <DashboardShell
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }}
      permissions={permissionsFor(user.role)}
    >
      {children}
    </DashboardShell>
  );
}
