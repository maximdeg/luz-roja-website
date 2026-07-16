/**
 * Launch gate for the public store. The store ships to production behind a
 * closed curtain: every public /tienda surface shows the "PREPARATE"
 * placeholder until TIENDA_ABIERTA is explicitly "true". Absence, an empty
 * value, or anything else keeps it closed, so a fresh deploy or a missing
 * variable can never launch the store by accident. The admin panel and the
 * Mercado Pago webhook are never gated.
 */

/** Pure parser so the open/closed decision is unit-testable. */
export function esTiendaAbierta(valor: string | undefined | null): boolean {
  return valor?.trim().toLowerCase() === "true";
}

/** Reads the gate from the environment (server-side only). */
export function tiendaAbierta(): boolean {
  return esTiendaAbierta(process.env.TIENDA_ABIERTA);
}
