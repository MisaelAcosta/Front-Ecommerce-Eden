// api/useGetCategoryProducts.tsx
"use client";

import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

const base = process.env.NEXT_PUBLIC_BACKEND_URL;

type UseGetCategoryProductProps = {
  categorySlug: string;
  subSlug?: string | null;
  page?: number;
  pageSize?: number;
  /** 🔎 término de búsqueda (opcional) */
  searchTerm?: string;
};

export const useGetCategoryProduct = ({
  categorySlug,
  subSlug,
  page = 1,
  pageSize = 12,
  searchTerm = "",
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

        if (!base) throw new Error("Falta NEXT_PUBLIC_BACKEND_URL");

        // base
        let url = `${base}/api/products`;

        // filtros categoría/sub
        if (categorySlug !== "todos-los-productos") {
          url += `?filters[category][slug][$eq]=${encodeURIComponent(categorySlug)}`;

          if (subSlug) {
            url += `&filters[sub_category][slug][$eq]=${encodeURIComponent(subSlug)}`;
          }
        } else {
          url += `?`;
        }

        // 🔎 búsqueda (server-side) — plano, sin 'attributes'
        const term = (searchTerm ?? "").trim();
        if (term !== "") {
          const enc = encodeURIComponent(term);
          url += `&filters[$or][0][productName][$containsi]=${enc}`;
          url += `&filters[$or][1][productName2][$containsi]=${enc}`;
          // si quieres incluir descripción:
          // url += `&filters[$or][2][description][$containsi]=${enc}`;
        }

        // paginación + populate
        url += `&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`;

        console.log("📡 Fetch URL =>", url);

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Error fetching products: ${res.status}`);
        }

        const json = await res.json();
        console.log("🐉 RAW item 0 de Strapi:", json.data?.[0]);

        // ✅ normalizamos conservando tu shape { id, attributes: {...rest} }
        const normalized: ProductType[] = (json.data || []).map((item: any) => {
          const { id, ...rest } = item; // v5: todo viene plano (incluye imágenes/relaciones dentro de 'rest')
          return {
            id,
            attributes: {
              ...rest,
            },
          };
        });

        setProducts(normalized);

        // pageCount de Strapi = total de páginas
        const pageCount = json?.meta?.pagination?.pageCount ?? 1;
        setTotalPages(pageCount > 0 ? pageCount : 1);
      } catch (err: any) {
        console.error("❌ useGetCategoryProduct error:", err);
        setError(err.message || "Unknown error");
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, subSlug, page, pageSize, searchTerm]);

  return { products, loading, error, totalPages };
};







