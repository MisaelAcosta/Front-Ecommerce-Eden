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

function FlowReturnContent() {
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
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let tries = 0;
    const maxTries = 20;

    const tick = async () => {
      tries += 1;

      try {
        const res = await fetch(
          `/api/flow/status?token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const json: {
          ok?: boolean;
          data?: FlowDetail;
          message?: string;
        } = await res.json();

        if (!alive) return;

        if (!res.ok || !json?.ok) {
          setStatus("error");
          setDetail(
            json?.data ?? {
              message: json?.message ?? "Error consultando Flow.",
            }
          );
          return;
        }

        const data = json?.data;
        const rawStatus =
          data?.status ?? data?.paymentStatus ?? data?.state ?? null;
        const s = String(rawStatus ?? "").toLowerCase();

        setDetail(data ?? null);

        if (
          s === "2" ||
          s.includes("paid") ||
          s.includes("authorized") ||
          s.includes("success")
        ) {
          setStatus("paid");
          cart.clear();
          wizard.resetWizard?.();
          return;
        }

        if (
          s === "3" ||
          s.includes("rejected") ||
          s.includes("failed") ||
          s.includes("canceled")
        ) {
          setStatus("rejected");
          return;
        }

        setStatus("pending");

        if (tries >= maxTries) return;

        timeoutId = setTimeout(tick, 2000);
      } catch (error: unknown) {
        if (!alive) return;

        const message =
          error instanceof Error
            ? error.message
            : "Error consultando el estado.";

        setStatus("error");
        setDetail({ message });
      }
    };

    tick();

    return () => {
      alive = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [token, cart, wizard]);

  return (
    <section className="min-h-[calc(100vh-140px)] px-4 pt-35 sm:px-6 sm:pt-22 lg:pt-30">
      <div className="mx-auto w-full max-w-2xl">
        <div className="border bg-white p-5 shadow-none sm:p-6 md:p-8">
          <h1 className="text-xl font-black tracking-tight sm:text-2xl">
            RESULTADO DEL PAGO
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-[15px]">
            Estamos verificando tu transacción con Flow.
          </p>

          <Separator className="my-4 sm:my-5" />

          {status === "loading" && (
            <p className="text-sm sm:text-base">Procesando…</p>
          )}

          {status === "pending" && (
            <div className="space-y-2">
              <p className="text-sm font-medium sm:text-base">
                Pago en proceso… (esperando confirmación)
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Si cerraste Flow muy rápido, esto puede tardar unos segundos.
              </p>
            </div>
          )}

          {status === "paid" && (
            <div className="space-y-3">
              <p className="text-sm font-semibold sm:text-base">
                ✅ Pago aprobado
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Tu pedido quedó registrado. Te enviaremos confirmación al correo.
              </p>

              <div className="pt-2 sm:pt-3">
                <Button
                  className="h-11 w-full"
                  onClick={() => router.push("/")}
                >
                  Volver al inicio
                </Button>
              </div>
            </div>
          )}

          {status === "rejected" && (
            <div className="space-y-3">
              <p className="text-sm font-semibold sm:text-base">
                ❌ Pago rechazado o cancelado
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Puedes intentar nuevamente desde el carrito.
              </p>

              <div className="pt-2 sm:pt-3 ">
                <Button
                  className="h-11 w-full "
                  onClick={() => router.push("/cart")}
                >
                  Volver al carrito
                </Button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <p className="text-sm font-semibold sm:text-base">
                ⚠️ No pudimos validar el pago
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Intenta refrescar o vuelve al carrito.
              </p>

              <div className="flex flex-col gap-2 pt-2 sm:flex sm:pt-3">
                <Button
                  variant="outline"
                  className="h-11 w-full cursor-pointer"
                  onClick={() => window.location.reload()}
                >
                  Reintentar
                </Button>

                <Button
                  className="h-11 w-full cursor-pointer"
                  onClick={() => router.push("/cart")}
                >
                  Ir al carrito
                </Button>
              </div>
            </div>
          )}

          {detail && (
            <>
              <Separator className="my-4 sm:my-5" />
              <details className="text-xs sm:text-sm hidden">
                <summary className="cursor-pointer text-muted-foreground">
                  Ver detalle (debug)
                </summary>
                <pre className="mt-2 overflow-x-auto break-words rounded-md bg-neutral-50 p-3 text-[11px] sm:text-xs">
                  {JSON.stringify(detail, null, 2)}
                </pre>
              </details>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function FlowReturnPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-[calc(100vh-140px)] px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
          <div className="mx-auto w-full max-w-2xl">
            <div className="rounded-xl border bg-white p-5 shadow-sm sm:p-6 md:p-8">
              <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                RESULTADO DEL PAGO
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-[15px]">
                Cargando…
              </p>
            </div>
          </div>
        </section>
      }
    >
      <FlowReturnContent />
    </Suspense>
  );
}