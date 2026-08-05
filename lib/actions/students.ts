"use server";

import { revalidatePath } from "next/cache";

import { AttendanceStatus, GuardianRelationship } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { ensurePermission, getCurrentSchoolId, getCurrentUser } from "@/lib/tenant";
import { studentFormSchema, type StudentFormData } from "@/types/student";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Prisma raises P2002 when a unique constraint is hit. */
function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

/** Confirms the class belongs to the caller's school before writing to it. */
async function assertClassRoomInSchool(classRoomId: string, schoolId: string) {
  const classRoom = await prisma.classRoom.findFirst({
    where: { id: classRoomId, schoolId },
    select: { id: true },
  });

  if (!classRoom) {
    throw new Error("That class does not exist.");
  }
}

export async function createStudent(
  classRoomId: string,
  data: StudentFormData
): Promise<ActionResult> {
  const permitted = await ensurePermission("student:manage");
  if (!permitted.ok) return permitted;

  const parsed = studentFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid student details",
    };
  }

  const schoolId = await getCurrentSchoolId();
  await assertClassRoomInSchool(classRoomId, schoolId);

  const { guardianName, guardianPhone, ...studentData } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      const student = await tx.student.create({
        data: { schoolId, classRoomId, ...studentData },
      });

      // A guardian is a real record, shared between siblings via their phone
      // number, rather than a name copied onto each child.
      if (guardianName && guardianPhone) {
        const [firstName, ...rest] = guardianName.trim().split(/\s+/);

        const guardian = await tx.guardian.upsert({
          where: { schoolId_phone: { schoolId, phone: guardianPhone } },
          update: {},
          create: {
            schoolId,
            firstName,
            lastName: rest.join(" ") || firstName,
            phone: guardianPhone,
          },
          select: { id: true },
        });

        await tx.studentGuardian.create({
          data: {
            studentId: student.id,
            guardianId: guardian.id,
            relationship: GuardianRelationship.GUARDIAN,
            isPrimary: true,
          },
        });
      }
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        error: "A student with that registration number already exists.",
      };
    }
    throw error;
  }

  revalidatePath("/dashboard/students");
  return { ok: true };
}

export async function removeStudent(id: string): Promise<ActionResult> {
  const permitted = await ensurePermission("student:manage");
  if (!permitted.ok) return permitted;

  const schoolId = await getCurrentSchoolId();

  const { count } = await prisma.student.deleteMany({ where: { id, schoolId } });

  if (count === 0) {
    return { ok: false, error: "That student no longer exists." };
  }

  revalidatePath("/dashboard/students");
  return { ok: true };
}

/**
 * Records attendance for one class on one date.
 *
 * Re-taking attendance for the same date overwrites that day rather than
 * adding a second set of rows — `Attendance` is unique on (student, date).
 */
export async function saveAttendance(
  classRoomId: string,
  isoDate: string,
  presentByStudentId: Record<string, boolean>
): Promise<ActionResult> {
  const permitted = await ensurePermission("attendance:record");
  if (!permitted.ok) return permitted;

  const schoolId = await getCurrentSchoolId();
  await assertClassRoomInSchool(classRoomId, schoolId);

  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: "Pick a valid date." };
  }

  // Normalise to midnight UTC so a day always maps to one @db.Date value.
  const day = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  if (day.getTime() > Date.now()) {
    return { ok: false, error: "You cannot take attendance for a future date." };
  }

  // Only students actually in this class, so a tampered payload can't reach others.
  const students = await prisma.student.findMany({
    where: { schoolId, classRoomId, id: { in: Object.keys(presentByStudentId) } },
    select: { id: true },
  });

  if (students.length === 0) {
    return { ok: false, error: "There are no students in this class yet." };
  }

  const user = await getCurrentUser();
  const term = await prisma.term.findFirst({
    where: { isCurrent: true, session: { schoolId } },
    select: { id: true },
  });

  await prisma.$transaction(
    students.map(({ id }) => {
      const status = presentByStudentId[id]
        ? AttendanceStatus.PRESENT
        : AttendanceStatus.ABSENT;

      return prisma.attendance.upsert({
        where: { studentId_date: { studentId: id, date: day } },
        update: { status, recordedById: user?.id ?? null },
        create: {
          studentId: id,
          classRoomId,
          termId: term?.id ?? null,
          date: day,
          status,
          recordedById: user?.id ?? null,
        },
      });
    })
  );

  revalidatePath("/dashboard/students");
  return { ok: true };
}
