import "server-only";

import { prisma } from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/tenant";
import {
  formatTimeRange,
  type SubjectDetail,
  type SubjectListItem,
} from "@/types/subject";

const assignmentSelect = {
  schedule: true,
  startTime: true,
  endTime: true,
  teacher: { select: { name: true } },
  term: { select: { name: true, session: { select: { name: true } } } },
  classRoom: {
    select: { name: true, arm: true, _count: { select: { students: true } } },
  },
} as const;

/** Student totals come from enrolment in the classes a subject is taught to. */
function summarise(assignments: {
  schedule: string | null;
  startTime: string | null;
  endTime: string | null;
  teacher: { name: string } | null;
  classRoom: { _count: { students: number } };
}[]) {
  return {
    teacherName: assignments.find((a) => a.teacher)?.teacher?.name ?? null,
    students: assignments.reduce(
      (sum, a) => sum + a.classRoom._count.students,
      0
    ),
    schedule: assignments.find((a) => a.schedule)?.schedule ?? null,
    time:
      assignments
        .map((a) => formatTimeRange(a.startTime, a.endTime))
        .find(Boolean) ?? null,
  };
}

export async function getSubjects(): Promise<SubjectListItem[]> {
  const schoolId = await getCurrentSchoolId();

  const subjects = await prisma.subject.findMany({
    where: { schoolId },
    select: {
      id: true,
      name: true,
      department: true,
      level: true,
      assignments: { select: assignmentSelect },
    },
    orderBy: { name: "asc" },
  });

  return subjects.map(({ assignments, ...subject }) => ({
    ...subject,
    ...summarise(assignments),
  }));
}

export async function getSubjectById(
  id: string
): Promise<SubjectDetail | null> {
  const schoolId = await getCurrentSchoolId();

  const subject = await prisma.subject.findFirst({
    where: { id, schoolId },
    select: {
      id: true,
      name: true,
      department: true,
      level: true,
      description: true,
      room: true,
      objectives: true,
      materials: true,
      prerequisites: true,
      assignments: { select: assignmentSelect },
    },
  });

  if (!subject) return null;

  const { assignments, ...rest } = subject;
  const primary = assignments[0];

  return {
    ...rest,
    ...summarise(assignments),
    className: primary?.classRoom
      ? [primary.classRoom.name, primary.classRoom.arm]
          .filter(Boolean)
          .join(" ")
      : null,
    termName: primary?.term
      ? `${primary.term.session.name} · ${primary.term.name
          .charAt(0)
          .concat(primary.term.name.slice(1).toLowerCase())} term`
      : null,
  };
}

/** Options for the Add Subject form's teacher and class selects. */
export async function getSubjectFormOptions() {
  const schoolId = await getCurrentSchoolId();

  const [teachers, classRooms] = await Promise.all([
    prisma.teacher.findMany({
      where: { schoolId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.classRoom.findMany({
      where: { schoolId },
      select: { id: true, name: true, arm: true },
      orderBy: [{ name: "asc" }, { arm: "asc" }],
    }),
  ]);

  return { teachers, classRooms };
}
