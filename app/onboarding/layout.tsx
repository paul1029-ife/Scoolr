import { redirect } from "next/navigation";

import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/lib/auth/server";
import { getCurrentUser } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await auth.getSession();

  if (!data?.user) {
    redirect("/login?next=/onboarding");
  }

  // No school yet — they register one first. Sending them to /dashboard would
  // bounce straight back here via /start.
  const user = await getCurrentUser();
  if (!user) {
    redirect("/start");
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
