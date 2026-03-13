import "../secondary.css";

const resources = [
  {
    title: "Guía de tono y voz",
    description:
      "Un pequeño mapa para encontrar la voz de tu marca sin perder tu propia manera de decir.",
    action: "Descargar guía (próximamente)"
  },
  {
    title: "Checklist antes de publicar",
    description:
      "Preguntas simples para revisar cada post antes de encender la luz roja y salir al aire.",
    action: "Ver checklist (ejemplo)"
  },
  {
    title: "Ideas de contenido para un mes",
    description:
      "Disparadores para que no te quedes sin ideas cuando la agenda se pone intensa.",
    action: "Descargar ideas (placeholder)"
  }
];

export default function CositasGratisPage() {
  return (
    <div className="lr-page">
      <header className="lr-page-header">
        <p className="lr-page-kicker">Recursos gratuitos</p>
        <h1 className="lr-page-title">Cositas gratis</h1>
        <p className="lr-page-subtitle">
          Pequeñas herramientas y disparadores creativos para acompañar tu
          proceso de creación de contenido. Todo pensado para que puedas probar,
          experimentar y encontrar tu propia forma de encender la luz roja.
        </p>
      </header>

      <section className="lr-grid-section">
        <div className="lr-grid">
          {resources.map((item) => (
            <article key={item.title} className="lr-card">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <button className="lr-card-button" type="button">
                {item.action}
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

