"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
  type ContactFormVariant
} from "../contact-form-validation";
import { buildContactMailto } from "../contact-mailto";
import {
  HONEYPOT_FIELD,
  type ContactActionResult,
  type ContactSubmission
} from "../contact-action-core";

/** Human labels for the error summary, keyed by field name. */
const FIELD_LABELS: Record<string, string> = {
  nombre: "Nombre",
  apellido: "Apellido",
  email: "Email",
  telefono: "Teléfono",
  servicio: "Servicio",
  servicio_otro: "Servicio (otro)",
  pais: "País",
  porque: "¿Por qué Luz Roja?",
  proyecto: "Proyecto",
  web: "Web / Instagram",
  presupuesto: "Presupuesto",
  origen: "¿Dónde nos conociste?",
  origen_otro: "¿Dónde nos conociste? (otro)"
};

type SubmitState = "idle" | "submitting" | "success" | "error";

interface ContactFormProps {
  variant: ContactFormVariant;
  children: ReactNode;
  /**
   * The server action that delivers the enquiry. Passed in from the (server)
   * page rather than imported here, so this client module never pulls in the
   * server-only email adapter. Tests inject a fake.
   */
  submit: (submission: ContactSubmission) => Promise<ContactActionResult>;
}

export function ContactForm({ variant, children, submit }: ContactFormProps) {
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [state, setState] = useState<SubmitState>("idle");
  const [fallbackMailto, setFallbackMailto] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData) as ContactFormValues;
    const honeypot = String(formData.get(HONEYPOT_FIELD) ?? "");

    // Fast client-side check for instant feedback; the server re-validates.
    const nextErrors = validateContactForm(values, variant);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setState("submitting");
    let result: ContactActionResult;
    try {
      result = await submit({ values, variant, honeypot });
    } catch {
      result = { status: "error" };
    }

    if (result.status === "ok") {
      setState("success");
      return;
    }

    if (result.status === "invalid") {
      setErrors(result.errors);
      setState("idle");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    // status === "error": offer the mailto so the enquiry isn't lost.
    setFallbackMailto(buildContactMailto(values, variant));
    setState("error");
  }

  if (state === "success") {
    return (
      <div className="lr-form-success" role="status">
        <p className="lr-form-success-title">¡Gracias!</p>
        <p>Nos comunicaremos con vos a la brevedad.</p>
      </div>
    );
  }

  const errorEntries = Object.entries(errors);

  return (
    <form className="lr-form" onSubmit={handleSubmit} noValidate>
      {/* Honeypot: hidden from real users, but bots fill it. The server action
          silently drops any submission where it's non-empty. Kept off-screen
          (not display:none) and out of the tab order / a11y tree. */}
      <div className="lr-form-honeypot" aria-hidden="true">
        <label htmlFor={`${variant}-${HONEYPOT_FIELD}`}>
          No completar este campo
        </label>
        <input
          id={`${variant}-${HONEYPOT_FIELD}`}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {errorEntries.length > 0 && (
        <div
          className="lr-form-errors"
          role="alert"
          tabIndex={-1}
          ref={summaryRef}
        >
          <p className="lr-form-errors-title">Revisá estos campos:</p>
          <ul className="lr-form-errors-list">
            {errorEntries.map(([field, message]) => (
              <li key={field}>
                {FIELD_LABELS[field] ?? field}: {message}
              </li>
            ))}
          </ul>
        </div>
      )}
      {state === "error" && (
        <div className="lr-form-errors" role="alert">
          <p className="lr-form-errors-title">
            No pudimos enviar tu mensaje en este momento.
          </p>
          <p>
            Probá de nuevo, o escribinos directamente por{" "}
            {fallbackMailto ? (
              <a href={fallbackMailto}>correo electrónico</a>
            ) : (
              "correo electrónico"
            )}
            .
          </p>
        </div>
      )}
      <fieldset className="lr-form-fieldset" disabled={state === "submitting"}>
        {children}
      </fieldset>
    </form>
  );
}
