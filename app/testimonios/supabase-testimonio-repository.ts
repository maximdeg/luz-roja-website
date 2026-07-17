/**
 * Supabase-backed TestimonioRepository. Satisfies the same seam as the
 * in-memory fake, so callers (the home page, the admin panel) never learn
 * where testimonials live. Runs through the service-role client like the
 * catalog repository.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { NuevoTestimonio, TestimonioRepository } from "./testimonio-repository";
import type { Testimonio } from "./testimonio";
import { getSupabaseAdmin } from "../tienda/supabase-server";
import {
  testimonioFromRow,
  nuevoTestimonioToRow,
  testimonioChangesToRow,
  type TestimonioRow
} from "./supabase-testimonio-mappers";

const TABLE = "testimonios";

export class SupabaseTestimonioRepository implements TestimonioRepository {
  private readonly db: SupabaseClient;

  constructor(client: SupabaseClient = getSupabaseAdmin()) {
    this.db = client;
  }

  async listAll(): Promise<Testimonio[]> {
    const { data, error } = await this.db
      .from(TABLE)
      .select("*")
      .order("orden", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw asError(error, "listar testimonios");
    return (data as TestimonioRow[]).map(testimonioFromRow);
  }

  async getById(id: string): Promise<Testimonio | null> {
    const { data, error } = await this.db.from(TABLE).select("*").eq("id", id).maybeSingle();
    if (error) throw asError(error, "obtener testimonio por id");
    return data ? testimonioFromRow(data as TestimonioRow) : null;
  }

  async create(input: NuevoTestimonio): Promise<Testimonio> {
    const { data, error } = await this.db
      .from(TABLE)
      .insert(nuevoTestimonioToRow(input))
      .select("*")
      .single();
    if (error) throw asError(error, "crear testimonio");
    return testimonioFromRow(data as TestimonioRow);
  }

  async update(id: string, cambios: Partial<NuevoTestimonio>): Promise<Testimonio | null> {
    const row = testimonioChangesToRow(cambios);
    // Nothing to change: return the current row (or null if it's gone).
    if (Object.keys(row).length === 0) return this.getById(id);

    const { data, error } = await this.db
      .from(TABLE)
      .update(row)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw asError(error, "actualizar testimonio");
    return data ? testimonioFromRow(data as TestimonioRow) : null;
  }

  async delete(id: string): Promise<boolean> {
    const { data, error } = await this.db
      .from(TABLE)
      .delete()
      .eq("id", id)
      .select("id");
    if (error) throw asError(error, "eliminar testimonio");
    return (data?.length ?? 0) > 0;
  }
}

function asError(error: { message: string }, action: string): Error {
  return new Error(`Supabase no pudo ${action}: ${error.message}`);
}
