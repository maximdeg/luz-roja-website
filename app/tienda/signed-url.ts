/**
 * Server-only adapter that mints a short-lived signed URL for a deliverable in
 * the PRIVATE `productos` bucket. This is the only way a private file is ever
 * handed out — both the free path and (later) the paid path go through here, so
 * the bucket can stay private and links expire quickly.
 */

import "server-only";
import { getSupabaseAdmin } from "./supabase-server";

const PRODUCTOS_BUCKET = "productos";
const DEFAULT_TTL_SECONDS = 120;

export interface SignedUrlOptions {
  /** Seconds the URL stays valid. Defaults to 120s. */
  expiresIn?: number;
  /** Filename the browser saves it as (sets Content-Disposition: attachment). */
  downloadAs?: string;
}

export async function createArchivoSignedUrl(
  archivo: string,
  options: SignedUrlOptions = {}
): Promise<string> {
  const { data, error } = await getSupabaseAdmin()
    .storage.from(PRODUCTOS_BUCKET)
    .createSignedUrl(archivo, options.expiresIn ?? DEFAULT_TTL_SECONDS, {
      download: options.downloadAs ?? true
    });

  if (error || !data) {
    throw new Error(
      `No se pudo generar el enlace de descarga: ${error?.message ?? "sin datos"}`
    );
  }
  return data.signedUrl;
}
