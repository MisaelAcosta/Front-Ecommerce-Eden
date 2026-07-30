"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import type { CartLine } from "@/types/cart";
import { formatPrice } from "@/lib/formatPrice";
import { cn } from "@/lib/utils";
import { useNavigationTransition } from "@/components/navigation-transition-provider";
import {
  khInterferenceLightFont,
  khInterferenceRegularFont,
} from "./cart-fonts";

interface CartItemProps {
  item: CartLine;
}

function formatCm(mm: number) {
  return (mm / 10).toFixed(1);
}

function getPrintQuoteDimensionsLabel(item: CartLine) {
  if (item.kind !== "print-quote" || !item.printQuote.dimensions) {
    return "Medidas pendientes";
  }

  const { x, y, z } = item.printQuote.dimensions;

  return `${formatCm(x)} x ${formatCm(y)} x ${formatCm(z)} cm`;
}

const CartItem = ({ item }: CartItemProps) => {
  const { navigateWithTransition } = useNavigationTransition();
  const { removeItem, incQty, decQty } = useCart();
  const isPrintQuote = item.kind === "print-quote";
  const destination = isPrintQuote ? "/cotiza" : `/product/${item.productSlug}`;

  return (
    <li className="flex items-start gap-4 border-b 
    border-black/15 py-5 sm:gap-6 sm:py-7">
      {/* La cotización 3D navega de vuelta a /cotiza; los productos normales conservan su detalle. */}
      <div
        onClick={() => navigateWithTransition(destination)}
        className="shrink-0 cursor-pointer bg-[#f1f1f1]"
      >
        <Image
          src={item.imageUrl}
          alt={item.variantName}
          width={112}
          height={112}
          className="h-24 w-24 object-contain sm:h-28 sm:w-28"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row 
      sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2
            className={`${khInterferenceRegularFont.className} truncate 
            text-sm uppercase leading-none text-black sm:text-lg`}
          >
            {item.variantName}
          </h2>

          {isPrintQuote ? (
            <div className="mt-2 space-y-1">
              <p
                className={`${khInterferenceLightFont.className} 
                text-xs uppercase text-black/50`}
              >
                {getPrintQuoteDimensionsLabel(item)}
              </p>
              <p
                className={`${khInterferenceLightFont.className} 
                text-xs uppercase text-black/50`}
              >
                {item.printQuote.selectedColor} · {item.printQuote.postProcessLabel}
              </p>
            </div>
          ) : (
            <div className="mt-2 flex items-center pt-2 lg:pt-4 gap-2">
              <button
                onClick={() => decQty(item.id)}
                className="flex h-8 w-8 items-center 
                justify-center lg:border border-black/20 transition-colors hover:border-[#ADFE00] hover:bg-[#ADFE00]"
                aria-label="Disminuir cantidad"
                type="button"
              >
                <Minus size={14} />
              </button>

              <span
                className={`${khInterferenceLightFont.className} w-6 
                text-center text-sm`}
              >
                {item.qty}
              </span>

              <button
                onClick={() => incQty(item.id)}
                className="flex h-8 w-8 items-center justify-center 
                lg:border border-black/20 transition-colors hover:border-[#ADFE00] hover:bg-[#ADFE00]"
                aria-label="Aumentar cantidad"
                type="button"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 
        sm:justify-end">
          <p
            className={`${khInterferenceLightFont.className} whitespace-nowrap 
            text-sm font-semibold text-black`}
          >
            {formatPrice(item.unitPrice * item.qty)}
          </p>

          <button
            onClick={() => removeItem(item.id)}
            className={cn(
              "flex h-8 w-8 items-center justify-center lg:border border-black/20 text-black/60 transition-colors hover:border-[#ADFE00] hover:bg-[#ADFE00] hover:text-black"
            )}
            aria-label="Eliminar producto"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
