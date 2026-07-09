/**
 * Price helpers for the tienda. Prices are stored as an integer number of
 * centavos (ARS cents) to avoid floating-point drift; display and Mercado Pago
 * amounts are derived from that. The admin types a plain peso amount with an
 * optional 1-2 digit decimal (dot or comma); thousands separators are rejected
 * so the input is never ambiguous.
 */

const ARS_FORMAT = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

/** Formats integer centavos as an Argentine currency string, e.g. "$ 1.500,00". */
export function formatARS(centavos: number): string {
  return ARS_FORMAT.format(centavos / 100);
}

/** Pesos (major unit) for a centavos amount — used to build Mercado Pago amounts. */
export function centavosToPesos(centavos: number): number {
  return centavos / 100;
}

/**
 * Parses admin price input into integer centavos, or returns null when the
 * input isn't a clean, non-negative peso amount. Accepts "1500", "1500,50",
 * "1500.50", and a leading "$"; rejects thousands separators, letters, more
 * than two decimals, and negatives.
 */
export function parsePrecioInput(input: string): number | null {
  const cleaned = input.replace(/\s/g, "").replace(/^\$/, "");
  if (!/^\d+([.,]\d{1,2})?$/.test(cleaned)) return null;
  const pesos = Number(cleaned.replace(",", "."));
  if (!Number.isFinite(pesos) || pesos < 0) return null;
  return Math.round(pesos * 100);
}
