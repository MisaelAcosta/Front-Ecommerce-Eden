import { ProductType } from "./product";
import { PromotionType } from "./promotion";
export type VariantType = {
  id: number;
  documentId?: string; // Strapi v5 usa documentId para queries directas
  variantName: string;
  active: boolean;
  slug: string;
  price: number;
  stock: number;
  sku: string;
  specs?: string;

  // Media
  image: {
    id: number;
    url: string;
    alternativeText?: string | null;
  }[];
  
  image2: {
    id: number;
    url: string;
    alternativeText?: string | null;
  }[];

  // Relaciones
  promotions?: PromotionType[] | null;
  product?: ProductType[] | null;

};
