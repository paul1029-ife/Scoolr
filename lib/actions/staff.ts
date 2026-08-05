"use server";

import { revalidatePath } from "next/cache";

import { Prisma } from "@/lib/generated/prisma/client";
import { Role } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { ensurePermission } from "@/lib/tenant";

const STAFF_PATH = "/dashboard/staff";

export type ActionResult = { ok: true } | { ok: false; error: string };

const ADMIN_ROLES: Role[] = [Role.ADMIN, Role.SUPER_ADMIN];

/**
 * Changes a colleague's role.
 *
 * The guards here exist to make it impossible to lock a school out of its own
 * account: you cannot change your own role, you cannot remove the last
 * administrator, and only a super admin can grant or revoke super admin.
 */
export async function updateUserRole(
  userId: string,
  role: Role
): Promise<ActionResult> {
  const permitted = await ensurePermission("school:manage");
  if (!permitted.ok) return permitted;

  const actor = permitted.user;

  if (!Object.values(Role).includes(role)) {
    return { ok: false, error: "That is not a valid role." };
  }

  // Changing your own role is how people accidentally remove their own access.
  if (userId === actor.id) {
    return {
      ok: false,
      error: "You cannot change your own role. Ask another administrator.",
    };
  }

  if (role === Role.SUPER_ADMIN && actor.role !== Role.SUPER_ADMIN) {
    return {
      ok: false,
      error: "Only a super admin can grant the super admin role.",
    };
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        const target = await tx.user.findFirst({
          where: { id: userId, schoolId: actor.schoolId },
          select: { id: true, role: true },
        });

        if (!target) {
          throw new StaffError("That account is not part of your school.");
        }

        if (target.role === role) {
          return;
        }

        if (
          target.role === Role.SUPER_ADMIN &&
          actor.role !== Role.SUPER_ADMIN
        ) {
          throw new StaffError(
            "Only a super admin can change another super admin's role."
          );
        }

        // Re-counted inside the transaction: two admins demoting each other at
        // the same time would each see a safe count outside of one.
        if (ADMIN_ROLES.includes(target.role) && !ADMIN_ROLES.includes(role)) {
          const remainingAdmins = await tx.user.count({
            where: {
              schoolId: actor.schoolId,
              role: { in: ADMIN_ROLES },
              id: { not: target.id },
            },
          });

          if (remainingAdmins === 0) {
            throw new StaffError(
              "Your school must keep at least one administrator."
            );
          }
        }

        await tx.user.update({ where: { id: target.id }, data: { role } });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
  } catch (error) {
    if (error instanceof StaffError) {
      return { ok: false, error: error.message };
    }
    // Serialisable transactions can abort under contention; ask for a retry
    // rather than surfacing a Postgres error code.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2034"
    ) {
      return {
        ok: false,
        error: "Someone else was making a change. Please try again.",
      };
    }
    throw error;
  }

  revalidatePath(STAFF_PATH);
  return { ok: true };
}

/** Expected, user-facing failures raised inside the transaction. */
class StaffError extends Error {}
