/**
 * The catalog seam. Everything that reads or writes products depends on this
 * interface, never on Supabase directly, so the storage backend can change
 * without touching callers. The real Supabase-backed implementation lands in
 * the Supabase-foundation slice once project credentials exist; tests and local
 * development use the in-memory fake.
 */

import type { Producto } from "./producto";

/** Fields needed to create a product; the repository assigns the id. */
export type NuevoProducto = Omit<Producto, "id">;

export interface CatalogRepository {
  /** Published products only — what the public tienda shows. */
  listPublished(): Promise<Producto[]>;
  /** Every product, drafts included — for the admin catalog. */
  listAll(): Promise<Producto[]>;
  getById(id: string): Promise<Producto | null>;
  getBySlug(slug: string): Promise<Producto | null>;
  create(input: NuevoProducto): Promise<Producto>;
  /** Applies a partial change; returns the updated product, or null if it's missing. */
  update(id: string, cambios: Partial<NuevoProducto>): Promise<Producto | null>;
  /** Returns true if a product was deleted, false if it didn't exist. */
  delete(id: string): Promise<boolean>;
}
