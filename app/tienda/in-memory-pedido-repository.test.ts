import { describe, it, expect } from "vitest";
import { InMemoryPedidoRepository } from "./in-memory-pedido-repository";
import type { NuevoPedido } from "./pedido";

function nuevoPedido(overrides: Partial<NuevoPedido> = {}): NuevoPedido {
  return {
    productoId: "prod-1",
    emailComprador: "ana@example.com",
    montoCentavos: 150000,
    ...overrides
  };
}

describe("InMemoryPedidoRepository — create", () => {
  it("opens a pedido in the pendiente state with its externalReference set to its id", async () => {
    const repo = new InMemoryPedidoRepository();
    const pedido = await repo.create(nuevoPedido());
    expect(pedido).toMatchObject({
      estado: "pendiente",
      downloadCount: 0,
      mpPreferenceId: null,
      mpPaymentId: null,
      paidAt: null
    });
    expect(pedido.externalReference).toBe(pedido.id);
  });

  it("stamps createdAt from the injected clock", async () => {
    const repo = new InMemoryPedidoRepository({ now: () => 1_700_000_000_000 });
    const pedido = await repo.create(nuevoPedido());
    expect(pedido.createdAt).toBe(new Date(1_700_000_000_000).toISOString());
  });
});

describe("InMemoryPedidoRepository — lookups", () => {
  it("finds a pedido by id and by externalReference", async () => {
    const repo = new InMemoryPedidoRepository();
    const pedido = await repo.create(nuevoPedido());
    expect((await repo.getById(pedido.id))?.id).toBe(pedido.id);
    expect((await repo.getByExternalReference(pedido.externalReference))?.id).toBe(pedido.id);
    expect(await repo.getById("missing")).toBeNull();
  });

  it("finds a pedido by Mercado Pago payment id once one is recorded", async () => {
    const repo = new InMemoryPedidoRepository();
    const pedido = await repo.create(nuevoPedido());
    expect(await repo.getByMpPaymentId("mp-999")).toBeNull();
    await repo.save({ ...pedido, mpPaymentId: "mp-999", estado: "pagado" });
    expect((await repo.getByMpPaymentId("mp-999"))?.id).toBe(pedido.id);
  });
});

describe("InMemoryPedidoRepository — save & list", () => {
  it("persists mutations to an existing pedido", async () => {
    const repo = new InMemoryPedidoRepository();
    const pedido = await repo.create(nuevoPedido());
    await repo.save({ ...pedido, estado: "entregado", downloadCount: 2 });
    expect(await repo.getById(pedido.id)).toMatchObject({
      estado: "entregado",
      downloadCount: 2
    });
  });

  it("lists all orders newest first", async () => {
    let t = 1_700_000_000_000;
    const repo = new InMemoryPedidoRepository({ now: () => (t += 1000) });
    const first = await repo.create(nuevoPedido());
    const second = await repo.create(nuevoPedido());
    const all = await repo.listAll();
    expect(all.map((p) => p.id)).toEqual([second.id, first.id]);
  });
});
