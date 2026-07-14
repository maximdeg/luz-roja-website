/**
 * Supabase-backed PedidoRepository. Same seam as the in-memory fake. Orders are
 * fully private (no RLS read policy), so this only works through the
 * service-role client — exactly where the checkout, webhook, and delivery flows
 * run. `create` opens a pedido in "pendiente"; `save` persists the mutable
 * fields the pure state transitions produce.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { PedidoRepository } from "./pedido-repository";
import type { Pedido, NuevoPedido } from "./pedido";
import { getSupabaseAdmin } from "./supabase-server";
import { pedidoFromRow, pedidoToUpdateRow, type PedidoRow } from "./supabase-mappers";

const TABLE = "pedidos";

export class SupabasePedidoRepository implements PedidoRepository {
  private readonly db: SupabaseClient;

  constructor(client: SupabaseClient = getSupabaseAdmin()) {
    this.db = client;
  }

  async create(input: NuevoPedido): Promise<Pedido> {
    // estado defaults to 'pendiente' and external_reference mirrors the id, both
    // in the schema — so we only supply the caller-provided fields.
    const { data, error } = await this.db
      .from(TABLE)
      .insert({
        producto_id: input.productoId,
        email_comprador: input.emailComprador,
        monto_centavos: input.montoCentavos
      })
      .select("*")
      .single();
    if (error) throw asError(error, "crear pedido");
    return pedidoFromRow(data as PedidoRow);
  }

  async getById(id: string): Promise<Pedido | null> {
    return this.findOne("id", id, "obtener pedido por id");
  }

  async getByExternalReference(externalReference: string): Promise<Pedido | null> {
    return this.findOne(
      "external_reference",
      externalReference,
      "obtener pedido por external_reference"
    );
  }

  async getByMpPaymentId(mpPaymentId: string): Promise<Pedido | null> {
    return this.findOne("mp_payment_id", mpPaymentId, "obtener pedido por mp_payment_id");
  }

  async save(pedido: Pedido): Promise<Pedido> {
    const { data, error } = await this.db
      .from(TABLE)
      .update(pedidoToUpdateRow(pedido))
      .eq("id", pedido.id)
      .select("*")
      .single();
    if (error) throw asError(error, "guardar pedido");
    return pedidoFromRow(data as PedidoRow);
  }

  async listAll(): Promise<Pedido[]> {
    const { data, error } = await this.db
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw asError(error, "listar pedidos");
    return (data as PedidoRow[]).map(pedidoFromRow);
  }

  private async findOne(
    column: string,
    value: string,
    action: string
  ): Promise<Pedido | null> {
    const { data, error } = await this.db
      .from(TABLE)
      .select("*")
      .eq(column, value)
      .maybeSingle();
    if (error) throw asError(error, action);
    return data ? pedidoFromRow(data as PedidoRow) : null;
  }
}

function asError(error: { message: string }, action: string): Error {
  return new Error(`Supabase no pudo ${action}: ${error.message}`);
}
