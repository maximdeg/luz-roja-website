/**
 * Pure mapping between the snake_case Supabase rows and the Testimonio domain
 * type. Kept free of any Supabase client so the translation — the part most
 * likely to drift from the schema — is unit-testable in Node.
 *
 * `TestimonioRow` mirrors `supabase/migrations/0002_testimonios.sql`.
 */

import type { Testimonio } from "./testimonio";
import type { NuevoTestimonio } from "./testimonio-repository";

export interface TestimonioRow {
  id: string;
  cita: string;
  autor: string;
  rol: string;
  orden: number;
}

export function testimonioFromRow(row: TestimonioRow): Testimonio {
  return {
    id: row.id,
    cita: row.cita,
    autor: row.autor,
    rol: row.rol,
    orden: row.orden
  };
}

/** Row for inserting a new testimonial (no id — the DB assigns a uuid). */
export type NuevoTestimonioRow = Omit<TestimonioRow, "id">;

export function nuevoTestimonioToRow(input: NuevoTestimonio): NuevoTestimonioRow {
  return {
    cita: input.cita,
    autor: input.autor,
    rol: input.rol,
    orden: input.orden
  };
}

/**
 * Translates a partial change set, emitting only the keys that were actually
 * provided so an `update` touches nothing else.
 */
export function testimonioChangesToRow(
  cambios: Partial<NuevoTestimonio>
): Partial<NuevoTestimonioRow> {
  const row: Partial<NuevoTestimonioRow> = {};
  if ("cita" in cambios) row.cita = cambios.cita;
  if ("autor" in cambios) row.autor = cambios.autor;
  if ("rol" in cambios) row.rol = cambios.rol;
  if ("orden" in cambios) row.orden = cambios.orden;
  return row;
}
