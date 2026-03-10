"use client";

import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatPrice";
import { cn } from "@/lib/utils";
import type { CartLine } from "@/types/cart";
import { Minus, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItemProps {
  item: CartLine;
}

const CartItem = ({ item }: CartItemProps) => {
  const router = useRouter();
  const { removeItem, incQty, decQty } = useCart();

  return (
    <li className="flex items-center gap-4 py-6 border-b">
      {/* Imagen */}
      <div
        onClick={() => router.push(`/product/${item.productSlug}`)}
        className="cursor-pointer"
      >
        <img
          src={item.imageUrl}
          alt={item.variantName}
          className="w-20 h-20 rounded-md object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 justify-between items-center gap-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold truncate">{item.variantName}</h2>

          {/* Control cantidad */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => decQty(item.id)}
              className="h-8 w-8 border rounded-md flex items-center justify-center hover:bg-muted"
              aria-label="Disminuir cantidad"
              type="button"
            >
              <Minus size={14} />
            </button>

            <span className="w-6 text-center text-sm font-medium">
              {item.qty}
            </span>

            <button
              onClick={() => incQty(item.id)}
              className="h-8 w-8 border rounded-md flex items-center justify-center hover:bg-muted"
              aria-label="Aumentar cantidad"
              type="button"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Precio + eliminar */}
        <div className="flex items-center gap-4">
          <p className="text-sm font-semibold whitespace-nowrap">
            {formatPrice(item.unitPrice * item.qty)}
          </p>

          <button
            onClick={() => removeItem(item.id)}
            className={cn(
              "h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted"
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




