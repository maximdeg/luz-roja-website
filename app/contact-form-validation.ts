/**
 * Pure validation for the contact form (home + /contacto share the same fields).
 * Returns a map of field name -> error message. An empty object means "valid".
 */

export interface ContactFormValues {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  servicio?: string;
  servicio_otro?: string;
  pais?: string;
  porque?: string;
  proyecto?: string;
  web?: string;
  presupuesto?: string;
  origen?: string;
  origen_otro?: string;
}

export type ContactFormErrors = Record<string, string>;

/** The home section shows a shorter form than the full /contacto page. */
export type ContactFormVariant = "home" | "contacto";

const REQUIRED_FIELDS_BY_VARIANT: Record<
  ContactFormVariant,
  readonly (keyof ContactFormValues)[]
> = {
  home: ["nombre", "apellido", "email", "servicio", "web", "origen"],
  contacto: [
    "nombre",
    "apellido",
    "email",
    "servicio",
    "pais",
    "porque",
    "proyecto",
    "web",
    "presupuesto",
    "origen"
  ]
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The select value that reveals a free-text "tell us more" input. */
const OTRO_VALUE = "otro";

/** Selects where choosing "otro" makes an accompanying free-text field required. */
const OTRO_FREE_TEXT_RULES = [
  {
    select: "servicio",
    freeText: "servicio_otro",
    message: "Contanos qué servicio te interesa."
  },
  {
    select: "origen",
    freeText: "origen_otro",
    message: "Contanos cómo nos conociste."
  }
] as const;

/** Budget ranges offered by the presupuesto <select>; anything else is tampering. */
const PRESUPUESTO_VALUES = new Set([
  "hasta-1000",
  "1000-2000",
  "2000-4000",
  "4000-8000",
  "8000-15000",
  "mas-15000"
]);

export function validateContactForm(
  values: ContactFormValues,
  variant: ContactFormVariant = "contacto"
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  for (const field of REQUIRED_FIELDS_BY_VARIANT[variant]) {
    if (!values[field]?.trim()) {
      errors[field] = "Este campo es obligatorio.";
    }
  }

  const email = values.email?.trim();
  if (email && !EMAIL_PATTERN.test(email)) {
    errors.email = "Ingresá un email válido.";
  }

  for (const rule of OTRO_FREE_TEXT_RULES) {
    if (values[rule.select] === OTRO_VALUE && !values[rule.freeText]?.trim()) {
      errors[rule.freeText] = rule.message;
    }
  }

  const presupuesto = values.presupuesto?.trim();
  if (presupuesto && !PRESUPUESTO_VALUES.has(presupuesto)) {
    errors.presupuesto = "Elegí uno de los rangos disponibles.";
  }

  return errors;
}
