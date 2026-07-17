/**
 * In-memory TestimonioRepository for tests and local development. Satisfies
 * the same interface as the Supabase-backed implementation, so nothing that
 * depends on the seam changes between the two.
 */

import type { NuevoTestimonio, TestimonioRepository } from "./testimonio-repository";
import type { Testimonio } from "./testimonio";

export class InMemoryTestimonioRepository implements TestimonioRepository {
  private readonly items = new Map<string, Testimonio>();
  private counter = 0;

  constructor(seed: readonly Testimonio[] = []) {
    for (const testimonio of seed) this.items.set(testimonio.id, testimonio);
  }

  async listAll(): Promise<Testimonio[]> {
    // Stable sort: equal orden keeps insertion order, like the DB tiebreak.
    return [...this.items.values()].sort((a, b) => a.orden - b.orden);
  }

  async getById(id: string): Promise<Testimonio | null> {
    return this.items.get(id) ?? null;
  }

  async create(input: NuevoTestimonio): Promise<Testimonio> {
    const id = `testimonio-${++this.counter}`;
    const testimonio: Testimonio = { ...input, id };
    this.items.set(id, testimonio);
    return testimonio;
  }

  async update(id: string, cambios: Partial<NuevoTestimonio>): Promise<Testimonio | null> {
    const existing = this.items.get(id);
    if (!existing) return null;
    const updated: Testimonio = { ...existing, ...cambios, id };
    this.items.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }
}
