"use client";

import { useCallback, useId, useState } from "react";

/** Display shape only — the caller decides where testimonials come from. */
export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
}

function ChevronLeftIcon() {
  return (
    <svg
      className="lr-testimonial-chevron-svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M15 6L9 12L15 18"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="lr-testimonial-chevron-svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TestimonialCarousel({ items }: { items: TestimonialItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = items.length;
  const liveId = useId();

  const goPrev = useCallback(() => {
    setActiveIndex((index) => (index - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setActiveIndex((index) => (index + 1) % total);
  }, [total]);

  return (
    <div className="lr-testimonial-inner">
      <p className="lr-testimonial-kicker">Lo que dicen quienes confían en nosotras</p>

      <div
        className="lr-testimonial-carousel"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Testimonios de clientes"
      >
        <button
          type="button"
          className="lr-testimonial-nav lr-testimonial-nav--prev"
          onClick={goPrev}
          aria-label="Ver testimonio anterior"
        >
          <ChevronLeftIcon />
        </button>

        <div className="lr-testimonial-viewport">
          <div
            className="lr-testimonial-track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {items.map((item, index) => (
              <article
                key={index}
                className="lr-testimonial-slide"
                aria-hidden={index !== activeIndex}
                aria-labelledby={`${liveId}-heading-${index}`}
                role="group"
                aria-roledescription="diapositiva"
              >
                <h3 id={`${liveId}-heading-${index}`} className="sr-only">
                  Testimonio {index + 1} de {total}
                </h3>
                <blockquote className="lr-testimonial-quote">
                  <p>{item.quote}</p>
                </blockquote>
                <footer className="lr-testimonial-footer">
                  <cite className="lr-testimonial-author">{item.author}</cite>
                  <span className="lr-testimonial-role">{item.role}</span>
                </footer>
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="lr-testimonial-nav lr-testimonial-nav--next"
          onClick={goNext}
          aria-label="Ver testimonio siguiente"
        >
          <ChevronRightIcon />
        </button>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Testimonio {activeIndex + 1} de {total}
      </p>
    </div>
  );
}
