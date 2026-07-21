/**
 * Server-only email adapter over Gmail SMTP (nodemailer). Reads GMAIL_USER /
 * GMAIL_APP_PASSWORD from the environment — an App Password, never the account
 * password — so it must never reach the browser. Deliberately thin: build a
 * sender, send. The sender is injectable so callers (and tests) can pass a fake
 * instead of hitting real SMTP.
 */

import "server-only";
import nodemailer from "nodemailer";

export interface OutgoingEmail {
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}

/** Sends one message. The default reaches Gmail; tests inject a fake. */
export type EmailSender = (email: OutgoingEmail) => Promise<void>;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta ${name} en el entorno.`);
  return value;
}

/**
 * Lazily builds the real Gmail SMTP sender. Env is read (and validated) only
 * when this is actually invoked, so injecting a fake sender needs no env.
 */
export function createGmailSender(): EmailSender {
  const user = requireEnv("GMAIL_USER");
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: requireEnv("GMAIL_APP_PASSWORD") }
  });

  return async (email) => {
    // `from` is the Gmail account; `replyTo` (the visitor) is where replies go.
    await transport.sendMail({
      from: user,
      to: email.to,
      replyTo: email.replyTo,
      subject: email.subject,
      text: email.text,
      html: email.html
    });
  };
}

/**
 * Sends an email. Throws if the send fails so callers can fall back. Pass a
 * `send` to bypass real SMTP (tests / the server action's injected sender).
 */
export async function sendEmail(
  email: OutgoingEmail,
  send: EmailSender = createGmailSender()
): Promise<void> {
  await send(email);
}
