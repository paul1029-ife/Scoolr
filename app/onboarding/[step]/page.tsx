import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getOnboardingState } from "@/lib/queries/onboarding";
import { currentUserCan } from "@/lib/tenant";
import { isStepSlug } from "@/lib/onboarding/steps";

import { OnboardingShell } from "../OnboardingShell";
import {
  CalendarStep,
  ClassesStep,
  GradingStep,
  ProfileStep,
  SubjectsStep,
} from "./StepForms";

export const dynamic = "force-dynamic";

export default async function OnboardingStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;

  if (!isStepSlug(step)) {
    notFound();
  }

  // Setting a school up is an administrative act; a teacher who lands here
  // should not be able to rewrite the calendar or grading scale.
  if (!(await currentUserCan("school:manage"))) {
    redirect("/dashboard");
  }

  const state = await getOnboardingState();

  return (
    <OnboardingShell
      schoolName={state.school.name}
      steps={state.steps}
      currentSlug={step}
      allRequiredComplete={state.allRequiredComplete}
    >
      {step === "profile" && <ProfileStep school={state.school} />}
      {step === "calendar" && <CalendarStep session={state.session} />}
      {step === "classes" && <ClassesStep classRooms={state.classRooms} />}
      {step === "grading" && <GradingStep grading={state.grading} />}
      {step === "subjects" && <SubjectsStep subjectCount={state.subjectCount} />}
      {step === "staff" && (
        <div>
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900">
              Invite staff
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Colleagues get an email with a link to create their account. You
              choose what each of them can do.
            </p>
          </div>

          <div className="rounded-md border border-gray-200 p-4">
            <p className="text-sm text-gray-700">
              {state.staffCount === 1 && state.pendingInviteCount === 0
                ? "It's just you so far."
                : `${state.staffCount} account${
                    state.staffCount === 1 ? "" : "s"
                  }${
                    state.pendingInviteCount > 0
                      ? ` and ${state.pendingInviteCount} pending invitation${
                          state.pendingInviteCount === 1 ? "" : "s"
                        }`
                      : ""
                  }.`}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Invitations live on the Staff page, where you can also change
              roles and withdraw invites.
            </p>
            <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard/staff">
                <UserPlus className="mr-2 h-4 w-4" />
                Open Staff page
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <p className="text-sm text-gray-600">
              This step is optional — you can invite people any time.
            </p>
            <Button asChild variant="outline">
              <Link href="/onboarding/profile">
                Back to start
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </OnboardingShell>
  );
}
