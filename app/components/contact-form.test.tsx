// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "./contact-form";
import type { ContactActionResult } from "../contact-action-core";

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

/** Fills every required home field with valid values. */
async function fillValidHomeForm() {
  await userEvent.type(screen.getByLabelText("Nombre"), "Ana");
  await userEvent.type(screen.getByLabelText("Apellido"), "Pérez");
  await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
  await userEvent.type(screen.getByLabelText("Servicio"), "headshot-express");
  await userEvent.type(screen.getByLabelText("Web"), "@ana.marca");
  await userEvent.type(screen.getByLabelText("Origen"), "instagram");
}

function renderForm(submit: () => Promise<ContactActionResult>) {
  return render(
    <ContactForm variant="home" submit={submit}>
      <HomeFields />
    </ContactForm>
  );
}

describe("ContactForm", () => {
  it("blocks submission and shows an error summary when required fields are empty", async () => {
    const submit = vi.fn();
    renderForm(submit);

    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));

    expect(screen.queryByRole("alert")).not.toBeNull();
    expect(submit).not.toHaveBeenCalled();
  });

  it("submits a valid form and shows the thank-you message on success", async () => {
    const submit = vi.fn().mockResolvedValue({ status: "ok" });
    renderForm(submit);

    await fillValidHomeForm();
    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));

    expect(submit).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/gracias/i)).not.toBeNull();
    expect(screen.getByText(/nos comunicaremos con vos/i)).not.toBeNull();
    // The form (its submit button) is gone once submitted.
    expect(screen.queryByRole("button", { name: /enviar/i })).toBeNull();
  });

  it("shows an error with a mailto fallback when the send fails", async () => {
    const submit = vi.fn().mockResolvedValue({ status: "error" });
    renderForm(submit);

    await fillValidHomeForm();
    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));

    expect(screen.queryByRole("alert")).not.toBeNull();
    const fallback = screen.getByRole("link", { name: /correo electrónico/i });
    expect(fallback.getAttribute("href")).toMatch(/^mailto:luzrojacontenidos@gmail\.com\?/);
    // Form is still there so the user can retry.
    expect(screen.queryByRole("button", { name: /enviar/i })).not.toBeNull();
  });

  it("re-shows the error summary when the server reports the submission invalid", async () => {
    const submit = vi
      .fn()
      .mockResolvedValue({ status: "invalid", errors: { email: "Ingresá un email válido." } });
    renderForm(submit);

    await fillValidHomeForm();
    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));

    expect(submit).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/ingresá un email válido/i)).not.toBeNull();
  });
});
