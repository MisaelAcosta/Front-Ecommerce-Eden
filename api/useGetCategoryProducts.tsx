"use client";

import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

const base = process.env.NEXT_PUBLIC_BACKEND_URL;

type UseGetCategoryProductProps = {
  categorySlug: string;
  subSlug?: string | null;
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: "default" | "price-asc" | "price-desc" | "recent";
};

type StrapiProductResponse = {
  id: number;
  [key: string]: unknown;
};

export const useGetCategoryProduct = ({
  categorySlug,
  subSlug,
  page = 1,
  pageSize = 12,
  searchTerm = "",
  sortBy = "default",
}: UseGetCategoryProductProps) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!base) throw new Error("Falta NEXT_PUBLIC_BACKEND_URL");

        const params = new URLSearchParams();

        if (categorySlug !== "todos-los-productos") {
          params.set("filters[category][slug][$eq]", categorySlug);

          if (subSlug) {
            params.set("filters[sub_category][slug][$eq]", subSlug);
          }
        }

        const term = searchTerm.trim();
        if (term) {
          params.set("filters[$or][0][productName][$containsi]", term);
          params.set("filters[$or][1][productName2][$containsi]", term);
        }

        params.set("pagination[page]", String(page));
        params.set("pagination[pageSize]", String(pageSize));
        params.set("populate", "*");

        if (sortBy === "price-asc") {
          params.set("sort[0]", "price:asc");
        }

        if (sortBy === "price-desc") {
          params.set("sort[0]", "price:desc");
        }

        if (sortBy === "recent") {
          params.set("sort[0]", "createdAt:desc");
        }

        const res = await fetch(`${base}/api/products?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Error fetching products: ${res.status}`);
        }

        const json = await res.json();
        const normalized: ProductType[] = (
          (json.data || []) as StrapiProductResponse[]
        ).map((item) => {
          const { id, ...rest } = item;
          return {
            id,
            attributes: {
              ...rest,
            },
          } as unknown as ProductType;
        });

        setProducts(normalized);

        const pageCount = json?.meta?.pagination?.pageCount ?? 1;
        setTotalPages(pageCount > 0 ? pageCount : 1);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        console.error("useGetCategoryProduct error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setProducts([]);
        setTotalPages(1);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [categorySlug, subSlug, page, pageSize, searchTerm, sortBy]);

  return { products, loading, error, totalPages };
};
