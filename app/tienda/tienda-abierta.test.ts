import { describe, it, expect } from "vitest";
import { esTiendaAbierta } from "./tienda-abierta";

describe("esTiendaAbierta", () => {
  it("opens only on an explicit true", () => {
    expect(esTiendaAbierta("true")).toBe(true);
    expect(esTiendaAbierta("TRUE")).toBe(true);
    expect(esTiendaAbierta("  true  ")).toBe(true);
  });

  it("stays closed when the variable is missing", () => {
    expect(esTiendaAbierta(undefined)).toBe(false);
    expect(esTiendaAbierta(null)).toBe(false);
    expect(esTiendaAbierta("")).toBe(false);
  });

  it("stays closed on anything that is not the explicit open value", () => {
    expect(esTiendaAbierta("false")).toBe(false);
    expect(esTiendaAbierta("1")).toBe(false);
    expect(esTiendaAbierta("yes")).toBe(false);
    expect(esTiendaAbierta("open")).toBe(false);
    expect(esTiendaAbierta("truthy")).toBe(false);
  });
});
