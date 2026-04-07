"use client";

import { useCallback, useId, useState } from "react";

interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      "Nos acompañaron en todo el proceso: desde ordenar ideas hasta el último Reel. La comunicación de nuestra marca por fin se siente nuestra y, al mismo tiempo, profesional.",
    author: "Equipo fundador",
    role: "Marca de bienestar"
  },
  {
    quote:
      "Por primera vez tenemos un calendario que sí usamos. El tono de voz quedó tan claro que hasta el equipo de ventas lo adoptó al toque.",
    author: "Directora de marketing",
    role: "Estudio de arquitectura"
  },
  {
    quote:
      "Pasamos de publicar «por publicar» a contar una historia coherente. Las métricas no fueron el único cambio: la gente nos escribe distinto.",
    author: "Fundadora",
    role: "Tienda de diseño local"
  },
  {
    quote:
      "Nos exigían rapidez y calidad al mismo tiempo. Ellas llevaron el ritmo, cuidaron el detalle y nos ahorraron reuniones infinitas.",
    author: "Responsable de comunicación",
    role: "ONG cultural"
  },
  {
    quote:
      "Lo que más valoramos es que entendieron nuestra marca en serio. Cada pieza se siente auténtica, no genérica.",
    author: "Cofundadora",
    role: "Marca de cosmética"
  }
];

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

export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = TESTIMONIALS.length;
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
            {TESTIMONIALS.map((item, index) => (
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
