"use client"
import { useEffect, useState } from "react";

export function useGetCategoryProduct(slugParam: string | string[]) {
  // 1) Normalizá el slug
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  // 2) Pedí solo lo necesario; al menos asegurá populate=TempCategory
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=category&filters[category][slug][$eq]=${encodeURIComponent(slug)}`;

  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();
        setResult(json?.data ?? []);
      } catch (e: any) {
        setError(e?.message ?? "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [url]);

  return { result, loading, error };
}

