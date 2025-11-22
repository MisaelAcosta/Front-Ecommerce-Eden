"use client";

import { useEffect, useState } from "react";
import type { ProductType } from "@/types/product";
import type { ResponseType } from "@/types/response";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 👇 export EXACTO como lo pediste
export const getCategoryRecommended = (categorySlug?: string): ResponseType => {
  const [result, setResult] = useState<ProductType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!categorySlug) {
      setResult([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/api/products?filters[category][slug][$eq]=${categorySlug}&filters[active][$eq]=true&populate=*`
        );

        const data = await res.json();

        // Strapi devuelve: { data: [...] }
        const items = (data?.data ?? []) as ProductType[];

        console.log(
          "[getCategoryRecommended] slug:",
          categorySlug,
          "items:",
          items.length
        );

        setResult(items);
      } catch (err) {
        console.error("Error fetching category products", err);
        setError(err);
        setResult([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug]);

  return { result, loading, error };
};

