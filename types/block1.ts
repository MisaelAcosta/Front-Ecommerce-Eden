// Tipos de ayuda (puedes moverlos a otro archivo si quieres)
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

// Tipo principal de Block1 (Strapi v5)
export type Block1Type = {
  id: number;
  attributes: {
    tituloBlock1: string;
    description: string;
    slug: string;
    isFeatured: boolean;

    // Multiple Media
    imageBlock1?: {
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

    // Campos de sistema típicos de Strapi v5 (opcionales)
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string | null;
  };
};
