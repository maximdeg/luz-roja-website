/**
 * The pedido (order): one purchase attempt of a paid producto. State lives in
 * `estado` and is only ever moved through the transitions in `pedido-estado`.
 */

import type { PedidoEstado } from "./pedido-estado";

export interface Pedido {
  id: string;
  productoId: string;
  emailComprador: string;
  /** Amount charged, in centavos (ARS cents), captured at checkout time. */
  montoCentavos: number;
  estado: PedidoEstado;
  mpPreferenceId: string | null;
  mpPaymentId: string | null;
  /** Carried on the Mercado Pago preference so a notification maps back here. Equals the id. */
  externalReference: string;
  downloadCount: number;
  /** ISO timestamps. */
  createdAt: string;
  paidAt: string | null;
}

/** Fields needed to open a pedido; the repository fills in the rest as "pendiente". */
export interface NuevoPedido {
  productoId: string;
  emailComprador: string;
  montoCentavos: number;
}
