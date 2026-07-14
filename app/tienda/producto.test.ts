import { describe, it, expect } from "vitest";
import { validateProductoForm, type ProductoFormValues } from "./producto";

/** A paid product filled out the way an admin would to publish it. */
function validPaid(): ProductoFormValues {
  return {
    titulo: "Guía de marca",
    descripcion: "Un PDF para ordenar tu identidad visual.",
    precio: "1500",
    esGratis: false,
    tieneArchivo: true,
    publicar: true
  };
}

/** A free product ready to publish. */
function validFree(): ProductoFormValues {
  return {
    titulo: "Checklist gratis",
    descripcion: "Una lista para empezar tu marca.",
    esGratis: true,
    tieneArchivo: true,
    publicar: true
  };
}

describe("validateProductoForm", () => {
  it("accepts a complete paid product", () => {
    expect(validateProductoForm(validPaid())).toEqual({});
  });

  it("accepts a complete free product with no price", () => {
    expect(validateProductoForm(validFree())).toEqual({});
  });

  it("requires a título", () => {
    expect(validateProductoForm({ ...validPaid(), titulo: "  " }).titulo).toBeTruthy();
  });

  it("requires a descripción", () => {
    const { descripcion, ...rest } = validPaid();
    expect(validateProductoForm(rest).descripcion).toBeTruthy();
  });

  it("requires a price for a paid product", () => {
    expect(validateProductoForm({ ...validPaid(), precio: "" }).precio).toBeTruthy();
  });

  it("rejects a paid price of zero or less", () => {
    expect(validateProductoForm({ ...validPaid(), precio: "0" }).precio).toBeTruthy();
  });

  it("rejects an unparseable price", () => {
    expect(validateProductoForm({ ...validPaid(), precio: "gratis" }).precio).toBeTruthy();
  });

  it("rejects a price on a free product", () => {
    expect(validateProductoForm({ ...validFree(), precio: "1500" }).precio).toBeTruthy();
  });

  it("blocks publishing without a file", () => {
    expect(validateProductoForm({ ...validPaid(), tieneArchivo: false }).archivo).toBeTruthy();
  });

  it("allows saving a draft without a file", () => {
    const draft = { ...validPaid(), tieneArchivo: false, publicar: false };
    expect(validateProductoForm(draft)).toEqual({});
  });
});
