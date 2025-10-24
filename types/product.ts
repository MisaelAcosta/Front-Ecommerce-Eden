//propiedades del producto 

export type ProductType = {
  id: number;
  attributes: {
    productName: string;
    productName2?: string;
    slug: string;
    description?: string;
    active: boolean;
    isFeatured: boolean;
    newProduct: boolean;
    price: number;

    images: {
      data: {
        id: number;
        attributes: {
          url: string;
          alternativeText?: string | null;
        };
      }[];
    };

    category?: {
      data: {
        id: number;
        attributes: {
          categoryName: string;
          slug: string;
        };
      } | null;
    };

    sub_category?: {
      data: {
        id: number;
        attributes: {
          categoryName: string;   // o "name" si así lo definiste
          slug: string;
        };
      } | null;
    };

    temp_category?: {
      data: {
        id: number;
        attributes: {
          tempCategoryName: string;
          slug: string;
        };
      } | null;
    };

    // Relación oneWay al Block1
    block_1?: {
      data: {
        id: number;
        attributes?: {
          tituloBlock1: string;
          slug: string;
          // imageBlock1, description... si quisieras usarlos
        };
      } | null;
    };
  };
};
