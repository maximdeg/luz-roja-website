"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearTestimonio, actualizarTestimonio } from "./testimonios-actions";
import { validateTestimonioForm, type Testimonio } from "../testimonios/testimonio";

/**
 * Create/edit form for a testimonial. Pass `testimonio` to edit; omit it to
 * create. Text-only, so unlike the product form there is no upload dance —
 * the form data goes straight to the server action.
 */
export function TestimonioForm({
  testimonio,
  ordenInicial
}: {
  testimonio?: Testimonio;
  /** Suggested display order for a new testimonial (end of the list). */
  ordenInicial?: number;
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);

    const preErrors = validateTestimonioForm({
      cita: String(fd.get("cita") ?? ""),
      autor: String(fd.get("autor") ?? ""),
      rol: String(fd.get("rol") ?? ""),
      orden: String(fd.get("orden") ?? "")
    });
    if (Object.keys(preErrors).length > 0) {
      setErrors(preErrors);
      setMessage(null);
      return;
    }

    setPending(true);
    setErrors({});
    setMessage(null);

    try {
      const result = testimonio
        ? await actualizarTestimonio(fd)
        : await crearTestimonio(fd);
      if (result.errors) {
        setErrors(result.errors);
        return;
      }
      if (result.message) {
        setMessage(result.message);
        return;
      }
      if (result.ok) {
        router.push("/admin/testimonios");
        router.refresh();
      }
    } catch {
      setMessage("Algo salió mal guardando el testimonio. Probá de nuevo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="lr-admin-form" onSubmit={handleSubmit} noValidate>
      {message ? <p className="lr-admin-alert">{message}</p> : null}
      {testimonio ? <input type="hidden" name="id" value={testimonio.id} /> : null}

      <label className="lr-admin-field">
        <span>Testimonio</span>
        <textarea name="cita" rows={4} defaultValue={testimonio?.cita} />
        {errors.cita ? <em className="lr-admin-error">{errors.cita}</em> : null}
      </label>

      <label className="lr-admin-field">
        <span>Autor (por ejemplo “Fundadora”)</span>
        <input name="autor" type="text" autoComplete="off" defaultValue={testimonio?.autor} />
        {errors.autor ? <em className="lr-admin-error">{errors.autor}</em> : null}
      </label>

      <label className="lr-admin-field">
        <span>Rol o marca (por ejemplo “Tienda de diseño local”)</span>
        <input name="rol" type="text" autoComplete="off" defaultValue={testimonio?.rol} />
        {errors.rol ? <em className="lr-admin-error">{errors.rol}</em> : null}
      </label>

      <label className="lr-admin-field">
        <span>Orden (menor = aparece antes)</span>
        <input
          name="orden"
          type="text"
          inputMode="numeric"
          defaultValue={testimonio?.orden ?? ordenInicial ?? 0}
        />
        {errors.orden ? <em className="lr-admin-error">{errors.orden}</em> : null}
      </label>

      <div className="lr-admin-actions">
        <button type="submit" className="lr-admin-primary" disabled={pending}>
          {pending ? "Guardando…" : testimonio ? "Guardar cambios" : "Crear testimonio"}
        </button>
      </div>
    </form>
  );
}
