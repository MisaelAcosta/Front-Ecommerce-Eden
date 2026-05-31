"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

type ProfileOrdersViewProps = {
  onBack: () => void;
};

type ProfileOrderItem = {
  name: string;
  qty: number;
};

type ProfileOrder = {
  id: string;
  date: string | null;
  total: number;
  items: ProfileOrderItem[];
};

function formatOrderDate(value: string | null) {
  if (!value) return "Fecha no disponible";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function OrderItemsText({ items }: { items: ProfileOrderItem[] }) {
  const text = useMemo(() => {
    if (!items.length) return "Sin articulos registrados";

    return items
      .map((item) => `${item.name}${item.qty > 1 ? ` x${item.qty}` : ""}`)
      .join(", ");
  }, [items]);

  return <p className="mt-1 text-xs leading-5 text-neutral-600">{text}</p>;
}

export function ProfileOrdersView({ onBack }: ProfileOrdersViewProps) {
  const [orders, setOrders] = useState<ProfileOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch("/api/profile/orders", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok || !json?.ok) {
          throw new Error(json?.error || "No se pudieron cargar tus pedidos");
        }

        if (isMounted) {
          setOrders(Array.isArray(json.orders) ? json.orders : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar tus pedidos"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-full p-1 hover:bg-neutral-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-black tracking-tight">PEDIDOS</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {isLoading && (
          <div className="flex h-full flex-col items-center justify-center text-sm text-neutral-500">
            <Loader2 className="mb-3 h-5 w-5 animate-spin" />
            <p>Cargando pedidos...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-neutral-500">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-sm text-neutral-500">
            <p>Aun no tienes pedidos.</p>
            <p className="mt-1">Cuando realices tu primera compra, aparecera aqui.</p>
          </div>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-lg border border-neutral-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      Pedido
                    </p>
                    <h3 className="mt-1 text-sm font-black text-neutral-950">
                      {order.id}
                    </h3>
                  </div>
                  <p className="text-right text-sm font-black text-neutral-950">
                    {formatPrice(order.total)}
                  </p>
                </div>

                <div className="mt-4 border-t border-neutral-100 pt-3">
                  <p className="text-xs text-neutral-500">
                    Fecha: {formatOrderDate(order.date)}
                  </p>
                  <OrderItemsText items={order.items} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
