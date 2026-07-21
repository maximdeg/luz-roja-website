"use server";

/**
 * Contact form server action the client calls. Thin wrapper: it supplies the
 * real Gmail sender to the injectable core logic (contact-action-core), which
 * does the honeypot drop, server-side re-validation, email build, and send.
 * Never throws to the client — returns a discriminated result the form renders.
 */

import { createGmailSender } from "./email-adapter";
import {
  submitContactWith,
  type ContactActionResult,
  type ContactSubmission
} from "./contact-action-core";

export async function submitContact(
  submission: ContactSubmission
): Promise<ContactActionResult> {
  return submitContactWith(submission, createGmailSender());
}
