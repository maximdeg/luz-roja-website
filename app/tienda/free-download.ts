/**
 * Pure eligibility check for the FREE download path. Given a product (or null,
 * when the slug matched nothing), it decides whether the deliverable may be
 * served without payment, and why not otherwise. The side-effecting bits
 * (looking up the product, minting a signed URL) live in the route handler; the
 * decision is kept pure so every branch is unit-testable.
 *
 * Paid products are never served here — their delivery goes through the
 * payment + signed-token flow instead.
 */

import type { Producto } from "./producto";

export type FreeDownloadReason = "not-found" | "not-published" | "not-free" | "no-file";

export type FreeDownloadResolution =
  | { ok: true; archivo: string }
  | { ok: false; reason: FreeDownloadReason };

export function resolveFreeDownload(producto: Producto | null): FreeDownloadResolution {
  if (!producto) return { ok: false, reason: "not-found" };
  if (!producto.publicado) return { ok: false, reason: "not-published" };
  if (!isGratis(producto)) return { ok: false, reason: "not-free" };
  if (!producto.archivo) return { ok: false, reason: "no-file" };
  return { ok: true, archivo: producto.archivo };
}

/** A product counts as free when flagged gratis or carrying no price. */
export function isGratis(producto: Producto): boolean {
  return producto.esGratis || producto.precioCentavos === null;
}

/** Friendly filename for the download, e.g. "guia-de-marca.pdf". */
export function downloadFileName(producto: Producto): string {
  const match = /\.[a-z0-9]+$/i.exec(producto.archivo ?? "");
  return `${producto.slug}${match ? match[0].toLowerCase() : ""}`;
}
