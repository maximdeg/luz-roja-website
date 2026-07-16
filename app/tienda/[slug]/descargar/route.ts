/**
 * Free-download endpoint: GET /tienda/[slug]/descargar. Resolves the product,
 * checks it's a published free product with a file (pure `resolveFreeDownload`),
 * then redirects to a short-lived signed URL from the private bucket. Paid
 * products are refused here (403) — they deliver through the payment flow.
 */

import { NextResponse } from "next/server";
import { getCatalogRepository } from "../../repositories";
import { resolveFreeDownload, downloadFileName } from "../../free-download";
import { createArchivoSignedUrl } from "../../signed-url";
import { tiendaAbierta } from "../../tienda-abierta";

export const dynamic = "force-dynamic";

const MENSAJES: Record<string, string> = {
  "not-found": "No encontramos ese producto.",
  "not-published": "Ese producto todavía no está disponible.",
  "not-free": "Ese producto es de pago; no se puede descargar gratis.",
  "no-file": "Ese producto no tiene un archivo para descargar."
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Closed store: previously shared links go quiet instead of serving files.
  if (!tiendaAbierta()) {
    return NextResponse.redirect(new URL("/tienda", request.url), { status: 302 });
  }

  const { slug } = await params;
  const producto = await getCatalogRepository().getBySlug(slug);
  const resolution = resolveFreeDownload(producto);

  if (!resolution.ok) {
    const status = resolution.reason === "not-free" ? 403 : 404;
    return new NextResponse(MENSAJES[resolution.reason], {
      status,
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }

  const signedUrl = await createArchivoSignedUrl(resolution.archivo, {
    downloadAs: downloadFileName(producto!)
  });
  return NextResponse.redirect(signedUrl, { status: 302 });
}
