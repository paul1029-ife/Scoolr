import "server-only";

import { prisma } from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/tenant";
import { ONBOARDING_STEPS, type StepStatus } from "@/lib/onboarding/steps";
import type {
  SchoolLevel,
  SchoolType,
  Stream,
  TermName,
} from "@/lib/generated/prisma/enums";

export type OnboardingSchool = {
  id: string;
  name: string;
  type: SchoolType;
  motto: string | null;
  address: string | null;
  state: string | null;
  lga: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  principalName: string | null;
  onboardingCompletedAt: string | null;
};

export type OnboardingSession = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  terms: {
    id: string;
    name: TermName;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
  }[];
} | null;

export type OnboardingClassRoom = {
  id: string;
  name: string;
  arm: string;
  level: SchoolLevel;
  stream: Stream | null;
  studentCount: number;
};

export type OnboardingGrading = {
  id: string;
  name: string;
  caWeight: number;
  examWeight: number;
  bands: {
    code: string;
    label: string;
    minScore: number;
    maxScore: number;
    isPass: boolean;
  }[];
} | null;

export type OnboardingState = {
  school: OnboardingSchool;
  session: OnboardingSession;
  classRooms: OnboardingClassRoom[];
  grading: OnboardingGrading;
  subjectCount: number;
  staffCount: number;
  pendingInviteCount: number;
  steps: StepStatus[];
  allRequiredComplete: boolean;
};

const iso = (value: Date) => value.toISOString();

export async function getOnboardingState(): Promise<OnboardingState> {
  const schoolId = await getCurrentSchoolId();

  const [school, session, classRooms, grading, subjectCount, staffCount, pendingInviteCount] =
    await Promise.all([
      prisma.school.findUniqueOrThrow({
        where: { id: schoolId },
        select: {
          id: true,
          name: true,
          type: true,
          motto: true,
          address: true,
          state: true,
          lga: true,
          phone: true,
          email: true,
          website: true,
          principalName: true,
          onboardingCompletedAt: true,
        },
      }),
      prisma.academicSession.findFirst({
        where: { schoolId, isCurrent: true },
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          terms: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true,
              isCurrent: true,
            },
            orderBy: { startDate: "asc" },
          },
        },
      }),
      prisma.classRoom.findMany({
        where: { schoolId },
        select: {
          id: true,
          name: true,
          arm: true,
          level: true,
          stream: true,
          _count: { select: { students: true } },
        },
        orderBy: [{ name: "asc" }, { arm: "asc" }],
      }),
      prisma.gradingScale.findFirst({
        where: { schoolId, isDefault: true },
        select: {
          id: true,
          name: true,
          caWeight: true,
          examWeight: true,
          bands: {
            select: {
              code: true,
              label: true,
              minScore: true,
              maxScore: true,
              isPass: true,
            },
            orderBy: { position: "asc" },
          },
        },
      }),
      prisma.subject.count({ where: { schoolId } }),
      prisma.user.count({ where: { schoolId } }),
      prisma.invitation.count({
        where: { schoolId, acceptedAt: null, revokedAt: null },
      }),
    ]);

  // A step counts as done when the thing it sets up actually exists — derived,
  // never a stored "step 3 of 6" that can drift from reality.
  const completion: Record<string, boolean> = {
    profile: Boolean(school.state && school.address),
    calendar: Boolean(session && session.terms.length > 0),
    classes: classRooms.length > 0,
    grading: Boolean(grading && grading.bands.length > 0),
    subjects: subjectCount > 0,
    // The founder counts as one account, so staff is done once anyone else
    // has been added or invited.
    staff: staffCount > 1 || pendingInviteCount > 0,
  };

  const steps: StepStatus[] = ONBOARDING_STEPS.map((step) => ({
    slug: step.slug,
    title: step.title,
    description: step.description,
    required: step.required,
    complete: completion[step.slug] ?? false,
  }));

  return {
    school: {
      ...school,
      onboardingCompletedAt: school.onboardingCompletedAt
        ? iso(school.onboardingCompletedAt)
        : null,
    },
    session: session
      ? {
          id: session.id,
          name: session.name,
          startDate: iso(session.startDate),
          endDate: iso(session.endDate),
          terms: session.terms.map((term) => ({
            ...term,
            startDate: iso(term.startDate),
            endDate: iso(term.endDate),
          })),
        }
      : null,
    classRooms: classRooms.map(({ _count, ...classRoom }) => ({
      ...classRoom,
      studentCount: _count.students,
    })),
    grading,
    subjectCount,
    staffCount,
    pendingInviteCount,
    steps,
    allRequiredComplete: steps
      .filter((step) => step.required)
      .every((step) => step.complete),
  };
}

/** Cheap check for the dashboard gate — avoids loading the whole state. */
export async function schoolNeedsOnboarding(): Promise<boolean> {
  const schoolId = await getCurrentSchoolId();

  const school = await prisma.school.findUniqueOrThrow({
    where: { id: schoolId },
    select: { onboardingCompletedAt: true },
  });

  return school.onboardingCompletedAt === null;
}
