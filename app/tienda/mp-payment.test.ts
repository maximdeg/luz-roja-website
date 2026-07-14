import { describe, it, expect } from "vitest";
import { mapMpPayment, interpretPayment, type MpPayment } from "./mp-payment";
import type { Pedido } from "./pedido";

function pedido(overrides: Partial<Pedido> = {}): Pedido {
  return {
    id: "pedido-1",
    productoId: "prod-1",
    emailComprador: "ana@example.com",
    montoCentavos: 250000,
    estado: "pendiente",
    mpPreferenceId: "pref-1",
    mpPaymentId: null,
    externalReference: "pedido-1",
    downloadCount: 0,
    createdAt: "2026-07-11T00:00:00.000Z",
    paidAt: null,
    ...overrides
  };
}

function payment(overrides: Partial<MpPayment> = {}): MpPayment {
  return {
    id: "123",
    status: "approved",
    statusDetail: "accredited",
    externalReference: "pedido-1",
    transactionAmount: 2500,
    payerEmail: "ana@example.com",
    ...overrides
  };
}

describe("mapMpPayment", () => {
  it("normalizes the raw API json", () => {
    expect(
      mapMpPayment({
        id: 987654321,
        status: "approved",
        status_detail: "accredited",
        external_reference: "pedido-1",
        transaction_amount: 2500,
        payer: { email: "ana@example.com" }
      })
    ).toEqual({
      id: "987654321",
      status: "approved",
      statusDetail: "accredited",
      externalReference: "pedido-1",
      transactionAmount: 2500,
      payerEmail: "ana@example.com"
    });
  });

  it("tolerates missing optional fields", () => {
    const p = mapMpPayment({ id: 1, status: "pending" });
    expect(p).toMatchObject({ id: "1", externalReference: null, transactionAmount: 0, payerEmail: null });
  });
});

describe("interpretPayment", () => {
  it("delivers an approved payment that matches the pedido and amount", () => {
    expect(interpretPayment(payment(), pedido())).toEqual({ deliver: true });
  });

  it("refuses a payment for a different pedido", () => {
    expect(interpretPayment(payment({ externalReference: "otro" }), pedido())).toEqual({
      deliver: false,
      reason: "reference-mismatch"
    });
  });

  it("refuses a payment that is not approved", () => {
    expect(interpretPayment(payment({ status: "pending" }), pedido())).toEqual({
      deliver: false,
      reason: "not-approved"
    });
  });

  it("refuses a payment whose amount does not match what was charged", () => {
    expect(interpretPayment(payment({ transactionAmount: 100 }), pedido())).toEqual({
      deliver: false,
      reason: "amount-mismatch"
    });
  });
});
