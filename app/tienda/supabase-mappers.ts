/**
 * Pure mapping between the snake_case Supabase rows and the camelCase domain
 * types. Kept free of any Supabase client so the translation — the part most
 * likely to drift from the schema — is unit-testable in Node.
 *
 * `*Row` types mirror the columns in `supabase/migrations/0001_tienda_schema.sql`.
 */

import type { Producto } from "./producto";
import type { NuevoProducto } from "./catalog-repository";
import type { Pedido } from "./pedido";
import type { PedidoEstado } from "./pedido-estado";

// --- productos -------------------------------------------------------------

export interface ProductoRow {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  imagen_portada: string | null;
  archivo: string | null;
  precio_centavos: number | null;
  es_gratis: boolean;
  publicado: boolean;
}

export function productoFromRow(row: ProductoRow): Producto {
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    descripcion: row.descripcion,
    imagenPortada: row.imagen_portada,
    archivo: row.archivo,
    precioCentavos: row.precio_centavos,
    esGratis: row.es_gratis,
    publicado: row.publicado
  };
}

/** Row for inserting a new product (no id — the DB assigns a uuid). */
export type NuevoProductoRow = Omit<ProductoRow, "id">;

export function nuevoProductoToRow(input: NuevoProducto): NuevoProductoRow {
  return {
    slug: input.slug,
    titulo: input.titulo,
    descripcion: input.descripcion,
    imagen_portada: input.imagenPortada,
    archivo: input.archivo,
    precio_centavos: input.precioCentavos,
    es_gratis: input.esGratis,
    publicado: input.publicado
  };
}

/**
 * Translates a partial change set to snake_case, emitting only the keys that
 * were actually provided so an `update` touches nothing else.
 */
export function productoChangesToRow(
  cambios: Partial<NuevoProducto>
): Partial<NuevoProductoRow> {
  const row: Partial<NuevoProductoRow> = {};
  if ("slug" in cambios) row.slug = cambios.slug;
  if ("titulo" in cambios) row.titulo = cambios.titulo;
  if ("descripcion" in cambios) row.descripcion = cambios.descripcion;
  if ("imagenPortada" in cambios) row.imagen_portada = cambios.imagenPortada ?? null;
  if ("archivo" in cambios) row.archivo = cambios.archivo ?? null;
  if ("precioCentavos" in cambios) row.precio_centavos = cambios.precioCentavos ?? null;
  if ("esGratis" in cambios) row.es_gratis = cambios.esGratis;
  if ("publicado" in cambios) row.publicado = cambios.publicado;
  return row;
}

// --- pedidos ---------------------------------------------------------------

export interface PedidoRow {
  id: string;
  producto_id: string;
  email_comprador: string;
  monto_centavos: number;
  estado: PedidoEstado;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  external_reference: string;
  download_count: number;
  created_at: string;
  paid_at: string | null;
}

export function pedidoFromRow(row: PedidoRow): Pedido {
  return {
    id: row.id,
    productoId: row.producto_id,
    emailComprador: row.email_comprador,
    montoCentavos: row.monto_centavos,
    estado: row.estado,
    mpPreferenceId: row.mp_preference_id,
    mpPaymentId: row.mp_payment_id,
    externalReference: row.external_reference,
    downloadCount: row.download_count,
    createdAt: toIso(row.created_at),
    paidAt: row.paid_at === null ? null : toIso(row.paid_at)
  };
}

/**
 * The mutable columns `save` persists. `external_reference` is a generated
 * column and `created_at` / immutable identity fields are left untouched, so
 * they are deliberately absent here.
 */
export function pedidoToUpdateRow(pedido: Pedido) {
  return {
    estado: pedido.estado,
    mp_preference_id: pedido.mpPreferenceId,
    mp_payment_id: pedido.mpPaymentId,
    download_count: pedido.downloadCount,
    paid_at: pedido.paidAt
  };
}

/** Normalises a Postgres timestamptz string to a canonical ISO-8601 (Z) form. */
function toIso(value: string): string {
  return new Date(value).toISOString();
}
