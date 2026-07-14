import { describe, it, expect } from "vitest";
import { validateContactForm, type ContactFormValues } from "./contact-form-validation";

/** A full /contacto form filled exactly the way a real visitor would submit it. */
function validForm(): ContactFormValues {
  return {
    nombre: "Ana",
    apellido: "Pérez",
    email: "ana@example.com",
    telefono: "+54 11 5555 5555",
    servicio: "headshot-express",
    pais: "Argentina",
    porque: "Me encanta su trabajo.",
    proyecto: "Necesito retratos para mi marca personal.",
    web: "@ana.marca",
    presupuesto: "1000-2000",
    origen: "instagram"
  };
}

/** The shorter home-page form: no pais / porque / proyecto / presupuesto. */
function validHomeForm(): ContactFormValues {
  return {
    nombre: "Ana",
    apellido: "Pérez",
    email: "ana@example.com",
    telefono: "+54 11 5555 5555",
    servicio: "headshot-express",
    web: "@ana.marca",
    origen: "instagram"
  };
}

describe("validateContactForm — contacto variant", () => {
  it("returns no errors for a fully-filled valid form", () => {
    expect(validateContactForm(validForm(), "contacto")).toEqual({});
  });

  it("flags a missing required field under that field's key", () => {
    const { nombre, ...withoutNombre } = validForm();
    const errors = validateContactForm(withoutNombre, "contacto");
    expect(errors.nombre).toBeTruthy();
  });

  it("treats a whitespace-only required field as missing", () => {
    const errors = validateContactForm({ ...validForm(), nombre: "   " }, "contacto");
    expect(errors.nombre).toBeTruthy();
  });

  it("rejects an email that is present but malformed", () => {
    const errors = validateContactForm({ ...validForm(), email: "ana(at)example" }, "contacto");
    expect(errors.email).toBeTruthy();
  });

  it("requires servicio_otro when servicio is 'otro'", () => {
    const errors = validateContactForm({ ...validForm(), servicio: "otro" }, "contacto");
    expect(errors.servicio_otro).toBeTruthy();
  });

  it("requires origen_otro when origen is 'otro'", () => {
    const errors = validateContactForm({ ...validForm(), origen: "otro" }, "contacto");
    expect(errors.origen_otro).toBeTruthy();
  });

  it("never flags telefono, which is optional", () => {
    const { telefono, ...withoutTelefono } = validForm();
    expect(validateContactForm(withoutTelefono, "contacto")).toEqual({});
  });

  it("rejects a presupuesto that is not one of the offered ranges", () => {
    const errors = validateContactForm({ ...validForm(), presupuesto: "9999-99999" }, "contacto");
    expect(errors.presupuesto).toBeTruthy();
  });
});

describe("validateContactForm — home variant", () => {
  it("returns no errors for a valid home form that omits pais/porque/proyecto/presupuesto", () => {
    expect(validateContactForm(validHomeForm(), "home")).toEqual({});
  });

  it("still enforces the home form's own required fields", () => {
    const { web, ...withoutWeb } = validHomeForm();
    const errors = validateContactForm(withoutWeb, "home");
    expect(errors.web).toBeTruthy();
  });

  it("still applies the 'otro' rule to servicio on the home form", () => {
    const errors = validateContactForm({ ...validHomeForm(), servicio: "otro" }, "home");
    expect(errors.servicio_otro).toBeTruthy();
  });
});
