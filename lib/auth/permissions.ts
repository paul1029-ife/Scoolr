import { Role } from "@/lib/generated/prisma/enums";

export { Role };

/**
 * What a signed-in user is allowed to do.
 *
 * Kept as a flat list of capabilities rather than role checks scattered through
 * the code, so changing who can do what is a single edit here and every call
 * site stays readable.
 */
export const PERMISSIONS = [
  "dashboard:access",
  "teacher:manage",
  "student:manage",
  "attendance:record",
  "subject:manage",
  "event:manage",
  "billing:view",
  "billing:manage",
  "school:manage",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const ADMIN_PERMISSIONS: Permission[] = [...PERMISSIONS];

/**
 * Teachers run day-to-day classroom work: enrolling students, taking
 * attendance, and scheduling events. Money and staff records are deliberately
 * out of reach — a teacher should not be able to delete a colleague or alter
 * fee collection.
 */
const TEACHER_PERMISSIONS: Permission[] = [
  "dashboard:access",
  "student:manage",
  "attendance:record",
  "event:manage",
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: ADMIN_PERMISSIONS,
  [Role.ADMIN]: ADMIN_PERMISSIONS,
  [Role.TEACHER]: TEACHER_PERMISSIONS,
  // Parents and students get their own portal later; until then they have no
  // access to the staff dashboard rather than a partially broken version of it.
  [Role.PARENT]: [],
  [Role.STUDENT]: [],
};

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/** The full set for a role, for handing to the client in one go. */
export function permissionsFor(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role];
}

export const roleLabel: Record<Role, string> = {
  [Role.SUPER_ADMIN]: "Super admin",
  [Role.ADMIN]: "Admin",
  [Role.TEACHER]: "Teacher",
  [Role.PARENT]: "Parent",
  [Role.STUDENT]: "Student",
};
