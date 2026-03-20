"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useCartWizard } from "@/hooks/use-cart-wizard";

type UiStatus = "loading" | "paid" | "rejected" | "pending" | "error";

type FlowDetail = {
  message?: string;
  status?: string | number;
  paymentStatus?: string | number;
  state?: string | number;
  [key: string]: unknown;
};

type OrderStatusData = {
  statusOrder?: string;
  paidAt?: string | null;
  commerceOrder?: string;
  flowToken?: string | null;
};

function FlowReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tokenFromUrl = useMemo(() => searchParams.get("token"), [searchParams]);

  const [status, setStatus] = useState<UiStatus>("loading");
  const [detail, setDetail] = useState<FlowDetail | OrderStatusData | null>(null);

  const cart = useCart();
  const wizard = useCartWizard();

  useEffect(() => {
    let alive = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let tries = 0;
    const maxTries = 15;

    const markPaid = (info?: FlowDetail | OrderStatusData | null) => {
  if (!alive) return;

  setStatus("paid");
  setDetail(info ?? null);

  cart.clear();
  wizard.resetWizard?.();

  //  limpiar solo una vez con tiempo para evitar borrar datos si el usuario regresa a la página después de un pago exitoso
  if (typeof window !== "undefined") {
    setTimeout(() => {
      try {
        localStorage.removeItem("eden_last_flow_token");
        localStorage.removeItem("eden_last_order_id");
        localStorage.removeItem("eden_last_order_document_id");
        localStorage.removeItem("eden_last_commerce_order");
      } catch {}
    }, 5000);
  }
};

    const markRejected = (info?: FlowDetail | OrderStatusData | null) => {
      if (!alive) return;
      setStatus("rejected");
      setDetail(info ?? null);
    };

    const markError = (message: string, info?: FlowDetail | OrderStatusData | null) => {
      if (!alive) return;
      setStatus("error");
      setDetail(info ?? { message });
    };

    const checkOrderInStrapi = async (): Promise<
  "paid" | "rejected" | "pending" | "not-found" | "error"
> => {
  let orderDocumentId = "";
  let commerceOrder = "";

  try {
    orderDocumentId =
      localStorage.getItem("eden_last_order_document_id") ?? "";
    commerceOrder =
      localStorage.getItem("eden_last_commerce_order") ?? "";
  } catch {}

  console.log("DEBUG STRAPI IDS", {
    orderDocumentId,
    commerceOrder,
  });

  if (!orderDocumentId && !commerceOrder) {
    return "not-found";
  }

  const qs = new URLSearchParams();
  if (orderDocumentId) {
    qs.set("orderDocumentId", orderDocumentId);
  } else {
    qs.set("commerceOrder", commerceOrder);
  }

  try {
    const res = await fetch(`/api/orders/get-status?${qs.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    const json = await res.json();

    // 🔥 DEBUG IMPORTANTE
    console.log("GET STATUS RESPONSE", {
      status: res.status,
      ok: res.ok,
      json,
    });

    if (!alive) return "error";

    if (!res.ok || !json?.ok) {
      return "error";
    }

    const order = json?.data ?? null;
    setDetail(order);

    const statusOrder = String(order?.statusOrder ?? "").toUpperCase();

    if (statusOrder === "PAID") {
      markPaid(order);
      return "paid";
    }

    if (
      statusOrder === "REJECTED" ||
      statusOrder === "FAILED" ||
      statusOrder === "CANCELLED" ||
      statusOrder === "CANCELED"
    ) {
      markRejected(order);
      return "rejected";
    }

    if (statusOrder) {
      setStatus("pending");
      return "pending";
    }

    return "not-found";
  } catch (error) {
    console.error("ERROR GET STATUS", error);
    return "error";
  }
};

    const checkFlowStatus = async (): Promise<"paid" | "rejected" | "pending" | "no-token" | "error"> => {
      let token = tokenFromUrl;

      if (!token) {
        try {
          token = localStorage.getItem("eden_last_flow_token");
        } catch {}
      }

      if (!token) {
        return "no-token";
      }

      const res = await fetch(`/api/flow/status?token=${encodeURIComponent(token)}`, {
        method: "GET",
        cache: "no-store",
      });

      const json: {
        ok?: boolean;
        data?: FlowDetail;
        message?: string;
        error?: string;
      } = await res.json();

      if (!alive) return "error";

      if (!res.ok || !json?.ok) {
        markError(
          json?.error ?? json?.message ?? "Error consultando Flow.",
          json?.data ?? null
        );
        return "error";
      }

      const data = json?.data ?? null;
      const rawStatus = data?.status ?? data?.paymentStatus ?? data?.state ?? null;
      const s = String(rawStatus ?? "").toLowerCase();

      setDetail(data);

      if (
        s === "2" ||
        s.includes("paid") ||
        s.includes("authorized") ||
        s.includes("success")
      ) {
        markPaid(data);
        return "paid";
      }

      if (
        s === "3" ||
        s.includes("rejected") ||
        s.includes("failed") ||
        s.includes("canceled")
      ) {
        markRejected(data);
        return "rejected";
      }

      setStatus("pending");
      return "pending";
    };

    const tick = async () => {
      tries += 1;

      try {
        const orderResult = await checkOrderInStrapi();
        if (!alive) return;

        if (orderResult === "paid" || orderResult === "rejected") {
          return;
        }

        if (orderResult === "pending") {
          if (tries < maxTries) {
            timeoutId = setTimeout(tick, 2000);
          }
          return;
        }

        const flowResult = await checkFlowStatus();
        if (!alive) return;

        if (flowResult === "paid" || flowResult === "rejected") {
          return;
        }

        if (flowResult === "pending" && tries < maxTries) {
          timeoutId = setTimeout(tick, 2000);
          return;
        }

        if (flowResult === "no-token") {
          markError("No encontramos datos suficientes para validar el pago.");
          return;
        }

        if (flowResult === "error") {
          return;
        }

        if (tries < maxTries) {
          timeoutId = setTimeout(tick, 2000);
        }
      } catch (e: unknown) {
        if (!alive) return;

        const message =
          e instanceof Error ? e.message : "Error consultando el estado.";

        markError(message);
      }
    };

    tick();

    return () => {
      alive = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [tokenFromUrl, cart, wizard]);

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="rounded-md border bg-white p-6">
        <h1 className="text-xl font-black">RESULTADO DEL PAGO</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Estamos verificando tu transacción con Flow.
        </p>

        <Separator className="my-4" />

        {status === "loading" && <p className="text-sm">Procesando…</p>}

        {status === "pending" && (
          <div className="space-y-2">
            <p className="text-sm">Pago en proceso… (esperando confirmación)</p>
            <p className="text-xs text-muted-foreground">
              Esto puede tardar unos segundos mientras confirmamos tu orden.
            </p>
          </div>
        )}

        {status === "paid" && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">✅ Pago aprobado</p>
            <p className="text-xs text-muted-foreground">
              Tu pedido quedó registrado. Te enviaremos confirmación al correo.
            </p>

            <div className="pt-3">
              <Button className="w-full" onClick={() => router.push("/")}>
                Volver al inicio
              </Button>
            </div>
          </div>
        )}

        {status === "rejected" && (
          <div className="space-y-3">
            <p className="text-sm font-semibold">❌ Pago rechazado o cancelado</p>
            <p className="text-xs text-muted-foreground">
              Puedes intentar nuevamente desde el carrito.
            </p>

            <div className="flex gap-2 pt-2">
              <Button className="w-full" onClick={() => router.push("/cart")}>
                Volver al carrito
              </Button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <p className="text-sm font-semibold">⚠️ No pudimos validar el pago</p>
            <p className="text-xs text-muted-foreground">
              Intenta refrescar o vuelve al carrito.
            </p>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </Button>
              <Button className="w-full" onClick={() => router.push("/cart")}>
                Ir al carrito
              </Button>
            </div>
          </div>
        )}

        {detail && (
          <>
            <Separator className="my-4" />
            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground">
                Ver detalle (debug)
              </summary>
              <pre className="mt-2 overflow-auto rounded-md bg-neutral-50 p-3">
                {JSON.stringify(detail, null, 2)}
              </pre>
            </details>
          </>
        )}
      </div>
    </div>
  );
}

export default function FlowReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 py-16">
          <div className="rounded-md border bg-white p-6">
            <h1 className="text-xl font-black">RESULTADO DEL PAGO</h1>
            <p className="mt-2 text-sm text-muted-foreground">Cargando…</p>
          </div>
        </div>
      }
    >
      <FlowReturnContent />
    </Suspense>
  );
}