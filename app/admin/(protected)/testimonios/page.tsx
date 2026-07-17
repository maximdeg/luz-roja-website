import Link from "next/link";
import { getTestimonioRepository } from "../../../testimonios/repositories";
import { eliminarTestimonio } from "../../testimonios-actions";

export const dynamic = "force-dynamic";

export default async function AdminTestimonios() {
  const testimonios = await getTestimonioRepository().listAll();

  return (
    <section>
      <div className="lr-admin-head">
        <h1>Testimonios</h1>
        <Link href="/admin/testimonios/nuevo" className="lr-admin-primary lr-admin-btn">
          + Nuevo testimonio
        </Link>
      </div>

      {testimonios.length === 0 ? (
        <p className="lr-admin-empty">
          Todavía no hay testimonios. Creá el primero con “Nuevo testimonio”.
        </p>
      ) : (
        <ul className="lr-admin-list">
          {testimonios.map((testimonio) => (
            <li key={testimonio.id} className="lr-admin-row">
              <div className="lr-admin-row-main">
                <strong>
                  {testimonio.autor} · {testimonio.rol}
                </strong>
                <span className="lr-admin-meta">
                  #{testimonio.orden} · “{recorte(testimonio.cita)}”
                </span>
              </div>
              <div className="lr-admin-row-actions">
                <Link href={`/admin/testimonios/${testimonio.id}`} className="lr-admin-link">
                  Editar
                </Link>
                <form action={eliminarTestimonio}>
                  <input type="hidden" name="id" value={testimonio.id} />
                  <button type="submit" className="lr-admin-link lr-admin-danger">
                    Eliminar
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function recorte(cita: string): string {
  return cita.length > 90 ? `${cita.slice(0, 90)}…` : cita;
}
