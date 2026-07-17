import Link from "next/link";
import { getTestimonioRepository } from "../../../../testimonios/repositories";
import { TestimonioForm } from "../../../testimonio-form";

export const dynamic = "force-dynamic";

export default async function NuevoTestimonioPage() {
  // Suggest placing the new testimonial at the end of the current list.
  const testimonios = await getTestimonioRepository().listAll();
  const ordenInicial = testimonios.reduce((max, t) => Math.max(max, t.orden), 0) + 1;

  return (
    <section>
      <div className="lr-admin-head">
        <h1>Nuevo testimonio</h1>
        <Link href="/admin/testimonios" className="lr-admin-link">
          ← Volver
        </Link>
      </div>
      <TestimonioForm ordenInicial={ordenInicial} />
    </section>
  );
}
