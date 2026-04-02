import Image from "next/image";
import heroTeamPhoto from "../public/logos/DSC_3934-27.jpg";
import servicesPhoto from "../public/logos/camera black desk.jpg";
import "./home.css";
import "./secondary.css";

// Copia original del hero (para referencia de tono y contenido):
// Kicker: "Luz Roja Contenidos"
// Título: "Encendemos la luz roja para contar historias que importan."
// Subtítulo: "Creamos historias que inspiran y construimos comunidades que perduran.
// Acompañamos a marcas y creadoras a encontrar su propia voz con contenido auténtico, sensible y estratégico."

function HeroSection() {
  return (
    <section className="lr-hero" id="hero">
      <div className="lr-hero-inner">
        <div className="lr-hero-content">
          <div className="lr-hero-logo">
            <Image
              src="/logos/Circle Logo - White.png"
              alt="Luz Roja"
              width={360}
              height={360}
              priority
            />
          </div>
          <h1 className="lr-hero-title">
            <span className="lr-hero-title-fixed">Encendemos</span>{" "}
            <span
              className="lr-hero-title-rotator"
              aria-label="la luz roja, marcas, comunidades"
            >
              <span className="lr-hero-title-rotator-item">la luz roja</span>
              <span className="lr-hero-title-rotator-item">marcas</span>
              <span className="lr-hero-title-rotator-item">comunidades</span>
            </span>
            <span className="sr-only">
              Encendemos la luz roja. Encendemos marcas. Encendemos comunidades.
            </span>
          </h1>
        </div>
        <div className="lr-hero-photo" aria-hidden="true">
          <Image
            src={heroTeamPhoto}
            alt="Equipo de Luz Roja"
            fill
            sizes="(min-width: 900px) 50vw, 100vw"
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    "Narrativa y storytelling",
    "Contenido visual y audiovisual",
    "Fotografía",
    "Estrategia para redes",
    "Acompañamiento creativo"
  ];

  return (
    <section className="lr-services" id="servicios">
      <div className="lr-services-inner">
        <div className="lr-services-media" aria-hidden="true">
          <Image
            src={servicesPhoto}
            alt=""
            fill
            sizes="(min-width: 900px) 66vw, 100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        <div className="lr-services-right">
          {/* <p className="lr-section-kicker">Servicios</p> */}
          <h2 className="lr-section-title">
            Nuestros servicios
          </h2>

          <ul className="lr-services-list" aria-label="Servicios">
            {services.map((service) => (
              <li key={service} className="lr-services-item">
                {service}
              </li>
            ))}
          </ul>
        </div>
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
      <ServicesSection />
      <NosotrasSection />
      <ContactSection />
    </div>
  );
}

