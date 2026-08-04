import "server-only";

import { Resend } from "resend";

export type SendResult =
  | { ok: true; delivered: boolean }
  | { ok: false; error: string };

let client: Resend | null = null;

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  return (client ??= new Resend(apiKey));
}

/** Whether outbound email is configured. */
export function emailIsConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Sends a transactional email.
 *
 * Without RESEND_API_KEY the message is logged instead of sent, so the invite
 * flow is usable in development before any email account exists. `delivered`
 * tells the caller which happened, so the UI can be honest about it rather than
 * claiming an email went out when it did not.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<SendResult> {
  const resend = getClient();

  if (!resend) {
    console.info(
      `\n[email] RESEND_API_KEY not set — not sending.\n  to: ${to}\n  subject: ${subject}\n${text
        .split("\n")
        .map((line) => `  ${line}`)
        .join("\n")}\n`
    );
    return { ok: true, delivered: false };
  }

  const from = process.env.EMAIL_FROM;

  if (!from) {
    return {
      ok: false,
      error: "EMAIL_FROM is not set. See .env.example.",
    };
  }

  const { error } = await resend.emails.send({ from, to, subject, html, text });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, delivered: true };
}
