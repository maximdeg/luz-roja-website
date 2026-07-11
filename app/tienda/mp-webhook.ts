/**
 * Pure verification of a Mercado Pago webhook's `x-signature`. MP signs a
 * manifest built from the resource id, the request id, and a timestamp with
 * HMAC-SHA256 and the webhook secret. We rebuild the manifest and compare in
 * constant time. Kept pure (inputs in, boolean out) so it's unit-testable
 * without a live request.
 *
 * Reference: the `x-signature` header looks like `ts=<unix>,v1=<hex-hmac>`, and
 * the manifest is `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export interface WebhookSignatureInput {
  /** Raw `x-signature` header value, e.g. "ts=1700000000,v1=abcdef...". */
  xSignature: string | null;
  /** Raw `x-request-id` header value. */
  xRequestId: string | null;
  /** The `data.id` query param (the payment/resource id). */
  dataId: string | null;
  /** MERCADOPAGO_WEBHOOK_SECRET. */
  secret: string | undefined;
}

export function verifyWebhookSignature(input: WebhookSignatureInput): boolean {
  const parsed = parseSignatureHeader(input.xSignature);
  if (!parsed || !input.secret || !input.xRequestId) return false;

  // MP lowercases an alphanumeric data.id when building the manifest.
  const dataId = (input.dataId ?? "").toLowerCase();
  const manifest = `id:${dataId};request-id:${input.xRequestId};ts:${parsed.ts};`;

  const expected = createHmac("sha256", input.secret).update(manifest).digest("hex");
  return safeEqualHex(expected, parsed.v1);
}

interface ParsedSignature {
  ts: string;
  v1: string;
}

function parseSignatureHeader(header: string | null): ParsedSignature | null {
  if (!header) return null;
  let ts = "";
  let v1 = "";
  for (const part of header.split(",")) {
    const [rawKey, ...rest] = part.split("=");
    const key = rawKey?.trim();
    const value = rest.join("=").trim();
    if (key === "ts") ts = value;
    else if (key === "v1") v1 = value;
  }
  if (!ts || !v1) return null;
  return { ts, v1 };
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}
