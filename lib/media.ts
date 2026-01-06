// src/lib/media.ts

export const toAbsUrl = (url?: string | null) => {
  if (!url) return null;

  if (url.startsWith("http")) {
    return url;
  }

  const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;

  return `${base}${path}`;
};
