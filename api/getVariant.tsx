// src/api/getVariant.tsx
import { useEffect, useState } from "react";

export function useGetVariant(productSlug: string | string[]) {
  const resolvedSlug = Array.isArray(productSlug) ? productSlug[0] : productSlug;

  const base = process.env.NEXT_PUBLIC_BACKEND_URL;

  // ✅ Strapi v5 bugfix: NO usar populate[image]=*
  // ✅ filtramos por product (singular) como tu schema
  const url =
    `${base}/api/variants` +
    `?filters[product][slug][$eq]=${encodeURIComponent(resolvedSlug)}` +
    `&populate[0]=image` +
    `&populate[1]=promotions` +
    `&populate[2]=product`;

  const [result, setResult] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(url);
        const json = await res.json();
        setResult(json.data ?? []);
      } catch (err: any) {
        setError(err?.message ?? "Error al cargar variantes");
      } finally {
        setLoading(false);
      }
    })();
  }, [url]);

  return { result, loading, error };
}







