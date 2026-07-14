/**
 * Confirms a Mercado Pago payment and releases the download. Both entry points
 * — the back-url `gracias` page and the server-to-server webhook — call this
 * with a payment id; neither trusts anything but a fresh fetch of the payment
 * from MP. The order's estado moves through the pure `transitionPedido` machine,
 * and repeat calls for the same payment are idempotent (looked up by
 * mpPaymentId), so the buyer can refresh the page or MP can retry the webhook
 * without double-processing.
 */

import "server-only";
import { getPedidoRepository, getCatalogRepository } from "./repositories";
import { getPayment } from "./mp-client";
import { interpretPayment } from "./mp-payment";
import { transitionPedido } from "./pedido-estado";
import { createArchivoSignedUrl } from "./signed-url";
import { downloadFileName } from "./free-download";
import type { Pedido } from "./pedido";
import type { Producto } from "./producto";

export type ConfirmResult =
  | { estado: "entregado"; producto: Producto; downloadUrl: string; emailComprador: string }
  | { estado: "pendiente" }
  | { estado: "rechazado" }
  | { estado: "error"; motivo: string };

export async function confirmarPago(paymentId: string): Promise<ConfirmResult> {
  const pedidos = getPedidoRepository();
  const payment = await getPayment(paymentId);

  // Idempotency: this payment already advanced its pedido — just re-issue a link.
  const yaProcesado = await pedidos.getByMpPaymentId(payment.id);
  if (yaProcesado) return entregar(yaProcesado);

  if (!payment.externalReference) {
    return { estado: "error", motivo: "El pago no trae external_reference." };
  }
  const pedido = await pedidos.getByExternalReference(payment.externalReference);
  if (!pedido) return { estado: "error", motivo: "No encontramos el pedido del pago." };

  const outcome = interpretPayment(payment, pedido);
  if (!outcome.deliver) {
    if (outcome.reason === "not-approved") {
      const rechazado = ["rejected", "cancelled", "refunded", "charged_back"].includes(
        payment.status
      );
      return rechazado ? { estado: "rechazado" } : { estado: "pendiente" };
    }
    return { estado: "error", motivo: outcome.reason };
  }

  // Approved: pendiente -> pagado, recording the payment.
  const aPagado = transitionPedido(pedido.estado, "pagado");
  const pagado = await pedidos.save({
    ...pedido,
    estado: aPagado.ok ? aPagado.estado : pedido.estado,
    mpPaymentId: payment.id,
    paidAt: pedido.paidAt ?? new Date().toISOString()
  });

  return entregar(pagado);
}

/** Moves a paid pedido to entregado (idempotently) and mints a fresh download link. */
async function entregar(pedido: Pedido): Promise<ConfirmResult> {
  const producto = await getCatalogRepository().getById(pedido.productoId);
  if (!producto || !producto.archivo) {
    return { estado: "error", motivo: "El producto no tiene un archivo para entregar." };
  }

  const aEntregado = transitionPedido(pedido.estado, "entregado");
  if (aEntregado.ok && aEntregado.changed) {
    await getPedidoRepository().save({ ...pedido, estado: aEntregado.estado });
  }

  const downloadUrl = await createArchivoSignedUrl(producto.archivo, {
    downloadAs: downloadFileName(producto)
  });
  return { estado: "entregado", producto, downloadUrl, emailComprador: pedido.emailComprador };
}
