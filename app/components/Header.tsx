"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import "./header.css";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // On mobile the off-canvas nav is portalled to <body> so it escapes the
  // header's stacking context / backdrop-filter containing block. Starts false
  // (matches SSR: nav rendered inline) and flips once matchMedia resolves.
  const [isMobile, setIsMobile] = useState(false);
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
    // Only drives the scrolled-state border styling. Menu-open state is
    // deliberately NOT coupled to scroll: the menu must stay open wherever the
    // user opened it, so scrolling never force-closes it.
    function handleScroll() {
      setIsScrolled(window.scrollY > 400);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const nav = (
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
  );

  // The off-canvas panel (nav + backdrop) that only exists in the mobile layout.
  const mobilePanel = (
    <>
      {nav}
      {isMenuOpen ? (
        <button
          type="button"
          className="lr-nav-backdrop"
          aria-label="Cerrar menú"
          onClick={() => setIsMenuOpen(false)}
        />
      ) : null}
    </>
  );

  const headerClassName = [
    "lr-header",
    isScrolled && "lr-header--scrolled",
    // While the menu is open we lock body scroll (overflow: hidden), which would
    // otherwise un-stick the sticky header and scroll it out of view when opened
    // from lower down the page. This modifier pins the header to the viewport so
    // it (and the close button) stays put regardless of scroll position.
    isMenuOpen && "lr-header--menu-open"
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClassName}>
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
        {/* Desktop renders the nav inline in the header bar. On mobile it is
            portalled to <body> so the fixed off-canvas panel escapes the
            header's stacking context and backdrop-filter containing block —
            otherwise it paints over the toggle and, on iOS, is trapped inside
            the header bar. Only one of the two is ever in the DOM, so there is
            no duplicate navigation. */}
        {!isMobile && nav}
      </div>
      {isMobile && createPortal(mobilePanel, document.body)}
    </header>
  );
}

