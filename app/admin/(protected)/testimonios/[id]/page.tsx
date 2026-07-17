import Link from "next/link";
import { notFound } from "next/navigation";
import { getTestimonioRepository } from "../../../../testimonios/repositories";
import { TestimonioForm } from "../../../testimonio-form";

export const dynamic = "force-dynamic";

export default async function EditarTestimonioPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonio = await getTestimonioRepository().getById(id);
  if (!testimonio) notFound();

  return (
    <section>
      <div className="lr-admin-head">
        <h1>Editar testimonio</h1>
        <Link href="/admin/testimonios" className="lr-admin-link">
          ← Volver
        </Link>
      </div>
      <TestimonioForm testimonio={testimonio} />
    </section>
  );
}
