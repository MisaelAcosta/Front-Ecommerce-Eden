import { VariantType } from "./variant";
import { PromotionType } from "./promotion";
export type ProductType = {
  id: number;
  documentId?: string; // Strapi v5 usa documentId
  productName: string;
  productName2?: string;
  slug: string;
  description?: string;
  specs?: string;
  active: boolean;
  isFeatured: boolean;
  newProduct: boolean;
  price: number;

  // Medios
  images: {
    id: number;
    url: string;
    alternativeText?: string | null;
  }[];

  // Relaciones base
  category?: {
    id: number;
    documentId?: string;
    categoryName: string;
    slug: string;
  } | null;

  sub_category?: {
    id: number;
    documentId?: string;
    categoryName: string;
  } | null;

  temp_category?: {
    id: number;
    documentId?: string;
    tempCategoryName: string;
    slug: string;
  } | null;

  block_1?: {
    id: number;
    documentId?: string;
    tituloBlock1: string;
    slug: string;
  } | null;

  // Variantes y promocion
  variants?: VariantType[] | null;

  promotions?: PromotionType[] | null;

 
};
