import "server-only";

import { cache } from "react";

import { auth } from "@/lib/auth/server";
import { can, roleLabel, type Permission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/generated/prisma/enums";

export type CurrentUser = {
  id: string;
  authUserId: string;
  schoolId: string;
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string | null;
};

function splitName(name: string | null | undefined, email: string) {
  const source = name?.trim() || email.split("@")[0] || "User";
  const [first, ...rest] = source.split(/\s+/);
  return { firstName: first, lastName: rest.join(" ") };
}

/**
 * Resolves the signed-in user, creating the local row on first sign-in.
 *
 * Neon Auth is the source of truth for identity; this table is the source of
 * truth for which school someone belongs to and what they may do.
 *
 * `cache` dedupes this across a single render pass, so several server
 * components can call it without repeating the session lookup and query.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const { data } = await auth.getSession();
  const sessionUser = data?.user;

  if (!sessionUser) return null;

  const existing = await prisma.user.findUnique({
    where: { authUserId: sessionUser.id },
  });

  if (existing) return existing;

  const email = sessionUser.email.toLowerCase();
  const { firstName, lastName } = splitName(sessionUser.name, email);

  // An account is only created for someone holding a live invitation to the
  // email they signed up with. Signing up alone grants nothing — otherwise
  // anyone reaching /signup would land inside a school with a working role.
  const invitation = await prisma.invitation.findFirst({
    where: {
      email,
      acceptedAt: null,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, schoolId: true, role: true },
  });

  if (invitation) {
    const [user] = await prisma.$transaction([
      prisma.user.create({
        data: {
          authUserId: sessionUser.id,
          schoolId: invitation.schoolId,
          role: invitation.role,
          email,
          firstName,
          lastName,
          imageUrl: sessionUser.image ?? null,
        },
      }),
      prisma.invitation.update({
        where: { id: invitation.id },
        data: { acceptedAt: new Date() },
      }),
    ]);

    return user;
  }

  // No invitation and no school: they register one at /start, which is what
  // makes them its admin. Tenancy comes only from a user's own school — there
  // is no default school any more.
  return null;
});

/** Like `getCurrentUser`, but throws instead of returning null. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  return user;
}

/** Throws unless the signed-in user holds one of `roles`. */
export async function requireRole(roles: Role[]): Promise<CurrentUser> {
  const user = await requireUser();

  if (!roles.includes(user.role)) {
    throw new Error("You do not have permission to perform this action.");
  }

  return user;
}

export type PermissionCheck =
  | { ok: true; user: CurrentUser }
  | { ok: false; error: string };

/**
 * The authorisation gate for server actions.
 *
 * Returns a result rather than throwing so an unauthorised attempt surfaces as
 * a normal error message instead of a 500. Every mutating action must call this
 * first: the UI also hides what a user cannot do, but that is presentation
 * only — a crafted request reaches the action directly.
 */
export async function ensurePermission(
  permission: Permission
): Promise<PermissionCheck> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, error: "You are not signed in." };
  }

  if (!can(user.role, permission)) {
    return {
      ok: false,
      error: `Your ${roleLabel[
        user.role
      ].toLowerCase()} account does not have permission to do that.`,
    };
  }

  return { ok: true, user };
}

/** Convenience for pages: does the signed-in user hold this permission? */
export async function currentUserCan(
  permission: Permission
): Promise<boolean> {
  const user = await getCurrentUser();
  return user ? can(user.role, permission) : false;
}

/** The tenant every query and mutation is scoped to. */
export async function getCurrentSchoolId(): Promise<string> {
  const user = await requireUser();
  return user.schoolId;
}
