"use client";

import { useCart } from "@/hooks/use-cart";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";
import { maratypeFont, khInterferenceLightFont } from "./components/cart-fonts";

export default function Page() {
  const { items } = useCart();

  return (
    <div className="max-w-6xl px-4 py-16 mx-auto sm:px-0 ">
      <h1 className={`${maratypeFont.className} mb-8 pt-10 text-2xl sm:text-3xl`}>
        CHEKOUT
      </h1>

      {/* Layout: izquierda items / derecha summary */}
      <div className="grid grid-cols-1 gap-10 sm:gap-20 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* LEFT: Lista de productos */}
        <div>
          {items.length === 0 ? (
            <div className="rounded-md border p-6">
              <p
                className={`${khInterferenceLightFont.className} text-sm text-muted-foreground`}
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
        </div>

        {/* RIGHT: Summary sticky */}
        <div className="lg:sticky lg:top-24">
          <Summary />
        </div>
      </div>
    </div>
  );
}




