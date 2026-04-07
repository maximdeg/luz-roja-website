import {
  ContactOrigenSelect,
  ContactServicioSelect
} from "../components/contact-conditional-selects";
import "../secondary.css";

export const dynamic = "force-dynamic";

// Formulario original (referencia):
// Nombre, Email, Mensaje simple con botón "Enviar mensaje".

export default function ContactoPage() {
  return (
    <div className="lr-page">
      <header className="lr-page-header">
        <p className="lr-page-kicker">Trabajemos juntas</p>
        <h1 className="lr-page-title">
          Nos inspiran las historias. Contanos todo sobre tu proyecto.
        </h1>
        <p className="lr-page-subtitle">
          Queremos trabajar con vos y encender la luz roja para tu marca.
          Escribinos y te respondemos con toda la información para dar el
          siguiente paso.
        </p>
        <p className="lr-page-subtitle">
          Para cualquier otra consulta también podés escribirnos directo a{" "}
          <strong>luzrojacontenidos@gmail.com</strong>.
        </p>
      </header>

      <section className="lr-form-section">
        <form className="lr-form">
          <div className="lr-form-grid">
            <div className="lr-form-group">
              <label htmlFor="contacto-nombre">Nombre*</label>
              <input id="contacto-nombre" name="nombre" type="text" required />
            </div>
            <div className="lr-form-group">
              <label htmlFor="contacto-apellido">Apellido*</label>
              <input
                id="contacto-apellido"
                name="apellido"
                type="text"
                required
              />
            </div>
          </div>

          <div className="lr-form-grid">
            <div className="lr-form-group">
              <label htmlFor="contacto-email">Email*</label>
              <input
                id="contacto-email"
                name="email"
                type="email"
                required
              />
            </div>
            <div className="lr-form-group">
              <label htmlFor="contacto-telefono">Teléfono</label>
              <input
                id="contacto-telefono"
                name="telefono"
                type="tel"
                placeholder="+54 ..."
              />
            </div>
          </div>

          <ContactServicioSelect form="contacto" />

          <div className="lr-form-group">
            <label htmlFor="contacto-pais">¿En qué país te encontrás?*</label>
            <input
              id="contacto-pais"
              name="pais"
              type="text"
              required
              placeholder="País / ciudad"
            />
          </div>

          <div className="lr-form-group">
            <label htmlFor="contacto-porque">
              ¿Por qué querés trabajar con Luz Roja?*
            </label>
            <textarea
              id="contacto-porque"
              name="porque"
              rows={3}
              required
            />
          </div>

          <div className="lr-form-group">
            <label htmlFor="contacto-proyecto">
              Contanos más sobre tu proyecto o marca*
            </label>
            <textarea
              id="contacto-proyecto"
              name="proyecto"
              rows={4}
              required
            />
          </div>

          <div className="lr-form-group">
            <label htmlFor="contacto-web">
              ¿Cuál es la web o Instagram de tu marca?*
            </label>
            <input
              id="contacto-web"
              name="web"
              type="text"
              required
              placeholder="URL o @usuario"
            />
          </div>

          <div className="lr-form-group">
            <label htmlFor="contacto-presupuesto">
              ¿Cuál es tu presupuesto para este proyecto?*
            </label>
            <select
              id="contacto-presupuesto"
              name="presupuesto"
              required
              defaultValue=""
            >
              <option value="">Seleccioná un rango</option>
              <option value="hasta-1000">Hasta USD 1.000</option>
              <option value="1000-2000">Entre USD 1.000 y USD 2.000</option>
              <option value="2000-4000">Entre USD 2.000 y USD 4.000</option>
              <option value="4000-8000">Entre USD 4.000 y USD 8.000</option>
              <option value="8000-15000">Entre USD 8.000 y USD 15.000</option>
              <option value="mas-15000">Más de USD 15.000</option>
            </select>
          </div>

          <ContactOrigenSelect form="contacto" />

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
  );
}

