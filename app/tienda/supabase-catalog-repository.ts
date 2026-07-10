/**
 * Supabase-backed CatalogRepository. Satisfies the same seam as the in-memory
 * fake, so callers (the /tienda page, the admin catalog) never learn where
 * products live. Runs through the service-role client, so writes and draft
 * reads are allowed; `listPublished` still filters to keep parity with the fake.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { CatalogRepository, NuevoProducto } from "./catalog-repository";
import type { Producto } from "./producto";
import { getSupabaseAdmin } from "./supabase-server";
import {
  productoFromRow,
  nuevoProductoToRow,
  productoChangesToRow,
  type ProductoRow
} from "./supabase-mappers";

const TABLE = "productos";

export class SupabaseCatalogRepository implements CatalogRepository {
  private readonly db: SupabaseClient;

  constructor(client: SupabaseClient = getSupabaseAdmin()) {
    this.db = client;
  }

  async listPublished(): Promise<Producto[]> {
    const { data, error } = await this.db
      .from(TABLE)
      .select("*")
      .eq("publicado", true)
      .order("created_at", { ascending: false });
    if (error) throw asError(error, "listar productos publicados");
    return (data as ProductoRow[]).map(productoFromRow);
  }

  async listAll(): Promise<Producto[]> {
    const { data, error } = await this.db
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw asError(error, "listar productos");
    return (data as ProductoRow[]).map(productoFromRow);
  }

  async getById(id: string): Promise<Producto | null> {
    const { data, error } = await this.db.from(TABLE).select("*").eq("id", id).maybeSingle();
    if (error) throw asError(error, "obtener producto por id");
    return data ? productoFromRow(data as ProductoRow) : null;
  }

  async getBySlug(slug: string): Promise<Producto | null> {
    const { data, error } = await this.db
      .from(TABLE)
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw asError(error, "obtener producto por slug");
    return data ? productoFromRow(data as ProductoRow) : null;
  }

  async create(input: NuevoProducto): Promise<Producto> {
    const { data, error } = await this.db
      .from(TABLE)
      .insert(nuevoProductoToRow(input))
      .select("*")
      .single();
    if (error) throw asError(error, "crear producto");
    return productoFromRow(data as ProductoRow);
  }

  async update(id: string, cambios: Partial<NuevoProducto>): Promise<Producto | null> {
    const row = productoChangesToRow(cambios);
    // Nothing to change: return the current row (or null if it's gone).
    if (Object.keys(row).length === 0) return this.getById(id);

    const { data, error } = await this.db
      .from(TABLE)
      .update(row)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw asError(error, "actualizar producto");
    return data ? productoFromRow(data as ProductoRow) : null;
  }

  async delete(id: string): Promise<boolean> {
    const { data, error } = await this.db
      .from(TABLE)
      .delete()
      .eq("id", id)
      .select("id");
    if (error) throw asError(error, "eliminar producto");
    return (data?.length ?? 0) > 0;
  }
}

function asError(error: { message: string }, action: string): Error {
  return new Error(`Supabase no pudo ${action}: ${error.message}`);
}
