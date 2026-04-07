import Image from "next/image";
import Link from "next/link";
import "./tienda.css";

export default function TiendaPage() {
  return (
    <main className="lr-tienda" aria-label="Tienda">
      <div className="lr-tienda-bg" aria-hidden>
        <Image
          src="/images/5.png"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="lr-tienda-overlay" aria-hidden />

      <section className="lr-tienda-card" aria-label="Próximamente">
        <p className="lr-tienda-kicker">TIENDA</p>
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
