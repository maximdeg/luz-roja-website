/**
 * The pedido (order) seam. The checkout, webhook, and delivery flows depend on
 * this interface rather than on Supabase directly. Mutations are computed with
 * the pure `pedido-estado` transitions and then persisted via `save`.
 */

import type { Pedido, NuevoPedido } from "./pedido";

export interface PedidoRepository {
  /** Opens a pedido in the "pendiente" state; externalReference is set to its id. */
  create(input: NuevoPedido): Promise<Pedido>;
  getById(id: string): Promise<Pedido | null>;
  /** Looks up the pedido a Mercado Pago notification refers to. */
  getByExternalReference(externalReference: string): Promise<Pedido | null>;
  /** Idempotency lookup so a repeated webhook for the same payment is a no-op. */
  getByMpPaymentId(mpPaymentId: string): Promise<Pedido | null>;
  /** Persists mutations to an existing pedido (estado, Mercado Pago ids, counts). */
  save(pedido: Pedido): Promise<Pedido>;
  /** All orders, newest first — for the admin orders list. */
  listAll(): Promise<Pedido[]>;
}
