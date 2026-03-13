import Link from "next/link";
import Image from "next/image";
import "./footer.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="lr-footer">
      <div className="lr-footer-inner">
        <div className="lr-footer-primary">
          <p className="lr-footer-brand">
            <Image
              src="/logos/Circle Logo - White.png"
              alt="Luz Roja Contenidos"
              width={80}
              height={80}
            />
          </p>
          <p className="lr-footer-copy">
            &copy; {year} Luz Roja Contenidos. Todos los derechos reservados.
          </p>
        </div>
        <nav className="lr-footer-nav" aria-label="Enlaces legales">
          <Link href="/terminos-y-condiciones">Términos y Condiciones</Link>
          <Link href="/politicas-de-privacidad">Políticas de Privacidad</Link>
        </nav>
      </div>
    </footer>
  );
}

