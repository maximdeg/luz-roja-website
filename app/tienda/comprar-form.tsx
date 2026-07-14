"use client";

/**
 * Buy form for a paid product. Calls the `iniciarCompra` server action to open a
 * pending pedido + Mercado Pago preference, then navigates the browser to MP's
 * hosted checkout with `window.location.href`. Doing the external navigation on
 * the client (rather than `redirect()`-ing to it from the action) is what makes
 * the redirect to Mercado Pago actually happen.
 */

import { useState } from "react";
import { iniciarCompra } from "./checkout";

export function ComprarForm({ slug, testMode }: { slug: string; testMode: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();

    setPending(true);
    setError(null);
    try {
      const result = await iniciarCompra({ slug, email });
      if (result.initPoint) {
        // Full-page navigation to Mercado Pago; keep the button disabled meanwhile.
        window.location.href = result.initPoint;
        return;
      }
      setError(result.error ?? "No pudimos iniciar el pago. Probá de nuevo.");
    } catch {
      setError("No pudimos iniciar el pago. Probá de nuevo.");
    }
    setPending(false);
  }

  return (
    <form className="lr-detalle-buy" onSubmit={handleSubmit}>
      <label className="lr-detalle-buy-field">
        <span>Tu email (para enviarte la descarga)</span>
        <input
          type="email"
          name="email"
          required
          placeholder="vos@email.com"
          autoComplete="email"
        />
      </label>
      <button className="lr-detalle-cta" type="submit" disabled={pending}>
        {pending ? "Redirigiendo…" : "Comprar"}
      </button>
      {error ? <p className="lr-detalle-nota lr-detalle-error">{error}</p> : null}
      <p className="lr-detalle-nota">
        Pago seguro con Mercado Pago.
        {testMode ? " (Mercado Pago está en modo de prueba.)" : ""}
      </p>
    </form>
  );
}
