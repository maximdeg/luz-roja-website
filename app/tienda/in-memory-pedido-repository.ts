/**
 * In-memory PedidoRepository for tests and local development. Matches the
 * future Supabase-backed implementation's interface. The clock is injectable
 * so createdAt is deterministic in tests.
 */

import type { PedidoRepository } from "./pedido-repository";
import type { Pedido, NuevoPedido } from "./pedido";

export interface InMemoryPedidoRepositoryOptions {
  now?: () => number;
}

export class InMemoryPedidoRepository implements PedidoRepository {
  private readonly items = new Map<string, Pedido>();
  private counter = 0;
  private readonly now: () => number;

  constructor(options: InMemoryPedidoRepositoryOptions = {}) {
    this.now = options.now ?? Date.now;
  }

  async create(input: NuevoPedido): Promise<Pedido> {
    const id = `pedido-${++this.counter}`;
    const pedido: Pedido = {
      id,
      productoId: input.productoId,
      emailComprador: input.emailComprador,
      montoCentavos: input.montoCentavos,
      estado: "pendiente",
      mpPreferenceId: null,
      mpPaymentId: null,
      externalReference: id,
      downloadCount: 0,
      createdAt: new Date(this.now()).toISOString(),
      paidAt: null
    };
    this.items.set(id, pedido);
    return pedido;
  }

  async getById(id: string): Promise<Pedido | null> {
    return this.items.get(id) ?? null;
  }

  async getByExternalReference(externalReference: string): Promise<Pedido | null> {
    return (
      [...this.items.values()].find((p) => p.externalReference === externalReference) ?? null
    );
  }

  async getByMpPaymentId(mpPaymentId: string): Promise<Pedido | null> {
    return [...this.items.values()].find((p) => p.mpPaymentId === mpPaymentId) ?? null;
  }

  async save(pedido: Pedido): Promise<Pedido> {
    this.items.set(pedido.id, pedido);
    return pedido;
  }

  async listAll(): Promise<Pedido[]> {
    return [...this.items.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
