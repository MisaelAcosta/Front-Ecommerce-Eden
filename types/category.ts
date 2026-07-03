export type CategoryType = {
  id: number;
  categoryName: string;
  slug: string;
  description: string | null;
  isFeatured: boolean | null;
  mainImage?: { url: string; alternativeText?: string | null } | null;
  mainImages?: Array<{ url: string; alternativeText?: string | null }>;
  secondImage?: { url: string; alternativeText?: string | null } | null;

  subcategories?: Array<{
    id: number;
    categoryName: string;
    slug: string;
  }>;
};









