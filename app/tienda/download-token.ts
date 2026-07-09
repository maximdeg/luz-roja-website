/**
 * Signed, expiring download tokens — the security core of paid delivery.
 *
 * A paid file is only ever served behind one of these. The token is an
 * HMAC-SHA256 signature over a small payload (order id, expiry, max downloads),
 * so it can't be forged without the secret and can't be replayed after it
 * expires or past its download limit. The clock is injectable so expiry is
 * testable without waiting.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 3; // 3 days
const DEFAULT_MAX_DOWNLOADS = 5;

interface TokenPayload {
  /** Pedido (order) id this token unlocks. */
  pedidoId: string;
  /** Expiry as epoch milliseconds. */
  exp: number;
  /** Max allowed downloads, or null for unlimited (until expiry). */
  max: number | null;
}

export interface CreateTokenOptions {
  secret: string;
  now?: () => number;
  ttlSeconds?: number;
  maxDownloads?: number | null;
}

export function createDownloadToken(pedidoId: string, opts: CreateTokenOptions): string {
  const now = opts.now ?? Date.now;
  const ttlSeconds = opts.ttlSeconds ?? DEFAULT_TTL_SECONDS;
  const max = opts.maxDownloads === undefined ? DEFAULT_MAX_DOWNLOADS : opts.maxDownloads;

  const payload: TokenPayload = {
    pedidoId,
    exp: now() + ttlSeconds * 1000,
    max
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${payloadB64}.${sign(payloadB64, opts.secret)}`;
}

export type VerifyResult =
  | { valid: true; pedidoId: string; exp: number; maxDownloads: number | null }
  | { valid: false; reason: "malformed" | "bad-signature" | "expired" | "download-limit" };

export interface VerifyTokenOptions {
  secret: string;
  now?: () => number;
  /** How many times this order has already been downloaded. */
  downloadCount?: number;
}

export function verifyDownloadToken(token: string, opts: VerifyTokenOptions): VerifyResult {
  const now = opts.now ?? Date.now;

  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { valid: false, reason: "malformed" };
  }
  const [payloadB64, signature] = parts;

  if (!safeEqual(signature, sign(payloadB64, opts.secret))) {
    return { valid: false, reason: "bad-signature" };
  }

  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  } catch {
    return { valid: false, reason: "malformed" };
  }
  if (
    typeof payload?.pedidoId !== "string" ||
    typeof payload?.exp !== "number" ||
    (payload.max !== null && typeof payload.max !== "number")
  ) {
    return { valid: false, reason: "malformed" };
  }

  if (now() > payload.exp) {
    return { valid: false, reason: "expired" };
  }
  if (payload.max !== null && (opts.downloadCount ?? 0) >= payload.max) {
    return { valid: false, reason: "download-limit" };
  }

  return { valid: true, pedidoId: payload.pedidoId, exp: payload.exp, maxDownloads: payload.max };
}

function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
