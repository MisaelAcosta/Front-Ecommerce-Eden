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

  images: {
    id: number;
    url: string;
    alternativeText?: string | null;
  }[];

  category?: {
    id: number;
    categoryName: string;
    slug: string;
  } | null;

  sub_category?: {
    id: number;
    categoryName: string; // o "name" según tu modelo
    slug: string;
  } | null;

  temp_category?: {
    id: number;
    tempCategoryName: string;
    slug: string;
  } | null;

  block_1?: {
    id: number;
    tituloBlock1: string;
    slug: string;
  } | null;

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};
