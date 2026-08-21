"use client";

import { useCallback, useId } from "react";
import { useCarouselScroll } from "./use-carousel-scroll";

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
  const total = items.length;
  const liveId = useId();
  // One testimonial needs no navigation; zero would make the wrap-around
  // arithmetic below divide by zero.
  const isNavigable = total > 1;
  const { viewportRef, activeIndex, goTo } = useCarouselScroll(total);

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + total) % total);
  }, [goTo, activeIndex, total]);

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % total);
  }, [goTo, activeIndex, total]);

  if (total === 0) return null;

  return (
    <div className="lr-testimonial-inner">
      <p className="lr-testimonial-kicker">Se dice de nosotras</p>

      <div
        className="lr-testimonial-carousel"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Testimonios de clientes"
      >
        {isNavigable && (
          <button
            type="button"
            className="lr-testimonial-nav lr-testimonial-nav--prev"
            onClick={goPrev}
            aria-label="Ver testimonio anterior"
          >
            <ChevronLeftIcon />
          </button>
        )}

        <div className="lr-testimonial-viewport" ref={viewportRef}>
          <div className="lr-testimonial-track">
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

        {isNavigable && (
          <button
            type="button"
            className="lr-testimonial-nav lr-testimonial-nav--next"
            onClick={goNext}
            aria-label="Ver testimonio siguiente"
          >
            <ChevronRightIcon />
          </button>
        )}
      </div>

      {isNavigable && (
        <div className="lr-testimonial-dots">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`lr-testimonial-dot${
                index === activeIndex ? " is-active" : ""
              }`}
              onClick={() => goTo(index)}
              aria-label={`Ver testimonio ${index + 1} de ${total}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
      )}

      {isNavigable && (
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Testimonio {activeIndex + 1} de {total}
        </p>
      )}
    </div>
  );
}
