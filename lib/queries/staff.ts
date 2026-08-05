import "server-only";

import { Role } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { getCurrentSchoolId, getCurrentUser } from "@/lib/tenant";

export type StaffMember = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  joinedAt: string;
  /** True for the signed-in user's own row — they cannot change their own role. */
  isSelf: boolean;
  /** Name of the linked staff record, when this account has one. */
  teacherName: string | null;
};

export type PendingInvitation = {
  id: string;
  email: string;
  role: Role;
  invitedAt: string;
  expiresAt: string;
  isExpired: boolean;
};

export type StaffList = {
  members: StaffMember[];
  invitations: PendingInvitation[];
  /** Drives the "last administrator" guard in the UI. */
  adminCount: number;
  /** Only a super admin may grant the super admin role. */
  viewerIsSuperAdmin: boolean;
};

export async function getStaffMembers(): Promise<StaffList> {
  const [schoolId, viewer] = await Promise.all([
    getCurrentSchoolId(),
    getCurrentUser(),
  ]);

  const invitations = await prisma.invitation.findMany({
    where: { schoolId, acceptedAt: null, revokedAt: null },
    select: { id: true, email: true, role: true, createdAt: true, expiresAt: true },
    orderBy: { createdAt: "desc" },
  });

  const users = await prisma.user.findMany({
    where: { schoolId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
      teacher: { select: { name: true } },
    },
    orderBy: [{ role: "asc" }, { firstName: "asc" }],
  });

  const now = new Date();

  return {
    invitations: invitations.map((invitation) => ({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      invitedAt: invitation.createdAt.toISOString(),
      expiresAt: invitation.expiresAt.toISOString(),
      isExpired: invitation.expiresAt < now,
    })),
    members: users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      joinedAt: user.createdAt.toISOString(),
      isSelf: user.id === viewer?.id,
      teacherName: user.teacher?.name ?? null,
    })),
    adminCount: users.filter(
      (user) => user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN
    ).length,
    viewerIsSuperAdmin: viewer?.role === Role.SUPER_ADMIN,
  };
}
