/**
 * Helpers for turning stored Supabase Storage paths into URLs the browser can
 * use. Cover images live in the PUBLIC `portadas` bucket, so their URL can be
 * built with just the project base URL (no signing). Deliverable files live in
 * the PRIVATE `productos` bucket and are never linked directly — those get
 * short-lived signed URLs generated server-side after payment.
 */

const PORTADAS_BUCKET = "portadas";

/**
 * Public URL for a cover image. Accepts either a full `http(s)` URL (returned
 * as-is) or an object path inside the `portadas` bucket. Returns null when
 * there is no cover or the base URL is unavailable.
 */
export function portadaPublicUrl(
  imagenPortada: string | null,
  baseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL
): string | null {
  if (!imagenPortada) return null;
  if (/^https?:\/\//i.test(imagenPortada)) return imagenPortada;
  if (!baseUrl) return null;
  const base = baseUrl.replace(/\/+$/, "");
  const path = imagenPortada.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/${PORTADAS_BUCKET}/${path}`;
}
