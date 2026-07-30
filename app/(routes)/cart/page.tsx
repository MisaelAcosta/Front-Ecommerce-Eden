"use client";

import { useCart } from "@/hooks/use-cart";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";
import { maratypeFont, khInterferenceLightFont } from "./components/cart-fonts";

export default function Page() {
  const { items } = useCart();

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-28 lg:pt-34 sm:px-6 lg:px-8">
      {/* ENCABEZADO: identifica el flujo y la cantidad de piezas antes del detalle. */}
      <header className="mb-10 flex flex-col gap-5 border-b border-black pb-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          
          <h1 className={`${maratypeFont.className} text-5xl uppercase leading-none text-black sm:text-7xl`}>
            CHECKOUT
          </h1>
        </div>

        <p className={`${khInterferenceLightFont.className} text-sm uppercase text-black/60`}>
          {items.length} {items.length === 1 ? "pieza en tu pedido" : "piezas en tu pedido"}
        </p>
      </header>

      {/* CONTENIDO: productos a la izquierda y pasos de pago fijos a la derecha en escritorio. */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 lg:items-start">
        <section>
          <div className="mb-2 flex items-center justify-between border-b border-black/15 pb-3">
            <h2 className={`${khInterferenceLightFont.className} text-sm 
            uppercase tracking-[0.16em] text-black`}>
              Tu pedido
            </h2>
            <span className={`${khInterferenceLightFont.className} text-xs text-black/45`}>
              Revisa tus productos
            </span>
          </div>

          {items.length === 0 ? (
            <div className="border border-black/15 bg-[#f4f4f4] p-6">
              <p
                className={`${khInterferenceLightFont.className} text-sm text-black/55`}
              >
                No hay productos en el carrito.
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </section>

        {/* RESUMEN: se mantiene accesible mientras se revisan los productos. */}
        <aside className="lg:sticky lg:top-24">
          <Summary />
        </aside>
      </div>
    </div>
  );
}




