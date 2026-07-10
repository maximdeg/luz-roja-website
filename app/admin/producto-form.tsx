"use client";

import { useActionState, useState } from "react";
import { crearProducto, type ProductoFormState } from "./actions";

const initialState: ProductoFormState = {};

export function ProductoForm() {
  const [state, formAction, pending] = useActionState(crearProducto, initialState);
  const [esGratis, setEsGratis] = useState(false);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="lr-admin-form" noValidate>
      {state.message ? <p className="lr-admin-alert">{state.message}</p> : null}

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
        <span>Portada (imagen, opcional)</span>
        <input name="portada" type="file" accept="image/*" />
      </label>

      <label className="lr-admin-field">
        <span>Archivo descargable</span>
        <input name="archivo" type="file" />
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
          {pending ? "Guardando…" : "Publicar"}
        </button>
      </div>
    </form>
  );
}
