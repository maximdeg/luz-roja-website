// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { Header } from "./Header";

const mocks = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname
}));

beforeEach(() => {
  mocks.pathname = "/";
  // jsdom implements neither matchMedia nor scrollIntoView.
  window.matchMedia = (() => ({
    matches: true
  })) as unknown as typeof window.matchMedia;
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(cleanup);

function scrollIntoViewMock(): Mock {
  return window.HTMLElement.prototype.scrollIntoView as Mock;
}

describe("Header on the home page", () => {
  it("intercepts a section link: no navigation, scrolls to the section", () => {
    render(
      <>
        <Header />
        <div id="servicios" />
      </>
    );

    const notPrevented = fireEvent.click(screen.getByRole("link", { name: "Servicios" }));

    expect(notPrevented).toBe(false); // default navigation was prevented
    expect(scrollIntoViewMock()).toHaveBeenCalledTimes(1);
  });

  it("closes the mobile menu when a section link is clicked", () => {
    render(
      <>
        <Header />
        <div id="contacto" />
      </>
    );

    const toggle = screen.getByRole("button", { name: "Abrir menú" });
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(screen.getByRole("link", { name: "Contacto" }));
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });
});
