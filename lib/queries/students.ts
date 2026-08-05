import "server-only";

import { AttendanceStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/tenant";
import {
  classRoomSlug,
  type AttendanceSummary,
  type Student,
} from "@/types/student";
import type { SchoolLevel } from "@/lib/generated/prisma/enums";

export type ClassRoomSummary = {
  id: string;
  name: string;
  arm: string;
  slug: string;
  level: SchoolLevel;
  formTeacherName: string | null;
  totalStudents: number;
  /** Null until attendance has been recorded for the class. */
  averageAttendance: number | null;
};

/**
 * Groups attendance counts by class in one query rather than per class, so the
 * students overview stays a fixed number of round trips as classes grow.
 */
async function attendanceByClassRoom(classRoomIds: string[]) {
  const rows = await prisma.attendance.groupBy({
    by: ["classRoomId", "status"],
    where: { classRoomId: { in: classRoomIds } },
    _count: { _all: true },
  });

  const totals = new Map<string, { present: number; total: number }>();

  for (const row of rows) {
    const entry = totals.get(row.classRoomId) ?? { present: 0, total: 0 };
    const count = row._count._all;

    entry.total += count;
    // Late still counts as attending for the headline percentage.
    if (
      row.status === AttendanceStatus.PRESENT ||
      row.status === AttendanceStatus.LATE
    ) {
      entry.present += count;
    }

    totals.set(row.classRoomId, entry);
  }

  return totals;
}

export async function getClassRoomSummaries(): Promise<ClassRoomSummary[]> {
  const schoolId = await getCurrentSchoolId();

  const classRooms = await prisma.classRoom.findMany({
    where: { schoolId },
    select: {
      id: true,
      name: true,
      arm: true,
      level: true,
      formTeacher: { select: { name: true } },
      _count: { select: { students: true } },
    },
    orderBy: [{ name: "asc" }, { arm: "asc" }],
  });

  const attendance = await attendanceByClassRoom(classRooms.map((c) => c.id));

  return classRooms.map((classRoom) => {
    const totals = attendance.get(classRoom.id);

    return {
      id: classRoom.id,
      name: classRoom.name,
      arm: classRoom.arm,
      slug: classRoomSlug(classRoom.name, classRoom.arm),
      level: classRoom.level,
      formTeacherName: classRoom.formTeacher?.name ?? null,
      totalStudents: classRoom._count.students,
      averageAttendance:
        totals && totals.total > 0
          ? (totals.present / totals.total) * 100
          : null,
    };
  });
}

export type ClassRoomDetail = {
  id: string;
  name: string;
  arm: string;
  displayName: string;
};

/** Resolves a /dashboard/students/[class] slug to a class in the current school. */
export async function getClassRoomBySlug(
  slug: string
): Promise<ClassRoomDetail | null> {
  const schoolId = await getCurrentSchoolId();

  const classRooms = await prisma.classRoom.findMany({
    where: { schoolId },
    select: { id: true, name: true, arm: true },
  });

  const match = classRooms.find(
    (classRoom) => classRoomSlug(classRoom.name, classRoom.arm) === slug
  );

  if (!match) return null;

  return {
    ...match,
    displayName: [match.name, match.arm].filter(Boolean).join(" "),
  };
}

export async function getStudentsForClassRoom(
  classRoomId: string
): Promise<Student[]> {
  const schoolId = await getCurrentSchoolId();

  const students = await prisma.student.findMany({
    where: { schoolId, classRoomId },
    select: {
      id: true,
      name: true,
      registrationNumber: true,
      gender: true,
      status: true,
      attendanceRecords: { select: { status: true } },
      guardians: {
        select: {
          isPrimary: true,
          guardian: { select: { firstName: true, lastName: true, phone: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return students.map(({ attendanceRecords, guardians, ...student }) => {
    // Prefer the contact marked primary; otherwise the first one recorded.
    const contact =
      guardians.find((link) => link.isPrimary)?.guardian ??
      guardians[0]?.guardian ??
      null;

    const attendance: AttendanceSummary = {
      present: 0,
      absent: 0,
      late: 0,
      total: attendanceRecords.length,
    };

    for (const record of attendanceRecords) {
      if (record.status === AttendanceStatus.PRESENT) attendance.present += 1;
      else if (record.status === AttendanceStatus.ABSENT) attendance.absent += 1;
      else attendance.late += 1;
    }

    return {
      ...student,
      guardianName: contact
        ? `${contact.firstName} ${contact.lastName}`.trim()
        : null,
      guardianPhone: contact?.phone ?? null,
      attendance,
    };
  });
}
