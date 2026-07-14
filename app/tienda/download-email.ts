/**
 * Pure builder for the paid-delivery email — the message sent once a pedido is
 * paid, carrying the signed download link. Like `contact-mailto`, it just
 * assembles strings; the email adapter does the sending. Kept pure so the copy
 * and the link placement are unit-testable.
 */

export interface DownloadEmail {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface DownloadEmailInput {
  emailComprador: string;
  productoTitulo: string;
  downloadUrl: string;
}

export function buildDownloadEmail({
  emailComprador,
  productoTitulo,
  downloadUrl
}: DownloadEmailInput): DownloadEmail {
  const subject = `Tu descarga de Luz Roja: ${productoTitulo}`;

  const text = [
    "¡Gracias por tu compra!",
    "",
    `Ya podés descargar "${productoTitulo}" desde este enlace:`,
    downloadUrl,
    "",
    "El enlace es personal y vence en unos días, así que guardá tu archivo cuando lo abras.",
    "",
    "Un abrazo,",
    "Luz Roja Contenidos"
  ].join("\n");

  const html = [
    '<div style="font-family:Arial,Helvetica,sans-serif;color:#161616;line-height:1.6">',
    "<p>¡Gracias por tu compra!</p>",
    `<p>Ya podés descargar <strong>${escapeHtml(productoTitulo)}</strong>:</p>`,
    `<p><a href="${escapeHtml(downloadUrl)}" style="display:inline-block;background:#AB0F08;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px">Descargar archivo</a></p>`,
    "<p>El enlace es personal y vence en unos días, así que guardá tu archivo cuando lo abras.</p>",
    "<p>Un abrazo,<br/>Luz Roja Contenidos</p>",
    "</div>"
  ].join("");

  return { to: emailComprador, subject, text, html };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
