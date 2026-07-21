/**
 * Shared presentation logic for a submitted contact enquiry: which fields appear
 * (per variant), their human labels, and how each value renders (service label,
 * "otro" free-text, origen). One source of truth for both the `mailto:` link
 * (contact-mailto) and the server-sent email (contact-email).
 */

import type { ContactFormValues, ContactFormVariant } from "./contact-form-validation";
import { CONTACT_SERVICE_OPTIONS } from "./contact-service-options";

const SERVICE_LABELS = new Map(
  CONTACT_SERVICE_OPTIONS.map((option) => [option.value, option.label])
);

export interface BodyField {
  key: keyof ContactFormValues;
  label: string;
}

export const BODY_FIELDS_BY_VARIANT: Record<ContactFormVariant, readonly BodyField[]> = {
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

/** Resolves a single field's display value: service/origen "otro" fall back to
 *  their free-text companion; the service slug resolves to its visible label. */
export function displayValue(
  key: keyof ContactFormValues,
  values: ContactFormValues
): string {
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

/** The full sender name assembled from nombre + apellido. */
export function senderName(values: ContactFormValues): string {
  return [values.nombre, values.apellido]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
}

/** Labelled "Label: value" lines for the variant's fields, empties omitted. */
export function bodyLines(
  values: ContactFormValues,
  variant: ContactFormVariant
): string[] {
  return BODY_FIELDS_BY_VARIANT[variant]
    .map((field) => {
      const value = displayValue(field.key, values);
      return value ? `${field.label}: ${value}` : null;
    })
    .filter((line): line is string => line !== null);
}
