"use client";

import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatPrice";
import { cn } from "@/lib/utils";
import type { CartLine } from "@/types/cart";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItemProps {
  item: CartLine;
}

const CartItem = ({ item }: CartItemProps) => {
  const router = useRouter();
  const { removeItem } = useCart();

  return (
    <li className="flex py-6 border-b">
      {/* Ruta del producto */}
      <div
        onClick={() => router.push(`/product/${item.productSlug}`)}
        className="cursor-pointer"
      >
        <img
          src={item.imageUrl}
          alt={item.variantName || "Variant"}
          className="w-24 h-24 overflow-hidden rounded-md sm:w-auto sm:h-32 object-cover"
        />
      </div>

      {/* Nombres y precio */}
      <div className="flex justify-between flex-1 px-6 gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-bold truncate">{item.variantName}</h2>
          {item.sku ? (
            <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
          ) : null}
          <p className="text-sm text-muted-foreground">Cantidad: {item.qty}</p>
        </div>

        <div className="flex items-center gap-4">
          <p className="font-semibold">
            {formatPrice(item.unitPrice * item.qty)}
          </p>

          <button
            className={cn(
              "rounded-full flex items-center justify-center bg-white border cursor-pointer p-1"
            )}
            onClick={() => removeItem(item.id)}
            aria-label="Eliminar item"
            type="button"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;


