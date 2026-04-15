"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import "./header.css";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const prefersReducedMotion =
    typeof window === "undefined"
      ? true
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
            onClick={(event) => {
              event.preventDefault();
              setIsMenuOpen(false);
              document
                .querySelector("#servicios")
                ?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
            }}
          >
            Servicios
          </Link>
          <Link href="/tienda">Tienda</Link>
          <Link
            href="/#nosotras"
            onClick={(event) => {
              event.preventDefault();
              setIsMenuOpen(false);
              document
                .querySelector("#nosotras")
                ?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
            }}
          >
            Nosotras
          </Link>
          <Link
            href="/#contacto"
            onClick={(event) => {
              event.preventDefault();
              setIsMenuOpen(false);
              document
                .querySelector("#contacto")
                ?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
            }}
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

