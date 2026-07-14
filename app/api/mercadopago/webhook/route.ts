/**
 * Mercado Pago webhook. Verifies the x-signature (when a secret is configured),
 * then re-fetches and confirms the payment through the same `confirmarPago`
 * path the gracias page uses. Idempotent, so MP's retries are harmless. Returns
 * 200 on success and 500 on a transient failure so MP retries.
 */

import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "../../../tienda/mp-webhook";
import { confirmarPago } from "../../../tienda/confirmar-pago";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const body = await request.json().catch(() => ({}) as Record<string, unknown>);

  const type = url.searchParams.get("type") ?? (body as { type?: string }).type;
  const dataIdQuery = url.searchParams.get("data.id");
  const paymentId =
    dataIdQuery ?? (body as { data?: { id?: string } }).data?.id ?? null;

  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  const valid = verifyWebhookSignature({
    xSignature: request.headers.get("x-signature"),
    xRequestId: request.headers.get("x-request-id"),
    dataId: dataIdQuery ?? (paymentId ? String(paymentId) : null),
    secret
  });
  // Only enforce the signature when a secret is configured.
  if (secret && !valid) {
    return new NextResponse("invalid signature", { status: 401 });
  }

  if (type !== "payment" || !paymentId) {
    return NextResponse.json({ ignored: true });
  }

  try {
    const result = await confirmarPago(String(paymentId));
    return NextResponse.json({ ok: true, estado: result.estado });
  } catch {
    // Transient failure — let Mercado Pago retry.
    return new NextResponse("error", { status: 500 });
  }
}
