export type PromotionType = {
  id: number;
  documentId?: string; // Strapi v5
  name: string;
  slug: string;
  value: number;
  active: boolean; 
  startAt: string;
  endAt: string;

  // Relaciones (todas opcionales)
  products?: {
    id: number;
    documentId?: string;
    productName: string;
    slug: string;
  }[];

  variants?: {
    id: number;
    documentId?: string;
    variantName: string;
    slug: string;
  }[];

  categories?: {
    id: number;
    documentId?: string;
    categoryName: string;
    slug: string;
  }[];

  temp_categories?: {
    id: number;
    documentId?: string;
    tempCategoryName: string;
    slug: string;
  }[];

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

