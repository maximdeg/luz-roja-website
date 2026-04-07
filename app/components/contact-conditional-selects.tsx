"use client";

import { useState } from "react";
import { CONTACT_SERVICE_OPTIONS } from "../contact-service-options";

const ORIGEN_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "amigo-de-un-amigo", label: "Amigo de un amigo" },
  { value: "recomendacion", label: "Recomendación" },
  { value: "busqueda", label: "Búsqueda en Google" },
  { value: "otro", label: "Otro" }
] as const;

const OTRO_VALUE = "otro";

interface ContactFormPlacement {
  form: "home" | "contacto";
}

export function ContactServicioSelect({ form }: ContactFormPlacement) {
  const isHome = form === "home";
  const selectId = isHome ? "contacto-servicio-home" : "contacto-servicio";
  const otroInputId = isHome ? "contacto-servicio-otro-home" : "contacto-servicio-otro";
  const [value, setValue] = useState("");

  return (
    <>
      <div className="lr-form-group">
        <label htmlFor={selectId}>¿Qué servicio te interesa?*</label>
        <select
          id={selectId}
          name="servicio"
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="">Seleccioná una opción</option>
          {CONTACT_SERVICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {value === OTRO_VALUE && (
        <div className="lr-form-group">
          <label htmlFor={otroInputId}>Contanos qué servicio te interesa*</label>
          <input
            id={otroInputId}
            name="servicio_otro"
            type="text"
            required
            autoComplete="off"
          />
        </div>
      )}
    </>
  );
}

export function ContactOrigenSelect({ form }: ContactFormPlacement) {
  const isHome = form === "home";
  const selectId = isHome ? "contacto-origen-home" : "contacto-origen";
  const otroInputId = isHome ? "contacto-origen-otro-home" : "contacto-origen-otro";
  const [value, setValue] = useState("");

  return (
    <>
      <div className="lr-form-group">
        <label htmlFor={selectId}>¿Dónde nos conociste?*</label>
        <select
          id={selectId}
          name="origen"
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="">Seleccioná una opción</option>
          {ORIGEN_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {value === OTRO_VALUE && (
        <div className="lr-form-group">
          <label htmlFor={otroInputId}>Contanos cómo nos conociste*</label>
          <input
            id={otroInputId}
            name="origen_otro"
            type="text"
            required
            autoComplete="off"
          />
        </div>
      )}
    </>
  );
}
