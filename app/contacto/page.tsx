import "../secondary.css";

export default function ContactoPage() {
  return (
    <div className="lr-page">
      <header className="lr-page-header">
        <p className="lr-page-kicker">Hablemos</p>
        <h1 className="lr-page-title">Contacto</h1>
        <p className="lr-page-subtitle">
          Si sentís que es momento de encender la luz roja y empezar a contar
          tu historia con más intención, podés escribirnos desde acá.
        </p>
      </header>

      <section className="lr-form-section">
        <form
          className="lr-form"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="lr-form-group">
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" name="nombre" type="text" required />
          </div>

          <div className="lr-form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>

          <div className="lr-form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea id="mensaje" name="mensaje" rows={5} required />
          </div>

          <button type="submit" className="lr-primary-button">
            Enviar mensaje
          </button>
        </form>
      </section>
    </div>
  );
}

