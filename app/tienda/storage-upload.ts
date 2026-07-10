/**
 * Server-only uploads to Supabase Storage, via the service-role client. Cover
 * images go to the PUBLIC `portadas` bucket; deliverable files go to the
 * PRIVATE `productos` bucket (never linked directly — served later through
 * short-lived signed URLs). Returns the object path to persist on the producto.
 */

import "server-only";
import { getSupabaseAdmin } from "./supabase-server";

const PORTADAS_BUCKET = "portadas";
const PRODUCTOS_BUCKET = "productos";

async function uploadTo(bucket: string, file: File, keyBase: string): Promise<string> {
  const path = `${keyBase}-${Date.now()}${extFromName(file.name)}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error } = await getSupabaseAdmin()
    .storage.from(bucket)
    .upload(path, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false
    });

  if (error) throw new Error(`No se pudo subir el archivo a ${bucket}: ${error.message}`);
  return path;
}

/** Uploads a cover image to the public `portadas` bucket. */
export function uploadPortada(file: File, keyBase: string): Promise<string> {
  return uploadTo(PORTADAS_BUCKET, file, keyBase);
}

/** Uploads a deliverable file to the private `productos` bucket. */
export function uploadArchivo(file: File, keyBase: string): Promise<string> {
  return uploadTo(PRODUCTOS_BUCKET, file, keyBase);
}

function extFromName(name: string): string {
  const match = /\.[a-z0-9]+$/i.exec(name);
  return match ? match[0].toLowerCase() : "";
}
