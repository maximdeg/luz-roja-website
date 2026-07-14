import type { Metadata } from "next";
import Link from "next/link";
import "../tienda.css";
import { confirmarPago } from "../confirmar-pago";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gracias — Luz Roja Contenidos",
  robots: { index: false }
};

type SearchParams = {
  searchParams: Promise<{
    estado?: string;
    payment_id?: string;
    status?: string;
  }>;
};

export default async function GraciasPage({ searchParams }: SearchParams) {
  const sp = await searchParams;
  const paymentId = sp.payment_id;

  // A back_url is never proof of payment — confirm by re-fetching from MP.
  const result = paymentId
    ? await confirmarPago(paymentId)
    : ({ estado: sp.estado === "failure" ? "rechazado" : "pendiente" } as const);

  return (
    <main className="lr-tienda lr-tienda--detalle" aria-label="Gracias">
      <div className="lr-tienda-overlay" aria-hidden />
      <section className="lr-tienda-card">
        <p className="lr-tienda-kicker">TIENDA</p>
        {renderEstado(result)}
        <div className="lr-tienda-actions">
          <Link className="lr-tienda-home" href="/tienda">
            Volver a la tienda
          </Link>
        </div>
      </section>
    </main>
  );
}

function renderEstado(result: Awaited<ReturnType<typeof confirmarPago>>) {
  switch (result.estado) {
    case "entregado":
      return (
        <>
          <h1 className="lr-tienda-title">¡Gracias por tu compra!</h1>
          <p className="lr-tienda-subtitle">
            Tu pago de <strong>{result.producto.titulo}</strong> está confirmado. Descargá tu
            archivo con el botón de abajo — el enlace es personal y vence en unos minutos, así
            que guardalo cuando lo abras.
          </p>
          <p className="lr-detalle-cta-wrap">
            <a className="lr-detalle-cta" href={result.downloadUrl}>
              Descargar archivo
            </a>
          </p>
        </>
      );
    case "pendiente":
      return (
        <>
          <h1 className="lr-tienda-title">Tu pago está en proceso</h1>
          <p className="lr-tienda-subtitle">
            Cuando Mercado Pago lo apruebe vas a poder descargar tu archivo. Podés volver a
            esta página en un rato.
          </p>
        </>
      );
    case "rechazado":
      return (
        <>
          <h1 className="lr-tienda-title">El pago no se completó</h1>
          <p className="lr-tienda-subtitle">
            No se realizó ningún cobro. Podés intentar de nuevo desde la página del producto.
          </p>
        </>
      );
    default:
      return (
        <>
          <h1 className="lr-tienda-title">Algo salió distinto</h1>
          <p className="lr-tienda-subtitle">
            No pudimos confirmar la compra automáticamente. Si el cobro se hizo, escribinos y
            lo resolvemos enseguida.
          </p>
        </>
      );
  }
}
