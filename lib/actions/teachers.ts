"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ensurePermission, getCurrentSchoolId } from "@/lib/tenant";
import { teacherFormSchema, type TeacherFormData } from "@/types/teacher";

const TEACHERS_PATH = "/dashboard/teachers";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Prisma raises P2002 when a unique constraint (here, school + email) is hit. */
function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

function validate(data: TeacherFormData) {
  const parsed = teacherFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid teacher details",
    };
  }

  return { ok: true as const, data: parsed.data };
}

export async function createTeacher(
  data: TeacherFormData
): Promise<ActionResult> {
  const permitted = await ensurePermission("teacher:manage");
  if (!permitted.ok) return permitted;

  const parsed = validate(data);
  if (!parsed.ok) return parsed;

  const schoolId = await getCurrentSchoolId();

  try {
    await prisma.teacher.create({ data: { schoolId, ...parsed.data } });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "A teacher with that email already exists." };
    }
    throw error;
  }

  revalidatePath(TEACHERS_PATH);
  return { ok: true };
}

export async function updateTeacher(
  id: string,
  data: TeacherFormData
): Promise<ActionResult> {
  const permitted = await ensurePermission("teacher:manage");
  if (!permitted.ok) return permitted;

  const parsed = validate(data);
  if (!parsed.ok) return parsed;

  const schoolId = await getCurrentSchoolId();

  try {
    // Scoping the update by schoolId means another tenant's id can never match.
    const { count } = await prisma.teacher.updateMany({
      where: { id, schoolId },
      data: parsed.data,
    });

    if (count === 0) {
      return { ok: false, error: "That teacher no longer exists." };
    }
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "A teacher with that email already exists." };
    }
    throw error;
  }

  revalidatePath(TEACHERS_PATH);
  return { ok: true };
}

export async function removeTeacher(id: string): Promise<ActionResult> {
  const permitted = await ensurePermission("teacher:manage");
  if (!permitted.ok) return permitted;

  const schoolId = await getCurrentSchoolId();

  const { count } = await prisma.teacher.deleteMany({
    where: { id, schoolId },
  });

  if (count === 0) {
    return { ok: false, error: "That teacher no longer exists." };
  }

  revalidatePath(TEACHERS_PATH);
  return { ok: true };
}
