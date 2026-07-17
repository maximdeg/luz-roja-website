/**
 * The testimonials seam. The home page and the admin panel depend on this
 * interface, never on Supabase directly — same architecture as the tienda's
 * CatalogRepository. Tests use the in-memory fake.
 */

import type { Testimonio } from "./testimonio";

/** Fields needed to create a testimonial; the repository assigns the id. */
export type NuevoTestimonio = Omit<Testimonio, "id">;

export interface TestimonioRepository {
  /** Every testimonial, in display order (orden ascending). */
  listAll(): Promise<Testimonio[]>;
  getById(id: string): Promise<Testimonio | null>;
  create(input: NuevoTestimonio): Promise<Testimonio>;
  /** Applies a partial change; returns the updated testimonial, or null if it's missing. */
  update(id: string, cambios: Partial<NuevoTestimonio>): Promise<Testimonio | null>;
  /** Returns true if a testimonial was deleted, false if it didn't exist. */
  delete(id: string): Promise<boolean>;
}
