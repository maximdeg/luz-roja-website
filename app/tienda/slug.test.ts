import { describe, it, expect } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates a title", () => {
    expect(slugify("Guía de Marca")).toBe("guia-de-marca");
  });

  it("strips accents and punctuation", () => {
    expect(slugify("¡Diseño & Estrategia!")).toBe("diseno-estrategia");
  });

  it("trims leading/trailing separators", () => {
    expect(slugify("  Hola Mundo  ")).toBe("hola-mundo");
  });

  it("collapses runs of separators into one hyphen", () => {
    expect(slugify("a---b   c")).toBe("a-b-c");
  });

  it("falls back to 'producto' when nothing usable remains", () => {
    expect(slugify("¿?¡!")).toBe("producto");
    expect(slugify("")).toBe("producto");
  });

  it("bounds the length and never ends on a hyphen", () => {
    const s = slugify("palabra ".repeat(20));
    expect(s.length).toBeLessThanOrEqual(60);
    expect(s.endsWith("-")).toBe(false);
  });
});
