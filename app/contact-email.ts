/**
 * Pure builder for the contact-enquiry email — the message sent to the Luz Roja
 * inbox when a visitor submits the contact form. Like `buildDownloadEmail`, it
 * only assembles strings; the nodemailer adapter does the sending. Kept pure so
 * the recipient, subject, reply-to, and body are unit-testable without SMTP.
 */

import type { ContactFormValues, ContactFormVariant } from "./contact-form-validation";
import { bodyLines, senderName } from "./contact-fields";

/** The Luz Roja inbox that receives every enquiry. */
const RECIPIENT = "luzrojacontenidos@gmail.com";

export interface ContactEmail {
  to: string;
  /** The visitor's address, so replying to the enquiry answers them. */
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}

export function buildContactEmail(
  values: ContactFormValues,
  variant: ContactFormVariant = "contacto"
): ContactEmail {
  const sender = senderName(values);
  const subject = `Consulta de ${sender}`.trim();
  const lines = bodyLines(values, variant);

  const text = lines.join("\n");

  const html = [
    '<div style="font-family:Arial,Helvetica,sans-serif;color:#161616;line-height:1.6">',
    `<p><strong>Nueva consulta desde el formulario de contacto.</strong></p>`,
    "<ul>",
    ...lines.map((line) => `<li>${escapeHtml(line)}</li>`),
    "</ul>",
    "</div>"
  ].join("");

  return {
    to: RECIPIENT,
    replyTo: values.email?.trim() ?? "",
    subject,
    text,
    html
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
