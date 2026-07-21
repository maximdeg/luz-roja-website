/**
 * Builds a prefilled `mailto:` link from a submitted contact form. Retained as
 * the fallback when server-side email delivery fails, so a valid submit can
 * still hand off to the visitor's own mail client.
 */

import type { ContactFormValues, ContactFormVariant } from "./contact-form-validation";
import { bodyLines, senderName } from "./contact-fields";

const RECIPIENT = "luzrojacontenidos@gmail.com";

export function buildContactMailto(
  values: ContactFormValues,
  variant: ContactFormVariant = "contacto"
): string {
  const subject = `Consulta de ${senderName(values)}`.trim();
  const body = bodyLines(values, variant).join("\n");

  return `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
