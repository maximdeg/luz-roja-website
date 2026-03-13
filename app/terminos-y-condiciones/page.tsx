import "../secondary.css";

export default function TerminosCondicionesPage() {
  return (
    <div className="lr-page">
      <header className="lr-page-header">
        <p className="lr-page-kicker">Información legal</p>
        <h1 className="lr-page-title">Términos y Condiciones</h1>
        <p className="lr-page-subtitle">
          Este texto es una base orientativa para que luego puedas reemplazarlo
          por la versión legal definitiva junto a una persona especializada.
        </p>
      </header>

      <section className="lr-legal-section">
        <h2>1. Uso del sitio</h2>
        <p>
          El sitio de Luz Roja Contenidos tiene como objetivo compartir
          información sobre nuestros servicios, proyectos y recursos
          gratuitos. Al navegarlo aceptás hacerlo de manera responsable y de
          acuerdo con estos términos.
        </p>

        <h2>2. Propiedad intelectual</h2>
        <p>
          A menos que se indique lo contrario, todos los contenidos de este
          sitio (textos, imágenes, piezas audiovisuales y recursos descargables)
          pertenecen a Luz Roja Contenidos o se utilizan con autorización. No
          está permitido reproducirlos, modificarlos o distribuirlos con fines
          comerciales sin nuestro consentimiento previo y por escrito.
        </p>

        <h2>3. Recursos gratuitos</h2>
        <p>
          Las “Cositas gratis” están pensadas como materiales de apoyo. Podés
          usarlos para tu proyecto respetando la autoría y sin revenderlos ni
          presentarlos como propios.
        </p>

        <h2>4. Limitación de responsabilidad</h2>
        <p>
          Hacemos nuestro mejor esfuerzo para que la información del sitio sea
          clara y actualizada, pero no podemos garantizar su exactitud absoluta
          en todo momento. El uso que hagas de los contenidos es tu
          responsabilidad.
        </p>

        <h2>5. Cambios en los términos</h2>
        <p>
          Podemos actualizar estos Términos y Condiciones cuando sea necesario.
          La versión vigente será siempre la que se encuentre publicada en esta
          página.
        </p>
      </section>
    </div>
  );
}

