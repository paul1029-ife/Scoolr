import "server-only";

import { prisma } from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/tenant";
import type { GuardianRecord } from "@/types/guardian";

const classLabel = (classRoom: { name: string; arm: string } | null) =>
  classRoom
    ? [classRoom.name, classRoom.arm].filter(Boolean).join(" ")
    : null;

export async function getGuardians(): Promise<GuardianRecord[]> {
  const schoolId = await getCurrentSchoolId();

  const guardians = await prisma.guardian.findMany({
    where: { schoolId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
      email: true,
      occupation: true,
      address: true,
      students: {
        select: {
          relationship: true,
          isPrimary: true,
          student: {
            select: {
              id: true,
              name: true,
              registrationNumber: true,
              classRoom: { select: { name: true, arm: true } },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  return guardians.map((guardian) => ({
    id: guardian.id,
    firstName: guardian.firstName,
    lastName: guardian.lastName,
    fullName: `${guardian.firstName} ${guardian.lastName}`.trim(),
    phone: guardian.phone,
    email: guardian.email,
    occupation: guardian.occupation,
    address: guardian.address,
    students: guardian.students.map((link) => ({
      studentId: link.student.id,
      studentName: link.student.name,
      registrationNumber: link.student.registrationNumber,
      className: classLabel(link.student.classRoom),
      relationship: link.relationship,
      isPrimary: link.isPrimary,
    })),
  }));
}

/** Students available to link, for the guardian drawer. */
export async function getLinkableStudents() {
  const schoolId = await getCurrentSchoolId();

  const students = await prisma.student.findMany({
    where: { schoolId },
    select: {
      id: true,
      name: true,
      registrationNumber: true,
      classRoom: { select: { name: true, arm: true } },
    },
    orderBy: { name: "asc" },
  });

  return students.map((student) => ({
    id: student.id,
    name: student.name,
    registrationNumber: student.registrationNumber,
    className: classLabel(student.classRoom),
  }));
}
