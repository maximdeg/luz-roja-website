// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestimonialCarousel, type TestimonialItem } from "./testimonial-carousel";

afterEach(cleanup);

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
