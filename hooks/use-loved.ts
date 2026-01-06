"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LovedProduct = {
  id: number;
  title: string;
  price: number;
  imageUrl?: string | null;
  slug: string;
};

type LovedState = {
  items: LovedProduct[];
  toggleLoved: (product: LovedProduct) => void;
  isLoved: (id: number) => boolean;
  removeLoved: (id: number) => void;
};

export const useLoved = create<LovedState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleLoved: (product) => {
        const exists = get().items.some((p) => p.id === product.id);

        set({
          items: exists
            ? get().items.filter((p) => p.id !== product.id)
            : [...get().items, product],
        });
      },

      removeLoved: (id) => {
        set({
          items: get().items.filter((p) => p.id !== id),
        });
      },

      isLoved: (id) => {
        return get().items.some((p) => p.id === id);
      },
    }),
    {
      name: "loved-products", // localStorage
    }
  )
);
