"use server";

/**
 * Starts a purchase: opens a pending pedido (capturing the price server-side,
 * never from the client), creates a Mercado Pago preference for it, records the
 * preference id, and sends the buyer to MP's hosted checkout. Free or
 * unpublished products can't reach here.
 */

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCatalogRepository, getPedidoRepository } from "./repositories";
import { buildMpPreference } from "./mp-preference";
import { createPreference } from "./mp-client";
import { isGratis } from "./free-download";

export async function iniciarCompra(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "");
  const emailComprador = String(formData.get("email") ?? "").trim();

  const producto = await getCatalogRepository().getBySlug(slug);
  const comprable =
    producto && producto.publicado && !isGratis(producto) && producto.archivo !== null;
  if (!producto || !comprable) {
    redirect(`/tienda/${slug}`);
  }

  const pedidos = getPedidoRepository();
  const pedido = await pedidos.create({
    productoId: producto.id,
    emailComprador,
    montoCentavos: producto.precioCentavos as number
  });

  const baseUrl = await siteBaseUrl();
  const preference = buildMpPreference(producto, pedido, {
    baseUrl,
    notificationUrl: `${baseUrl}/api/mercadopago/webhook`
  });

  const created = await createPreference(preference);
  await pedidos.save({ ...pedido, mpPreferenceId: created.id });

  redirect(created.initPoint);
}

/** Derives the site's base URL from the incoming request headers. */
async function siteBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
