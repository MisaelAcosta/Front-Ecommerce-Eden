"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Loader2, Package, Truck } from "lucide-react";
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

// SEGUIMIENTO VISUAL DEL PEDIDO
// La caja se activa cuando la orden esta en preparacion. El camion se activa
// unicamente cuando Strapi entrega un numero de seguimiento valido.
function OrderStatusTracker({
  trackingNumber,
}: {
  trackingNumber: string | null;
}) {
  const isShipped = Boolean(trackingNumber);

  return (
    <section className="mt-5">
      {/* BARRA DE PROGRESO: fondo negro, nodos verdes activos y tramo gris pendiente. */}
      <div className=" bg-black px-4 py-2">
        <div className="flex items-center">
          {/* PASO 01 - PREPARACION: siempre activo una vez creada la orden. */}
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#ADFE00] text-black">
            <Package className="size-5" strokeWidth={1} />
          </div>

          {/* CONECTOR: avanza completamente solo despues de que se envia el pedido. */}
          <div className="relative h-2 flex-1 overflow-hidden bg-white/25">
            <span
              className={`absolute inset-y-0 left-0 bg-[#ADFE00] 
                transition-[width] duration-500 ${
                isShipped ? "w-full" : "w-[42%]"
              }`}
            />
          </div>

          {/* PASO 02 - ENVIO: cambia de gris a verde al existir trackingNumber. */}
          <div
            className={`flex size-11 shrink-0 items-center justify-center
               rounded-full transition-colors ${
              isShipped ? "bg-[#ADFE00] text-black" : "bg-white/25 text-white/60"
            }`}
          >
            <Truck className="size-5" strokeWidth={1} />
          </div>
        </div>

        {/* ETIQUETAS: nombran cada icono sin recargar la barra principal. */}
        <div
          className={`${khInterferenceRegularFont.className} mt-3 grid grid-cols-2 text-[10px] uppercase`}
        >
          <span className="text-[#ADFE00]"></span>
          <span className={isShipped ? "text-right text-[#ADFE00]" : "text-right text-white/50"}>
            
          </span>
        </div>
      </div>

      {/* MENSAJE DE ESTADO: se actualiza junto con el segundo paso de la barra. */}
      <div className="mt-3  bg-[#ADFE00]/20 px-3 py-3">
        <p
          className={`${khInterferenceRegularFont.className} text-[11px] uppercase`}
        >
          {isShipped ? "Tu pedido fue enviado" : "Estamos preparando tu pedido"}
        </p>
        {isShipped && (
          <p
            className={`${khInterferenceLightFont.className} mt-2 text-[12px] text-black/70`}
          >
            Seguimiento: {trackingNumber}
          </p>
        )}
      </div>
    </section>
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
            inline-flex size-8 items-center justify-center 
            transition-colors hover:bg-[#ADFE00]
          "
        >
          <ChevronLeft className="size-4" strokeWidth={2} />
        </button>
        <div>
          <p
            className={`${khInterferenceLightFont.className} text-[10px] tracking-widest uppercase text-black/55`}
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
                text-[25px] tracking-widest uppercase leading-none`}
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
              <article key={order.id} className=" py-5">
                {/* CABECERA DE LA ORDEN: fecha e identificador a la izquierda, total a la derecha. */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p
                      className={`${khInterferenceLightFont.className} text-[10px] tracking-widest uppercase text-black/55`}
                    >
                      Pedido · {formatOrderDate(order.date)}
                    </p>
                    <h3
                      className={`${khInterferenceRegularFont.className} mt-2 
                      break-words text-[10px] lg:text-[13px] uppercase leading-[1.05]`}
                    >
                      {order.id}
                    </h3>
                  </div>
                  <p
                    className={`${khInterferenceRegularFont.className} 
                    shrink-0 text-[10px] lg:text[13px] leading-none`}
                  >
                    {formatPrice(order.total)}
                  </p>
                </div>

                {/* ARTICULOS: texto resumido con todos los productos de esta orden. */}
                <OrderItemsText items={order.items} />

                {/* ESTADO DEL PEDIDO: caja + camion y mensaje segun trackingNumber. */}
                <OrderStatusTracker trackingNumber={order.trackingNumber} />
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
