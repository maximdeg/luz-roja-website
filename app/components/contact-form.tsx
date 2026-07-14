"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
  type ContactFormVariant
} from "../contact-form-validation";
import { buildContactMailto } from "../contact-mailto";

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

interface ContactFormProps {
  variant: ContactFormVariant;
  children: ReactNode;
  /** Injectable for tests; defaults to navigating the browser to the mailto. */
  navigate?: (url: string) => void;
}

export function ContactForm({ variant, children, navigate }: ContactFormProps) {
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const summaryRef = useRef<HTMLDivElement>(null);

  const go =
    navigate ??
    ((url: string) => {
      window.location.href = url;
    });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(
      new FormData(event.currentTarget)
    ) as ContactFormValues;

    const nextErrors = validateContactForm(values, variant);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    go(buildContactMailto(values, variant));
  }

  const errorEntries = Object.entries(errors);

  return (
    <form className="lr-form" onSubmit={handleSubmit} noValidate>
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
      {children}
    </form>
  );
}
