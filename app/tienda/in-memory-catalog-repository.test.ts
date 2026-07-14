import { describe, it, expect } from "vitest";
import { InMemoryCatalogRepository } from "./in-memory-catalog-repository";
import type { Producto } from "./producto";

function producto(overrides: Partial<Producto> = {}): Producto {
  return {
    id: "prod-seed",
    slug: "guia-de-marca",
    titulo: "Guía de marca",
    descripcion: "Un PDF para ordenar tu identidad visual.",
    imagenPortada: null,
    archivo: "productos/guia.pdf",
    precioCentavos: 150000,
    esGratis: false,
    publicado: true,
    ...overrides
  };
}

describe("InMemoryCatalogRepository — reads", () => {
  it("listPublished returns only published products", async () => {
    const repo = new InMemoryCatalogRepository([
      producto({ id: "a", slug: "a", publicado: true }),
      producto({ id: "b", slug: "b", publicado: false })
    ]);
    const published = await repo.listPublished();
    expect(published.map((p) => p.id)).toEqual(["a"]);
  });

  it("listAll returns drafts as well as published products", async () => {
    const repo = new InMemoryCatalogRepository([
      producto({ id: "a", slug: "a", publicado: true }),
      producto({ id: "b", slug: "b", publicado: false })
    ]);
    expect((await repo.listAll()).map((p) => p.id).sort()).toEqual(["a", "b"]);
  });

  it("getById and getBySlug find a product, or return null when absent", async () => {
    const repo = new InMemoryCatalogRepository([producto({ id: "a", slug: "guia" })]);
    expect((await repo.getById("a"))?.id).toBe("a");
    expect((await repo.getBySlug("guia"))?.id).toBe("a");
    expect(await repo.getById("missing")).toBeNull();
    expect(await repo.getBySlug("missing")).toBeNull();
  });
});

describe("InMemoryCatalogRepository — writes", () => {
  it("create assigns an id and makes the product retrievable", async () => {
    const repo = new InMemoryCatalogRepository();
    const { id: _omit, ...input } = producto();
    const created = await repo.create(input);
    expect(created.id).toBeTruthy();
    expect((await repo.getById(created.id))?.titulo).toBe("Guía de marca");
  });

  it("update applies a partial change and returns the updated product", async () => {
    const repo = new InMemoryCatalogRepository([producto({ id: "a" })]);
    const updated = await repo.update("a", { publicado: false, precioCentavos: 200000 });
    expect(updated).toMatchObject({ id: "a", publicado: false, precioCentavos: 200000 });
  });

  it("update returns null for a product that doesn't exist", async () => {
    const repo = new InMemoryCatalogRepository();
    expect(await repo.update("nope", { publicado: true })).toBeNull();
  });

  it("delete removes an existing product and reports whether it existed", async () => {
    const repo = new InMemoryCatalogRepository([producto({ id: "a" })]);
    expect(await repo.delete("a")).toBe(true);
    expect(await repo.getById("a")).toBeNull();
    expect(await repo.delete("a")).toBe(false);
  });
});
