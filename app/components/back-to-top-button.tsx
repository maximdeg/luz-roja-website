"use client";

import { useEffect, useMemo, useState } from "react";

function ArrowUpIcon() {
  return (
    <svg
      className="lr-back-to-top-icon"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 5L12 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 11L12 5L18 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    function onScroll() {
      setIsVisible(window.scrollY > 280);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      className={`lr-back-to-top ${isVisible ? "lr-back-to-top--visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Volver arriba"
    >
      <ArrowUpIcon />
      <span className="sr-only">Volver arriba</span>
    </button>
  );
}

