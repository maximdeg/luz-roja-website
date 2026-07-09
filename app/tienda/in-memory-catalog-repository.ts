/**
 * In-memory CatalogRepository for tests and local development. Satisfies the
 * same interface as the future Supabase-backed implementation, so nothing that
 * depends on the seam changes when the real backend arrives.
 */

import type { CatalogRepository, NuevoProducto } from "./catalog-repository";
import type { Producto } from "./producto";

export class InMemoryCatalogRepository implements CatalogRepository {
  private readonly items = new Map<string, Producto>();
  private counter = 0;

  constructor(seed: readonly Producto[] = []) {
    for (const producto of seed) this.items.set(producto.id, producto);
  }

  async listPublished(): Promise<Producto[]> {
    return [...this.items.values()].filter((p) => p.publicado);
  }

  async listAll(): Promise<Producto[]> {
    return [...this.items.values()];
  }

  async getById(id: string): Promise<Producto | null> {
    return this.items.get(id) ?? null;
  }

  async getBySlug(slug: string): Promise<Producto | null> {
    return [...this.items.values()].find((p) => p.slug === slug) ?? null;
  }

  async create(input: NuevoProducto): Promise<Producto> {
    const id = `prod-${++this.counter}`;
    const producto: Producto = { ...input, id };
    this.items.set(id, producto);
    return producto;
  }

  async update(id: string, cambios: Partial<NuevoProducto>): Promise<Producto | null> {
    const existing = this.items.get(id);
    if (!existing) return null;
    const updated: Producto = { ...existing, ...cambios, id };
    this.items.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }
}
