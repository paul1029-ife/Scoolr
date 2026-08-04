import { z } from "zod";

import { SubjectLevel } from "@/lib/generated/prisma/enums";

export { SubjectLevel };

export const DEPARTMENTS = [
  "Sciences",
  "Humanities",
  "Religious Studies",
  "Arts",
  "Physical Education",
] as const;

export const subjectFormSchema = z.object({
  name: z.string().trim().min(2, "Subject name is required"),
  department: z.string().trim().min(2, "Department is required"),
  level: z.nativeEnum(SubjectLevel),
  /** Optional: a subject can exist before it is timetabled. */
  teacherId: z.string().optional(),
  classRoomId: z.string().optional(),
  schedule: z.string().trim().optional(),
  time: z.string().trim().optional(),
});

export type SubjectFormData = z.infer<typeof subjectFormSchema>;

export const subjectLevelLabel: Record<SubjectLevel, string> = {
  [SubjectLevel.JUNIOR]: "Junior",
  [SubjectLevel.SENIOR]: "Senior",
  [SubjectLevel.ALL_LEVELS]: "All Levels",
};

export type SubjectListItem = {
  id: string;
  name: string;
  department: string;
  level: SubjectLevel;
  /** Primary teacher, or null when the subject is not yet assigned to one. */
  teacherName: string | null;
  /** Derived from enrolment in the classes this subject is taught to. */
  students: number;
  schedule: string | null;
  time: string | null;
};

export type SubjectDetail = SubjectListItem & {
  description: string | null;
  room: string | null;
  objectives: string[];
  materials: string[];
  prerequisites: string[];
  className: string | null;
  termName: string | null;
};

/** Joins the stored start/end times back into the "9:00 AM - 10:30 AM" display form. */
export function formatTimeRange(
  startTime: string | null,
  endTime: string | null
): string | null {
  if (!startTime && !endTime) return null;
  if (startTime && endTime) return `${startTime} - ${endTime}`;
  return startTime ?? endTime;
}

/** Splits the "9:00 AM - 10:30 AM" input back into its two halves. */
export function parseTimeRange(value: string | undefined): {
  startTime: string | null;
  endTime: string | null;
} {
  if (!value?.trim()) return { startTime: null, endTime: null };

  const [start, end] = value.split(/\s*[-–]\s*/);
  return { startTime: start?.trim() || null, endTime: end?.trim() || null };
}
