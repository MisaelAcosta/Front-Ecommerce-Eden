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
    <li className="flex items-center gap-4 border-b py-6">
      {/* La cotización 3D navega de vuelta a /cotiza; los productos normales conservan su detalle. */}
      <div
        onClick={() => navigateWithTransition(destination)}
        className="cursor-pointer"
      >
        <Image
          src={item.imageUrl}
          alt={item.variantName}
          width={80}
          height={80}
          className="h-20 w-20 rounded-md object-cover"
        />
      </div>

      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="min-w-0">
          <h2
            className={`${khInterferenceRegularFont.className} truncate text-sm`}
          >
            {item.variantName}
          </h2>

          {isPrintQuote ? (
            <div className="mt-2 space-y-1">
              <p
                className={`${khInterferenceLightFont.className} text-xs text-muted-foreground`}
              >
                {getPrintQuoteDimensionsLabel(item)}
              </p>
              <p
                className={`${khInterferenceLightFont.className} text-xs text-muted-foreground`}
              >
                {item.printQuote.selectedColor} · {item.printQuote.postProcessLabel}
              </p>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => decQty(item.id)}
                className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted"
                aria-label="Disminuir cantidad"
                type="button"
              >
                <Minus size={14} />
              </button>

              <span
                className={`${khInterferenceLightFont.className} w-6 text-center text-sm`}
              >
                {item.qty}
              </span>

              <button
                onClick={() => incQty(item.id)}
                className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted"
                aria-label="Aumentar cantidad"
                type="button"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <p
            className={`${khInterferenceLightFont.className} whitespace-nowrap text-sm`}
          >
            {formatPrice(item.unitPrice * item.qty)}
          </p>

          <button
            onClick={() => removeItem(item.id)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted"
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
