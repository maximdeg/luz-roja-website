/**
 * The pedido (order) state machine. Kept pure and separate so every legal and
 * illegal transition is decided in one tested place. Mapping a Mercado Pago
 * payment status to a target estado lives in the webhook adapter, not here —
 * this module only guards the transitions.
 *
 * Idempotency: re-applying the state an order is already in is a no-op
 * (`changed: false`), which is how duplicate webhook notifications avoid
 * re-sending the delivery email.
 */

export type PedidoEstado = "pendiente" | "pagado" | "entregado" | "fallido";

export const PEDIDO_ESTADOS: readonly PedidoEstado[] = [
  "pendiente",
  "pagado",
  "entregado",
  "fallido"
];

const ALLOWED_NEXT: Record<PedidoEstado, readonly PedidoEstado[]> = {
  pendiente: ["pagado", "fallido"],
  pagado: ["entregado"],
  entregado: [],
  fallido: []
};

export type TransitionResult =
  | { ok: true; estado: PedidoEstado; changed: boolean }
  | { ok: false; reason: string };

export function transitionPedido(from: PedidoEstado, to: PedidoEstado): TransitionResult {
  if (from === to) {
    return { ok: true, estado: from, changed: false };
  }
  if (ALLOWED_NEXT[from].includes(to)) {
    return { ok: true, estado: to, changed: true };
  }
  return { ok: false, reason: `No se puede pasar un pedido de "${from}" a "${to}".` };
}

/** Whether an order has reached a state it can never leave. */
export function isEstadoFinal(estado: PedidoEstado): boolean {
  return ALLOWED_NEXT[estado].length === 0;
}
