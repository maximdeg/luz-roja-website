"use server";

/**
 * Admin server actions. Every one re-checks the session server-side (never
 * trusting the client) and only then touches the catalog through the
 * service-role repository. Product creation validates with the same pure
 * `validateProductoForm` the form uses, uploads the files, and persists.
 */

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser, createServerSupabase } from "./supabase-server-auth";
import { getCatalogRepository } from "../tienda/repositories";
import { validateProductoForm } from "../tienda/producto";
import { parsePrecioInput } from "../tienda/precio";
import { slugify } from "../tienda/slug";
import { uploadPortada, uploadArchivo } from "../tienda/storage-upload";

export interface ProductoFormState {
  errors?: Record<string, string>;
  message?: string;
}

export async function crearProducto(
  _prev: ProductoFormState,
  formData: FormData
): Promise<ProductoFormState> {
  if (!(await getCurrentUser())) redirect("/admin/login");

  const titulo = String(formData.get("titulo") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const precio = String(formData.get("precio") ?? "").trim();
  const esGratis = formData.get("esGratis") === "on";
  const publicar = formData.get("intent") === "publicar";

  const portadaFile = asFile(formData.get("portada"));
  const archivoFile = asFile(formData.get("archivo"));
  const tieneArchivo = archivoFile !== null;

  const errors = validateProductoForm({
    titulo,
    descripcion,
    precio,
    esGratis,
    tieneArchivo,
    publicar
  });
  if (Object.keys(errors).length > 0) return { errors };

  const catalog = getCatalogRepository();

  // Derive a unique slug; disambiguate only on collision.
  const base = slugify(titulo);
  const slug = (await catalog.getBySlug(base)) ? `${base}-${Date.now().toString(36)}` : base;

  try {
    const imagenPortada = portadaFile ? await uploadPortada(portadaFile, slug) : null;
    const archivo = archivoFile ? await uploadArchivo(archivoFile, slug) : null;

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
  redirect("/admin");
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

/** Normalises a FormData entry to a real, non-empty File, or null. */
function asFile(value: FormDataEntryValue | null): File | null {
  return value instanceof File && value.size > 0 ? value : null;
}
