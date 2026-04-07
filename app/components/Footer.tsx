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
            <Link
              className="lr-footer-social"
              href="https://www.instagram.com/luzrojacontenidos"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram de Luz Roja Contenidos"
            >
              <svg
                className="lr-footer-social-icon"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M16.5 7.5h.01M7.5 2.5h9A5 5 0 0 1 21.5 7.5v9a5 5 0 0 1-5 5h-9a5 5 0 0 1-5-5v-9a5 5 0 0 1 5-5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
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

