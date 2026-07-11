import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../tienda.css";
import { getCatalogRepository } from "../repositories";
import { formatARS } from "../precio";
import { portadaPublicUrl } from "../storage";
import { isGratis } from "../free-download";
import { iniciarCompra } from "../checkout";
import { isTestMode } from "../mp-client";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const producto = await getCatalogRepository().getBySlug(slug);
  if (!producto || !producto.publicado) {
    return { title: "Producto no encontrado — Luz Roja Contenidos" };
  }
  return {
    title: `${producto.titulo} — Luz Roja Contenidos`,
    description: producto.descripcion.slice(0, 160)
  };
}

export default async function ProductoDetallePage({ params }: Params) {
  const { slug } = await params;
  const producto = await getCatalogRepository().getBySlug(slug);
  if (!producto || !producto.publicado) notFound();

  const gratis = isGratis(producto);
  const portada = portadaPublicUrl(producto.imagenPortada);

  return (
    <main className="lr-tienda lr-tienda--detalle" aria-label={producto.titulo}>
      <div className="lr-tienda-bg" aria-hidden>
        <Image src="/images/5.png" alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
      </div>
      <div className="lr-tienda-overlay" aria-hidden />

      <article className="lr-detalle">
        <div className="lr-detalle-media">
          {portada ? (
            <Image
              src={portada}
              alt={producto.titulo}
              fill
              sizes="(max-width: 860px) 100vw, 440px"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="lr-card-media-fallback" aria-hidden />
          )}
          <span className={`lr-card-badge${gratis ? " is-gratis" : ""}`}>
            {gratis ? "Gratis" : formatARS(producto.precioCentavos as number)}
          </span>
        </div>

        <div className="lr-detalle-info">
          <p className="lr-tienda-kicker">TIENDA</p>
          <h1 className="lr-detalle-title">{producto.titulo}</h1>
          <p className="lr-detalle-precio">
            {gratis ? "Descarga gratuita" : formatARS(producto.precioCentavos as number)}
          </p>
          <p className="lr-detalle-desc">{producto.descripcion}</p>

          <div className="lr-detalle-cta-wrap">
            {gratis ? (
              producto.archivo ? (
                <a className="lr-detalle-cta" href={`/tienda/${producto.slug}/descargar`}>
                  Descargar gratis
                </a>
              ) : (
                <p className="lr-detalle-nota">La descarga estará disponible muy pronto.</p>
              )
            ) : producto.archivo ? (
              <form className="lr-detalle-buy" action={iniciarCompra}>
                <input type="hidden" name="slug" value={producto.slug} />
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
                <button className="lr-detalle-cta" type="submit">
                  Comprar
                </button>
                <p className="lr-detalle-nota">
                  Pago seguro con Mercado Pago.
                  {isTestMode() ? " (Mercado Pago está en modo de prueba.)" : ""}
                </p>
              </form>
            ) : (
              <p className="lr-detalle-nota">
                Este producto todavía no está disponible para la compra.
              </p>
            )}
          </div>

          <Link href="/tienda" className="lr-detalle-volver">
            ← Volver a la tienda
          </Link>
        </div>
      </article>
    </main>
  );
}
