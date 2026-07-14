// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "./contact-form";

afterEach(cleanup);

/** Minimal stand-ins for the real home-form fields; the wrapper only reads names. */
function HomeFields() {
  return (
    <>
      <input name="nombre" aria-label="Nombre" />
      <input name="apellido" aria-label="Apellido" />
      <input name="email" aria-label="Email" />
      <input name="servicio" aria-label="Servicio" />
      <input name="web" aria-label="Web" />
      <input name="origen" aria-label="Origen" />
      <button type="submit">Enviar formulario</button>
    </>
  );
}

describe("ContactForm", () => {
  it("blocks submission and shows an error summary when required fields are empty", async () => {
    const navigate = vi.fn();
    render(
      <ContactForm variant="home" navigate={navigate}>
        <HomeFields />
      </ContactForm>
    );

    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));

    expect(screen.queryByRole("alert")).not.toBeNull();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("navigates to a prefilled mailto when the form is valid", async () => {
    const navigate = vi.fn();
    render(
      <ContactForm variant="home" navigate={navigate}>
        <HomeFields />
      </ContactForm>
    );

    await userEvent.type(screen.getByLabelText("Nombre"), "Ana");
    await userEvent.type(screen.getByLabelText("Apellido"), "Pérez");
    await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
    await userEvent.type(screen.getByLabelText("Servicio"), "headshot-express");
    await userEvent.type(screen.getByLabelText("Web"), "@ana.marca");
    await userEvent.type(screen.getByLabelText("Origen"), "instagram");

    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));

    expect(screen.queryByRole("alert")).toBeNull();
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate.mock.calls[0][0]).toMatch(/^mailto:luzrojacontenidos@gmail\.com\?/);
  });
});
