import { describe, it, expect } from "vitest";
import { createDownloadToken, verifyDownloadToken } from "./download-token";

const SECRET = "test-signing-secret";
const T0 = 1_700_000_000_000; // fixed epoch ms
const fixedClock = (t: number) => () => t;

describe("download token round-trip", () => {
  it("verifies a freshly created token and returns its pedido id", () => {
    const token = createDownloadToken("pedido-123", { secret: SECRET, now: fixedClock(T0) });
    const result = verifyDownloadToken(token, { secret: SECRET, now: fixedClock(T0) });
    expect(result).toMatchObject({ valid: true, pedidoId: "pedido-123" });
  });
});

describe("download token expiry", () => {
  it("rejects a token once its ttl has passed", () => {
    const token = createDownloadToken("p1", {
      secret: SECRET,
      now: fixedClock(T0),
      ttlSeconds: 60
    });
    const result = verifyDownloadToken(token, { secret: SECRET, now: fixedClock(T0 + 61_000) });
    expect(result).toEqual({ valid: false, reason: "expired" });
  });

  it("still accepts a token just before expiry", () => {
    const token = createDownloadToken("p1", {
      secret: SECRET,
      now: fixedClock(T0),
      ttlSeconds: 60
    });
    const result = verifyDownloadToken(token, { secret: SECRET, now: fixedClock(T0 + 59_000) });
    expect(result.valid).toBe(true);
  });
});

describe("download token authenticity", () => {
  it("rejects a token signed with a different secret", () => {
    const token = createDownloadToken("p1", { secret: SECRET, now: fixedClock(T0) });
    const result = verifyDownloadToken(token, { secret: "other-secret", now: fixedClock(T0) });
    expect(result).toEqual({ valid: false, reason: "bad-signature" });
  });

  it("rejects a token whose payload was tampered with", () => {
    const token = createDownloadToken("p1", { secret: SECRET, now: fixedClock(T0) });
    const [payload, sig] = token.split(".");
    const forged = `${payload}x.${sig}`;
    const result = verifyDownloadToken(forged, { secret: SECRET, now: fixedClock(T0) });
    expect(result.valid).toBe(false);
  });

  it("rejects a structurally malformed token", () => {
    const result = verifyDownloadToken("not-a-token", { secret: SECRET, now: fixedClock(T0) });
    expect(result).toEqual({ valid: false, reason: "malformed" });
  });
});

describe("download token download limit", () => {
  it("rejects once the download count reaches the max", () => {
    const token = createDownloadToken("p1", {
      secret: SECRET,
      now: fixedClock(T0),
      maxDownloads: 3
    });
    expect(verifyDownloadToken(token, { secret: SECRET, now: fixedClock(T0), downloadCount: 3 }))
      .toEqual({ valid: false, reason: "download-limit" });
    expect(verifyDownloadToken(token, { secret: SECRET, now: fixedClock(T0), downloadCount: 2 }).valid)
      .toBe(true);
  });

  it("treats a null max as unlimited downloads", () => {
    const token = createDownloadToken("p1", {
      secret: SECRET,
      now: fixedClock(T0),
      maxDownloads: null
    });
    const result = verifyDownloadToken(token, {
      secret: SECRET,
      now: fixedClock(T0),
      downloadCount: 999
    });
    expect(result.valid).toBe(true);
  });
});
