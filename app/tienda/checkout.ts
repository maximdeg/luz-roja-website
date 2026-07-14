"use server";

/**
 * Starts a purchase: opens a pending pedido (capturing the price server-side,
 * never from the client), creates a Mercado Pago preference for it, records the
 * preference id, and returns MP's hosted-checkout URL for the browser to
 * navigate to. Free or unpublished products can't reach here.
 *
 * It returns the checkout URL instead of `redirect()`-ing to it on purpose:
 * `redirect()` inside a Server Action is for INTERNAL navigations — pointing it
 * at an external URL (MP's checkout) doesn't reliably move the browser, so the
 * buyer would just bounce back to the product page. The client navigates with
 * `window.location.href` instead.
 */

import { headers } from "next/headers";
import { getCatalogRepository, getPedidoRepository } from "./repositories";
import { buildMpPreference } from "./mp-preference";
import { createPreference } from "./mp-client";
import { isGratis } from "./free-download";

export interface IniciarCompraResult {
  /** MP hosted-checkout URL the client should navigate to. */
  initPoint?: string;
  /** User-facing error message when the purchase couldn't start. */
  error?: string;
}

export async function iniciarCompra(input: {
  slug: string;
  email: string;
}): Promise<IniciarCompraResult> {
  const slug = String(input.slug ?? "");
  const emailComprador = String(input.email ?? "").trim();

  const producto = await getCatalogRepository().getBySlug(slug);
  const comprable =
    producto && producto.publicado && !isGratis(producto) && producto.archivo !== null;
  if (!producto || !comprable) {
    return { error: "Este producto no está disponible para la compra." };
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

  let created;
  try {
    created = await createPreference(preference);
  } catch {
    return { error: "No pudimos iniciar el pago con Mercado Pago. Probá de nuevo." };
  }
  await pedidos.save({ ...pedido, mpPreferenceId: created.id });

  return { initPoint: created.initPoint };
}

/** Derives the site's base URL from the incoming request headers. */
async function siteBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
