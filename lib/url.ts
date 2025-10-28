// /lib/url.ts

export const toAbsUrl = (path?: string | null): string | null => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
  const clean = path.replace(/^\/+/, "");
  return `${base}/${clean}`;
};
