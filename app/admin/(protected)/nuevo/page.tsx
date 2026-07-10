import Link from "next/link";
import { ProductoForm } from "../../producto-form";

export default function NuevoProductoPage() {
  return (
    <section>
      <div className="lr-admin-head">
        <h1>Nuevo producto</h1>
        <Link href="/admin" className="lr-admin-link">
          ← Volver
        </Link>
      </div>
      <ProductoForm />
    </section>
  );
}
