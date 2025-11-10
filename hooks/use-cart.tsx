"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ProductType } from "@/types/product";
import { toast } from "sonner";

interface CartStore {
  items: ProductType[];
  addItem: (item: ProductType) => void;
  removeItem: (id: number) => void;
  removeAll: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: ProductType) => {
        const exists = get().items.some((i) => i.id === item.id);
        if (exists) {
          toast.error("⚠️ El producto ya está en el carrito");
          return;
        }

        set({ items: [...get().items, item] });
        toast.success("🛒 Producto agregado al carrito");
      },

      removeItem: (id: number) => {
        const before = get().items.length;
        set({ items: get().items.filter((i) => i.id !== id) });

        if (get().items.length < before) {
          toast("❌ Producto eliminado del carrito");
        } else {
          toast("Ese producto no estaba en el carrito");
        }
      },

      removeAll: () => {
        set({ items: [] });
        toast("🧹 Carrito vaciado");
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);








