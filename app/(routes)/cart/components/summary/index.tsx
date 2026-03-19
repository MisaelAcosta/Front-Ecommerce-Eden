"use client";

import { useMemo, useState } from "react";
import Step01Order from "./steps/step-01-order";
import Step02Data from "./steps/step-02-data";
import Step03Shipping from "./steps/step-03-shipping";

import { useCart } from "@/hooks/use-cart";
import { useCartWizard } from "@/hooks/use-cart-wizard";

type Step = 1 | 2 | 3;

type CartItem = {
  id: number | string;
  variantId?: number | string | null;
  qty: number | string;
  unitPrice: number | string;
  sku?: string | null;
  variantName?: string | null;
  imageUrl?: string | null;
  variant?: {
    id?: number | string | null;
    sku?: string | null;
    variantName?: string | null;
  } | null;
  productName?: string | null;
  product?: {
    productName?: string | null;
    name?: string | null;
  } | null;
};

const Summary = () => {
  const [step, setStep] = useState<Step>(1);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const next = () => setStep((s) => (s === 3 ? 3 : ((s + 1) as Step)));
  const back = () => setStep((s) => (s === 1 ? 1 : ((s - 1) as Step)));

  const { items } = useCart();
  const { step02, step03 } = useCartWizard();

  const cartItems = items as CartItem[];

  const subtotal = useMemo(
    () => cartItems.reduce((acc, it) => acc + Number(it.unitPrice) * Number(it.qty), 0),
    [cartItems]
  );

  const shippingCost = step03?.shippingCost ?? 0;
  const totalFinal = subtotal + shippingCost;

  const payerEmail = (step02?.email ?? "").trim().toLowerCase();

  const handlePay = async () => {
    setPayError(null);

    if (cartItems.length === 0) {
      setPayError("Tu carrito está vacío.");
      return;
    }

    const name = (step02?.name ?? "").trim();
    const email = payerEmail;

    const rutBody = String(step02?.rutBody ?? "").replace(/\D/g, "").slice(0, 8);
    const rutDv = String(step02?.rutDv ?? "").trim().toUpperCase().slice(0, 1);
    const phoneRest = String(step02?.phoneRest ?? "").replace(/\D/g, "").slice(0, 8);

    if (!name) return setPayError("Falta tu nombre.");
    if (!email || !email.includes("@")) return setPayError("Falta un email válido para el pago.");
    if (!rutBody || rutBody.length < 7) return setPayError("RUT incompleto.");
    if (!rutDv) return setPayError("Falta dígito verificador del RUT.");
    if (!phoneRest || phoneRest.length < 8) return setPayError("Teléfono incompleto.");

    if (!step03?.region || !step03?.comuna || !step03?.calle || !step03?.numero) {
      setPayError("Faltan datos de envío (región, comuna, calle y número).");
      return;
    }

    if (totalFinal <= 0) {
      setPayError("El total final no puede ser 0.");
      return;
    }

    setPaying(true);

    try {
      const createOrderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((it) => ({
            variantId: Number(it.variantId ?? it.variant?.id ?? it.id),
            qty: Number(it.qty),
            unitPrice: Number(it.unitPrice),
            sku: it.sku ?? it.variant?.sku ?? null,
            variantName: it.variantName ?? it.variant?.variantName ?? null,
            productName: it.productName ?? it.product?.productName ?? it.product?.name ?? null,
            imageUrl: it.imageUrl ?? null,
          })),

          step02: {
            name,
            email,
            rutBody,
            rutDv,
            phoneRest,
          },

          step03: {
            region: step03.region ?? null,
            comuna: step03.comuna ?? null,
            calle: String(step03.calle ?? "").trim(),
            numero: String(step03.numero ?? "").trim(),
            depto: String(step03.depto ?? "").trim(),
            nota: String(step03.nota ?? "").trim(),
            shippingCost,
          },

          subtotal: Math.round(subtotal),
          shippingCost: Math.round(shippingCost),
          total: Math.round(totalFinal),
        }),
      });

      const createOrderJson = await createOrderRes.json();

      if (!createOrderRes.ok || !createOrderJson?.ok) {
        const msg =
          createOrderJson?.error ||
          createOrderJson?.detail?.message ||
          "No se pudo crear la orden. Intenta de nuevo.";
        setPayError(String(msg));
        return;
      }

      const orderId = createOrderJson?.orderId;
      const orderDocumentId = createOrderJson?.orderDocumentId;
      const commerceOrder = createOrderJson?.commerceOrder;

      if (!orderId || !orderDocumentId || !commerceOrder) {
        setPayError("La API de órdenes no devolvió orderId/orderDocumentId/commerceOrder.");
        return;
      }

      try {
        localStorage.setItem("eden_last_order_id", String(orderId));
        localStorage.setItem("eden_last_order_document_id", String(orderDocumentId));
        localStorage.setItem("eden_last_commerce_order", String(commerceOrder));
      } catch {}

      const flowRes = await fetch("/api/flow/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commerceOrder,
          subject: `Compra Eden 3D (${commerceOrder})`,
          amount: Math.round(totalFinal),
          email,
          optional: {
            orderId,
            orderDocumentId,
            name,
            rut: `${rutBody}-${rutDv}`,
            region: step03.region ?? null,
            comuna: step03.comuna ?? null,
          },
        }),
      });

      const flowJson = await flowRes.json();

      if (!flowRes.ok || !flowJson?.ok) {
        const msg =
          flowJson?.error ||
          flowJson?.detail?.message ||
          "No se pudo iniciar el pago en Flow. Intenta de nuevo.";
        setPayError(String(msg));
        return;
      }

      const flowToken = flowJson?.token;
      const paymentUrl = flowJson?.paymentUrl;

      if (!flowToken || !paymentUrl) {
        setPayError("Flow no devolvió token/URL de pago.");
        return;
      }

      const attachRes = await fetch("/api/orders/attach-flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderDocumentId,
          flowToken,
          paymentUrl,
        }),
      });

      const attachJson = await attachRes.json();

      if (!attachRes.ok || !attachJson?.ok) {
        const msg =
          attachJson?.error ||
          attachJson?.detail?.message ||
          "No se pudo asociar Flow a la orden. Intenta de nuevo.";
        setPayError(String(msg));
        return;
      }
/* No dependencia de token */
      try {
        localStorage.setItem("eden_last_flow_token", String(flowToken));
      } catch {}

/* ------------------------ */

      window.location.href = paymentUrl;
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Error inesperado al iniciar el pago.";

      setPayError(message);
    } finally {
      setPaying(false);
    }
  };

  if (step === 1) return <Step01Order onContinue={next} />;
  if (step === 2) return <Step02Data onContinue={next} onBack={back} />;

  if (step === 3) {
    return (
      <div className="space-y-3">
        <Step03Shipping onBack={back} onPay={handlePay} />

        {payError && (
          <div className="rounded-md border bg-white p-3">
            <p className="text-xs text-red-600">{payError}</p>
          </div>
        )}

        {paying && (
          <div className="rounded-md border bg-white p-3">
            <p className="text-xs text-muted-foreground">Redirigiendo a Flow...</p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default Summary;




