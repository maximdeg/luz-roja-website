/**
 * Composition root for the testimonials repository, mirroring the tienda's.
 * Server code asks here for a TestimonioRepository and gets the real
 * Supabase-backed implementation without learning which backend it is.
 */

import "server-only";
import type { TestimonioRepository } from "./testimonio-repository";
import { SupabaseTestimonioRepository } from "./supabase-testimonio-repository";

export function getTestimonioRepository(): TestimonioRepository {
  return new SupabaseTestimonioRepository();
}
