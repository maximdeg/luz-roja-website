import { describe, it, expect } from "vitest";
import { buildMpPreference, type MpPreferenceConfig } from "./mp-preference";
import type { Producto } from "./producto";
import type { Pedido } from "./pedido";

function producto(overrides: Partial<Producto> = {}): Producto {
  return {
    id: "prod-1",
    slug: "guia-de-marca",
    titulo: "Guía de marca",
    descripcion: "Un PDF para ordenar tu identidad visual.",
    imagenPortada: null,
    archivo: "productos/guia.pdf",
    precioCentavos: 150000,
    esGratis: false,
    publicado: true,
    ...overrides
  };
}

function pedido(overrides: Partial<Pedido> = {}): Pedido {
  return {
    id: "pedido-1",
    productoId: "prod-1",
    emailComprador: "ana@example.com",
    montoCentavos: 150000,
    estado: "pendiente",
    mpPreferenceId: null,
    mpPaymentId: null,
    externalReference: "pedido-1",
    downloadCount: 0,
    createdAt: "2026-07-09T00:00:00.000Z",
    paidAt: null,
    ...overrides
  };
}

const config: MpPreferenceConfig = {
  baseUrl: "https://luzroja.vercel.app",
  notificationUrl: "https://luzroja.vercel.app/api/mercadopago/webhook"
};

describe("buildMpPreference", () => {
  it("charges the pedido amount in pesos, defaulting to ARS", () => {
    const pref = buildMpPreference(producto(), pedido({ montoCentavos: 150050 }), config);
    expect(pref.items[0]).toMatchObject({
      quantity: 1,
      unit_price: 1500.5,
      currency_id: "ARS"
    });
  });

  it("sets external_reference from the pedido so the webhook can map it back", () => {
    const pref = buildMpPreference(producto(), pedido({ externalReference: "pedido-42" }), config);
    expect(pref.external_reference).toBe("pedido-42");
    expect(pref.metadata).toEqual({ pedido_id: "pedido-1", producto_id: "prod-1" });
  });

  it("points all three back_urls at the gracias page and passes the notification url through", () => {
    const pref = buildMpPreference(producto(), pedido(), config);
    expect(pref.back_urls.success).toBe(
      "https://luzroja.vercel.app/tienda/gracias?estado=success"
    );
    expect(pref.back_urls.pending).toContain("/tienda/gracias?estado=pending");
    expect(pref.back_urls.failure).toContain("/tienda/gracias?estado=failure");
    expect(pref.notification_url).toBe(config.notificationUrl);
  });

  it("sets auto_return only for a public https base url", () => {
    const prod = producto();
    const ped = pedido();
    // Deployed site (public https): MP accepts auto_return.
    expect(buildMpPreference(prod, ped, config).auto_return).toBe("approved");
    // Local dev over http/localhost: MP rejects auto_return, so it's omitted.
    expect(
      buildMpPreference(prod, ped, {
        ...config,
        baseUrl: "http://localhost:3000"
      }).auto_return
    ).toBeUndefined();
    // https but localhost is still not publicly reachable.
    expect(
      buildMpPreference(prod, ped, {
        ...config,
        baseUrl: "https://localhost:3000"
      }).auto_return
    ).toBeUndefined();
  });

  it("tolerates a trailing slash on the base url", () => {
    const pref = buildMpPreference(producto(), pedido(), {
      ...config,
      baseUrl: "https://luzroja.vercel.app/"
    });
    expect(pref.back_urls.success).toBe(
      "https://luzroja.vercel.app/tienda/gracias?estado=success"
    );
  });
});
