/**
 * Select labels: short description only (same detail as flip-card back, without service title).
 * Options are ordered A–Z by visible label; "Otro" is always last.
 */

export interface ContactServiceOption {
  value: string;
  label: string;
}

function detailLabel(backLine1: string, backLine2?: string): string {
  return [backLine1, backLine2].filter(Boolean).join(" ");
}

export const CONTACT_SERVICE_OPTIONS: ContactServiceOption[] = [
  {
    value: "del-que-al-como",
    label: detailLabel("Asesorías en comunicación", "creativa y digital")
  },
  {
    value: "el-plan-maestro",
    label: detailLabel("Calendario de Contenidos", "Personalizado")
  },
  {
    value: "auditoria-digital",
    label: detailLabel("Diagnóstico y optimización", "de IG profesional")
  },
  {
    value: "te-armamos-la-vidriera",
    label: detailLabel("Fotografía de producto")
  },
  {
    value: "tu-marca-tu-huella",
    label: detailLabel("Fotografía de retrato")
  },
  {
    value: "por-fin-todos-juntos",
    label: detailLabel("Fotografía de retrato", "corporativo")
  },
  {
    value: "me-haces-un-videito",
    label: detailLabel("Producción integral de Reels", "con narrativa visual")
  },
  {
    value: "cada-palabra-cuenta",
    label: detailLabel("Redacción SEO", "para mejorar tu posicionamiento")
  },
  {
    value: "headshot-express",
    label: "Retrato express"
  },
  { value: "otro", label: "Otro" }
];
