import Image from "next/image";
import "./home.css";

// Copia original del hero (para referencia de tono y contenido):
// Kicker: "Luz Roja Contenidos"
// Título: "Encendemos la luz roja para contar historias que importan."
// Subtítulo: "Creamos historias que inspiran y construimos comunidades que perduran.
// Acompañamos a marcas y creadoras a encontrar su propia voz con contenido auténtico, sensible y estratégico."

function HeroSection() {
  return (
    <section className="lr-hero">
      <div className="lr-hero-inner">
        <div className="lr-hero-logo">
          <Image
            src="/logos/Circle Logo - White.png"
            alt="Luz Roja Contenidos"
            width={512}
            height={512}
            priority
          />
        </div>
        <div className="lr-hero-phrases" aria-label="Mensajes de la marca">
          <span className="lr-hero-phrase">
            Encendemos la luz roja.
          </span>
          <span className="lr-hero-phrase">
            Historias que encienden marcas.
          </span>
          <span className="lr-hero-phrase">
            Comunidades que laten juntas.
          </span>
        </div>
      </div>
    </section>
  );
}

function IntroSection() {
  return (
    <section className="lr-intro">
      <div className="lr-intro-inner">
        <h2 className="lr-intro-title">
          Encendemos la luz roja para contar historias que importan.
        </h2>
        <p className="lr-intro-subtitle">
          Creamos historias que inspiran y construimos comunidades que perduran.
          Acompañamos a marcas y creadoras a encontrar su propia voz con
          contenido auténtico, sensible y estratégico.
        </p>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      title: "Narrativa y storytelling",
      description:
        "Diseñamos relatos que conectan con la esencia de tu marca y con la sensibilidad de tu comunidad."
    },
    {
      title: "Contenido visual y audiovisual",
      description:
        "Fotografía, video y piezas creativas que capturan momentos honestos, íntimos y memorables."
    },
    {
      title: "Estrategia de contenidos",
      description:
        "Planificamos contenidos con propósito para redes y plataformas digitales, alineados a tus objetivos."
    },
    {
      title: "Acompañamiento creativo",
      description:
        "Trabajamos junto a vos para activar ideas, ordenar procesos y sostener tu presencia en el tiempo."
    }
  ];

  return (
    <section className="lr-services" id="servicios">
      <div className="lr-section-header">
        <p className="lr-section-kicker">Servicios</p>
        <h2 className="lr-section-title">
          Contenido que ilumina la historia de tu marca.
        </h2>
        <p className="lr-section-subtitle">
          Cada proyecto es un set distinto: escuchamos, observamos y diseñamos
          una puesta en escena a la medida de lo que querés contar.
        </p>
      </div>
      <div className="lr-services-grid">
        {services.map((service) => (
          <article key={service.title} className="lr-service-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="lr-home">
      <HeroSection />
      <IntroSection />
      <ServicesSection />
    </div>
  );
}

