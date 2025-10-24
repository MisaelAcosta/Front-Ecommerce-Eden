export type Block1Type = {
  id: number;
  attributes: {
  tituloBlock1: string;
  description: string;
  slug: string;
  isFeatured: boolean;
  imageBlock1?: {
    data: {
      id: number;
      attributes: {
        url: string;
        alternativeText?: string | null;
      };
    }[];
    category?: {
      data: {
        id: number;
        attributes: {
          categoryName: string;
          slug: string;
        };
      } | null;
    };


    };
  };
};
