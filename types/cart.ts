import type { PrintQuoteSnapshot } from "@/types/print-quote";

type CartLineBase = {
  // id único del item en el carrito
  id: string;

  // discriminador para soportar productos normales y cotizaciones 3D
  kind: "product" | "print-quote";

  // referencia compartida
  productId: number;
  productSlug: string;
  variantId: number;
  variantName: string;

  // datos para UI
  imageUrl: string;
  sku?: string | null;

  // precio final a cobrar
  unitPrice: number;
  qty: number;
};

export type ProductCartLine = CartLineBase & {
  kind: "product";
};

export type PrintQuoteCartLine = CartLineBase & {
  kind: "print-quote";
  productId: 0;
  productSlug: "cotiza";
  variantId: -1;
  sku?: null;
  printQuote: PrintQuoteSnapshot;
};

export type CartLine = ProductCartLine | PrintQuoteCartLine;
