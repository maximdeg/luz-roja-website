import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./tienda.css";
import { getCatalogRepository } from "./repositories";
import { formatARS } from "./precio";
import { portadaPublicUrl } from "./storage";
import type { Producto } from "./producto";
import { tiendaAbierta } from "./tienda-abierta";
import { TiendaPreparate } from "./preparate";

// Catalog changes whenever an admin publishes, so render per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kiosquito — Luz Roja Contenidos",
  description:
    "Recursos y contenidos de Luz Roja para que tu marca deje huella. Algunos son pagos, otros van de regalo."
};

export default async function TiendaPage() {
  if (!tiendaAbierta()) return <TiendaPreparate />;

  const productos = await getCatalogRepository().listPublished();

  if (productos.length === 0) {
    return <TiendaProximamente />;
  }

  return (
    <main className="lr-tienda lr-tienda--catalogo" aria-label="Tienda">
      <div className="lr-tienda-bg" aria-hidden>
        <Image src="/images/5.png" alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
      </div>
      <div className="lr-tienda-overlay" aria-hidden />

      <section className="lr-tienda-catalogo">
        <header className="lr-tienda-head">
          {/* <p className="lr-tienda-kicker">KIOSQUITO</p> */}
          <h1 className="lr-tienda-title">El Kiosquito de Luz Roja Contenidos</h1>
          <p className="lr-tienda-subtitle">
            Pasá, chusmeá y llevate lo que necesites.
          </p>
        </header>

        <ul className="lr-tienda-grid">
          {productos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </ul>

        <div className="lr-tienda-actions">
          <Link className="lr-tienda-home" href="/">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}

function ProductoCard({ producto }: { producto: Producto }) {
  const gratis = producto.esGratis || producto.precioCentavos === null;
  const portada = portadaPublicUrl(producto.imagenPortada);

  return (
    <li className="lr-card">
      <Link className="lr-card-link" href={`/tienda/${producto.slug}`}>
        <div className="lr-card-media">
          {portada ? (
            <Image
              src={portada}
              alt={producto.titulo}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 320px"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="lr-card-media-fallback" aria-hidden />
          )}
          <span className={`lr-card-badge${gratis ? " is-gratis" : ""}`}>
            {gratis ? "Gratis" : formatARS(producto.precioCentavos as number)}
          </span>
        </div>

        <div className="lr-card-body">
          <h2 className="lr-card-title">{producto.titulo}</h2>
          <p className="lr-card-desc">{producto.descripcion}</p>
          <span className="lr-card-cta">{gratis ? "Descargar" : "Comprar"}</span>
        </div>
      </Link>
    </li>
  );
}

function TiendaProximamente() {
  return (
    <main className="lr-tienda" aria-label="Kiosquito">
      <div className="lr-tienda-bg" aria-hidden>
        <Image src="/images/5.png" alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
      </div>

      <div className="lr-tienda-overlay" aria-hidden />

      <section className="lr-tienda-card" aria-label="Próximamente">
        <p className="lr-tienda-kicker">KIOSQUITO</p>
        <h1 className="lr-tienda-title">PRÓXIMAMENTE</h1>
        <p className="lr-tienda-subtitle">
          También estamos preparando cositas gratis para que tu marca deje huella.
        </p>

        <div className="lr-tienda-actions">
          <Link className="lr-tienda-home" href="/">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
