"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import {
  khInterferenceBoldFont,
  khInterferenceLightFont,
  khInterferenceRegularFont,
} from "@/app/(routes)/cart/components/cart-fonts";
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
  trackingNumber: string | null;
};

// FORMATO DE FECHA
// Convierte la fecha de Strapi al formato corto que se muestra en cada pedido.
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

// LISTADO DE ARTICULOS
// Une los productos de una orden en una sola linea y agrega la cantidad cuando es mayor a uno.
function OrderItemsText({ items }: { items: ProfileOrderItem[] }) {
  const text = useMemo(() => {
    if (!items.length) return "Sin articulos registrados";

    return items
      .map((item) => `${item.name}${item.qty > 1 ? ` x${item.qty}` : ""}`)
      .join(", ");
  }, [items]);

  return (
    <p
      className={`${khInterferenceLightFont.className} mt-3 text-[12px] leading-[1.25] text-black/70`}
    >
      {text}
    </p>
  );
}

export function ProfileOrdersView({ onBack }: ProfileOrdersViewProps) {
  // DATOS Y ESTADOS DE CONSULTA
  // `orders` recibe las ordenes del usuario; loading y error gobiernan las vistas de respuesta.
  const [orders, setOrders] = useState<ProfileOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // PROTECCION DE DESMONTAJE
    // Evita actualizar estado si el usuario vuelve atras antes de que termine la consulta.
    let isMounted = true;

    // CONSULTA DE PEDIDOS
    // La API agrupa los productos por orden y entrega total, fecha y numero de seguimiento.
    async function loadOrders() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/profile/orders", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        const json = await response.json();

        if (!response.ok || !json?.ok) {
          throw new Error(json?.error || "No se pudieron cargar tus pedidos");
        }

        if (isMounted) {
          setOrders(Array.isArray(json.orders) ? json.orders : []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudieron cargar tus pedidos"
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    // CONTENEDOR GENERAL DE PEDIDOS
    // La cabecera permanece arriba; la lista puede desplazarse de manera independiente.
    <div className="flex h-full flex-col bg-[#fafafa] text-black">
      {/* CABECERA: vuelve al menu principal y mantiene la jerarquia de Mi cuenta. */}
      <header className="flex items-center gap-2 border-b border-black px-5 pb-5 pt-14">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver al perfil"
          className="
            inline-flex size-8 items-center justify-center border border-black
            transition-colors hover:bg-[#ADFE00]
          "
        >
          <ChevronLeft className="size-4" strokeWidth={2} />
        </button>
        <div>
          <p
            className={`${khInterferenceLightFont.className} text-[10px] uppercase text-black/55`}
          >
            Mi cuenta
          </p>
          <h2
            className={`${khInterferenceBoldFont.className} mt-1 text-[29px] uppercase leading-none`}
          >
            Pedidos
          </h2>
        </div>
      </header>

      {/* AREA DESPLAZABLE: contiene los cuatro estados visuales de la consulta. */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        {/* ESTADO 01 - CARGANDO: indicador centrado antes de recibir las ordenes. */}
        {isLoading && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Loader2 className="mb-4 size-6 animate-spin text-[#6b9b00]" />
            <p
              className={`${khInterferenceRegularFont.className}
                text-[12px] uppercase text-black/60`}
            >
              Cargando pedidos
            </p>
          </div>
        )}

        {/* ESTADO 02 - ERROR: bloque rojo cuando la API no logra cargar el historial. */}
        {!isLoading && error && (
          <div className="border-l-4 border-red-600 bg-red-50 px-4 py-3">
            <p
              className={`${khInterferenceRegularFont.className}
                text-[12px] uppercase text-red-700`}
            >
              {error}
            </p>
          </div>
        )}

        {/* ESTADO 03 - SIN PEDIDOS: explicacion breve para una cuenta nueva. */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="flex h-full flex-col justify-center border-y border-black py-8">
            <p
              className={`${khInterferenceBoldFont.className}
                text-[25px] uppercase leading-none`}
            >
              Aun no hay pedidos
            </p>
            <p
              className={`${khInterferenceLightFont.className}
                mt-3 max-w-[240px] text-[13px] leading-[1.25] text-black/65`}
            >
              Cuando realices tu primera compra, aparecera aqui con su estado.
            </p>
          </div>
        )}

        {/* ESTADO 04 - LISTA DE PEDIDOS: cada articulo representa una orden completa. */}
        {!isLoading && !error && orders.length > 0 && (
          <div className="border-t border-black">
            {orders.map((order) => (
              // TARJETA/LINEA DE PEDIDO
              // El borde inferior separa ordenes sin usar contenedores visuales adicionales.
              <article key={order.id} className="border-b border-black py-5">
                {/* CABECERA DE LA ORDEN: fecha e identificador a la izquierda, total a la derecha. */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p
                      className={`${khInterferenceLightFont.className} text-[10px] uppercase text-black/55`}
                    >
                      Pedido · {formatOrderDate(order.date)}
                    </p>
                    <h3
                      className={`${khInterferenceBoldFont.className} mt-2 break-words text-[17px] uppercase leading-[1.05]`}
                    >
                      {order.id}
                    </h3>
                  </div>
                  <p
                    className={`${khInterferenceBoldFont.className} shrink-0 text-[18px] leading-none`}
                  >
                    {formatPrice(order.total)}
                  </p>
                </div>

                {/* ARTICULOS: texto resumido con todos los productos de esta orden. */}
                <OrderItemsText items={order.items} />

                {order.trackingNumber ? (
                  // ESTADO ENVIADO
                  // Verde Eden: confirma despacho y hace visible el numero de seguimiento.
                  <div className="mt-4 border-l-4 border-[#ADFE00] bg-[#ADFE00]/20 px-3 py-3">
                    <p
                      className={`${khInterferenceRegularFont.className} text-[11px] uppercase`}
                    >
                      Tu pedido fue enviado
                    </p>
                    <p
                      className={`${khInterferenceLightFont.className} mt-2 text-[12px] text-black/70`}
                    >
                      Seguimiento: {order.trackingNumber}
                    </p>
                  </div>
                ) : (
                  // ESTADO PREPARACION
                  // Fondo negro: comunica que aun no existe numero de seguimiento disponible.
                  <div className="mt-4 border-l-4 border-black bg-black px-3 py-3 text-white">
                    <p
                      className={`${khInterferenceRegularFont.className} text-[11px] uppercase`}
                    >
                      Estamos preparando tu pedido
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
