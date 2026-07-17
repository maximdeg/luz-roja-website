import { describe, it, expect } from "vitest";
import {
  validateTestimonioForm,
  parseOrdenInput,
  CITA_MAX,
  AUTOR_MAX
} from "./testimonio";

const VALIDO = {
  cita: "Nos ayudaron muchísimo con la marca.",
  autor: "Fundadora",
  rol: "Tienda de diseño",
  orden: "1"
};

describe("validateTestimonioForm", () => {
  it("accepts a complete testimonial", () => {
    expect(validateTestimonioForm(VALIDO)).toEqual({});
  });

  it("requires quote, author and role", () => {
    const errors = validateTestimonioForm({ orden: "0" });
    expect(Object.keys(errors).sort()).toEqual(["autor", "cita", "rol"]);
  });

  it("treats whitespace-only fields as missing", () => {
    const errors = validateTestimonioForm({ ...VALIDO, cita: "   " });
    expect(errors.cita).toBeTruthy();
  });

  it("caps field lengths", () => {
    expect(
      validateTestimonioForm({ ...VALIDO, cita: "x".repeat(CITA_MAX + 1) }).cita
    ).toMatch(/superar/);
    expect(
      validateTestimonioForm({ ...VALIDO, autor: "x".repeat(AUTOR_MAX + 1) }).autor
    ).toMatch(/superar/);
  });

  it("rejects a missing or malformed order", () => {
    expect(validateTestimonioForm({ ...VALIDO, orden: undefined }).orden).toBeTruthy();
    expect(validateTestimonioForm({ ...VALIDO, orden: "" }).orden).toBeTruthy();
    expect(validateTestimonioForm({ ...VALIDO, orden: "-1" }).orden).toBeTruthy();
    expect(validateTestimonioForm({ ...VALIDO, orden: "1,5" }).orden).toBeTruthy();
    expect(validateTestimonioForm({ ...VALIDO, orden: "abc" }).orden).toBeTruthy();
  });
});

describe("parseOrdenInput", () => {
  it("parses non-negative integers, tolerating whitespace", () => {
    expect(parseOrdenInput("0")).toBe(0);
    expect(parseOrdenInput(" 12 ")).toBe(12);
  });

  it("returns null for anything else", () => {
    expect(parseOrdenInput(undefined)).toBeNull();
    expect(parseOrdenInput("")).toBeNull();
    expect(parseOrdenInput("-3")).toBeNull();
    expect(parseOrdenInput("2.5")).toBeNull();
    expect(parseOrdenInput("tres")).toBeNull();
  });
});
