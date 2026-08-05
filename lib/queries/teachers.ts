import "server-only";

import { prisma } from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/tenant";
import type { ClassRoomOption, Teacher } from "@/types/teacher";

const teacherSelect = {
  id: true,
  name: true,
  subject: true,
  phoneNumber: true,
  email: true,
  status: true,
  classRoomId: true,
  classRoom: { select: { id: true, name: true, arm: true } },
} as const;

export async function getTeachers(): Promise<Teacher[]> {
  const schoolId = await getCurrentSchoolId();

  return prisma.teacher.findMany({
    where: { schoolId },
    select: teacherSelect,
    orderBy: { name: "asc" },
  });
}

export async function getClassRoomOptions(): Promise<ClassRoomOption[]> {
  const schoolId = await getCurrentSchoolId();

  return prisma.classRoom.findMany({
    where: { schoolId },
    select: { id: true, name: true, arm: true },
    orderBy: [{ name: "asc" }, { arm: "asc" }],
  });
}
