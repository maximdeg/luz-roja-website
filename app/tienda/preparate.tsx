import Link from "next/link";
import "./tienda.css";

/**
 * Launch curtain for the public store (see tienda-abierta). Rendered by every
 * public /tienda surface while TIENDA_ABIERTA is not "true". Pure teaser: no
 * catalog data is fetched or leaked.
 */
export function TiendaPreparate() {
  return (
    <main className="lr-tienda lr-preparate" aria-label="Muy pronto">
      <div className="lr-tienda-overlay" aria-hidden />
      <section className="lr-preparate-content">
        <h1 className="lr-tienda-title lr-preparate-title">PREPARATE</h1>
        <p className="lr-tienda-subtitle lr-preparate-subtitle">
          No estas listo para lo que viene...
        </p>
        <div className="lr-preparate-loader" aria-hidden>
          <span className="lr-preparate-loader-stripes" />
        </div>
        <div className="lr-tienda-actions">
          <Link className="lr-tienda-home" href="/">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
