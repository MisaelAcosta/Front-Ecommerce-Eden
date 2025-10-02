import { useEffect, useState } from "react";

export function useGetNewProducts() {
  // Podés ordenar por fecha si querés ver lo más nuevo primero
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[newProduct][$eq]=true&populate=*&sort=createdAt:desc`;

  const [result, setResult] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(url, { cache: "no-store" }); // opcional para evitar cache
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setResult(json.data ?? []);
      } catch (err: any) {
        setError(err?.message ?? "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    })();
  }, [url]);

  return { result, loading, error };
}
