//propiedades del producto en slide

export type ProductType = {
    id: number;

    attributes: {
        productName: string;
        productName2: string;
        slug: string;
        description: string;
        active: boolean;
        isFeatured: boolean;
        price: number;
        images: {
            data: {
                id: number;
                attributes: {  
                    url: string;
                };
            }[];
        };
        category: {
            data: {
                slug: string;
                categoryName: string;
            };
        }
    };
};