import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { verifyWebhookSignature } from "./mp-webhook";

const secret = "test-webhook-secret";
const dataId = "123456";
const requestId = "req-abc";
const ts = "1731000000";

function sign(id: string, rid: string, timestamp: string, key: string): string {
  const manifest = `id:${id.toLowerCase()};request-id:${rid};ts:${timestamp};`;
  return createHmac("sha256", key).update(manifest).digest("hex");
}

describe("verifyWebhookSignature", () => {
  it("accepts a correctly signed request", () => {
    const v1 = sign(dataId, requestId, ts, secret);
    expect(
      verifyWebhookSignature({
        xSignature: `ts=${ts},v1=${v1}`,
        xRequestId: requestId,
        dataId,
        secret
      })
    ).toBe(true);
  });

  it("rejects a wrong secret", () => {
    const v1 = sign(dataId, requestId, ts, "other-secret");
    expect(
      verifyWebhookSignature({ xSignature: `ts=${ts},v1=${v1}`, xRequestId: requestId, dataId, secret })
    ).toBe(false);
  });

  it("rejects a tampered data id", () => {
    const v1 = sign(dataId, requestId, ts, secret);
    expect(
      verifyWebhookSignature({
        xSignature: `ts=${ts},v1=${v1}`,
        xRequestId: requestId,
        dataId: "999999",
        secret
      })
    ).toBe(false);
  });

  it("rejects when the secret is missing", () => {
    const v1 = sign(dataId, requestId, ts, secret);
    expect(
      verifyWebhookSignature({ xSignature: `ts=${ts},v1=${v1}`, xRequestId: requestId, dataId, secret: undefined })
    ).toBe(false);
  });

  it("rejects a malformed or missing signature header", () => {
    expect(verifyWebhookSignature({ xSignature: null, xRequestId: requestId, dataId, secret })).toBe(false);
    expect(verifyWebhookSignature({ xSignature: "garbage", xRequestId: requestId, dataId, secret })).toBe(false);
  });

  it("lowercases an alphanumeric data id before hashing (matches MP)", () => {
    const v1 = sign("ABCdef", requestId, ts, secret);
    expect(
      verifyWebhookSignature({
        xSignature: `ts=${ts},v1=${v1}`,
        xRequestId: requestId,
        dataId: "ABCdef",
        secret
      })
    ).toBe(true);
  });
});
