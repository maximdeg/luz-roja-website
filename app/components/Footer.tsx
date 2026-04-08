import Link from "next/link";
import Image from "next/image";
import "./footer.css";

function InstagramIcon() {
  return (
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
  );
}

function WhatsAppIcon() {
  return (
    <svg
      className="lr-footer-social-icon"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.646.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
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
        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
        <div className="lr-footer-aside">
          <div className="lr-footer-aside-stack">
            <nav className="lr-footer-nav" aria-label="Enlaces legales">
              <Link href="/terminos-y-condiciones">Términos y Condiciones</Link>
              <Link href="/politicas-de-privacidad">Políticas de Privacidad</Link>
            </nav>
            <div className="lr-footer-socials" aria-label="Redes y contacto">
              <Link
                className="lr-footer-social-link"
                href="https://www.instagram.com/luzrojacontenidos"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram de Luz Roja Contenidos"
              >
                <InstagramIcon />
              </Link>
              <Link
                className="lr-footer-social-link"
                href="https://wa.me/5493426395784"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp de Luz Roja Contenidos"
              >
                <WhatsAppIcon />
              </Link>
              <Link
                className="lr-footer-social-link"
                href="mailto:luzrojacontenidos@gmail.com"
                aria-label="Enviar email a Luz Roja Contenidos"
              >
                <EmailIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
