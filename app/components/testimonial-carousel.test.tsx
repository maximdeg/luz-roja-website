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
});
