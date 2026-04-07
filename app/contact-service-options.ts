/**
 * Labels match service flip cards in #servicios: front title + back face in parentheses.
 */

export interface ContactServiceOption {
  value: string;
  label: string;
}

function withBackFace(frontTitle: string, backLine1: string, backLine2?: string): string {
  const detail = [backLine1, backLine2].filter(Boolean).join(" ");
  return `${frontTitle} (${detail})`;
}

export const CONTACT_SERVICE_OPTIONS: ContactServiceOption[] = [
  {
    value: "el-plan-maestro",
    label: withBackFace("El plan maestro", "Calendario de Contenidos", "Personalizado")
  },
  {
    value: "auditoria-digital",
    label: withBackFace("Auditoria digital", "Diagnóstico y optimización", "de IG profesional")
  },
  {
    value: "me-haces-un-videito",
    label: withBackFace(
      "¿Me haces un videito?",
      "Producción integral de Reels",
      "con narrativa visual"
    )
  },
  {
    value: "del-que-al-como",
    label: withBackFace("Del qué al cómo", "Asesorías en comunicación", "creativa y digital")
  },
  {
    value: "tu-marca-tu-huella",
    label: withBackFace("Tu marca tu huella", "Fotografía de retrato")
  },
  {
    value: "headshot-express",
    label: withBackFace("Headshot express", "Fotografía de retrato")
  },
  {
    value: "por-fin-todos-juntos",
    label: withBackFace("Por fin todos juntos", "Fotografía de retrato", "corporativo")
  },
  {
    value: "cada-palabra-cuenta",
    label: withBackFace("Cada palabra cuenta", "Redacción SEO", "para mejorar tu posicionamiento")
  },
  {
    value: "te-armamos-la-vidriera",
    label: withBackFace("Te armamos la vidriera", "Fotografía de producto")
  },
  { value: "otro", label: "Otro" }
];
