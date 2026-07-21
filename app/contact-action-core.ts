/**
 * Contact submission logic, with the email sender injected. Kept out of the
 * "use server" module so it can export types, a constant, and a function that
 * takes the sender — none of which are valid server-action exports — and so
 * tests can drive every branch (bot / invalid / send-failure / ok) without real
 * SMTP. The thin "use server" wrapper (contact-action) supplies the real sender.
 */

import {
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
  type ContactFormVariant
} from "./contact-form-validation";
import { buildContactEmail } from "./contact-email";
// Type-only import: erased at compile time, so this does NOT pull in the
// server-only email-adapter module at runtime — keeping the core unit-testable.
import type { EmailSender } from "./email-adapter";

/** Hidden field real users never see; a filled value means a bot submitted. */
export const HONEYPOT_FIELD = "website";

export interface ContactSubmission {
  values: ContactFormValues;
  variant: ContactFormVariant;
  /** The honeypot input's value; present and non-empty only for bots. */
  honeypot?: string;
}

export type ContactActionResult =
  | { status: "ok" }
  | { status: "invalid"; errors: ContactFormErrors }
  | { status: "error" };

export async function submitContactWith(
  submission: ContactSubmission,
  send: EmailSender
): Promise<ContactActionResult> {
  // Bots fill the honeypot. Report success and send nothing — no signal to them.
  if (submission.honeypot && submission.honeypot.trim() !== "") {
    return { status: "ok" };
  }

  const { values, variant } = submission;
  const errors = validateContactForm(values, variant);
  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors };
  }

  try {
    const email = buildContactEmail(values, variant);
    await send(email);
  } catch {
    return { status: "error" };
  }

  return { status: "ok" };
}
