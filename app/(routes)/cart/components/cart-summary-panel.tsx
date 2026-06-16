"use client";

import Image from "next/image";
import { useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
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

function formatSummaryPrice(value: number) {
  return formatPrice(value).replace("$", "").trim();
}

function SwipeContinueButton({
  disabled,
  onComplete,
}: {
  disabled: boolean;
  onComplete: () => void;
}) {
  const trackRef = useRef<HTMLButtonElement | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const thumbSize = 72;

  const getMaxDrag = () => {
    const width = trackRef.current?.getBoundingClientRect().width ?? 0;
    return Math.max(0, width - thumbSize - 4);
  };

  const updateDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;

    const next = event.clientX - rect.left - thumbSize / 2;
    setDragX(Math.min(getMaxDrag(), Math.max(0, next)));
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;

    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    updateDrag(event);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;
    updateDrag(event);
  };

  const handlePointerEnd = () => {
    if (!isDragging) return;

    const maxDrag = getMaxDrag();
    const completed = maxDrag > 0 && dragX >= maxDrag * 0.78;

    setIsDragging(false);

    if (completed) {
      setDragX(maxDrag);
      window.setTimeout(onComplete, 100);
      return;
    }

    setDragX(0);
  };

  return (
    <button
      ref={trackRef}
      type="button"
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      className={`${khInterferenceRegularFont.className} relative h-12 w-full touch-none overflow-hidden rounded-full bg-white/20 text-xs uppercase tracking-[0.16em] text-white/35 disabled:cursor-not-allowed disabled:opacity-45`}
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        Continuar
      </span>
      <span
        className={`absolute left-0.5 top-0.5 flex h-11 w-[68px] items-center justify-center rounded-full bg-white text-black shadow-sm transition-transform ${
          isDragging ? "duration-0" : "duration-200"
        }`}
        style={{ transform: `translateX(${dragX}px)` }}
      >
        <ArrowRight size={18} />
      </span>
    </button>
  );
}

function CartSummaryContent({
  mode,
  onContinue,
}: {
  mode: "desktop" | "mobile";
  onContinue: () => void;
}) {
  const { items, removeItem } = useCart();
  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.unitPrice * item.qty, 0),
    [items]
  );

  if (mode === "mobile") {
    return (
      <div className="flex h-full min-h-[330px] flex-col bg-[#090909] px-8 pb-8 pt-10 text-white">
        <h3
          className={`${khInterferenceRegularFont.className} text-2xl uppercase tracking-normal`}
        >
          Resumen
        </h3>

        <div className="mt-5 space-y-4">
          {items.length === 0 ? (
            <p
              className={`${khInterferenceLightFont.className} text-xs uppercase text-white/45`}
            >
              No hay productos en el carrito.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 text-white"
              >
                <p
                  className={`${khInterferenceLightFont.className} min-w-0 flex-1 truncate text-xs uppercase text-white/60`}
                >
                  {item.variantName}
                  {item.qty > 1 ? ` x${item.qty}` : ""}
                </p>
                <div className="flex items-center gap-1">
                  <p
                    className={`${khInterferenceRegularFont.className} whitespace-nowrap text-sm text-white`}
                  >
                    {formatSummaryPrice(item.unitPrice * item.qty)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-white/70 transition-colors hover:text-white"
                    aria-label="Eliminar producto"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 h-px bg-white/15" />

        <div className="mt-4 flex items-center justify-between">
          <p
            className={`${khInterferenceLightFont.className} text-xs uppercase text-white/55`}
          >
            Total
          </p>
          <p className={`${khInterferenceRegularFont.className} text-sm`}>
            {formatSummaryPrice(subtotal)}
          </p>
        </div>

        <div className="mt-auto pt-10">
          <SwipeContinueButton
            disabled={items.length === 0}
            onComplete={onContinue}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-screen flex-col bg-[#090909] px-8 pb-8 pt-16 text-white">
      <div>
        <h3
          className={`${khInterferenceRegularFont.className} text-2xl uppercase tracking-normal`}
        >
          Resumen
        </h3>

        <div className="mt-7 space-y-6">
          {items.length === 0 ? (
            <p
              className={`${khInterferenceLightFont.className} text-xs uppercase text-white/45`}
            >
              No hay productos en el carrito.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl bg-[#141414] p-3 pr-4"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.variantName}
                  width={54}
                  height={54}
                  className="h-[54px] w-[54px] shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`${khInterferenceLightFont.className} truncate text-xs uppercase leading-4 text-white/55`}
                  >
                    {item.variantName}
                    {item.qty > 1 ? ` x${item.qty}` : ""}
                  </p>
                  <p
                    className={`${khInterferenceRegularFont.className} mt-1 text-sm text-white`}
                  >
                    {formatSummaryPrice(item.unitPrice * item.qty)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="self-start text-white/55 transition-colors hover:text-white"
                  aria-label="Eliminar producto"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-auto border-t border-white/15 pt-7">
        <div className="flex items-center justify-between">
          <p
            className={`${khInterferenceLightFont.className} text-xs uppercase text-white/55`}
          >
            Total
          </p>
          <p className={`${khInterferenceRegularFont.className} text-sm`}>
            {formatSummaryPrice(subtotal)}
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          disabled={items.length === 0}
          className={`${khInterferenceRegularFont.className} mx-auto mt-9 block w-[194px] rounded-xl bg-white px-4 py-3 text-xs uppercase tracking-normal text-black transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-45`}
        >
          Continuar
        </button>
      </div>
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
          <SheetContent
            side="right"
            className="w-full overflow-y-auto border-l-0 bg-[#090909] p-0 text-white [&>button]:right-8 [&>button]:top-9 [&>button]:text-white sm:w-[326px]"
          >
            <CartSummaryContent mode="desktop" onContinue={handleContinue} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="lg:hidden">
        <Drawer open={mobileOpen} onOpenChange={setMobileOpen} direction="bottom">
          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
          <DrawerContent className="max-h-[86vh] overflow-y-auto rounded-t-[18px] border-t-0 bg-[#090909] p-0 text-white [&>div:first-child]:hidden">
            <DrawerClose className="absolute right-5 top-5 z-10 text-white transition-colors hover:text-white/70">
              <X size={22} />
              <span className="sr-only">Cerrar resumen</span>
            </DrawerClose>
            <CartSummaryContent mode="mobile" onContinue={handleContinue} />
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
