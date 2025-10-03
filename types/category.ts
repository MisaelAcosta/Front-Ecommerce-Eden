
// types/category.ts (versión aplanada)
export type CategoryType = {
  id: number;
  categoryName: string;
  slug: string;
  description: string | null;
  isFeatured: boolean | null;
  mainImage?: { url: string; alternativeText?: string | null } | null;
};











/*export type CategoryType = {
    id: number;
    attributes: {
        categoryName: string;
        slug: string;
        mainImage: {
            data: {
                attributes: {
                    url: string;
            }
                 }   
                } | null;
            }
    }; */