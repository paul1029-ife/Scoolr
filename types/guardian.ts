import { z } from "zod";

import { GuardianRelationship } from "@/lib/generated/prisma/enums";

export { GuardianRelationship };

export const relationshipLabel: Record<GuardianRelationship, string> = {
  [GuardianRelationship.FATHER]: "Father",
  [GuardianRelationship.MOTHER]: "Mother",
  [GuardianRelationship.GUARDIAN]: "Guardian",
  [GuardianRelationship.OTHER]: "Other",
};

export const guardianFormSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required"),
  lastName: z.string().trim().min(2, "Last name is required"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{7,}$/, "Enter a valid phone number"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .or(z.literal(""))
    .optional(),
  occupation: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

export type GuardianFormData = z.infer<typeof guardianFormSchema>;

export type GuardianStudentLink = {
  studentId: string;
  studentName: string;
  registrationNumber: string;
  className: string | null;
  relationship: GuardianRelationship;
  isPrimary: boolean;
};

export type GuardianRecord = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email: string | null;
  occupation: string | null;
  address: string | null;
  students: GuardianStudentLink[];
};

/** The guardian a school calls first about a student. */
export type StudentGuardianSummary = {
  guardianId: string;
  name: string;
  phone: string;
  relationship: GuardianRelationship;
  isPrimary: boolean;
};
