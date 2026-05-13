"use client";

import { toast } from "sonner";

export const useCartNotification = () => {
  const notifySelectVariant = () => {
    toast.warning("Selecciona una variante primero", {
      description:
        "Elige el producto que quieres antes de agregarlo al carrito de compras.",
    });
  };

  const notifyProductWithoutVariants = () => {
    toast.error("No se pudo agregar al carrito", {
      description: "Este producto no tiene variantes configuradas.",
    });
  };

  return {
    notifySelectVariant,
    notifyProductWithoutVariants,
  };
};
