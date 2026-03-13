import "../secondary.css";

export default function PoliticasPrivacidadPage() {
  return (
    <div className="lr-page">
      <header className="lr-page-header">
        <p className="lr-page-kicker">Información legal</p>
        <h1 className="lr-page-title">Políticas de Privacidad</h1>
        <p className="lr-page-subtitle">
          Acá se describe cómo podríamos tratar los datos personales vinculados
          al uso de este sitio. Tomalo como un punto de partida para una
          versión legal a medida.
        </p>
      </header>

      <section className="lr-legal-section">
        <h2>1. Datos que podríamos recopilar</h2>
        <p>
          Podemos recibir información que compartas a través del formulario de
          contacto, como tu nombre, correo electrónico y mensaje. También
          podríamos utilizar herramientas de analítica para comprender mejor
          cómo se navega el sitio.
        </p>

        <h2>2. Uso de la información</h2>
        <p>
          Los datos que nos brindes se utilizarán únicamente para responder tus
          consultas, enviar información relacionada con nuestros servicios o
          mejorar la experiencia en el sitio.
        </p>

        <h2>3. Cookies y tecnologías similares</h2>
        <p>
          Podríamos utilizar cookies u otras tecnologías similares para
          registrar información de navegación básica. Podés configurar tu
          navegador para bloquearlas o recibir avisos antes de que se
          almacenen.
        </p>

        <h2>4. Tus derechos</h2>
        <p>
          Podés solicitar la actualización, corrección o eliminación de tus
          datos personales escribiéndonos a un correo de contacto que definas
          cuando tengas la versión final de este texto.
        </p>

        <h2>5. Cambios en estas políticas</h2>
        <p>
          Estas Políticas de Privacidad pueden actualizarse ocasionalmente para
          reflejar ajustes en el sitio o en la forma de gestionar los datos. La
          versión más reciente será siempre la que aparezca publicada aquí.
        </p>
      </section>
    </div>
  );
}

