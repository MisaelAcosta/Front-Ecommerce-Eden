"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatPrice";
import { useNavigationTransition } from "@/components/navigation-transition-provider";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  khInterferenceLightFont,
  khInterferenceRegularFont,
} from "./cart-fonts";

type CartSummaryPanelProps = {
  children?: ReactNode;
};

function CartSummaryContent({ onContinue }: { onContinue: () => void }) {
  const { items } = useCart();
  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.unitPrice * item.qty, 0),
    [items]
  );

  return (
    <div className="w-full rounded-md border bg-white p-5 shadow-none">
      <div className="flex items-center justify-between">
        <h3
          className={`${khInterferenceRegularFont.className} text-sm uppercase tracking-wide`}
        >
          Resumen de pedido
        </h3>
        <ShoppingBag size={18} />
      </div>

      <div className="my-4 h-px bg-black/10" />

      <div className="space-y-3">
        {items.length === 0 ? (
          <p
            className={`${khInterferenceLightFont.className} text-sm text-muted-foreground`}
          >
            No hay productos en el carrito.
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4">
              <p
                className={`${khInterferenceLightFont.className} min-w-0 truncate text-xs text-muted-foreground`}
              >
                {item.variantName}
                {item.qty > 1 ? ` x ${item.qty}` : ""}
              </p>
              <p
                className={`${khInterferenceLightFont.className} whitespace-nowrap text-xs text-muted-foreground`}
              >
                {formatPrice(item.unitPrice * item.qty)}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="my-4 h-px bg-black/10" />

      <div className="flex items-center justify-between">
        <p
          className={`${khInterferenceRegularFont.className} text-xs uppercase leading-4`}
        >
          Total
        </p>
        <p className={`${khInterferenceLightFont.className} text-sm`}>
          {formatPrice(subtotal)}
        </p>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={items.length === 0}
        className={`${khInterferenceRegularFont.className} mt-4 w-full rounded-md bg-black px-4 py-3 text-xs uppercase tracking-[0.18em] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-45`}
      >
        Continuar
      </button>
    </div>
  );
}

function SummaryTriggerCard() {
  const { items } = useCart();
  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.unitPrice * item.qty, 0),
    [items]
  );
  const itemCount = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <button
      type="button"
      disabled={items.length === 0}
      className="group w-full rounded-md border bg-white p-5 text-left transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-white disabled:hover:text-black"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p
            className={`${khInterferenceRegularFont.className} text-sm uppercase tracking-wide`}
          >
            Resumen de pedido
          </p>
          <p
            className={`${khInterferenceLightFont.className} mt-1 text-xs text-muted-foreground group-hover:text-white/60`}
          >
            {itemCount} {itemCount === 1 ? "item" : "items"} en el carrito
          </p>
        </div>
        <ShoppingBag size={20} />
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <p
          className={`${khInterferenceRegularFont.className} text-xs uppercase leading-4`}
        >
          Total
        </p>
        <p className={`${khInterferenceLightFont.className} text-sm`}>
          {formatPrice(subtotal)}
        </p>
      </div>

      <p
        className={`${khInterferenceRegularFont.className} mt-4 rounded-full bg-black px-4 py-3 text-center text-xs uppercase tracking-[0.18em] text-white transition-colors group-hover:bg-white group-hover:text-black`}
      >
        Ver resumen
      </p>
    </button>
  );
}

export function CartSummaryPanel({ children }: CartSummaryPanelProps) {
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { navigateWithTransition } = useNavigationTransition();
  const trigger = children ?? <SummaryTriggerCard />;

  const handleContinue = () => {
    setDesktopOpen(false);
    setMobileOpen(false);
    window.setTimeout(() => navigateWithTransition("/cart"), 120);
  };

  return (
    <>
      <div className="hidden lg:block">
        <Sheet open={desktopOpen} onOpenChange={setDesktopOpen}>
          <SheetTrigger asChild>{trigger}</SheetTrigger>
          <SheetContent side="right" className="w-full overflow-y-auto p-4 sm:w-[430px]">
            <CartSummaryContent onContinue={handleContinue} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="lg:hidden">
        <Drawer open={mobileOpen} onOpenChange={setMobileOpen} direction="bottom">
          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
          <DrawerContent className="max-h-[86vh] overflow-y-auto p-4 pt-8">
            <DrawerClose className="absolute right-4 top-4 rounded-full border border-black/10 bg-white p-2 text-black shadow-sm transition-colors hover:bg-black hover:text-white">
              <X size={16} />
              <span className="sr-only">Cerrar resumen</span>
            </DrawerClose>
            <CartSummaryContent onContinue={handleContinue} />
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
