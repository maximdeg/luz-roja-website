/**
 * Builds a prefilled `mailto:` link from a submitted contact form. With no backend
 * yet, a valid submit hands off to the visitor's own mail client.
 */

import type { ContactFormValues, ContactFormVariant } from "./contact-form-validation";
import { CONTACT_SERVICE_OPTIONS } from "./contact-service-options";

const RECIPIENT = "luzrojacontenidos@gmail.com";

const SERVICE_LABELS = new Map(
  CONTACT_SERVICE_OPTIONS.map((option) => [option.value, option.label])
);

interface BodyField {
  key: keyof ContactFormValues;
  label: string;
}

const BODY_FIELDS_BY_VARIANT: Record<ContactFormVariant, readonly BodyField[]> = {
  home: [
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "email", label: "Email" },
    { key: "telefono", label: "Teléfono" },
    { key: "servicio", label: "Servicio" },
    { key: "web", label: "Web / Instagram" },
    { key: "origen", label: "¿Dónde nos conociste?" }
  ],
  contacto: [
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "email", label: "Email" },
    { key: "telefono", label: "Teléfono" },
    { key: "servicio", label: "Servicio" },
    { key: "pais", label: "País" },
    { key: "porque", label: "¿Por qué Luz Roja?" },
    { key: "proyecto", label: "Proyecto" },
    { key: "web", label: "Web / Instagram" },
    { key: "presupuesto", label: "Presupuesto" },
    { key: "origen", label: "¿Dónde nos conociste?" }
  ]
};

const OTRO_VALUE = "otro";

function displayValue(key: keyof ContactFormValues, values: ContactFormValues): string {
  if (key === "servicio") {
    const servicio = values.servicio ?? "";
    if (servicio === OTRO_VALUE) return values.servicio_otro?.trim() ?? "";
    return SERVICE_LABELS.get(servicio) ?? servicio;
  }
  if (key === "origen") {
    const origen = values.origen ?? "";
    if (origen === OTRO_VALUE) return values.origen_otro?.trim() ?? "";
    return origen;
  }
  return values[key]?.trim() ?? "";
}

export function buildContactMailto(
  values: ContactFormValues,
  variant: ContactFormVariant = "contacto"
): string {
  const sender = [values.nombre, values.apellido]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
  const subject = `Consulta de ${sender}`.trim();

  const body = BODY_FIELDS_BY_VARIANT[variant]
    .map((field) => {
      const value = displayValue(field.key, values);
      return value ? `${field.label}: ${value}` : null;
    })
    .filter((line): line is string => line !== null)
    .join("\n");

  return `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
