"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import type {
  CartLine,
  PrintQuoteCartLine,
  ProductCartLine,
} from "@/types/cart";

type CartLineInput =
  | Omit<ProductCartLine, "id">
  | Omit<PrintQuoteCartLine, "id">;

type CartState = {
  items: CartLine[];

  // 👇 NUEVO: evento de último agregado
  lastAddedItem: CartLine | null;
  clearLastAdded: () => void;

  addItem: (line: CartLineInput) => void;
  removeItem: (lineId: string) => void;

  incQty: (lineId: string) => void;
  decQty: (lineId: string) => void;

  clear: () => void;
};

const makeLineId = (line: CartLineInput) => {
  if (line.kind === "print-quote") {
    const anchor =
      line.printQuote.quoteId ||
      line.printQuote.fileId ||
      line.printQuote.fileName.toLowerCase().replace(/\s+/g, "-");

    return `print-quote:${anchor}`;
  }

  return `${line.productId}:${line.variantId}`;
};

const getCartToastDescription = (line: CartLine) => {
  if (line.kind === "print-quote") {
    return line.printQuote.fileName;
  }

  return line.variantName;
};

const notifyCartItemAdded = (line: CartLine, mode: "added" | "updated") => {
  const title =
    mode === "updated" ? "Cantidad actualizada" : "Agregado al carrito";

  toast.success(title, {
    description: getCartToastDescription(line),
    action: {
      label: "Ver carrito",
      onClick: () => {
        window.location.href = "/cart";
      },
    },
  });
};

export const useCart = create(
  persist<CartState>(
    (set, get) => ({
      items: [],
      lastAddedItem: null,

      clearLastAdded: () => set({ lastAddedItem: null }),

      addItem: (line) => {
        const id = makeLineId(line);
        const items = get().items;

        const existing = items.find((i) => i.id === id);

        if (existing) {
          const updated: CartLine =
            line.kind === "print-quote"
              ? { ...line, id, qty: 1 }
              : {
                  ...existing,
                  qty: existing.qty + line.qty,
                };

          set({
            items: items.map((i) => (i.id === id ? updated : i)),
            lastAddedItem: updated,
          });

          notifyCartItemAdded(updated, "updated");
          return;
        }

        const newItem: CartLine = { ...line, id };

        set({
          items: [...items, newItem],
          lastAddedItem: newItem,
        });

        notifyCartItemAdded(newItem, "added");
      },

      removeItem: (lineId) =>
        set({ items: get().items.filter((i) => i.id !== lineId) }),

      incQty: (lineId) =>
        set({
          items: get().items.map((i) =>
            i.id === lineId && i.kind !== "print-quote"
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        }),

      decQty: (lineId) =>
        set({
          items: get().items.map((i) =>
            i.id === lineId && i.kind !== "print-quote"
              ? { ...i, qty: Math.max(1, i.qty - 1) }
              : i
          ),
        }),

      clear: () => set({ items: [], lastAddedItem: null }),
    }),
    { name: "eden-cart" }
  )
);










