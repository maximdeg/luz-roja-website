"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import "./header.css";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const prefersReducedMotion =
    typeof window === "undefined"
      ? true
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * Section links smooth-scroll only when already on the home page. Anywhere
   * else the section isn't in the DOM, so the default navigation to /#seccion
   * must run and land the visitor on the right home section.
   */
  function handleSectionClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    selector: string
  ) {
    setIsMenuOpen(false);
    if (pathname !== "/") return;
    event.preventDefault();
    document
      .querySelector(selector)
      ?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  useEffect(() => {
    function handleScroll() {
      const scrolled = window.scrollY > 400;
      setIsScrolled(scrolled);
      if (!scrolled) {
        setIsMenuOpen(false);
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  return (
    <header className={isScrolled ? "lr-header lr-header--scrolled" : "lr-header"}>
      <div className="lr-header-inner">
        <div className="lr-header-bar">
          <div className="lr-header-logo">
            <Logo />
          </div>
          <button
            type="button"
            className={
              isMenuOpen
                ? "lr-header-menu-toggle lr-header-menu-toggle--open"
                : "lr-header-menu-toggle"
            }
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
        <nav
          className={isMenuOpen ? "lr-nav lr-nav--open" : "lr-nav"}
          aria-label="Navegación principal"
        >
          <Link
            href="/"
            onClick={() => {
              setIsMenuOpen(false);
              window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
            }}
          >
            Home
          </Link>
          <Link
            href="/#servicios"
            onClick={(event) => handleSectionClick(event, "#servicios")}
          >
            Servicios
          </Link>
          <Link href="/tienda">Kiosquito</Link>
          <Link
            href="/#nosotras"
            onClick={(event) => handleSectionClick(event, "#nosotras")}
          >
            Nosotras
          </Link>
          <Link
            href="/#contacto"
            onClick={(event) => handleSectionClick(event, "#contacto")}
          >
            Contacto
          </Link>
        </nav>
        {isMenuOpen ? (
          <button
            type="button"
            className="lr-nav-backdrop"
            aria-label="Cerrar menú"
            onClick={() => setIsMenuOpen(false)}
          />
        ) : null}
      </div>
    </header>
  );
}

