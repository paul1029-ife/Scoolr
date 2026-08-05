import { z } from "zod";

import {
  Gender,
  GuardianRelationship,
  ImportEntity,
  SchoolLevel,
  Stream,
  TeacherStatus,
} from "@/lib/generated/prisma/enums";

export { ImportEntity };

export type ColumnSpec = {
  key: string;
  label: string;
  required: boolean;
  hint: string;
  example: string;
};

/** Accepts the spellings a Nigerian school is likely to type. */
const genderValue = z
  .string()
  .trim()
  .transform((value, ctx) => {
    const normalised = value.toUpperCase();

    if (normalised === "M" || normalised === "MALE") return Gender.MALE;
    if (normalised === "F" || normalised === "FEMALE") return Gender.FEMALE;
    if (normalised === "OTHER") return Gender.OTHER;

    // Written for a school administrator, not a developer.
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `"${value}" is not a gender. Use Male, Female or Other.`,
    });
    return z.NEVER;
  });

const requiredText = (field: string, min = 2) =>
  z.string().trim().min(min, `${field} is required`);

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

const phone = z
  .string()
  .trim()
  .min(7, "Phone number looks too short")
  .max(20, "Phone number looks too long");

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value.toLowerCase() : undefined))
  .refine(
    (value) => value === undefined || z.string().email().safeParse(value).success,
    "Enter a valid email address"
  );

/** yyyy-mm-dd or dd/mm/yyyy, which is how dates are usually written locally. */
const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((value, ctx) => {
    if (!value) return undefined;

    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    const local = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);

    let parsed: Date | null = null;
    if (iso) {
      parsed = new Date(`${value}T00:00:00.000Z`);
    } else if (local) {
      const [, d, m, y] = local;
      parsed = new Date(
        `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}T00:00:00.000Z`
      );
    }

    if (!parsed || Number.isNaN(parsed.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Use yyyy-mm-dd or dd/mm/yyyy",
      });
      return z.NEVER;
    }

    return parsed;
  });

// ---------------------------------------------------------------------------
// Row schemas
// ---------------------------------------------------------------------------

export const studentRow = z.object({
  admission_number: requiredText("Admission number", 3),
  first_name: requiredText("First name"),
  last_name: requiredText("Last name"),
  gender: genderValue,
  class: requiredText("Class"),
  arm: optionalText,
  date_of_birth: optionalDate,
  guardian_name: optionalText,
  guardian_phone: optionalText,
  guardian_relationship: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value.toUpperCase() : undefined))
    .refine(
      (value) =>
        value === undefined ||
        (Object.values(GuardianRelationship) as string[]).includes(value),
      "Use Father, Mother, Guardian or Other"
    ),
  address: optionalText,
});

export const teacherRow = z.object({
  first_name: requiredText("First name"),
  last_name: requiredText("Last name"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: phone,
  subject: requiredText("Subject"),
  class: optionalText,
  arm: optionalText,
  status: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value.toUpperCase().replace(/\s+/g, "_") : "ACTIVE"))
    .refine(
      (value) => (Object.values(TeacherStatus) as string[]).includes(value),
      "Use Active or On Leave"
    ),
});

export const guardianRow = z.object({
  first_name: requiredText("First name"),
  last_name: requiredText("Last name"),
  phone: phone,
  email: optionalEmail,
  occupation: optionalText,
  address: optionalText,
  student_admission_number: optionalText,
  relationship: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value.toUpperCase() : "GUARDIAN"))
    .refine(
      (value) => (Object.values(GuardianRelationship) as string[]).includes(value),
      "Use Father, Mother, Guardian or Other"
    ),
});

export const subjectRow = z.object({
  name: requiredText("Subject name"),
  department: optionalText,
  level: z
    .string()
    .trim()
    .optional()
    .transform((value) =>
      value ? value.toUpperCase().replace(/\s+/g, "_") : "ALL_LEVELS"
    )
    .refine(
      (value) => ["JUNIOR", "SENIOR", "ALL_LEVELS"].includes(value),
      "Use Junior, Senior or All Levels"
    ),
});

export const classRow = z.object({
  name: requiredText("Class name"),
  level: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .refine(
      (value) => (Object.values(SchoolLevel) as string[]).includes(value),
      "Use Junior or Senior"
    ),
  arm: optionalText,
  stream: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value.toUpperCase() : undefined))
    .refine(
      (value) =>
        value === undefined || (Object.values(Stream) as string[]).includes(value),
      "Use Science, Arts or Commercial"
    ),
});

// ---------------------------------------------------------------------------
// Entity definitions
// ---------------------------------------------------------------------------

export type EntityDefinition = {
  entity: ImportEntity;
  label: string;
  description: string;
  columns: ColumnSpec[];
  /** Row schema, keyed by column key. */
  schema: z.ZodTypeAny;
  /** Builds the value that identifies a row, for duplicate detection. */
  identity: (row: Record<string, unknown>) => string;
  /** Human label for a duplicate, used in messages. */
  identityLabel: string;
};

export const ENTITY_DEFINITIONS: Record<ImportEntity, EntityDefinition> = {
  [ImportEntity.STUDENTS]: {
    entity: ImportEntity.STUDENTS,
    label: "Students",
    description:
      "Enrol students into classes. Guardian details are optional — include them to create the parent record at the same time.",
    columns: [
      { key: "admission_number", label: "Admission Number", required: true, hint: "Unique per school", example: "2025/001" },
      { key: "first_name", label: "First Name", required: true, hint: "", example: "Chioma" },
      { key: "last_name", label: "Last Name", required: true, hint: "", example: "Okafor" },
      { key: "gender", label: "Gender", required: true, hint: "Male, Female or Other", example: "Female" },
      { key: "class", label: "Class", required: true, hint: "Must already exist", example: "JSS 1" },
      { key: "arm", label: "Arm", required: false, hint: "Leave blank if the class has no arms", example: "A" },
      { key: "date_of_birth", label: "Date of Birth", required: false, hint: "yyyy-mm-dd or dd/mm/yyyy", example: "2012-04-15" },
      { key: "guardian_name", label: "Guardian Name", required: false, hint: "Full name", example: "Mr. Emeka Okafor" },
      { key: "guardian_phone", label: "Guardian Phone", required: false, hint: "Required if guardian name is given", example: "08031234567" },
      { key: "guardian_relationship", label: "Relationship", required: false, hint: "Father, Mother, Guardian, Other", example: "Father" },
      { key: "address", label: "Address", required: false, hint: "", example: "12 Awolowo Road, Ikoyi" },
    ],
    schema: studentRow,
    identity: (row) => String(row.admission_number ?? "").toLowerCase(),
    identityLabel: "admission number",
  },

  [ImportEntity.TEACHERS]: {
    entity: ImportEntity.TEACHERS,
    label: "Teachers",
    description:
      "Staff records. This does not create sign-in accounts — invite them from the Staff page for that.",
    columns: [
      { key: "first_name", label: "First Name", required: true, hint: "", example: "Oluwaseun" },
      { key: "last_name", label: "Last Name", required: true, hint: "", example: "Adeleke" },
      { key: "email", label: "Email", required: true, hint: "Unique per school", example: "adeleke.o@school.edu.ng" },
      { key: "phone", label: "Phone", required: true, hint: "", example: "08031234567" },
      { key: "subject", label: "Main Subject", required: true, hint: "", example: "Mathematics" },
      { key: "class", label: "Class Assigned", required: false, hint: "Must already exist", example: "SSS 3" },
      { key: "arm", label: "Arm", required: false, hint: "", example: "A" },
      { key: "status", label: "Status", required: false, hint: "Active or On Leave", example: "Active" },
    ],
    schema: teacherRow,
    identity: (row) => String(row.email ?? "").toLowerCase(),
    identityLabel: "email",
  },

  [ImportEntity.GUARDIANS]: {
    entity: ImportEntity.GUARDIANS,
    label: "Parents & Guardians",
    description:
      "Family contacts. Give a student's admission number to link them; siblings can share one guardian.",
    columns: [
      { key: "first_name", label: "First Name", required: true, hint: "", example: "Emeka" },
      { key: "last_name", label: "Last Name", required: true, hint: "", example: "Okafor" },
      { key: "phone", label: "Phone", required: true, hint: "Identifies the guardian", example: "08031234567" },
      { key: "email", label: "Email", required: false, hint: "", example: "emeka@example.com" },
      { key: "occupation", label: "Occupation", required: false, hint: "", example: "Engineer" },
      { key: "address", label: "Address", required: false, hint: "", example: "12 Awolowo Road, Ikoyi" },
      { key: "student_admission_number", label: "Student Admission Number", required: false, hint: "Links to an existing student", example: "2025/001" },
      { key: "relationship", label: "Relationship", required: false, hint: "Father, Mother, Guardian, Other", example: "Father" },
    ],
    schema: guardianRow,
    identity: (row) => String(row.phone ?? "").replace(/\D/g, ""),
    identityLabel: "phone number",
  },

  [ImportEntity.SUBJECTS]: {
    entity: ImportEntity.SUBJECTS,
    label: "Subjects",
    description: "What the school teaches. Assign teachers and classes afterwards.",
    columns: [
      { key: "name", label: "Subject Name", required: true, hint: "Unique per school", example: "Mathematics" },
      { key: "department", label: "Department", required: false, hint: "", example: "Sciences" },
      { key: "level", label: "Level", required: false, hint: "Junior, Senior or All Levels", example: "All Levels" },
    ],
    schema: subjectRow,
    identity: (row) => String(row.name ?? "").toLowerCase(),
    identityLabel: "subject name",
  },

  [ImportEntity.CLASSES]: {
    entity: ImportEntity.CLASSES,
    label: "Classes & Arms",
    description:
      "Classes and their arms. One row per arm — JSS 1 A and JSS 1 B are two rows.",
    columns: [
      { key: "name", label: "Class Name", required: true, hint: "", example: "JSS 1" },
      { key: "level", label: "Level", required: true, hint: "Junior or Senior", example: "Junior" },
      { key: "arm", label: "Arm", required: false, hint: "Blank for a single-arm class", example: "A" },
      { key: "stream", label: "Stream", required: false, hint: "Senior only: Science, Arts, Commercial", example: "Science" },
    ],
    schema: classRow,
    identity: (row) =>
      `${String(row.name ?? "").toLowerCase()}|${String(row.arm ?? "").toLowerCase()}`,
    identityLabel: "class and arm",
  },
};

export const IMPORT_ENTITIES = Object.values(ENTITY_DEFINITIONS);

/** The CSV a school downloads: header row plus one example row. */
export function buildTemplate(entity: ImportEntity): string {
  const definition = ENTITY_DEFINITIONS[entity];
  const escape = (value: string) =>
    /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

  return [
    definition.columns.map((c) => c.key).join(","),
    definition.columns.map((c) => escape(c.example)).join(","),
  ].join("\n");
}
