import { describe, it, expect } from "vitest";
import { transitionPedido, isEstadoFinal } from "./pedido-estado";

describe("transitionPedido — legal transitions", () => {
  it("moves a pending order to paid", () => {
    expect(transitionPedido("pendiente", "pagado")).toEqual({
      ok: true,
      estado: "pagado",
      changed: true
    });
  });

  it("moves a pending order to failed", () => {
    expect(transitionPedido("pendiente", "fallido").ok).toBe(true);
  });

  it("moves a paid order to delivered", () => {
    expect(transitionPedido("pagado", "entregado")).toEqual({
      ok: true,
      estado: "entregado",
      changed: true
    });
  });
});

describe("transitionPedido — idempotency", () => {
  it("treats a repeat of the current state as a no-op", () => {
    expect(transitionPedido("pagado", "pagado")).toEqual({
      ok: true,
      estado: "pagado",
      changed: false
    });
  });
});

describe("transitionPedido — illegal transitions", () => {
  it("won't skip straight from pending to delivered", () => {
    expect(transitionPedido("pendiente", "entregado").ok).toBe(false);
  });

  it("won't move a paid order back to pending", () => {
    expect(transitionPedido("pagado", "pendiente").ok).toBe(false);
  });

  it("won't revive a failed order", () => {
    expect(transitionPedido("fallido", "pagado").ok).toBe(false);
  });
});

describe("isEstadoFinal", () => {
  it("marks entregado and fallido as final", () => {
    expect(isEstadoFinal("entregado")).toBe(true);
    expect(isEstadoFinal("fallido")).toBe(true);
  });

  it("marks pendiente and pagado as non-final", () => {
    expect(isEstadoFinal("pendiente")).toBe(false);
    expect(isEstadoFinal("pagado")).toBe(false);
  });
});
