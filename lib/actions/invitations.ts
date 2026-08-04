"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { generateInvitationToken, hashToken } from "@/lib/auth/invitation-token";
import { Role } from "@/lib/generated/prisma/enums";
import { invitationEmail } from "@/lib/email/templates";
import { emailIsConfigured, sendEmail } from "@/lib/email/send";
import { prisma } from "@/lib/prisma";
import { ensurePermission } from "@/lib/tenant";

const STAFF_PATH = "/dashboard/staff";
const EXPIRES_IN_DAYS = 7;

export type InviteResult =
  | { ok: true; delivered: boolean; acceptUrl: string }
  | { ok: false; error: string };

export type ActionResult = { ok: true } | { ok: false; error: string };

const inviteSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  role: z.nativeEnum(Role),
});

export type InviteFormData = z.infer<typeof inviteSchema>;

/**
 * Absolute base URL for links in emails.
 *
 * Falls back to the request's own host so invite links work in development
 * without extra configuration.
 */
async function getBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";

  return `${protocol}://${host}`;
}

export async function inviteStaff(
  data: InviteFormData
): Promise<InviteResult> {
  const permitted = await ensurePermission("school:manage");
  if (!permitted.ok) return permitted;

  const actor = permitted.user;
  const parsed = inviteSchema.safeParse(data);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid invitation details",
    };
  }

  const { email, role } = parsed.data;

  if (role === Role.SUPER_ADMIN && actor.role !== Role.SUPER_ADMIN) {
    return {
      ok: false,
      error: "Only a super admin can invite another super admin.",
    };
  }

  const existingUser = await prisma.user.findFirst({
    where: { schoolId: actor.schoolId, email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      ok: false,
      error: "Someone with that email already has an account at your school.",
    };
  }

  const token = generateInvitationToken();
  const expiresAt = new Date(
    Date.now() + EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
  );

  // Re-inviting the same address replaces the outstanding invitation rather
  // than leaving several live tokens for one person.
  await prisma.invitation.updateMany({
    where: { schoolId: actor.schoolId, email, acceptedAt: null, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  await prisma.invitation.create({
    data: {
      schoolId: actor.schoolId,
      email,
      role,
      tokenHash: hashToken(token),
      invitedById: actor.id,
      expiresAt,
    },
  });

  const school = await prisma.school.findUniqueOrThrow({
    where: { id: actor.schoolId },
    select: { name: true },
  });

  const acceptUrl = `${await getBaseUrl()}/invite/${token}`;
  const message = invitationEmail({
    schoolName: school.name,
    inviterName: [actor.firstName, actor.lastName].filter(Boolean).join(" "),
    role,
    acceptUrl,
    expiresInDays: EXPIRES_IN_DAYS,
  });

  const sent = await sendEmail({ to: email, ...message });

  if (!sent.ok) {
    return { ok: false, error: `Invitation saved, but email failed: ${sent.error}` };
  }

  revalidatePath(STAFF_PATH);

  // The link is returned so the UI can offer it for manual sharing when email
  // is not configured yet.
  return {
    ok: true,
    delivered: sent.delivered,
    acceptUrl: emailIsConfigured() ? "" : acceptUrl,
  };
}

export async function revokeInvitation(id: string): Promise<ActionResult> {
  const permitted = await ensurePermission("school:manage");
  if (!permitted.ok) return permitted;

  const { count } = await prisma.invitation.updateMany({
    where: {
      id,
      schoolId: permitted.user.schoolId,
      acceptedAt: null,
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });

  if (count === 0) {
    return { ok: false, error: "That invitation is no longer pending." };
  }

  revalidatePath(STAFF_PATH);
  return { ok: true };
}
