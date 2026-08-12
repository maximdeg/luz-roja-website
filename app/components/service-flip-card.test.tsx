// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ServiceFlipCard } from "./service-flip-card";

afterEach(cleanup);

function renderCard() {
  render(
    <ServiceFlipCard
      variant="light"
      line1="Auditoria"
      line2="digital"
      backLine1="Diagnóstico y optimización"
      backLine2="de IG profesional"
    />
  );
  return screen.getByRole("button", {
    name: "Auditoria digital. Diagnóstico y optimización de IG profesional"
  });
}

describe("ServiceFlipCard", () => {
  it("starts unflipped", () => {
    const card = renderCard();

    expect(card.getAttribute("data-flipped")).toBeNull();
    expect(card.getAttribute("aria-pressed")).toBe("false");
  });

  it("flips on tap/click and flips back on a second tap", async () => {
    const card = renderCard();

    await userEvent.click(card);
    expect(card.getAttribute("data-flipped")).toBe("true");
    expect(card.getAttribute("aria-pressed")).toBe("true");

    await userEvent.click(card);
    expect(card.getAttribute("data-flipped")).toBeNull();
    expect(card.getAttribute("aria-pressed")).toBe("false");
  });

  it("toggles with Enter and Space from the keyboard", async () => {
    const card = renderCard();
    card.focus();

    await userEvent.keyboard("{Enter}");
    expect(card.getAttribute("data-flipped")).toBe("true");

    await userEvent.keyboard(" ");
    expect(card.getAttribute("data-flipped")).toBeNull();
  });
});
