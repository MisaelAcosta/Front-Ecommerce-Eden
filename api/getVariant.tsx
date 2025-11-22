// src/api/getVariant.tsx
import { useEffect, useState } from "react";

export function useGetVariant(productSlug: string | string[]) {
  const resolvedSlug = Array.isArray(productSlug) ? productSlug[0] : productSlug;

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/variants?populate=*`;

  const [result, setResult] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();

        const allVariants = json.data ?? [];

        // 🟢 Filtramos por el producto que tenga ese slug
        const filtered = allVariants.filter((v: any) =>
          v.products?.some((p: any) => p.slug === resolvedSlug)
        );

        setResult(filtered);
      } catch (err: any) {
        setError(err?.message ?? "Error al cargar variantes");
      } finally {
        setLoading(false);
      }
    })();
  }, [url, resolvedSlug]);

  return { result, loading, error };
}






