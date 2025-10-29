// api/useGetCategoryProduct.tsx
"use client";

import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

const base = process.env.NEXT_PUBLIC_BACKEND_URL;

type UseGetCategoryProductProps = {
  categorySlug: string;
  subSlug?: string | null;
  page?: number;
  pageSize?: number;
};

export const useGetCategoryProduct = ({
  categorySlug,
  subSlug,
  page = 1,
  pageSize = 12,
}: UseGetCategoryProductProps) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Armamos URL base
        let url = `${base}/api/products`;

        // 2. Filtros por categoría/subcategoría
        if (categorySlug !== "todos-los-productos") {
          url += `?filters[category][slug][$eq]=${categorySlug}`;
          if (subSlug) {
            url += `&filters[sub_category][slug][$eq]=${subSlug}`;
          }
        } else {
          url += `?`;
        }

        // 3. paginación + populate
        url += `&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`;

        console.log("📡 Fetch URL =>", url);

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Error fetching products");
        }

        const json = await res.json();
        console.log("🐉 RAW item 0 de Strapi:", json.data?.[0]);

        

        console.log("🔄 raw Strapi data:", json.data?.[0]);

        // ⛳ ATENCIÓN ACÁ:
        // json.data[i] viene PLANO (sin attributes)
        // Nosotros lo envolvemos para matchear ProductType
        const normalized: ProductType[] = (json.data || []).map((item: any) => {
          // sacamos id y el resto lo empacamos en attributes
          const { id, ...rest } = item;
          return {
            id: id,
            attributes: {
              ...rest,
            },
          };
        });
        console.log("🧪 NORMALIZED item 0:", normalized[0]);

        

        setProducts(normalized);

        // paginación total
        if (json.meta?.pagination?.pageCount) {
          setTotalPages(json.meta.pagination.pageCount);
        } else {
          setTotalPages(1);
        }
      } catch (err: any) {
        console.error("❌ useGetCategoryProduct error:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, subSlug, page, pageSize]);

  return { products, loading, error, totalPages };
};





