import { describe, it, expect } from "vitest";
import {
  testimonioFromRow,
  nuevoTestimonioToRow,
  testimonioChangesToRow
} from "./supabase-testimonio-mappers";

describe("testimonioFromRow", () => {
  it("maps a row to the domain shape", () => {
    expect(
      testimonioFromRow({
        id: "id-1",
        cita: "Gran experiencia.",
        autor: "Fundadora",
        rol: "Marca local",
        orden: 3
      })
    ).toEqual({
      id: "id-1",
      cita: "Gran experiencia.",
      autor: "Fundadora",
      rol: "Marca local",
      orden: 3
    });
  });
});

describe("nuevoTestimonioToRow", () => {
  it("maps a new testimonial without an id", () => {
    expect(
      nuevoTestimonioToRow({ cita: "Texto", autor: "Autor", rol: "Rol", orden: 0 })
    ).toEqual({ cita: "Texto", autor: "Autor", rol: "Rol", orden: 0 });
  });
});

describe("testimonioChangesToRow", () => {
  it("emits only the provided keys", () => {
    expect(testimonioChangesToRow({ rol: "ONG" })).toEqual({ rol: "ONG" });
    expect(testimonioChangesToRow({})).toEqual({});
  });

  it("keeps orden 0 (falsy but valid)", () => {
    expect(testimonioChangesToRow({ orden: 0 })).toEqual({ orden: 0 });
  });
});
