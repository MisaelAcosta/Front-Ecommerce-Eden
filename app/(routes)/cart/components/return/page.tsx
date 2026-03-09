"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function FlowReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = useMemo(() => searchParams.get("token"), [searchParams]);

  const [status, setStatus] = useState<UiStatus>("loading");
  const [detail, setDetail] = useState<FlowDetail | null>(null);

  const cart = useCart();
  const wizard = useCartWizard();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setDetail({ message: "No llegó token desde Flow." });
      return;
    }

    let alive = true;
    let tries = 0;
    const maxTries = 20; // ~40s si es cada 2s

    const tick = async () => {
      tries += 1;

      try {
        const res = await fetch(`/api/flow/status?token=${encodeURIComponent(token)}`, {
          method: "GET",
          cache: "no-store",
        });

        const json: { ok?: boolean; data?: FlowDetail; message?: string } = await res.json();

        if (!alive) return;

        if (!res.ok || !json?.ok) {
          setStatus("error");
          setDetail(json);
          return;
        }

        const data = json?.data;

        // ⚠️ Flow devuelve distintos campos según el producto.
        // Lo común: viene un "status" numérico o textual.
        const rawStatus = data?.status ?? data?.paymentStatus ?? data?.state ?? null;

        const s = String(rawStatus ?? "").toLowerCase();

        setDetail(data ?? null);

        if (s === "2" || s.includes("paid") || s.includes("authorized") || s.includes("success")) {
          setStatus("paid");

          // ✅ limpiar carrito + wizard
          cart.clear();
          wizard.resetWizard?.();

          return;
        }

        if (s === "3" || s.includes("rejected") || s.includes("failed") || s.includes("canceled")) {
          setStatus("rejected");
          return;
        }

        // si no es definitivo, seguimos consultando un rato
        setStatus("pending");

        if (tries >= maxTries) {
          return;
        }

        setTimeout(tick, 2000);
      } catch (e: unknown) {
        if (!alive) return;

        const message =
          e instanceof Error ? e.message : "Error consultando el estado.";

        setStatus("error");
        setDetail({ message });
      }
    };

    tick();

    return () => {
      alive = false;
    };
  }, [token, cart, wizard]);

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
              Si cerraste Flow muy rápido, esto puede tardar unos segundos.
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
              <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
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