import { createHash, randomBytes } from "node:crypto";

/**
 * Invitation token helpers.
 *
 * Deliberately not in `lib/actions/invitations.ts`: a `"use server"` module may
 * only export async functions, and these are synchronous.
 */

/** A fresh, unguessable invitation token. Only ever sent, never stored. */
export function generateInvitationToken(): string {
  return randomBytes(32).toString("hex");
}

/** What actually gets stored, so a leaked database cannot accept invitations. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
