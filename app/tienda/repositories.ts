/**
 * Composition root for the tienda's repositories. Server code asks here for a
 * CatalogRepository / PedidoRepository and gets the real Supabase-backed
 * implementation, without learning which backend it is. Swapping backends (or
 * dropping in the in-memory fake) is a one-line change confined to this file.
 */

import "server-only";
import type { CatalogRepository } from "./catalog-repository";
import type { PedidoRepository } from "./pedido-repository";
import { SupabaseCatalogRepository } from "./supabase-catalog-repository";
import { SupabasePedidoRepository } from "./supabase-pedido-repository";

export function getCatalogRepository(): CatalogRepository {
  return new SupabaseCatalogRepository();
}

export function getPedidoRepository(): PedidoRepository {
  return new SupabasePedidoRepository();
}
