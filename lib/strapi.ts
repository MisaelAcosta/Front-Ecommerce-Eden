export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "";

export function getStrapiMedia(path?: string | null) {
  if (!path) return "";
  // Si ya viene absoluta, la devolvemos tal cual
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${STRAPI_URL}${path}`;
}

export async function strapiFetch<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const url = `${STRAPI_URL}${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(process.env.STRAPI_API_TOKEN ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } : {}),
    ...init?.headers,
  };
  const res = await fetch(url, { ...init, headers, next: { revalidate: 60, tags: ["block1"] } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Strapi error ${res.status}: ${text}`);
  }
  return res.json();
}
