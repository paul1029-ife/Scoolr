"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  SchoolLevel,
  SchoolType,
  Stream,
  TermName,
} from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { ensurePermission } from "@/lib/tenant";

export type ActionResult = { ok: true } | { ok: false; error: string };

function firstIssue(error: z.ZodError, fallback: string) {
  return { ok: false as const, error: error.issues[0]?.message ?? fallback };
}

function revalidateOnboarding() {
  revalidatePath("/onboarding", "layout");
  revalidatePath("/dashboard", "layout");
}

// ---------------------------------------------------------------------------
// Step 1 — school profile
// ---------------------------------------------------------------------------

const profileSchema = z.object({
  name: z.string().trim().min(2, "School name is required"),
  type: z.nativeEnum(SchoolType),
  motto: z.string().trim().max(160, "Motto is too long").optional(),
  address: z.string().trim().min(4, "Address is required"),
  state: z.string().trim().min(2, "Select a state"),
  lga: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email("Enter a valid email").or(z.literal("")).optional(),
  website: z.string().trim().optional(),
  principalName: z.string().trim().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export async function saveSchoolProfile(
  data: ProfileFormData
): Promise<ActionResult> {
  const permitted = await ensurePermission("school:manage");
  if (!permitted.ok) return permitted;

  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) return firstIssue(parsed.error, "Invalid school details");

  const { name, motto, lga, phone, email, website, principalName, ...rest } =
    parsed.data;

  await prisma.school.update({
    where: { id: permitted.user.schoolId },
    data: {
      name,
      ...rest,
      motto: motto || null,
      lga: lga || null,
      phone: phone || null,
      email: email || null,
      website: website || null,
      principalName: principalName || null,
    },
  });

  revalidateOnboarding();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Step 2 — academic session and terms
// ---------------------------------------------------------------------------

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date");

const calendarSchema = z
  .object({
    name: z
      .string()
      .trim()
      .regex(/^\d{4}\/\d{4}$/, 'Session should look like "2025/2026"'),
    startDate: dateString,
    endDate: dateString,
    terms: z
      .array(
        z.object({
          name: z.nativeEnum(TermName),
          startDate: dateString,
          endDate: dateString,
        })
      )
      .length(3, "A Nigerian session has three terms"),
  })
  .refine((value) => value.startDate < value.endDate, {
    message: "The session must end after it starts",
    path: ["endDate"],
  })
  .refine(
    (value) => value.terms.every((term) => term.startDate < term.endDate),
    { message: "Each term must end after it starts", path: ["terms"] }
  );

export type CalendarFormData = z.infer<typeof calendarSchema>;

export async function saveAcademicCalendar(
  data: CalendarFormData
): Promise<ActionResult> {
  const permitted = await ensurePermission("school:manage");
  if (!permitted.ok) return permitted;

  const parsed = calendarSchema.safeParse(data);
  if (!parsed.success) return firstIssue(parsed.error, "Invalid calendar");

  const { name, startDate, endDate, terms } = parsed.data;
  const schoolId = permitted.user.schoolId;
  const today = new Date().toISOString().slice(0, 10);

  await prisma.$transaction(async (tx) => {
    // Only one session is current at a time.
    await tx.academicSession.updateMany({
      where: { schoolId },
      data: { isCurrent: false },
    });

    const session = await tx.academicSession.upsert({
      where: { schoolId_name: { schoolId, name } },
      update: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isCurrent: true,
      },
      create: {
        schoolId,
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isCurrent: true,
      },
      select: { id: true },
    });

    for (const term of terms) {
      // The term containing today is the live one; if the session is future or
      // past, nothing is marked current rather than guessing.
      const isCurrent = today >= term.startDate && today <= term.endDate;

      await tx.term.upsert({
        where: { sessionId_name: { sessionId: session.id, name: term.name } },
        update: {
          startDate: new Date(term.startDate),
          endDate: new Date(term.endDate),
          isCurrent,
        },
        create: {
          sessionId: session.id,
          name: term.name,
          startDate: new Date(term.startDate),
          endDate: new Date(term.endDate),
          isCurrent,
        },
      });
    }
  });

  revalidateOnboarding();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Step 3 — classes, arms and streams
// ---------------------------------------------------------------------------

const classesSchema = z.object({
  classRooms: z
    .array(
      z.object({
        name: z.string().trim().min(2, "Class name is required"),
        level: z.nativeEnum(SchoolLevel),
        arm: z.string().trim().max(12, "Arm name is too long"),
        stream: z.nativeEnum(Stream).nullable(),
      })
    )
    .min(1, "Add at least one class"),
});

export type ClassesFormData = z.infer<typeof classesSchema>;

export async function saveClassRooms(
  data: ClassesFormData
): Promise<ActionResult> {
  const permitted = await ensurePermission("school:manage");
  if (!permitted.ok) return permitted;

  const parsed = classesSchema.safeParse(data);
  if (!parsed.success) return firstIssue(parsed.error, "Invalid classes");

  const schoolId = permitted.user.schoolId;
  const wanted = parsed.data.classRooms;

  // Reject duplicates before touching the database so the error names the
  // offending class rather than surfacing a constraint violation.
  const keys = wanted.map((c) => `${c.name}|${c.arm}`);
  const duplicate = keys.find((key, index) => keys.indexOf(key) !== index);
  if (duplicate) {
    const [name, arm] = duplicate.split("|");
    return {
      ok: false,
      error: `${[name, arm].filter(Boolean).join(" ")} is listed more than once.`,
    };
  }

  const existing = await prisma.classRoom.findMany({
    where: { schoolId },
    select: { id: true, name: true, arm: true, _count: { select: { students: true } } },
  });

  const wantedKeys = new Set(keys);
  // Never delete a class that has students in it — that would orphan people.
  const removable = existing.filter(
    (c) => !wantedKeys.has(`${c.name}|${c.arm}`) && c._count.students === 0
  );
  const blocked = existing.filter(
    (c) => !wantedKeys.has(`${c.name}|${c.arm}`) && c._count.students > 0
  );

  if (blocked.length > 0) {
    const names = blocked
      .map((c) => [c.name, c.arm].filter(Boolean).join(" "))
      .join(", ");
    return {
      ok: false,
      error: `Cannot remove ${names} — there are still students enrolled. Move them first.`,
    };
  }

  await prisma.$transaction(async (tx) => {
    if (removable.length > 0) {
      await tx.classRoom.deleteMany({
        where: { id: { in: removable.map((c) => c.id) } },
      });
    }

    for (const classRoom of wanted) {
      await tx.classRoom.upsert({
        where: {
          schoolId_name_arm: {
            schoolId,
            name: classRoom.name,
            arm: classRoom.arm,
          },
        },
        update: { level: classRoom.level, stream: classRoom.stream },
        create: {
          schoolId,
          name: classRoom.name,
          arm: classRoom.arm,
          level: classRoom.level,
          stream: classRoom.stream,
        },
      });
    }
  });

  revalidateOnboarding();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Step 4 — grading
// ---------------------------------------------------------------------------

const gradingSchema = z
  .object({
    caWeight: z.number().int().min(0).max(100),
    examWeight: z.number().int().min(0).max(100),
    bands: z
      .array(
        z.object({
          code: z.string().trim().min(1, "Grade code is required"),
          label: z.string().trim().min(1, "Grade label is required"),
          minScore: z.number().int().min(0).max(100),
          maxScore: z.number().int().min(0).max(100),
          isPass: z.boolean(),
        })
      )
      .min(1, "Add at least one grade band"),
  })
  .refine((value) => value.caWeight + value.examWeight === 100, {
    message: "CA and exam weights must add up to 100%",
    path: ["examWeight"],
  })
  .refine(
    (value) => value.bands.every((band) => band.minScore <= band.maxScore),
    { message: "Each band's minimum must not exceed its maximum", path: ["bands"] }
  );

export type GradingFormData = z.infer<typeof gradingSchema>;

export async function saveGradingScale(
  data: GradingFormData
): Promise<ActionResult> {
  const permitted = await ensurePermission("school:manage");
  if (!permitted.ok) return permitted;

  const parsed = gradingSchema.safeParse(data);
  if (!parsed.success) return firstIssue(parsed.error, "Invalid grading scale");

  const { caWeight, examWeight, bands } = parsed.data;

  // Overlapping bands would make a score map to two grades.
  const sorted = [...bands].sort((a, b) => a.minScore - b.minScore);
  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i].minScore <= sorted[i - 1].maxScore) {
      return {
        ok: false,
        error: `${sorted[i - 1].code} and ${sorted[i].code} overlap. Grade ranges must not share scores.`,
      };
    }
  }

  const schoolId = permitted.user.schoolId;

  await prisma.$transaction(async (tx) => {
    const scale = await tx.gradingScale.upsert({
      where: { schoolId_name: { schoolId, name: "WAEC Standard" } },
      update: { caWeight, examWeight, isDefault: true },
      create: { schoolId, name: "WAEC Standard", caWeight, examWeight },
      select: { id: true },
    });

    // Replace wholesale: editing bands in place would leave removed ones behind.
    await tx.gradeBand.deleteMany({ where: { scaleId: scale.id } });
    await tx.gradeBand.createMany({
      data: sorted.map((band, index) => ({
        scaleId: scale.id,
        ...band,
        position: index,
      })),
    });
  });

  revalidateOnboarding();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Step 5 — subjects
// ---------------------------------------------------------------------------

const subjectsSchema = z.object({
  names: z.array(z.string().trim().min(2)).min(1, "Pick at least one subject"),
});

export async function addSubjectsInBulk(
  data: z.infer<typeof subjectsSchema>
): Promise<ActionResult> {
  const permitted = await ensurePermission("subject:manage");
  if (!permitted.ok) return permitted;

  const parsed = subjectsSchema.safeParse(data);
  if (!parsed.success) return firstIssue(parsed.error, "Invalid subjects");

  const schoolId = permitted.user.schoolId;

  await prisma.subject.createMany({
    data: parsed.data.names.map((name) => ({
      schoolId,
      name,
      department: "General",
    })),
    // Re-running the step must not fail on subjects that already exist.
    skipDuplicates: true,
  });

  revalidateOnboarding();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Finish
// ---------------------------------------------------------------------------

export async function completeOnboarding(): Promise<ActionResult> {
  const permitted = await ensurePermission("school:manage");
  if (!permitted.ok) return permitted;

  const schoolId = permitted.user.schoolId;

  // Re-check server-side: the client could call this with steps outstanding.
  const [school, sessionCount, classCount] = await Promise.all([
    prisma.school.findUniqueOrThrow({
      where: { id: schoolId },
      select: { state: true, address: true },
    }),
    prisma.academicSession.count({ where: { schoolId, terms: { some: {} } } }),
    prisma.classRoom.count({ where: { schoolId } }),
  ]);

  if (!school.state || !school.address) {
    return { ok: false, error: "Finish the school profile first." };
  }
  if (sessionCount === 0) {
    return { ok: false, error: "Set up the academic session and terms first." };
  }
  if (classCount === 0) {
    return { ok: false, error: "Add at least one class first." };
  }

  await prisma.school.update({
    where: { id: schoolId },
    data: { onboardingCompletedAt: new Date() },
  });

  revalidateOnboarding();
  return { ok: true };
}
