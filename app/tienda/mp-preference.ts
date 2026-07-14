/**
 * Pure builder for the Mercado Pago Checkout Pro preference request body. Given
 * a producto, its pending pedido, and runtime config (site URL + webhook URL),
 * it produces the object the Mercado Pago client will POST — no network here, so
 * the exact shape is unit-testable.
 *
 * The amount comes from the pedido (captured server-side at checkout), never
 * from the client, and `external_reference` mirrors the pedido so the webhook
 * can map a payment straight back to the order.
 */

import type { Producto } from "./producto";
import type { Pedido } from "./pedido";
import { centavosToPesos } from "./precio";

export interface MpPreferenceConfig {
  /** Public base URL of the site, e.g. https://luzroja.vercel.app (trailing slash tolerated). */
  baseUrl: string;
  /** Absolute URL Mercado Pago should POST payment notifications to. */
  notificationUrl: string;
  /** ISO currency; defaults to ARS. */
  currencyId?: string;
}

export interface MpPreferenceRequest {
  items: Array<{
    id: string;
    title: string;
    description: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
  }>;
  external_reference: string;
  back_urls: { success: string; pending: string; failure: string };
  /**
   * Auto-redirect back to the site after an approved payment. Mercado Pago
   * rejects this when back_urls point at localhost, so it is only emitted for a
   * public HTTPS base URL (i.e. the deployed site), not in local development.
   */
  auto_return?: "approved";
  notification_url: string;
  metadata: { pedido_id: string; producto_id: string };
}

export function buildMpPreference(
  producto: Producto,
  pedido: Pedido,
  config: MpPreferenceConfig
): MpPreferenceRequest {
  const base = config.baseUrl.replace(/\/+$/, "");
  const gracias = `${base}/tienda/gracias`;

  const request: MpPreferenceRequest = {
    items: [
      {
        id: producto.id,
        title: producto.titulo,
        description: producto.descripcion,
        quantity: 1,
        unit_price: centavosToPesos(pedido.montoCentavos),
        currency_id: config.currencyId ?? "ARS"
      }
    ],
    external_reference: pedido.externalReference,
    back_urls: {
      success: `${gracias}?estado=success`,
      pending: `${gracias}?estado=pending`,
      failure: `${gracias}?estado=failure`
    },
    notification_url: config.notificationUrl,
    metadata: { pedido_id: pedido.id, producto_id: producto.id }
  };

  if (isPublicHttps(base)) {
    request.auto_return = "approved";
  }

  return request;
}

/** True for an https:// URL whose host isn't localhost — where MP accepts auto_return. */
function isPublicHttps(baseUrl: string): boolean {
  try {
    const { protocol, hostname } = new URL(baseUrl);
    if (protocol !== "https:") return false;
    return hostname !== "localhost" && hostname !== "127.0.0.1" && hostname !== "[::1]";
  } catch {
    return false;
  }
}
