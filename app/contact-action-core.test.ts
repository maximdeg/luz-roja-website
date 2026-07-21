import { describe, it, expect, vi } from "vitest";
import {
  submitContactWith,
  type ContactSubmission
} from "./contact-action-core";
import type { ContactFormValues } from "./contact-form-validation";

function validValues(): ContactFormValues {
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

function submission(over: Partial<ContactSubmission> = {}): ContactSubmission {
  return { values: validValues(), variant: "contacto", ...over };
}

describe("submitContactWith", () => {
  it("sends the enquiry and returns ok for a valid submission", async () => {
    const send = vi.fn().mockResolvedValue(undefined);

    const result = await submitContactWith(submission(), send);

    expect(result).toEqual({ status: "ok" });
    expect(send).toHaveBeenCalledTimes(1);
    // Goes to the inbox, reply-to the visitor.
    const sent = send.mock.calls[0][0];
    expect(sent.to).toBe("luzrojacontenidos@gmail.com");
    expect(sent.replyTo).toBe("ana@example.com");
  });

  it("drops a honeypot-filled submission: ok, but nothing sent", async () => {
    const send = vi.fn().mockResolvedValue(undefined);

    const result = await submitContactWith(submission({ honeypot: "http://spam" }), send);

    expect(result).toEqual({ status: "ok" });
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects an invalid submission without sending", async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const values = { ...validValues(), email: "not-an-email" };

    const result = await submitContactWith(submission({ values }), send);

    expect(result.status).toBe("invalid");
    if (result.status === "invalid") {
      expect(result.errors.email).toBeTruthy();
    }
    expect(send).not.toHaveBeenCalled();
  });

  it("surfaces a send failure as an error result", async () => {
    const send = vi.fn().mockRejectedValue(new Error("SMTP down"));

    const result = await submitContactWith(submission(), send);

    expect(result).toEqual({ status: "error" });
    expect(send).toHaveBeenCalledTimes(1);
  });
});
