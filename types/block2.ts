// Tipos de apoyo
export type StrapiImageType = {
  id: number;
  attributes: {
    url: string;
    alternativeText?: string | null;
  };
};

export type CategoryType = {
  id: number;
  attributes: {
    categoryName: string;
    slug: string;
  };
};

export type ProductMiniType = {
  id: number;
  attributes: {
    productName: string;
    slug: string;
  };
};

// Tipo principal para Block2
export type Block2Type = {
  id: number;
  attributes: {
    tituloBlock2: string;
    description: string;
    slug: string;
    isFeatured: boolean;

    // Multiple Media
    imageBlock2?: {
      data: StrapiImageType[] | null;
    };

    // Relación oneToOne con Category
    category?: {
      data: CategoryType | null;
    };

    // Relación oneToOne con Product
    product?: {
      data: ProductMiniType | null;
    };

    // Campos estándar de Strapi v5
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string | null;
  };
};

