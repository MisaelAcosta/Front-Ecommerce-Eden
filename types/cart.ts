import type { VariantType } from "@/types/variant";
import type { PromotionType } from "@/types/promotion";

export type CartLine = {
  // id único del item en el carrito (puede ser un string)
  id: string;

  // referencia real
  productId: number;
  productSlug: string;

  variantId: number;
  variantName: string;

  // datos para UI
  imageUrl: string;   // ya armado absoluto o fallback
  sku?: string | null;

  // precio final que quieres cobrar (ya con promo aplicada si corresponde)
  unitPrice: number;

  qty: number;
};
