import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import heroTeamPhoto from "../public/logos/DSC_3934-27.jpg";
import "./home.css";
import "./secondary.css";

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

function HeroSection() {
  return (
    <section className="lr-hero" id="hero">
      <div className="lr-hero-inner">
        <div className="lr-hero-photo">
          <Image
            src={heroTeamPhoto}
            alt="Equipo de Luz Roja"
            fill
            sizes="(min-width: 900px) 50vw, 100vw"
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="lr-hero-content">
          <h1 className="lr-hero-headline">
            Te ayudamos
            <br />
            a ponerle
            <br />
            orden, onda y
            <br />
            un brillo
            <br />
            distinto a tu
            <br />
            marca.
          </h1>
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

interface ServiceFlipCardProps {
  variant: "light" | "dark";
  line1: string;
  line2: string;
  backLine1: string;
  backLine2?: string;
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
  line1: string;
  line2?: string;
}

function ServiceCardBackLines(props: ServiceCardBackLinesProps) {
  return (
    <span className="lr-services-board-card-text lr-services-board-card-text--back">
      {props.line2 ? (
        <>
          <span className="lr-services-board-card-line">{props.line1}</span>
          <span className="lr-services-board-card-line">{props.line2}</span>
        </>
      ) : (
        <span className="lr-services-board-card-line lr-services-board-card-line--back-single">
          {props.line1}
        </span>
      )}
    </span>
  );
}

function ServiceFlipCard({
  variant,
  line1,
  line2,
  backLine1,
  backLine2
}: ServiceFlipCardProps) {
  const backVariant = variant === "light" ? "dark" : "light";
  const title = `${line1} ${line2}`.trim();
  const detail = [backLine1, backLine2].filter(Boolean).join(" ");
  const ariaLabel = `${title}. ${detail}`;

  return (
    <div
      className="lr-services-flip"
      tabIndex={0}
      role="group"
      aria-label={ariaLabel}
    >
      <div className="lr-services-flip-inner">
        <div
          className={`lr-services-board-card lr-services-board-card-face lr-services-board-card-face--front lr-services-board-card--${variant}`}
        >
          <ServiceCardLines line1={line1} line2={line2} />
        </div>
        <div
          className={`lr-services-board-card lr-services-board-card-face lr-services-board-card-face--back lr-services-board-card--${backVariant}`}
          aria-hidden
        >
          <ServiceCardBackLines line1={backLine1} line2={backLine2} />
        </div>
      </div>
    </div>
  );
}

const SERVICES_BOARD_ROWS: ServiceFlipCardProps[] = [
  {
    variant: "light",
    line1: "Auditoria",
    line2: "digital",
    backLine1: "Diagnóstico y optimización",
    backLine2: "de IG profesional"
  },
  {
    variant: "dark",
    line1: "¿Me haces",
    line2: "un videito?",
    backLine1: "Producción integral de Reels",
    backLine2: "con narrativa visual"
  },
  {
    variant: "light",
    line1: "Del qué",
    line2: "al cómo",
    backLine1: "Asesorías en comunicación",
    backLine2: "creativa y digital"
  },
  {
    variant: "dark",
    line1: "Tu marca",
    line2: "tu huella",
    backLine1: "Fotografía de retrato"
  },
  {
    variant: "dark",
    line1: "Headshot",
    line2: "express",
    backLine1: "Fotografía de retrato"
  },
  {
    variant: "light",
    line1: "Por fin todos",
    line2: "juntos",
    backLine1: "Fotografía de retrato",
    backLine2: "corporativo"
  },
  {
    variant: "dark",
    line1: "Cada palabra",
    line2: "cuenta",
    backLine1: "Redacción SEO",
    backLine2: "para mejorar tu posicionamiento"
  },
  {
    variant: "light",
    line1: "Te armamos",
    line2: "la vidriera",
    backLine1: "Fotografía de producto"
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
              Ofrecemos distintos servicios que son independientes entre sí,
            </p>
            <p className="lr-services-board-intro-para">
              pero que al unirlos forman un{" "}
              <em className="lr-services-board-intro-em">recorrido estratégico</em>
            </p>
            <p className="lr-services-board-intro-para">
              diseñado especialmente para hacer que la comunicación de tu marca
            </p>
            <p className="lr-services-board-intro-para">deje huella.</p>
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
        />
        {SERVICES_BOARD_ROWS.map((service) => (
          <ServiceFlipCard
            key={`${service.line1}-${service.line2}`}
            variant={service.variant}
            line1={service.line1}
            line2={service.line2}
            backLine1={service.backLine1}
            backLine2={service.backLine2}
          />
        ))}
      </div>
    </section>
  );
}

function NosotrasSection() {
  return (
    <section className="lr-nosotras" id="nosotras">
      <div className="lr-nosotras-inner">
        <p className="lr-section-kicker">Nosotras</p>
        <h2 className="lr-nosotras-title">
          Somos quienes encienden la luz roja detrás de cada historia.
        </h2>
        <p className="lr-nosotras-body">
          Luz Roja nace de la mirada de dos creadoras que encuentran belleza en lo cotidiano,
          en los silencios y en las pequeñas escenas que construyen una comunidad. Pensamos
          cada proyecto como un set: encendemos la luz, acomodamos el cuadro y dejamos que
          tu voz aparezca con claridad, sin poses forzadas ni disfraces.
        </p>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="lr-contact" id="contacto">
      <div className="lr-page-header">
        <p className="lr-page-kicker">Trabajemos juntas</p>
        <h2 className="lr-page-title">
          Nos inspiran las historias. Contanos todo sobre tu proyecto.
        </h2>
        <p className="lr-page-subtitle">
          Queremos trabajar con vos y encender la luz roja para tu marca.
          Escribinos y te respondemos con toda la información para dar el
          siguiente paso.
        </p>
        <p className="lr-page-subtitle">
          Para cualquier otra consulta también podés escribirnos directo a{" "}
          <strong>hola@luzrojacontenidos.com</strong>.
        </p>
      </div>
      <section className="lr-form-section">
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

          <div className="lr-form-group">
            <label htmlFor="contacto-servicio-home">
              ¿Qué servicio te interesa?*
            </label>
            <select
              id="contacto-servicio-home"
              name="servicio"
              required
              defaultValue=""
            >
              <option value="">Seleccioná una opción</option>
              <option value="branding">Narrativa y storytelling</option>
              <option value="contenido">Contenido visual y audiovisual</option>
              <option value="fotografia">Fotografía</option>
              <option value="web">Contenido y narrativa para web</option>
              <option value="redes">Gestión y estrategia de redes</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="lr-form-group">
            <label htmlFor="contacto-pais-home">
              ¿En qué país te encontrás?*
            </label>
            <input
              id="contacto-pais-home"
              name="pais"
              type="text"
              required
              placeholder="País / ciudad"
            />
          </div>

          <div className="lr-form-group">
            <label htmlFor="contacto-porque-home">
              ¿Por qué querés trabajar con Luz Roja?*
            </label>
            <textarea
              id="contacto-porque-home"
              name="porque"
              rows={3}
              required
            />
          </div>

          <div className="lr-form-group">
            <label htmlFor="contacto-proyecto-home">
              Contanos más sobre tu proyecto o marca*
            </label>
            <textarea
              id="contacto-proyecto-home"
              name="proyecto"
              rows={4}
              required
            />
          </div>

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

          <div className="lr-form-group">
            <label htmlFor="contacto-presupuesto-home">
              ¿Cuál es tu presupuesto para este proyecto?*
            </label>
            <select
              id="contacto-presupuesto-home"
              name="presupuesto"
              required
              defaultValue=""
            >
              <option value="">Seleccioná un rango</option>
              <option value="hasta-1000">Hasta USD 1.000</option>
              <option value="1000-2000">Entre USD 1.000 y USD 2.000</option>
              <option value="2000-4000">Entre USD 2.000 y USD 4.000</option>
              <option value="4000-8000">Entre USD 4.000 y USD 8.000</option>
              <option value="8000-15000">
                Entre USD 8.000 y USD 15.000
              </option>
              <option value="mas-15000">Más de USD 15.000</option>
            </select>
          </div>

          <div className="lr-form-group">
            <label htmlFor="contacto-origen-home">
              ¿Dónde nos conociste?*
            </label>
            <select
              id="contacto-origen-home"
              name="origen"
              required
              defaultValue=""
            >
              <option value="">Seleccioná una opción</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="recomendacion">Recomendación</option>
              <option value="busqueda">Búsqueda en Google</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="lr-form-group">
            <label htmlFor="contacto-newsletter-home">
              ¿Querés suscribirte a nuestras novedades?
            </label>
            <select id="contacto-newsletter-home" name="newsletter" defaultValue="si">
              <option value="si">Sí, quiero recibir novedades</option>
              <option value="no">No por ahora</option>
            </select>
          </div>

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
      <ContactSection />
    </div>
  );
}

