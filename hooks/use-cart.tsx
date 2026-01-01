"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/types/cart";

type CartState = {
  items: CartLine[];

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

      addItem: (line) => {
        const id = makeLineId(line.productId, line.variantId);
        const items = get().items;

        const existing = items.find((i) => i.id === id);

        if (existing) {
          set({
            items: items.map((i) =>
              i.id === id ? { ...i, qty: i.qty + line.qty } : i
            ),
          });
          return;
        }

        set({ items: [...items, { ...line, id }] });
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
          items: get().items
            .map((i) =>
              i.id === lineId ? { ...i, qty: Math.max(1, i.qty - 1) } : i
            )
            .filter((i) => i.qty > 0),
        }),

      clear: () => set({ items: [] }),
    }),
    { name: "eden-cart" }
  )
);









