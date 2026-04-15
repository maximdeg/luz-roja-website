import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties } from "react";
import antonelaPortrait1 from "../public/images/Antonela4.jpg.jpeg";
import antonelaPortrait2 from "../public/images/Antonela1.jpeg";
import antonelaPortrait3 from "../public/images/Antonela3.jpg.jpeg";
import antonelaPortrait4 from "../public/images/Antonela2.jpg.jpeg";
import mailen1 from "../public/images/MAILEN-1.jpeg";
import mailen2 from "../public/images/MAILEN-2.jpeg";
import mailen3 from "../public/images/MAILEN-3.jpeg";
import mailen4 from "../public/images/MAILEN-4.jpeg";
import {
  ContactOrigenSelect,
  ContactServicioSelect
} from "./components/contact-conditional-selects";
import { TestimonialCarousel } from "./components/testimonial-carousel";
import "./home.css";
import "./secondary.css";

const ANTONELA_PORTRAITS: StaticImageData[] = [
  antonelaPortrait1,
  antonelaPortrait2,
  antonelaPortrait3,
  antonelaPortrait4
];

const MAILEN_PORTRAITS: StaticImageData[] = [
  mailen3,
  mailen2,
  mailen1,
  mailen4
];

const HERO_TICKER_PHRASE = "¿Qué hacemos?";
const HERO_TICKER_REPEAT = 14;

function HeroTickerBar() {
  function renderTickerGroup(groupId: string) {
    return Array.from({ length: HERO_TICKER_REPEAT }, (_, index) => (
      <Fragment key={`${groupId}-${index}`}>
        <span className="lr-hero-ticker-phrase">{HERO_TICKER_PHRASE}</span>
        <span className="lr-hero-ticker-dot" aria-hidden />
      </Fragment>
    ));
  }

  return (
    <div className="lr-hero-ticker">
      <p className="sr-only">{HERO_TICKER_PHRASE}</p>
      <div className="lr-hero-ticker-viewport" aria-hidden>
        <div className="lr-hero-ticker-track">
          <div className="lr-hero-ticker-group">{renderTickerGroup("a")}</div>
          <div className="lr-hero-ticker-group">{renderTickerGroup("b")}</div>
        </div>
      </div>
    </div>
  );
}

function HeroCharlemosIcon() {
  return (
    <svg
      className="lr-hero-charlemos-icon"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M15.5 3.5c2.2 1.6 3.6 4.1 3.9 6.9M19 1.5a11.5 11.5 0 0 1 3.5 8M12 5c1.8-.3 3.7.2 5.2 1.3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroSection() {
  return (
    <section className="lr-hero" id="hero">
      <div className="lr-hero-inner">
        <div className="lr-hero-content">
          <h1 className="lr-hero-headline">
            Te ayudamos
            <br />
            a ponerle
            <br />
            orden, onda y
            <br />
            un{" "}
            <span className="lr-hero-headline-emphasis">
              brillo
              <br />
              distinto
            </span>{" "}
            a tu
            <br />
            marca.
          </h1>
          <Link href="/#contacto" className="lr-hero-charlemos">
            <HeroCharlemosIcon />
            <span>Charlemos</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServicesPhoneIcon() {
  return (
    <svg
      className="lr-services-charlemos-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ServicesFlipIcon() {
  return (
    <Image
      src="/icons/rotate.png"
      alt=""
      width={22}
      height={22}
      className="lr-services-flip-icon-image"
    />
  );
}

interface ServiceFlipCardProps {
  variant: "light" | "dark";
  line1: string;
  line2: string;
  backLine1: string;
  backLine2?: string;
  /** Public URL (e.g. `/images/2.png`) for back face background with dark overlay */
  backImageUrl?: string;
}

interface ServiceCardLinesProps {
  line1: string;
  line2: string;
}

function ServiceCardLines(props: ServiceCardLinesProps) {
  return (
    <span className="lr-services-board-card-text">
      <span className="lr-services-board-card-line">{props.line1}</span>
      <span className="lr-services-board-card-line">{props.line2}</span>
    </span>
  );
}

interface ServiceCardBackLinesProps {
  lines: string[];
}

function splitWordsIntoLines(text: string, lineCount: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1 || lineCount <= 1) return [text.trim()].filter(Boolean);

  if (lineCount === 3 && words.length === 4) return [words[0], `${words[1]} ${words[2]}`, words[3]];

  if (lineCount === 3 && words.length === 5)
    return [`${words[0]} ${words[1]}`, `${words[2]} ${words[3]}`, words[4]];

  const totalLength = words.reduce((sum, word) => sum + word.length, 0);
  const target = Math.ceil(totalLength / lineCount);

  const lines: string[] = [];
  let current: string[] = [];
  let currentLen = 0;

  for (const word of words) {
    const nextLen = currentLen + word.length + (current.length > 0 ? 1 : 0);
    const shouldBreak =
      lines.length < lineCount - 1 && current.length > 0 && nextLen > target;

    if (shouldBreak) {
      lines.push(current.join(" "));
      current = [word];
      currentLen = word.length;
      continue;
    }

    current.push(word);
    currentLen = nextLen;
  }

  if (current.length > 0) lines.push(current.join(" "));
  return lines.filter(Boolean);
}

function getBackLines(line1: string, line2?: string) {
  const merged = [line1, line2].filter(Boolean).join(" ").trim();
  if (!merged) return [];

  const mergedWordCount = merged.split(/\s+/).filter(Boolean).length;
  const shouldUseThreeLines = merged.length >= 40 || (mergedWordCount >= 4 && merged.length >= 28);
  if (shouldUseThreeLines) return splitWordsIntoLines(merged, 3);

  return [line1, line2].filter(Boolean) as string[];
}

function ServiceCardBackLines(props: ServiceCardBackLinesProps) {
  const lines = props.lines.filter(Boolean);
  const hasSingleLine = lines.length === 1;

  return (
    <span className="lr-services-board-card-text lr-services-board-card-text--back">
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className={[
            "lr-services-board-card-line",
            hasSingleLine ? "lr-services-board-card-line--back-single" : ""
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {line}
        </span>
      ))}
    </span>
  );
}

function ServiceFlipCard({
  variant,
  line1,
  line2,
  backLine1,
  backLine2,
  backImageUrl
}: ServiceFlipCardProps) {
  const backVariant = variant === "light" ? "dark" : "light";
  const title = `${line1} ${line2}`.trim();
  const detail = [backLine1, backLine2].filter(Boolean).join(" ");
  const ariaLabel = `${title}. ${detail}`;
  const backLines = getBackLines(backLine1, backLine2);

  const backClassName = [
    "lr-services-board-card",
    "lr-services-board-card-face",
    "lr-services-board-card-face--back",
    `lr-services-board-card--${backVariant}`,
    backImageUrl ? "lr-services-board-card-back--photo" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const backStyle =
    backImageUrl !== undefined
      ? ({
          "--lr-card-back-image": `url("${backImageUrl}")`
        } as CSSProperties)
      : undefined;

  return (
    <div
      className="lr-services-flip"
      data-variant={variant}
      tabIndex={0}
      role="group"
      aria-label={ariaLabel}
    >
      <span className="lr-services-flip-icon" aria-hidden>
        <ServicesFlipIcon />
      </span>
      <div className="lr-services-flip-inner">
        <div
          className={`lr-services-board-card lr-services-board-card-face lr-services-board-card-face--front lr-services-board-card--${variant}`}
        >
          <ServiceCardLines line1={line1} line2={line2} />
        </div>
        <div className={backClassName} style={backStyle} aria-hidden>
          <ServiceCardBackLines lines={backLines} />
        </div>
      </div>
    </div>
  );
}

/**
 * Desktop 4×2 service grid (below intro + plan): orthogonal neighbors always differ
 * (checkerboard). “El plan” (light) sits above “Tu marca” (dark) in col 4. Mobile list:
 * one consecutive light pair (plan → Auditoría).
 */
const SERVICES_BOARD_ROWS: ServiceFlipCardProps[] = [
  {
    variant: "light",
    line1: "Auditoria",
    line2: "digital",
    backLine1: "Diagnóstico y optimización",
    backLine2: "de IG profesional",
    backImageUrl: "/images/AUDITORIA DIGITAL (3).png"
  },
  {
    variant: "dark",
    line1: "¿Me haces",
    line2: "un videito?",
    backLine1: "Producción integral de Reels",
    backLine2: "con narrativa visual",
    backImageUrl: "/images/ME HACES UN VIDEITO.png"
  },
  {
    variant: "light",
    line1: "Del qué",
    line2: "al cómo",
    backLine1: "Asesorías en comunicación",
    backLine2: "creativa y digital",
    backImageUrl: "/images/DEL QUE AL COMO (2).png"
  },
  {
    variant: "dark",
    line1: "Tu marca",
    line2: "tu huella",
    backLine1: "Fotografía de retrato",
    backImageUrl: "/images/TU MARCA, TU HUELLA.png"
  },
  {
    variant: "dark",
    line1: "Headshot",
    line2: "express",
    backLine1: "Fotografía de retrato",
    backImageUrl: "/images/HEADSHOT EXPRESS.png"
  },
  {
    variant: "light",
    line1: "Por fin todos",
    line2: "juntos",
    backLine1: "Fotografía de retrato",
    backLine2: "corporativo",
    backImageUrl: "/images/POR FIN TODOS JUNTOS.png"
  },
  {
    variant: "dark",
    line1: "Cada palabra",
    line2: "cuenta",
    backLine1: "Redacción SEO",
    backLine2: "para mejorar tu posicionamiento",
    backImageUrl: "/images/CADA PALABRA CUENTA.png"
  },
  {
    variant: "light",
    line1: "Te armamos",
    line2: "la vidriera",
    backLine1: "Fotografía de producto",
    backImageUrl: "/images/TE ARMAMOS LA VIDRIERA.png"
  }
];

function ServicesSection() {
  return (
    <section className="lr-services" id="servicios" aria-labelledby="servicios-heading">
      <h2 id="servicios-heading" className="sr-only">
        Servicios
      </h2>
      <div className="lr-services-board">
        <div className="lr-services-board-intro">
          <div className="lr-services-board-intro-body">
            <p className="lr-services-board-intro-para">
              Ofrecemos distintos servicios que son independientes entre sí, pero que al
              unirlos forman un{" "}
              <em className="lr-services-board-intro-em">recorrido estratégico</em>{" "}
              diseñado especialmente para hacer que la comunicación de tu marca deje
              huella.
            </p>
          </div>
          <Link href="/#contacto" className="lr-services-charlemos">
            <ServicesPhoneIcon />
            Charlemos
          </Link>
        </div>
        <ServiceFlipCard
          variant="light"
          line1="El plan"
          line2="maestro"
          backLine1="Calendario de Contenidos"
          backLine2="Personalizado"
          backImageUrl="/images/EL PLAN MAESTRO (3).png"
        />
        {SERVICES_BOARD_ROWS.map((service) => (
          <ServiceFlipCard
            key={`${service.line1}-${service.line2}`}
            variant={service.variant}
            line1={service.line1}
            line2={service.line2}
            backLine1={service.backLine1}
            backLine2={service.backLine2}
            backImageUrl={service.backImageUrl}
          />
        ))}
      </div>
    </section>
  );
}

function NosotrasGallery(props: {
  label: string;
  images: StaticImageData[];
  name: string;
}) {
  return (
    <div
      className="lr-nosotras-gallery"
      role="list"
      aria-label={props.label}
    >
      {props.images.map((src, index) => (
        <div
          key={`${props.name}-${index}`}
          className="lr-nosotras-gallery-slot"
          role="listitem"
        >
          <Image
            src={src}
            alt={`${props.name}, retrato ${index + 1} de 4`}
            fill
            sizes="(max-width: 520px) 50vw, 25vw"
            className="lr-nosotras-gallery-img"
            style={
              props.name === "Antonela" && index === 2
                ? { objectPosition: "center 30%" }
                : undefined
            }
          />
        </div>
      ))}
    </div>
  );
}

function NosotrasSection() {
  return (
    <section className="lr-nosotras" id="nosotras">
      <div className="lr-nosotras-inner">
        <h2 className="lr-nosotras-heading">Nosotras.</h2>
        <p className="lr-nosotras-lead">
          Cada una trae una historia propia. Una, fotógrafa, actriz y diseñadora, aporta la
          sensibilidad visual y la capacidad de capturar emociones; la otra, docente,
          comunicadora, redactora y especialista en audio, brinda estructura, narrativa y
          resonancia.
        </p>
      </div>
      <div className="lr-nosotras-divider">
        <span className="lr-nosotras-divider-line" aria-hidden />
        <h3 className="lr-nosotras-divider-name">Antonela</h3>
      </div>
      <NosotrasGallery
        name="Antonela"
        label="Retratos de Antonela"
        images={ANTONELA_PORTRAITS}
      />
      <div className="lr-nosotras-divider lr-nosotras-divider--name-start">
        <h3 className="lr-nosotras-divider-name">Mailen</h3>
        <span className="lr-nosotras-divider-line" aria-hidden />
      </div>
      <NosotrasGallery
        name="Mailen"
        label="Retratos de Mailen"
        images={MAILEN_PORTRAITS}
      />
    </section>
  );
}

function TestimonialSection() {
  return (
    <section
      className="lr-testimonial"
      id="testimonio"
      aria-labelledby="testimonio-heading"
    >
      <h2 id="testimonio-heading" className="sr-only">
        Testimonios
      </h2>
      <TestimonialCarousel />
    </section>
  );
}

function ContactSection() {
  return (
    <section className="lr-contact" id="contacto">
      <div className="lr-contact-inner">
        <div className="lr-contact-left">
          <div className="lr-page-header">
            <p className="lr-page-kicker">Trabajemos juntas</p>
            <h2 className="lr-page-title">¿Querés saber más?</h2>
            <p className="lr-page-subtitle">
              Queremos trabajar con vos y encender la luz roja para tu marca. Escribinos y
              te respondemos con toda la información para dar el siguiente paso.
            </p>
            <p className="lr-page-subtitle">
              Para cualquier otra consulta también podés escribirnos directo a{" "}
              <strong>luzrojacontenidos@gmail.com</strong>.
            </p>
          </div>
        </div>

        <section className="lr-form-section lr-contact-right" aria-label="Formulario de contacto">
          <form className="lr-form">
          <div className="lr-form-grid">
            <div className="lr-form-group">
              <label htmlFor="contacto-nombre-home">Nombre*</label>
              <input
                id="contacto-nombre-home"
                name="nombre"
                type="text"
                required
              />
            </div>
            <div className="lr-form-group">
              <label htmlFor="contacto-apellido-home">Apellido*</label>
              <input
                id="contacto-apellido-home"
                name="apellido"
                type="text"
                required
              />
            </div>
          </div>

          <div className="lr-form-grid">
            <div className="lr-form-group">
              <label htmlFor="contacto-email-home">Email*</label>
              <input
                id="contacto-email-home"
                name="email"
                type="email"
                required
              />
            </div>
            <div className="lr-form-group">
              <label htmlFor="contacto-telefono-home">Teléfono</label>
              <input
                id="contacto-telefono-home"
                name="telefono"
                type="tel"
                placeholder="+54 ..."
              />
            </div>
          </div>

          <ContactServicioSelect form="home" />

          <div className="lr-form-group">
            <label htmlFor="contacto-web-home">
              ¿Cuál es la web o Instagram de tu marca?*
            </label>
            <input
              id="contacto-web-home"
              name="web"
              type="text"
              required
              placeholder="URL o @usuario"
            />
          </div>

          <ContactOrigenSelect form="home" />

          <p className="lr-page-subtitle">
            Al enviar este formulario aceptás que almacenemos tus datos para
            gestionar tu consulta. Podés escribirnos en cualquier momento si
            querés actualizar o borrar tu información.
          </p>

          <button type="submit" className="lr-primary-button">
            Enviar formulario
          </button>
          </form>
        </section>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="lr-home">
      <HeroSection />
      <HeroTickerBar />
      <ServicesSection />
      <NosotrasSection />
      <TestimonialSection />
      <ContactSection />
    </div>
  );
}

