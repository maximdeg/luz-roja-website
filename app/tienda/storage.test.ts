import { describe, it, expect } from "vitest";
import { portadaPublicUrl } from "./storage";

const base = "https://proj.supabase.co";

describe("portadaPublicUrl", () => {
  it("returns null when there is no cover", () => {
    expect(portadaPublicUrl(null, base)).toBeNull();
  });

  it("builds a public portadas URL from an object path", () => {
    expect(portadaPublicUrl("guia.png", base)).toBe(
      "https://proj.supabase.co/storage/v1/object/public/portadas/guia.png"
    );
  });

  it("tolerates leading/trailing slashes on the base and path", () => {
    expect(portadaPublicUrl("/nested/guia.png", "https://proj.supabase.co/")).toBe(
      "https://proj.supabase.co/storage/v1/object/public/portadas/nested/guia.png"
    );
  });

  it("passes a full http(s) URL through unchanged", () => {
    const url = "https://cdn.example.com/x.png";
    expect(portadaPublicUrl(url, base)).toBe(url);
  });

  it("returns null when the base URL is unavailable", () => {
    expect(portadaPublicUrl("guia.png", undefined)).toBeNull();
  });
});
