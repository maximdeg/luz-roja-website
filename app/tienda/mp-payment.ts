/**
 * The Mercado Pago payment: the normalized shape we care about, a pure mapper
 * from the raw API JSON, and the pure decision of whether a payment should
 * release the download. Both the webhook and the back-url (gracias) flow feed a
 * payment through `interpretPayment`, so the "should we deliver?" rule lives in
 * exactly one tested place.
 *
 * A back_url redirect is never trusted on its own — the caller always re-fetches
 * the payment from MP and runs it through here.
 */

import type { Pedido } from "./pedido";
import { centavosToPesos } from "./precio";

export interface MpPayment {
  id: string;
  /** approved | pending | in_process | rejected | cancelled | refunded | ... */
  status: string;
  statusDetail: string;
  /** Our pedido id, echoed back from the preference. */
  externalReference: string | null;
  /** Amount actually charged, in pesos. */
  transactionAmount: number;
  payerEmail: string | null;
}

/** Maps the raw /v1/payments/{id} JSON to our shape. Pure, so it's unit-testable. */
export function mapMpPayment(raw: {
  id: string | number;
  status: string;
  status_detail?: string;
  external_reference?: string | null;
  transaction_amount?: number;
  payer?: { email?: string | null } | null;
}): MpPayment {
  return {
    id: String(raw.id),
    status: raw.status,
    statusDetail: raw.status_detail ?? "",
    externalReference: raw.external_reference ?? null,
    transactionAmount: raw.transaction_amount ?? 0,
    payerEmail: raw.payer?.email ?? null
  };
}

export type PaymentOutcome =
  | { deliver: true }
  | { deliver: false; reason: "reference-mismatch" | "not-approved" | "amount-mismatch" };

/**
 * Decides whether a payment releases the pedido's download: it must reference
 * this pedido, be approved, and match the amount captured at checkout (guarding
 * against a tampered or stale payment).
 */
export function interpretPayment(payment: MpPayment, pedido: Pedido): PaymentOutcome {
  if (payment.externalReference !== pedido.externalReference) {
    return { deliver: false, reason: "reference-mismatch" };
  }
  if (payment.status !== "approved") {
    return { deliver: false, reason: "not-approved" };
  }
  const expectedPesos = centavosToPesos(pedido.montoCentavos);
  if (Math.abs(payment.transactionAmount - expectedPesos) > 0.001) {
    return { deliver: false, reason: "amount-mismatch" };
  }
  return { deliver: true };
}
