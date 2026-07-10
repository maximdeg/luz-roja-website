import { describe, it, expect } from "vitest";
import { resolveFreeDownload, isGratis, downloadFileName } from "./free-download";
import type { Producto } from "./producto";

function producto(overrides: Partial<Producto> = {}): Producto {
  return {
    id: "prod-1",
    slug: "guia-de-marca",
    titulo: "Guía de marca",
    descripcion: "Un PDF.",
    imagenPortada: null,
    archivo: "productos/guia-1783.pdf",
    precioCentavos: null,
    esGratis: true,
    publicado: true,
    ...overrides
  };
}

describe("resolveFreeDownload", () => {
  it("allows a published free product that has a file", () => {
    expect(resolveFreeDownload(producto())).toEqual({
      ok: true,
      archivo: "productos/guia-1783.pdf"
    });
  });

  it("rejects a missing product", () => {
    expect(resolveFreeDownload(null)).toEqual({ ok: false, reason: "not-found" });
  });

  it("rejects an unpublished product (even with a known slug)", () => {
    expect(resolveFreeDownload(producto({ publicado: false }))).toEqual({
      ok: false,
      reason: "not-published"
    });
  });

  it("rejects a paid product — it must not be served for free", () => {
    expect(
      resolveFreeDownload(producto({ esGratis: false, precioCentavos: 150000 }))
    ).toEqual({ ok: false, reason: "not-free" });
  });

  it("rejects a free product with no uploaded file", () => {
    expect(resolveFreeDownload(producto({ archivo: null }))).toEqual({
      ok: false,
      reason: "no-file"
    });
  });
});

describe("isGratis", () => {
  it("is true when flagged gratis or priced null", () => {
    expect(isGratis(producto({ esGratis: true, precioCentavos: null }))).toBe(true);
    expect(isGratis(producto({ esGratis: false, precioCentavos: null }))).toBe(true);
  });

  it("is false for a priced product", () => {
    expect(isGratis(producto({ esGratis: false, precioCentavos: 150000 }))).toBe(false);
  });
});

describe("downloadFileName", () => {
  it("names the file after the slug, keeping the extension", () => {
    expect(downloadFileName(producto())).toBe("guia-de-marca.pdf");
  });

  it("copes with a file that has no extension", () => {
    expect(downloadFileName(producto({ archivo: "productos/guia" }))).toBe("guia-de-marca");
  });
});
