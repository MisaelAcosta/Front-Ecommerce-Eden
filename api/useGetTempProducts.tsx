import { useEffect, useState } from "react";

export function useGetTempProducts(slug: string) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return; // evita llamadas vacías

    (async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[temp_category][slug][$eq]=${encodeURIComponent(
          slug
        )}&populate=*`;

        const res = await fetch(url);
        const json = await res.json();

        setResult(json.data);
      } catch (err: any) {
        setError(err.message || "Error al obtener productos temporales");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  return { result, loading, error };
}

