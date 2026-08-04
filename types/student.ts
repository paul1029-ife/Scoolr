import { z } from "zod";

import { Gender, StudentStatus } from "@/lib/generated/prisma/enums";

export { Gender, StudentStatus };

export const studentFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  registrationNumber: z
    .string()
    .trim()
    .min(5, "Registration number must be at least 5 characters")
    .regex(
      /^[A-Z0-9/-]*$/,
      "Registration number can only contain uppercase letters, numbers, slashes and hyphens"
    ),
  gender: z.nativeEnum(Gender),
  /** Optional: creates or reuses a Guardian record and links it. */
  guardianName: z
    .string()
    .trim()
    .regex(/^[a-zA-Z\s]*$/, "Guardian name can only contain letters and spaces")
    .optional(),
  guardianPhone: z
    .string()
    .trim()
    .regex(
      /^(\+?[\d\s-]{10,})?$/,
      "Please enter a valid phone number (minimum 10 digits)"
    )
    .optional(),
});

export type StudentFormData = z.infer<typeof studentFormSchema>;

/** Attendance totals derived from the per-day Attendance rows. */
export type AttendanceSummary = {
  present: number;
  absent: number;
  late: number;
  total: number;
};

export type Student = {
  id: string;
  name: string;
  registrationNumber: string;
  gender: Gender;
  /** Primary contact, resolved from the Guardian relation. */
  guardianName: string | null;
  guardianPhone: string | null;
  status: StudentStatus;
  attendance: AttendanceSummary;
};

export const genderLabel: Record<Gender, string> = {
  [Gender.MALE]: "Male",
  [Gender.FEMALE]: "Female",
  [Gender.OTHER]: "Other",
};

/**
 * Percentage of recorded days marked present. Returns null when nothing has
 * been recorded yet, so callers show a placeholder instead of NaN%.
 */
export function attendancePercentage(
  attendance: AttendanceSummary
): number | null {
  if (attendance.total === 0) return null;
  return (attendance.present / attendance.total) * 100;
}

/** "JSS 1" + arm "A" -> "jss-1-a"; used for /dashboard/students/[class]. */
export function classRoomSlug(name: string, arm: string): string {
  return [name, arm]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, "-");
}
