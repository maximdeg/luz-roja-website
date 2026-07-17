import { describe, it, expect } from "vitest";
import { InMemoryTestimonioRepository } from "./in-memory-testimonio-repository";

const base = { cita: "Excelente trabajo.", autor: "Fundadora", rol: "Marca local" };

describe("InMemoryTestimonioRepository", () => {
  it("lists created testimonials in display order", async () => {
    const repo = new InMemoryTestimonioRepository();
    await repo.create({ ...base, autor: "Segundo", orden: 2 });
    await repo.create({ ...base, autor: "Primero", orden: 1 });

    const listado = await repo.listAll();
    expect(listado.map((t) => t.autor)).toEqual(["Primero", "Segundo"]);
  });

  it("finds a testimonial by id and returns null for unknown ids", async () => {
    const repo = new InMemoryTestimonioRepository();
    const creado = await repo.create({ ...base, orden: 1 });

    expect(await repo.getById(creado.id)).toEqual(creado);
    expect(await repo.getById("no-existe")).toBeNull();
  });

  it("updates only the provided fields", async () => {
    const repo = new InMemoryTestimonioRepository();
    const creado = await repo.create({ ...base, orden: 1 });

    const actualizado = await repo.update(creado.id, { rol: "ONG cultural" });
    expect(actualizado).toMatchObject({ ...base, rol: "ONG cultural", orden: 1 });
    expect(await repo.update("no-existe", { rol: "x" })).toBeNull();
  });

  it("deletes and reports whether something was deleted", async () => {
    const repo = new InMemoryTestimonioRepository();
    const creado = await repo.create({ ...base, orden: 1 });

    expect(await repo.delete(creado.id)).toBe(true);
    expect(await repo.delete(creado.id)).toBe(false);
    expect(await repo.listAll()).toEqual([]);
  });
});
