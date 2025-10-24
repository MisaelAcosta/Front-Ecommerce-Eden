export type Block2Type = {
  id: number;
  attributes: {
  tituloBlock2: string;
  description: string;
  slug: string;
  isFeatured: boolean;
  imageBlock2?: {
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
