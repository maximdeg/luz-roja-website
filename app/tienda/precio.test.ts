import { describe, it, expect } from "vitest";
import { formatARS, centavosToPesos, parsePrecioInput } from "./precio";

/** Strips all whitespace (including the non-breaking space Intl inserts). */
function noSpace(value: string): string {
  return value.replace(/\s/g, "");
}

describe("formatARS", () => {
  it("formats centavos as Argentine currency with comma decimals", () => {
    expect(noSpace(formatARS(150000))).toBe("$1.500,00");
  });

  it("always shows two decimals, even for round amounts and zero", () => {
    expect(noSpace(formatARS(0))).toBe("$0,00");
    expect(noSpace(formatARS(150050))).toBe("$1.500,50");
  });
});

describe("centavosToPesos", () => {
  it("converts centavos to the major peso unit for payment amounts", () => {
    expect(centavosToPesos(150050)).toBe(1500.5);
    expect(centavosToPesos(0)).toBe(0);
  });
});

describe("parsePrecioInput", () => {
  it("parses a plain integer amount into centavos", () => {
    expect(parsePrecioInput("1500")).toBe(150000);
  });

  it("accepts a comma or a dot as the decimal separator", () => {
    expect(parsePrecioInput("1500,50")).toBe(150050);
    expect(parsePrecioInput("1500.50")).toBe(150050);
  });

  it("tolerates a leading '$' and surrounding whitespace", () => {
    expect(parsePrecioInput("$1500")).toBe(150000);
    expect(parsePrecioInput("  2000 ")).toBe(200000);
  });

  it("returns null for empty, non-numeric, or negative input", () => {
    expect(parsePrecioInput("")).toBeNull();
    expect(parsePrecioInput("abc")).toBeNull();
    expect(parsePrecioInput("-5")).toBeNull();
  });

  it("rejects ambiguous thousands separators and over-precise decimals", () => {
    expect(parsePrecioInput("1.500")).toBeNull();
    expect(parsePrecioInput("1500.999")).toBeNull();
  });
});
