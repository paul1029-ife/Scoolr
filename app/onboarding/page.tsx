import { redirect } from "next/navigation";

import { getOnboardingState } from "@/lib/queries/onboarding";
import { nextIncompleteStep } from "@/lib/onboarding/steps";

export const dynamic = "force-dynamic";

/** Drops the user at the first step they still have to do. */
export default async function OnboardingIndexPage() {
  const state = await getOnboardingState();

  redirect(`/onboarding/${nextIncompleteStep(state.steps) ?? "profile"}`);
}
