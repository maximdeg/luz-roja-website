import { describe, it, expect } from "vitest";
import {
  productoFromRow,
  nuevoProductoToRow,
  productoChangesToRow,
  pedidoFromRow,
  pedidoToUpdateRow,
  type ProductoRow,
  type PedidoRow
} from "./supabase-mappers";
import type { NuevoProducto } from "./catalog-repository";
import type { Pedido } from "./pedido";

const productoRow: ProductoRow = {
  id: "11111111-1111-1111-1111-111111111111",
  slug: "guia-de-marca",
  titulo: "Guía de marca",
  descripcion: "Un PDF.",
  imagen_portada: "portadas/guia.png",
  archivo: "productos/guia.pdf",
  precio_centavos: 150000,
  es_gratis: false,
  publicado: true
};

const pedidoRow: PedidoRow = {
  id: "22222222-2222-2222-2222-222222222222",
  producto_id: "11111111-1111-1111-1111-111111111111",
  email_comprador: "ana@example.com",
  monto_centavos: 150000,
  estado: "pagado",
  mp_preference_id: "pref-1",
  mp_payment_id: "pay-1",
  external_reference: "22222222-2222-2222-2222-222222222222",
  download_count: 2,
  created_at: "2026-07-09 12:00:00+00",
  paid_at: "2026-07-09 12:05:00+00"
};

describe("producto mapping", () => {
  it("maps a row to the camelCase domain shape", () => {
    expect(productoFromRow(productoRow)).toEqual({
      id: productoRow.id,
      slug: "guia-de-marca",
      titulo: "Guía de marca",
      descripcion: "Un PDF.",
      imagenPortada: "portadas/guia.png",
      archivo: "productos/guia.pdf",
      precioCentavos: 150000,
      esGratis: false,
      publicado: true
    });
  });

  it("maps a NuevoProducto to snake_case columns without an id", () => {
    const input: NuevoProducto = {
      slug: "s",
      titulo: "t",
      descripcion: "d",
      imagenPortada: null,
      archivo: null,
      precioCentavos: null,
      esGratis: true,
      publicado: false
    };
    const row = nuevoProductoToRow(input);
    expect(row).toEqual({
      slug: "s",
      titulo: "t",
      descripcion: "d",
      imagen_portada: null,
      archivo: null,
      precio_centavos: null,
      es_gratis: true,
      publicado: false
    });
    expect("id" in row).toBe(false);
  });

  it("emits only the changed keys, translated to snake_case", () => {
    expect(productoChangesToRow({ titulo: "Nuevo", publicado: true })).toEqual({
      titulo: "Nuevo",
      publicado: true
    });
  });

  it("passes an explicit null through for nullable columns", () => {
    expect(productoChangesToRow({ archivo: null })).toEqual({ archivo: null });
  });

  it("ignores keys that were not provided", () => {
    expect(productoChangesToRow({})).toEqual({});
  });
});

describe("pedido mapping", () => {
  it("maps a row to the camelCase domain shape and normalises timestamps to ISO Z", () => {
    const pedido = pedidoFromRow(pedidoRow);
    expect(pedido).toEqual({
      id: pedidoRow.id,
      productoId: pedidoRow.producto_id,
      emailComprador: "ana@example.com",
      montoCentavos: 150000,
      estado: "pagado",
      mpPreferenceId: "pref-1",
      mpPaymentId: "pay-1",
      externalReference: pedidoRow.external_reference,
      downloadCount: 2,
      createdAt: "2026-07-09T12:00:00.000Z",
      paidAt: "2026-07-09T12:05:00.000Z"
    });
  });

  it("keeps a null paid_at as null", () => {
    expect(pedidoFromRow({ ...pedidoRow, paid_at: null }).paidAt).toBeNull();
  });

  it("update row carries only the mutable fields, never the generated external_reference", () => {
    const pedido: Pedido = pedidoFromRow(pedidoRow);
    const row = pedidoToUpdateRow(pedido);
    expect(row).toEqual({
      estado: "pagado",
      mp_preference_id: "pref-1",
      mp_payment_id: "pay-1",
      download_count: 2,
      paid_at: "2026-07-09T12:05:00.000Z"
    });
    expect("external_reference" in row).toBe(false);
    expect("id" in row).toBe(false);
    expect("created_at" in row).toBe(false);
  });
});
