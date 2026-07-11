"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "./supabase-browser";
import { firmarSubidas, crearProducto } from "./actions";
import { validateProductoForm } from "../tienda/producto";

const MB = 1024 * 1024;
const MAX_PORTADA_MB = 10;
const MAX_ARCHIVO_MB = 50;

export function ProductoForm() {
  const router = useRouter();
  const [esGratis, setEsGratis] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const intent =
      ((event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)?.value ??
      "borrador";
    const fd = new FormData(form);

    const portada = fileOrNull(fd.get("portadaFile"));
    const archivo = fileOrNull(fd.get("archivoFile"));

    // Validate before uploading anything, so we don't orphan files on a bad form.
    const preErrors = validateProductoForm({
      titulo: String(fd.get("titulo") ?? ""),
      descripcion: String(fd.get("descripcion") ?? ""),
      precio: String(fd.get("precio") ?? ""),
      esGratis: fd.get("esGratis") === "on",
      tieneArchivo: archivo !== null,
      publicar: intent === "publicar"
    });
    if (portada && portada.size > MAX_PORTADA_MB * MB) {
      preErrors.portada = `La portada supera ${MAX_PORTADA_MB} MB.`;
    }
    if (archivo && archivo.size > MAX_ARCHIVO_MB * MB) {
      preErrors.archivo = `El archivo supera ${MAX_ARCHIVO_MB} MB.`;
    }
    if (Object.keys(preErrors).length > 0) {
      setErrors(preErrors);
      setMessage(null);
      return;
    }

    setPending(true);
    setErrors({});
    setMessage(null);

    try {
      let imagenPortadaPath = "";
      let archivoPath = "";

      if (portada || archivo) {
        setProgress("Subiendo archivos…");
        const signed = await firmarSubidas({
          portadaName: portada?.name,
          archivoName: archivo?.name
        });
        if (signed.error) {
          setMessage(signed.error);
          return;
        }

        const supabase = createBrowserSupabase();

        if (portada && signed.portada) {
          const { error } = await supabase.storage
            .from("portadas")
            .uploadToSignedUrl(signed.portada.path, signed.portada.token, portada);
          if (error) {
            setMessage(`No se pudo subir la portada: ${error.message}`);
            return;
          }
          imagenPortadaPath = signed.portada.path;
        }

        if (archivo && signed.archivo) {
          const { error } = await supabase.storage
            .from("productos")
            .uploadToSignedUrl(signed.archivo.path, signed.archivo.token, archivo);
          if (error) {
            setMessage(`No se pudo subir el archivo: ${error.message}`);
            return;
          }
          archivoPath = signed.archivo.path;
        }
      }

      setProgress("Guardando…");
      const meta = new FormData();
      meta.set("titulo", String(fd.get("titulo") ?? ""));
      meta.set("descripcion", String(fd.get("descripcion") ?? ""));
      meta.set("precio", String(fd.get("precio") ?? ""));
      if (fd.get("esGratis") === "on") meta.set("esGratis", "on");
      meta.set("intent", intent);
      meta.set("imagenPortada", imagenPortadaPath);
      meta.set("archivo", archivoPath);

      const result = await crearProducto(meta);
      if (result.errors) {
        setErrors(result.errors);
        return;
      }
      if (result.message) {
        setMessage(result.message);
        return;
      }
      if (result.ok) {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setMessage("Algo salió mal subiendo el producto. Probá de nuevo.");
    } finally {
      setPending(false);
      setProgress(null);
    }
  }

  return (
    <form className="lr-admin-form" onSubmit={handleSubmit} noValidate>
      {message ? <p className="lr-admin-alert">{message}</p> : null}

      <label className="lr-admin-field">
        <span>Título</span>
        <input name="titulo" type="text" autoComplete="off" />
        {errors.titulo ? <em className="lr-admin-error">{errors.titulo}</em> : null}
      </label>

      <label className="lr-admin-field">
        <span>Descripción</span>
        <textarea name="descripcion" rows={4} />
        {errors.descripcion ? <em className="lr-admin-error">{errors.descripcion}</em> : null}
      </label>

      <label className="lr-admin-check">
        <input
          name="esGratis"
          type="checkbox"
          checked={esGratis}
          onChange={(e) => setEsGratis(e.target.checked)}
        />
        <span>Este producto es gratis</span>
      </label>

      <label className="lr-admin-field">
        <span>Precio (ARS)</span>
        <input
          name="precio"
          type="text"
          inputMode="decimal"
          placeholder="1500 o 1500,50"
          disabled={esGratis}
        />
        {errors.precio ? <em className="lr-admin-error">{errors.precio}</em> : null}
      </label>

      <label className="lr-admin-field">
        <span>Portada (imagen, opcional — hasta {MAX_PORTADA_MB} MB)</span>
        <input name="portadaFile" type="file" accept="image/*" />
        {errors.portada ? <em className="lr-admin-error">{errors.portada}</em> : null}
      </label>

      <label className="lr-admin-field">
        <span>Archivo descargable (hasta {MAX_ARCHIVO_MB} MB)</span>
        <input name="archivoFile" type="file" />
        {errors.archivo ? <em className="lr-admin-error">{errors.archivo}</em> : null}
      </label>

      <div className="lr-admin-actions">
        <button type="submit" name="intent" value="borrador" disabled={pending}>
          Guardar borrador
        </button>
        <button
          type="submit"
          name="intent"
          value="publicar"
          className="lr-admin-primary"
          disabled={pending}
        >
          {pending ? progress ?? "Guardando…" : "Publicar"}
        </button>
      </div>
    </form>
  );
}

function fileOrNull(value: FormDataEntryValue | null): File | null {
  return value instanceof File && value.size > 0 ? value : null;
}
