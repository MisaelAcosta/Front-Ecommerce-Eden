// lib/auth.ts
import { cookies } from "next/headers";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "http://localhost:1338"; // mismo puerto que ya usas

export type CurrentUser = {
  id: number;
  username: string;
  email: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  if (!token) {
    return null;
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.log("❌ /api/users/me respondió:", res.status);
      return null;
    }

    const data = (await res.json()) as CurrentUser;
    return data;
  } catch (error) {
    console.error("🔥 Error en getCurrentUser:", error);
    return null;
  }
}
