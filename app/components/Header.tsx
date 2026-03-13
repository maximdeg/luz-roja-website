import Link from "next/link";
import { Logo } from "./Logo";
import "./header.css";

export function Header() {
  return (
    <header className="lr-header">
      <div className="lr-header-inner">
        <Logo />
        <nav className="lr-nav" aria-label="Navegación principal">
          <Link href="/">Home</Link>
          <Link href="/cositas-gratis">Cositas gratis</Link>
          <Link href="/contacto">Contacto</Link>
        </nav>
      </div>
    </header>
  );
}

