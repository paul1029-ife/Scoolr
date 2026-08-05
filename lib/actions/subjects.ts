"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ensurePermission, getCurrentSchoolId } from "@/lib/tenant";
import {
  parseTimeRange,
  subjectFormSchema,
  type SubjectFormData,
} from "@/types/subject";

const SUBJECTS_PATH = "/dashboard/subjects";

export type ActionResult = { ok: true } | { ok: false; error: string };

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

export async function createSubject(
  data: SubjectFormData
): Promise<ActionResult> {
  const permitted = await ensurePermission("subject:manage");
  if (!permitted.ok) return permitted;

  const parsed = subjectFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid subject details",
    };
  }

  const { name, department, level, teacherId, classRoomId, schedule, time } =
    parsed.data;
  const schoolId = await getCurrentSchoolId();

  // Verify any referenced rows belong to this school before linking them.
  if (teacherId) {
    const teacher = await prisma.teacher.findFirst({
      where: { id: teacherId, schoolId },
      select: { id: true },
    });
    if (!teacher) return { ok: false, error: "That teacher does not exist." };
  }

  if (classRoomId) {
    const classRoom = await prisma.classRoom.findFirst({
      where: { id: classRoomId, schoolId },
      select: { id: true },
    });
    if (!classRoom) return { ok: false, error: "That class does not exist." };
  }

  const { startTime, endTime } = parseTimeRange(time);
  const term = await prisma.term.findFirst({
    where: { isCurrent: true, session: { schoolId } },
    select: { id: true },
  });

  try {
    await prisma.subject.create({
      data: {
        schoolId,
        name,
        department,
        level,
        // Timetable the subject only when a class was chosen.
        assignments: classRoomId
          ? {
              create: {
                classRoomId,
                teacherId: teacherId || null,
                termId: term?.id ?? null,
                schedule: schedule || null,
                startTime,
                endTime,
              },
            }
          : undefined,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "A subject with that name already exists." };
    }
    throw error;
  }

  revalidatePath(SUBJECTS_PATH);
  return { ok: true };
}

export async function removeSubject(id: string): Promise<ActionResult> {
  const permitted = await ensurePermission("subject:manage");
  if (!permitted.ok) return permitted;

  const schoolId = await getCurrentSchoolId();

  const { count } = await prisma.subject.deleteMany({ where: { id, schoolId } });

  if (count === 0) {
    return { ok: false, error: "That subject no longer exists." };
  }

  revalidatePath(SUBJECTS_PATH);
  return { ok: true };
}
