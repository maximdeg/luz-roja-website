/**
 * The home-page testimonial (testimonio) and pure validation for the admin
 * testimonial form. Mirrors the producto convention: validation returns a map
 * of field -> error message, and an empty object means "valid".
 */

/** A testimonial as persisted and shown on the home page. */
export interface Testimonio {
  id: string;
  /** The quote itself, without decorative quotation marks. */
  cita: string;
  autor: string;
  rol: string;
  /** Display position on the home page; ascending, lowest first. */
  orden: number;
}

export const CITA_MAX = 600;
export const AUTOR_MAX = 120;
export const ROL_MAX = 120;

/** Raw values as they come out of the admin testimonial form. */
export interface TestimonioFormValues {
  cita?: string;
  autor?: string;
  rol?: string;
  /** Raw order input, e.g. "3". */
  orden?: string;
}

export type TestimonioFormErrors = Record<string, string>;

/** Parses the raw order input to a non-negative integer, or null if invalid. */
export function parseOrdenInput(raw: string | undefined): number | null {
  const trimmed = raw?.trim() ?? "";
  if (!/^\d+$/.test(trimmed)) return null;
  return Number.parseInt(trimmed, 10);
}

export function validateTestimonioForm(values: TestimonioFormValues): TestimonioFormErrors {
  const errors: TestimonioFormErrors = {};

  const cita = values.cita?.trim() ?? "";
  if (!cita) {
    errors.cita = "El testimonio es obligatorio.";
  } else if (cita.length > CITA_MAX) {
    errors.cita = `El testimonio no puede superar los ${CITA_MAX} caracteres.`;
  }

  const autor = values.autor?.trim() ?? "";
  if (!autor) {
    errors.autor = "El autor es obligatorio.";
  } else if (autor.length > AUTOR_MAX) {
    errors.autor = `El autor no puede superar los ${AUTOR_MAX} caracteres.`;
  }

  const rol = values.rol?.trim() ?? "";
  if (!rol) {
    errors.rol = "El rol es obligatorio.";
  } else if (rol.length > ROL_MAX) {
    errors.rol = `El rol no puede superar los ${ROL_MAX} caracteres.`;
  }

  if (parseOrdenInput(values.orden) === null) {
    errors.orden = "Ingresá un orden válido (un número entero, 0 o más).";
  }

  return errors;
}
