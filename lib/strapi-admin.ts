// lib/strapi-admin.ts
export const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1338";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function strapiAdminFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const token = mustEnv("STRAPI_API_TOKEN");

  const res = await fetch(`${STRAPI_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    throw new Error(
      `Strapi error ${res.status} on ${path}: ${JSON.stringify(json)}`
    );
  }

  return json as T;
}
