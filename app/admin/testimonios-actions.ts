"use server";

/**
 * Admin server actions for testimonials. Like the product actions, every one
 * re-checks the session server-side (never trusting the client) and only then
 * writes through the service-role repository. Mutations revalidate the home
 * page (where testimonials show) and the admin list.
 */

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./supabase-server-auth";
import { getTestimonioRepository } from "../testimonios/repositories";
import { validateTestimonioForm, parseOrdenInput } from "../testimonios/testimonio";

export interface TestimonioFormState {
  ok?: boolean;
  errors?: Record<string, string>;
  message?: string;
}

export async function crearTestimonio(formData: FormData): Promise<TestimonioFormState> {
  if (!(await getCurrentUser())) redirect("/admin/login");

  const values = readForm(formData);
  const errors = validateTestimonioForm(values);
  if (Object.keys(errors).length > 0) return { errors };

  try {
    await getTestimonioRepository().create({
      cita: values.cita.trim(),
      autor: values.autor.trim(),
      rol: values.rol.trim(),
      orden: parseOrdenInput(values.orden) as number
    });
  } catch (error) {
    return { message: error instanceof Error ? error.message : "No se pudo guardar el testimonio." };
  }

  revalidar();
  return { ok: true };
}

export async function actualizarTestimonio(formData: FormData): Promise<TestimonioFormState> {
  if (!(await getCurrentUser())) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  if (!id) return { message: "Falta el identificador del testimonio." };

  const values = readForm(formData);
  const errors = validateTestimonioForm(values);
  if (Object.keys(errors).length > 0) return { errors };

  try {
    const actualizado = await getTestimonioRepository().update(id, {
      cita: values.cita.trim(),
      autor: values.autor.trim(),
      rol: values.rol.trim(),
      orden: parseOrdenInput(values.orden) as number
    });
    if (!actualizado) return { message: "Ese testimonio ya no existe." };
  } catch (error) {
    return { message: error instanceof Error ? error.message : "No se pudo actualizar el testimonio." };
  }

  revalidar();
  return { ok: true };
}

export async function eliminarTestimonio(formData: FormData): Promise<void> {
  if (!(await getCurrentUser())) redirect("/admin/login");
  await getTestimonioRepository().delete(String(formData.get("id")));
  revalidar();
}

function readForm(formData: FormData) {
  return {
    cita: String(formData.get("cita") ?? ""),
    autor: String(formData.get("autor") ?? ""),
    rol: String(formData.get("rol") ?? ""),
    orden: String(formData.get("orden") ?? "")
  };
}

function revalidar(): void {
  revalidatePath("/");
  revalidatePath("/admin/testimonios");
}
