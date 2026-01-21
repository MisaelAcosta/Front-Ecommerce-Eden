"use client";

import { Heart } from "lucide-react";
import { useLoved, LovedProduct } from "@/hooks/use-loved";
import clsx from "clsx";

type LovedButtonProps = {
  product: LovedProduct;
};

export const LovedButton = ({ product }: LovedButtonProps) => {
  const toggleLoved = useLoved((s) => s.toggleLoved);
  const isLoved = useLoved((s) => s.isLoved(product.id));

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLoved(product);
      }}
      className="ml-auto flex items-center justify-end"
    >
      <Heart
        width={20}
        strokeWidth={1.5}
        className={clsx(
          "transition-colors items-right  ht justify-right",
          isLoved ? "fill-black text-black" : "text-black/40 hover:fill-black"
        )}
      />
    </button>
  );
};
