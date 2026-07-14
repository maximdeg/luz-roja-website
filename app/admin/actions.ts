"use server";

/**
 * Admin server actions. Every one re-checks the session server-side (never
 * trusting the client) and only then touches the catalog through the
 * service-role repository.
 *
 * Files are NOT sent through these actions — the browser uploads them straight
 * to Supabase Storage using short-lived signed upload URLs minted by
 * `firmarSubidas`. That keeps request bodies tiny (no server-action / Vercel
 * body-size limit) while the buckets stay private. `crearProducto` then only
 * receives the resulting object paths.
 */

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser, createServerSupabase } from "./supabase-server-auth";
import { getSupabaseAdmin } from "../tienda/supabase-server";
import { getCatalogRepository } from "../tienda/repositories";
import { validateProductoForm } from "../tienda/producto";
import { parsePrecioInput } from "../tienda/precio";
import { slugify } from "../tienda/slug";

export interface ProductoFormState {
  ok?: boolean;
  errors?: Record<string, string>;
  message?: string;
}

export interface SignedUpload {
  path: string;
  token: string;
}

export interface FirmarSubidasResult {
  portada?: SignedUpload;
  archivo?: SignedUpload;
  error?: string;
}

/**
 * Mints signed upload URLs for the browser to upload directly to Storage. Only
 * an authenticated founder can get them; the object keys are random so uploads
 * never collide or overwrite.
 */
export async function firmarSubidas(input: {
  portadaName?: string;
  archivoName?: string;
}): Promise<FirmarSubidasResult> {
  if (!(await getCurrentUser())) return { error: "Tenés que iniciar sesión de nuevo." };

  const storage = getSupabaseAdmin().storage;
  const result: FirmarSubidasResult = {};

  if (input.portadaName) {
    const { data, error } = await storage
      .from("portadas")
      .createSignedUploadUrl(`${randomUUID()}${ext(input.portadaName)}`);
    if (error || !data) return { error: `No se pudo preparar la portada: ${error?.message ?? ""}` };
    result.portada = { path: data.path, token: data.token };
  }

  if (input.archivoName) {
    const { data, error } = await storage
      .from("productos")
      .createSignedUploadUrl(`${randomUUID()}${ext(input.archivoName)}`);
    if (error || !data) return { error: `No se pudo preparar el archivo: ${error?.message ?? ""}` };
    result.archivo = { path: data.path, token: data.token };
  }

  return result;
}

export async function crearProducto(formData: FormData): Promise<ProductoFormState> {
  if (!(await getCurrentUser())) redirect("/admin/login");

  const titulo = String(formData.get("titulo") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const precio = String(formData.get("precio") ?? "").trim();
  const esGratis = formData.get("esGratis") === "on";
  const publicar = formData.get("intent") === "publicar";

  // Already-uploaded object paths (empty string => none).
  const imagenPortada = String(formData.get("imagenPortada") ?? "").trim() || null;
  const archivo = String(formData.get("archivo") ?? "").trim() || null;

  const errors = validateProductoForm({
    titulo,
    descripcion,
    precio,
    esGratis,
    tieneArchivo: archivo !== null,
    publicar
  });
  if (Object.keys(errors).length > 0) return { errors };

  const catalog = getCatalogRepository();

  // Derive a unique slug; disambiguate only on collision.
  const base = slugify(titulo);
  const slug = (await catalog.getBySlug(base)) ? `${base}-${Date.now().toString(36)}` : base;

  try {
    await catalog.create({
      slug,
      titulo,
      descripcion,
      imagenPortada,
      archivo,
      precioCentavos: esGratis ? null : parsePrecioInput(precio),
      esGratis,
      publicado: publicar
    });
  } catch (error) {
    return { message: error instanceof Error ? error.message : "No se pudo guardar el producto." };
  }

  revalidatePath("/tienda");
  revalidatePath("/admin");
  return { ok: true };
}

export async function alternarPublicado(formData: FormData): Promise<void> {
  if (!(await getCurrentUser())) redirect("/admin/login");
  const id = String(formData.get("id"));
  const publicado = formData.get("publicado") === "true";
  await getCatalogRepository().update(id, { publicado: !publicado });
  revalidatePath("/tienda");
  revalidatePath("/admin");
}

export async function eliminarProducto(formData: FormData): Promise<void> {
  if (!(await getCurrentUser())) redirect("/admin/login");
  await getCatalogRepository().delete(String(formData.get("id")));
  revalidatePath("/tienda");
  revalidatePath("/admin");
}

export async function cerrarSesion(): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function ext(name: string): string {
  const match = /\.[a-z0-9]+$/i.exec(name);
  return match ? match[0].toLowerCase() : "";
}
