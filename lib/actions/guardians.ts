"use server";

import { revalidatePath } from "next/cache";

import { GuardianRelationship } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { ensurePermission } from "@/lib/tenant";
import { guardianFormSchema, type GuardianFormData } from "@/types/guardian";

const GUARDIANS_PATH = "/dashboard/guardians";

export type ActionResult = { ok: true } | { ok: false; error: string };

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

function revalidateAll() {
  revalidatePath(GUARDIANS_PATH);
  revalidatePath("/dashboard/students", "layout");
}

export async function createGuardian(
  data: GuardianFormData
): Promise<ActionResult> {
  const permitted = await ensurePermission("student:manage");
  if (!permitted.ok) return permitted;

  const parsed = guardianFormSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid guardian details",
    };
  }

  const { email, occupation, address, ...rest } = parsed.data;

  try {
    await prisma.guardian.create({
      data: {
        schoolId: permitted.user.schoolId,
        ...rest,
        email: email || null,
        occupation: occupation || null,
        address: address || null,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        error: "A guardian with that phone number already exists.",
      };
    }
    throw error;
  }

  revalidateAll();
  return { ok: true };
}

export async function updateGuardian(
  id: string,
  data: GuardianFormData
): Promise<ActionResult> {
  const permitted = await ensurePermission("student:manage");
  if (!permitted.ok) return permitted;

  const parsed = guardianFormSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid guardian details",
    };
  }

  const { email, occupation, address, ...rest } = parsed.data;

  try {
    const { count } = await prisma.guardian.updateMany({
      where: { id, schoolId: permitted.user.schoolId },
      data: {
        ...rest,
        email: email || null,
        occupation: occupation || null,
        address: address || null,
      },
    });

    if (count === 0) {
      return { ok: false, error: "That guardian no longer exists." };
    }
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        error: "Another guardian already uses that phone number.",
      };
    }
    throw error;
  }

  revalidateAll();
  return { ok: true };
}

export async function removeGuardian(id: string): Promise<ActionResult> {
  const permitted = await ensurePermission("student:manage");
  if (!permitted.ok) return permitted;

  const { count } = await prisma.guardian.deleteMany({
    where: { id, schoolId: permitted.user.schoolId },
  });

  if (count === 0) {
    return { ok: false, error: "That guardian no longer exists." };
  }

  revalidateAll();
  return { ok: true };
}

export async function linkStudentToGuardian(
  guardianId: string,
  studentId: string,
  relationship: GuardianRelationship
): Promise<ActionResult> {
  const permitted = await ensurePermission("student:manage");
  if (!permitted.ok) return permitted;

  const schoolId = permitted.user.schoolId;

  // Both sides must belong to the caller's school.
  const [guardian, student] = await Promise.all([
    prisma.guardian.findFirst({ where: { id: guardianId, schoolId }, select: { id: true } }),
    prisma.student.findFirst({ where: { id: studentId, schoolId }, select: { id: true } }),
  ]);

  if (!guardian) return { ok: false, error: "That guardian does not exist." };
  if (!student) return { ok: false, error: "That student does not exist." };

  const existingLinks = await prisma.studentGuardian.count({
    where: { studentId },
  });

  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId, guardianId } },
    update: { relationship },
    create: {
      studentId,
      guardianId,
      relationship,
      // The first contact recorded for a student is the one to call.
      isPrimary: existingLinks === 0,
    },
  });

  revalidateAll();
  return { ok: true };
}

export async function unlinkStudentFromGuardian(
  guardianId: string,
  studentId: string
): Promise<ActionResult> {
  const permitted = await ensurePermission("student:manage");
  if (!permitted.ok) return permitted;

  const link = await prisma.studentGuardian.findFirst({
    where: {
      guardianId,
      studentId,
      guardian: { schoolId: permitted.user.schoolId },
    },
    select: { id: true, isPrimary: true },
  });

  if (!link) return { ok: false, error: "That link no longer exists." };

  await prisma.$transaction(async (tx) => {
    await tx.studentGuardian.delete({ where: { id: link.id } });

    // Don't leave a student with contacts but no primary one.
    if (link.isPrimary) {
      const next = await tx.studentGuardian.findFirst({
        where: { studentId },
        orderBy: { createdAt: "asc" },
        select: { id: true },
      });

      if (next) {
        await tx.studentGuardian.update({
          where: { id: next.id },
          data: { isPrimary: true },
        });
      }
    }
  });

  revalidateAll();
  return { ok: true };
}
