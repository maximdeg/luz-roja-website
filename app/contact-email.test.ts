import { describe, it, expect } from "vitest";
import { buildContactEmail } from "./contact-email";
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

describe("buildContactEmail", () => {
  it("addresses the Luz Roja inbox and names the sender in the subject", () => {
    const email = buildContactEmail(validForm(), "contacto");
    expect(email.to).toBe("luzrojacontenidos@gmail.com");
    expect(email.subject).toContain("Ana Pérez");
  });

  it("sets reply-to to the visitor's address so replies reach them", () => {
    const email = buildContactEmail(validForm(), "contacto");
    expect(email.replyTo).toBe("ana@example.com");
  });

  it("lists contact details and the human-readable service label in both bodies", () => {
    const email = buildContactEmail(validForm(), "contacto");
    expect(email.text).toContain("ana@example.com");
    // "headshot-express" resolves to its visible option label, not the raw slug.
    expect(email.text).toContain("Retrato express");
    expect(email.html).toContain("Retrato express");
  });

  it("uses the free-text description when servicio is 'otro'", () => {
    const email = buildContactEmail(
      { ...validForm(), servicio: "otro", servicio_otro: "Sesión de fotos submarina" },
      "contacto"
    );
    expect(email.text).toContain("Servicio: Sesión de fotos submarina");
  });

  it("only includes the home variant's fields for a home submission", () => {
    const email = buildContactEmail(validForm(), "home");
    // Proyecto/presupuesto/país are contacto-only, absent from the home body.
    expect(email.text).not.toContain("Proyecto:");
    expect(email.text).not.toContain("Presupuesto:");
  });

  it("escapes html-significant characters in field values", () => {
    const email = buildContactEmail(
      { ...validForm(), servicio: "otro", servicio_otro: "Pack <Marca> & Co" },
      "contacto"
    );
    expect(email.html).toContain("Pack &lt;Marca&gt; &amp; Co");
    expect(email.html).not.toContain("<Marca>");
  });
});
