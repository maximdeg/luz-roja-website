import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import "../tienda.css";
import { getCatalogRepository } from "../repositories";
import { formatARS } from "../precio";
import { portadaPublicUrl } from "../storage";
import { isGratis } from "../free-download";
import { ComprarForm } from "../comprar-form";
import { isTestMode } from "../mp-client";
import { tiendaAbierta } from "../tienda-abierta";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

// generateMetadata and the page body both need the same product. Memoize the
// lookup per request so the two of them share a single Supabase round-trip
// instead of each firing their own.
const loadProducto = cache((slug: string) => getCatalogRepository().getBySlug(slug));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  // Closed store: reveal nothing about the product, not even its title.
  if (!tiendaAbierta()) return { title: "Kiosquito — Luz Roja Contenidos" };

  const { slug } = await params;
  const producto = await loadProducto(slug);
  if (!producto || !producto.publicado) {
    return { title: "Producto no encontrado — Luz Roja Contenidos" };
  }
  return {
    title: `${producto.titulo} — Luz Roja Contenidos`,
    description: producto.descripcion.slice(0, 160)
  };
}

export default async function ProductoDetallePage({ params }: Params) {
  if (!tiendaAbierta()) redirect("/tienda");

  const { slug } = await params;
  const producto = await loadProducto(slug);
  if (!producto || !producto.publicado) notFound();

  const gratis = isGratis(producto);
  const portada = portadaPublicUrl(producto.imagenPortada);

  return (
    <main className="lr-tienda lr-tienda--detalle" aria-label={producto.titulo}>
      <div className="lr-tienda-bg" aria-hidden>
        <Image src="/images/kiosquito2.png" alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
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
          <p className="lr-tienda-kicker">KIOSQUITO</p>
          <h1 className="lr-detalle-title">{producto.titulo}</h1>
          <p className="lr-detalle-precio">
            {gratis ? "Descarga gratuita" : formatARS(producto.precioCentavos as number)}
          </p>
          <p className="lr-detalle-desc">{producto.descripcion}</p>

          <div className="lr-detalle-cta-wrap">
            {gratis ? (
              producto.archivo ? (
                <>
                  <p className="lr-detalle-compartir">
                    Es gratis, pero si te sirve, nos ayuda un montón que lo compartas en
                    redes etiquetando a <strong>@luzrojacontenidos</strong>
                  </p>
                  <a className="lr-detalle-cta" href={`/tienda/${producto.slug}/descargar`}>
                    Descargar gratis
                  </a>
                </>
              ) : (
                <p className="lr-detalle-nota">La descarga estará disponible muy pronto.</p>
              )
            ) : producto.archivo ? (
              <ComprarForm slug={producto.slug} testMode={isTestMode()} />
            ) : (
              <p className="lr-detalle-nota">
                Este producto todavía no está disponible para la compra.
              </p>
            )}
          </div>

          <Link href="/tienda" className="lr-detalle-volver">
            ← Volver al kiosquito
          </Link>
        </div>
      </article>
    </main>
  );
}
