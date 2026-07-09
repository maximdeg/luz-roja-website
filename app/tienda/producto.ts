/**
 * The tienda product (producto) and pure validation for the admin product form.
 * Mirrors the contact-form convention: validation returns a map of
 * field -> error message, and an empty object means "valid".
 */

import { parsePrecioInput } from "./precio";

/** A product as persisted in the catalog. */
export interface Producto {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  imagenPortada: string | null;
  /** Storage path of the deliverable file; null until one is uploaded. */
  archivo: string | null;
  /** Price in centavos (ARS cents); null for free products. */
  precioCentavos: number | null;
  esGratis: boolean;
  publicado: boolean;
}

/** Raw values as they come out of the admin product form. */
export interface ProductoFormValues {
  titulo?: string;
  descripcion?: string;
  /** Raw price input, e.g. "1500" or "1500,50". Ignored for free products. */
  precio?: string;
  esGratis?: boolean;
  /** Whether a deliverable file is attached (existing or freshly uploaded). */
  tieneArchivo?: boolean;
  /** Whether the admin is trying to publish (vs. saving a draft). */
  publicar?: boolean;
}

export type ProductoFormErrors = Record<string, string>;

export function validateProductoForm(values: ProductoFormValues): ProductoFormErrors {
  const errors: ProductoFormErrors = {};

  if (!values.titulo?.trim()) {
    errors.titulo = "El título es obligatorio.";
  }
  if (!values.descripcion?.trim()) {
    errors.descripcion = "La descripción es obligatoria.";
  }

  const precioRaw = values.precio?.trim() ?? "";
  if (values.esGratis) {
    // A free product must not carry a price.
    if (precioRaw) {
      errors.precio = "Un producto gratis no lleva precio.";
    }
  } else if (!precioRaw) {
    errors.precio = "Poné un precio o marcá el producto como gratis.";
  } else {
    const centavos = parsePrecioInput(precioRaw);
    if (centavos === null) {
      errors.precio = "Ingresá un precio válido (por ejemplo 1500 o 1500,50).";
    } else if (centavos <= 0) {
      errors.precio = "El precio debe ser mayor a cero.";
    }
  }

  // A file is only required to publish; drafts can be saved without one.
  if (values.publicar && !values.tieneArchivo) {
    errors.archivo = "Subí un archivo antes de publicar el producto.";
  }

  return errors;
}
