export const ONBOARDING_STEPS = [
  {
    slug: "profile",
    title: "School profile",
    description: "Name, type and where the school is.",
    required: true,
  },
  {
    slug: "calendar",
    title: "Session & terms",
    description: "The academic year and its three terms.",
    required: true,
  },
  {
    slug: "classes",
    title: "Classes & arms",
    description: "JSS 1 to SSS 3, plus arms and senior streams.",
    required: true,
  },
  {
    slug: "grading",
    title: "Grading",
    description: "Grade bands and the CA / exam split.",
    required: false,
  },
  {
    slug: "subjects",
    title: "Subjects",
    description: "What the school teaches.",
    required: false,
  },
  {
    slug: "staff",
    title: "Invite staff",
    description: "Bring colleagues in.",
    required: false,
  },
] as const;

export type OnboardingStepSlug = (typeof ONBOARDING_STEPS)[number]["slug"];

export const REQUIRED_STEPS = ONBOARDING_STEPS.filter(
  (step) => step.required
).map((step) => step.slug);

export type StepStatus = {
  slug: OnboardingStepSlug;
  title: string;
  description: string;
  required: boolean;
  complete: boolean;
};

export function isStepSlug(value: string): value is OnboardingStepSlug {
  return ONBOARDING_STEPS.some((step) => step.slug === value);
}

/** The first step still outstanding, preferring required ones. */
export function nextIncompleteStep(
  statuses: StepStatus[]
): OnboardingStepSlug | null {
  return (
    statuses.find((step) => step.required && !step.complete)?.slug ??
    statuses.find((step) => !step.complete)?.slug ??
    null
  );
}
