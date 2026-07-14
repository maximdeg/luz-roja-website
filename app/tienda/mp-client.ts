/**
 * Server-only Mercado Pago API adapter: create a checkout preference and
 * re-fetch a payment. Uses the secret access token, so it must never reach the
 * browser. The raw JSON is normalized through the pure mappers so this file
 * only does I/O.
 */

import "server-only";
import type { MpPreferenceRequest } from "./mp-preference";
import { mapMpPayment, type MpPayment } from "./mp-payment";

const API_BASE = "https://api.mercadopago.com";

function accessToken(): string {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN en el entorno.");
  return token;
}

/** True while running on Mercado Pago TEST credentials. */
export function isTestMode(): boolean {
  return (process.env.MERCADOPAGO_ACCESS_TOKEN ?? "").startsWith("TEST-");
}

export interface CreatedPreference {
  id: string;
  /** The checkout URL to send the buyer to. */
  initPoint: string;
}

export async function createPreference(
  request: MpPreferenceRequest
): Promise<CreatedPreference> {
  const res = await fetch(`${API_BASE}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Mercado Pago rechazó la preferencia: ${json?.message ?? res.status}`);
  }

  // On TEST credentials the sandbox checkout lives at sandbox_init_point.
  const initPoint = isTestMode()
    ? json.sandbox_init_point ?? json.init_point
    : json.init_point;
  return { id: String(json.id), initPoint };
}

export async function getPayment(paymentId: string): Promise<MpPayment> {
  const res = await fetch(`${API_BASE}/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${accessToken()}` }
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Mercado Pago no devolvió el pago ${paymentId}: ${json?.message ?? res.status}`);
  }
  return mapMpPayment(json);
}
