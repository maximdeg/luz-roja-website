import { describe, it, expect } from "vitest";
import { buildContactMailto } from "./contact-mailto";
import type { ContactFormValues } from "./contact-form-validation";

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

describe("buildContactMailto", () => {
  it("targets the Luz Roja inbox and names the sender in the subject", () => {
    const url = buildContactMailto(validForm(), "contacto");
    expect(url.startsWith("mailto:luzrojacontenidos@gmail.com?")).toBe(true);
    expect(new URL(url).searchParams.get("subject")).toContain("Ana Pérez");
  });

  it("lists contact details and the human-readable service label in the body", () => {
    const body = new URL(buildContactMailto(validForm(), "contacto")).searchParams.get("body")!;
    expect(body).toContain("ana@example.com");
    // "headshot-express" resolves to its visible option label, not the raw slug.
    expect(body).toContain("Retrato express");
  });

  it("uses the free-text description when servicio is 'otro'", () => {
    const values = {
      ...validForm(),
      servicio: "otro",
      servicio_otro: "Sesión de fotos submarina"
    };
    const body = new URL(buildContactMailto(values, "contacto")).searchParams.get("body")!;
    expect(body).toContain("Servicio: Sesión de fotos submarina");
  });

  it("percent-encodes spaces and newlines instead of '+' (mailto-safe)", () => {
    const url = buildContactMailto(validForm(), "contacto");
    const query = url.slice(url.indexOf("?") + 1);
    expect(query).toContain("%20"); // spaces
    expect(query).toContain("%0A"); // newline between body fields
    expect(query).not.toContain("+"); // '+' renders literally in many mail clients
  });
});
