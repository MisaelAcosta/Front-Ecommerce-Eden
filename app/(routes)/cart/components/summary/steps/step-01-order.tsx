"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatPrice";
import {
  khInterferenceLightFont,
  khInterferenceRegularFont,
} from "../../cart-fonts";

type Props = {
  onContinue: () => void;
};



const Step01Order = ({ onContinue }: Props) => {
  const { items } = useCart();

  const subtotal = items.reduce((acc, it) => acc + it.unitPrice * it.qty, 0);
  

  return (
    <div className="w-full rounded-md border bg-white p-5 shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3
          className={`${khInterferenceRegularFont.className} text-sm tracking-wide`}
        >
          RESUMEN DE ORDEN
        </h3>

        {/* mini “paginador” visual (solo decorativo por ahora) */}
        <div className="flex items-center gap-1">
          <span className="h-[3px] w-6 rounded-full bg-black" />
          <span className="h-[3px] w-2 rounded-full bg-black/20" />
          <span className="h-[3px] w-2 rounded-full bg-black/20" />
        </div>
      </div>

      <Separator className="my-3" />

      {/* Items */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <p
            className={`${khInterferenceLightFont.className} text-sm text-muted-foreground`}
          >
            No hay productos en el carrito.
          </p>
        ) : (
          items.map((it) => (
            <div key={it.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  className={`${khInterferenceLightFont.className} text-xs text-muted-foreground truncate`}
                >
                  {it.variantName}
                  {it.qty > 1 ? ` × ${it.qty}` : ""}
                </p>
              </div>

              <p
                className={`${khInterferenceLightFont.className} text-xs text-muted-foreground whitespace-nowrap`}
              >
                {formatPrice(it.unitPrice * it.qty)}
              </p>
            </div>
          ))
        )}
      </div>

      <Separator className="my-4" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <div>
          <p className={`${khInterferenceRegularFont.className} text-xs leading-4`}>
            ESTIMADO
          </p>
          <p className={`${khInterferenceRegularFont.className} text-xs leading-4`}>
            TOTAL
          </p>
        </div>

        <p className={`${khInterferenceLightFont.className} text-sm`}>
          {formatPrice(subtotal)}
        </p>
      </div>

      {/* CTA */}
      <Button
        className="mt-4 w-full bg-black cursor-pointer text-white hover:bg-black/90"
        onClick={onContinue}
        disabled={items.length === 0}
      >
        CONTINUAR
      </Button>
    </div>
  );
};

export default Step01Order;
