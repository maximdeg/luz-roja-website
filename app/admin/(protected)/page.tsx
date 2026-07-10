import Link from "next/link";
import { getCatalogRepository } from "../../tienda/repositories";
import { formatARS } from "../../tienda/precio";
import { alternarPublicado, eliminarProducto } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const productos = await getCatalogRepository().listAll();

  return (
    <section>
      <div className="lr-admin-head">
        <h1>Productos</h1>
        <Link href="/admin/nuevo" className="lr-admin-primary lr-admin-btn">
          + Nuevo producto
        </Link>
      </div>

      {productos.length === 0 ? (
        <p className="lr-admin-empty">
          Todavía no hay productos. Creá el primero con “Nuevo producto”.
        </p>
      ) : (
        <ul className="lr-admin-list">
          {productos.map((producto) => {
            const gratis = producto.esGratis || producto.precioCentavos === null;
            return (
              <li key={producto.id} className="lr-admin-row">
                <div className="lr-admin-row-main">
                  <strong>{producto.titulo}</strong>
                  <span className="lr-admin-meta">
                    {gratis ? "Gratis" : formatARS(producto.precioCentavos as number)}
                    {" · "}
                    <span className={producto.publicado ? "is-live" : "is-draft"}>
                      {producto.publicado ? "Publicado" : "Borrador"}
                    </span>
                    {producto.archivo ? "" : " · sin archivo"}
                  </span>
                </div>
                <div className="lr-admin-row-actions">
                  <form action={alternarPublicado}>
                    <input type="hidden" name="id" value={producto.id} />
                    <input type="hidden" name="publicado" value={String(producto.publicado)} />
                    <button type="submit" className="lr-admin-link">
                      {producto.publicado ? "Despublicar" : "Publicar"}
                    </button>
                  </form>
                  <form action={eliminarProducto}>
                    <input type="hidden" name="id" value={producto.id} />
                    <button type="submit" className="lr-admin-link lr-admin-danger">
                      Eliminar
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
