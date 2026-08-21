// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestimonialCarousel, type TestimonialItem } from "./testimonial-carousel";

/**
 * jsdom implements neither scrolling nor scroll-snap, so the carousel's scroll
 * container is simulated: a fixed clientWidth gives slides a width, and
 * scrollTo records the target and fires the scroll event a browser would.
 * These tests therefore verify the wiring, not that snapping physically works.
 */
const SLIDE_WIDTH = 500;

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get(this: HTMLElement) {
      return this.classList?.contains("lr-testimonial-viewport") ? SLIDE_WIDTH : 0;
    }
  });

  HTMLElement.prototype.scrollTo = function (
    this: HTMLElement,
    options?: ScrollToOptions | number
  ) {
    const left = typeof options === "number" ? options : (options?.left ?? 0);
    Object.defineProperty(this, "scrollLeft", {
      configurable: true,
      writable: true,
      value: left
    });
    this.dispatchEvent(new Event("scroll"));
  } as typeof HTMLElement.prototype.scrollTo;

  // The hook coalesces scroll events through rAF; run them synchronously.
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

/** Simulates a touch swipe landing on the given slide. */
function swipeTo(index: number): void {
  const viewport = document.querySelector(".lr-testimonial-viewport");
  if (!viewport) throw new Error("carousel viewport not rendered");
  Object.defineProperty(viewport, "scrollLeft", {
    configurable: true,
    writable: true,
    value: index * SLIDE_WIDTH
  });
  act(() => {
    viewport.dispatchEvent(new Event("scroll"));
  });
}

const ITEMS: TestimonialItem[] = [
  { quote: "Primera cita de prueba.", author: "Autora Uno", role: "Rol Uno" },
  { quote: "Segunda cita de prueba.", author: "Autora Dos", role: "Rol Dos" }
];

/** Three items, so forward and backward wrap-around are distinguishable. */
const THREE_ITEMS: TestimonialItem[] = [
  ...ITEMS,
  { quote: "Tercera cita de prueba.", author: "Autora Tres", role: "Rol Tres" }
];

/** The polite live region that announces the active position. */
function liveRegionText(): string {
  return document.querySelector("[aria-live='polite']")?.textContent ?? "";
}

/** The slide currently exposed to assistive tech (not aria-hidden). */
function activeSlideText(): string {
  const slide = document.querySelector(
    '[aria-roledescription="diapositiva"][aria-hidden="false"]'
  );
  return slide?.textContent ?? "";
}

describe("TestimonialCarousel", () => {
  it("renders the testimonials it receives and starts on the first", () => {
    render(<TestimonialCarousel items={ITEMS} />);

    expect(screen.getByText("Primera cita de prueba.")).toBeDefined();
    expect(screen.getByText("Segunda cita de prueba.")).toBeDefined();
    expect(activeSlideText()).toContain("Autora Uno");
  });

  it("cycles forward and wraps around", async () => {
    render(<TestimonialCarousel items={ITEMS} />);
    const next = screen.getByRole("button", { name: /siguiente/i });

    await userEvent.click(next);
    expect(activeSlideText()).toContain("Autora Dos");

    await userEvent.click(next);
    expect(activeSlideText()).toContain("Autora Uno");
  });

  it("cycles backward from the first to the last", async () => {
    render(<TestimonialCarousel items={ITEMS} />);

    await userEvent.click(screen.getByRole("button", { name: /anterior/i }));
    expect(activeSlideText()).toContain("Autora Dos");
  });

  it("renders every quote regardless of which slide is active", async () => {
    render(<TestimonialCarousel items={THREE_ITEMS} />);

    await userEvent.click(screen.getByRole("button", { name: /siguiente/i }));

    for (const item of THREE_ITEMS) {
      expect(screen.getByText(item.quote)).toBeDefined();
    }
  });

  it("wraps forward past the last slide back to the first", async () => {
    render(<TestimonialCarousel items={THREE_ITEMS} />);
    const next = screen.getByRole("button", { name: /siguiente/i });

    await userEvent.click(next);
    expect(activeSlideText()).toContain("Autora Dos");
    await userEvent.click(next);
    expect(activeSlideText()).toContain("Autora Tres");
    await userEvent.click(next);
    expect(activeSlideText()).toContain("Autora Uno");
  });

  it("wraps backward past the first slide to the last", async () => {
    render(<TestimonialCarousel items={THREE_ITEMS} />);
    const prev = screen.getByRole("button", { name: /anterior/i });

    await userEvent.click(prev);
    expect(activeSlideText()).toContain("Autora Tres");
    await userEvent.click(prev);
    expect(activeSlideText()).toContain("Autora Dos");
  });

  it("follows the scroll position when the viewport is swiped", () => {
    render(<TestimonialCarousel items={THREE_ITEMS} />);

    swipeTo(2);
    expect(activeSlideText()).toContain("Autora Tres");
    expect(liveRegionText()).toBe("Testimonio 3 de 3");

    swipeTo(0);
    expect(activeSlideText()).toContain("Autora Uno");
  });

  it("renders nothing when there are no testimonials", () => {
    const { container } = render(<TestimonialCarousel items={[]} />);

    expect(container.textContent).toBe("");
  });

  it("shows a single testimonial without navigation affordances", () => {
    render(<TestimonialCarousel items={[ITEMS[0]]} />);

    expect(screen.getByText("Primera cita de prueba.")).toBeDefined();
    expect(screen.queryByRole("button", { name: /siguiente/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /anterior/i })).toBeNull();
  });

  it("announces the active position for screen readers", async () => {
    render(<TestimonialCarousel items={THREE_ITEMS} />);

    expect(liveRegionText()).toBe("Testimonio 1 de 3");
    await userEvent.click(screen.getByRole("button", { name: /siguiente/i }));
    expect(liveRegionText()).toBe("Testimonio 2 de 3");
  });
});
