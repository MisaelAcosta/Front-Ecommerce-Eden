"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export type LovedProduct = {
  id: number;
  title: string;
  secondaryName: string | null;
  price: number;
  imageUrl?: string | null;
  slug: string;
};

type LovedState = {
  items: LovedProduct[];
  toggleLoved: (product: LovedProduct) => "added" | "removed";
  isLoved: (id: number) => boolean;
  removeLoved: (id: number) => void;
};

const notifyLovedChange = (
  product: LovedProduct,
  status: "added" | "removed"
) => {
  toast(status === "added" ? "Agregado a favoritos" : "Quitado de favoritos", {
    description: product.title,
    action:
      status === "added"
        ? {
            label: "Ver favoritos",
            onClick: () => {
              window.location.href = "/loved-product";
            },
          }
        : undefined,
  });
};

export const useLoved = create<LovedState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleLoved: (product) => {
        const exists = get().items.some((p) => p.id === product.id);
        const status = exists ? "removed" : "added";

        set({
          items: exists
            ? get().items.filter((p) => p.id !== product.id)
            : [...get().items, product],
        });

        notifyLovedChange(product, status);
        return status;
      },

      removeLoved: (id) => {
        const product = get().items.find((p) => p.id === id);

        set({
          items: get().items.filter((p) => p.id !== id),
        });

        if (product) {
          notifyLovedChange(product, "removed");
        }
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
