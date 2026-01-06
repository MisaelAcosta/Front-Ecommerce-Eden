"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/types/cart";

type CartState = {
  items: CartLine[];

  // 👇 NUEVO: evento de último agregado
  lastAddedItem: CartLine | null;
  clearLastAdded: () => void;

  addItem: (line: Omit<CartLine, "id">) => void;
  removeItem: (lineId: string) => void;

  incQty: (lineId: string) => void;
  decQty: (lineId: string) => void;

  clear: () => void;
};

const makeLineId = (productId: number, variantId: number) =>
  `${productId}:${variantId}`;

export const useCart = create(
  persist<CartState>(
    (set, get) => ({
      items: [],
      lastAddedItem: null,

      clearLastAdded: () => set({ lastAddedItem: null }),

      addItem: (line) => {
        const id = makeLineId(line.productId, line.variantId);
        const items = get().items;

        const existing = items.find((i) => i.id === id);

        if (existing) {
          const updated = {
            ...existing,
            qty: existing.qty + line.qty,
          };

          set({
            items: items.map((i) => (i.id === id ? updated : i)),
            lastAddedItem: updated,
          });
          return;
        }

        const newItem = { ...line, id };

        set({
          items: [...items, newItem],
          lastAddedItem: newItem,
        });
      },

      removeItem: (lineId) =>
        set({ items: get().items.filter((i) => i.id !== lineId) }),

      incQty: (lineId) =>
        set({
          items: get().items.map((i) =>
            i.id === lineId ? { ...i, qty: i.qty + 1 } : i
          ),
        }),

      decQty: (lineId) =>
        set({
          items: get().items.map((i) =>
            i.id === lineId ? { ...i, qty: Math.max(1, i.qty - 1) } : i
          ),
        }),

      clear: () => set({ items: [], lastAddedItem: null }),
    }),
    { name: "eden-cart" }
  )
);










