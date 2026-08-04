import "server-only";

import { roleLabel, type Role } from "@/lib/auth/permissions";

/** Escapes untrusted values before they go into the HTML body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function invitationEmail({
  schoolName,
  inviterName,
  role,
  acceptUrl,
  expiresInDays,
}: {
  schoolName: string;
  inviterName: string | null;
  role: Role;
  acceptUrl: string;
  expiresInDays: number;
}) {
  const school = escapeHtml(schoolName);
  const inviter = inviterName ? escapeHtml(inviterName) : null;
  const roleName = roleLabel[role].toLowerCase();
  const subject = `You've been invited to ${schoolName} on Scoolr`;

  const text = [
    `${inviter ? `${inviterName} has` : "You have been"} invited you to join ${schoolName} on Scoolr as a ${roleName}.`,
    "",
    "Accept the invitation:",
    acceptUrl,
    "",
    `This link expires in ${expiresInDays} days and can only be used once.`,
    "If you weren't expecting this, you can ignore this email.",
  ].join("\n");

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb;padding:32px">
  <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:32px">
    <p style="font-size:24px;font-weight:700;margin:0 0 24px">
      <span style="color:#2563eb">S</span><span style="color:#111827">cool</span><span style="color:#818cf8">r</span>
    </p>
    <h1 style="font-size:18px;color:#111827;margin:0 0 12px">
      Join ${school} on Scoolr
    </h1>
    <p style="font-size:14px;color:#4b5563;line-height:1.6;margin:0 0 24px">
      ${inviter ? `${inviter} has invited you` : "You have been invited"} to join
      <strong>${school}</strong> as a <strong>${roleName}</strong>.
    </p>
    <a href="${acceptUrl}"
       style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600">
      Accept invitation
    </a>
    <p style="font-size:12px;color:#6b7280;line-height:1.6;margin:24px 0 0">
      This link expires in ${expiresInDays} days and can only be used once.
      If you weren't expecting this, you can ignore this email.
    </p>
    <p style="font-size:12px;color:#9ca3af;margin:16px 0 0;word-break:break-all">
      ${acceptUrl}
    </p>
  </div>
</div>`.trim();

  return { subject, html, text };
}
