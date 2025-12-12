// lib/auth.ts
import { cookies } from "next/headers";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "http://localhost:1338"; // mismo puerto que estás usando ahora

// 👉 Tipo simple para usar en navbar, etc.
export type CurrentUser = {
  id: number;
  username: string;
  email: string;
};

// 👉 Tipo extendido con los campos de perfil que guardas en Strapi
export type EdenUserWithProfile = {
  id: number;
  username: string;
  email: string;
  profile: {
    nombre: string | null;
    rut: string | null;
    telefono: string | null;
    region: string | null;
    comuna: string | null;
    calle: string | null;
    numero: string | null;
    depto: string | null;
    nota: string | null;
    notifyWhatsapp: boolean;
    notifyEmail: boolean;
  };
};

/**
 * Versión completa: trae al usuario + todos los campos de perfil
 * desde Strapi (/api/users/me), usando el JWT guardado en la cookie "jwt".
 */
export async function getCurrentUserWithProfile(): Promise<EdenUserWithProfile | null> {
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
      console.log("❌ /api/users/me respondió:", res.status, await res.text());
      return null;
    }

    const data = await res.json();

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      profile: {
        // 👇 estos nombres deben coincidir con los API IDs de Strapi
        nombre: data.nombre ?? null,
        rut: data.rut ?? null,
        telefono: data.telefono ?? null,
        region: data.region ?? null,
        comuna: data.comuna ?? null,
        calle: data.calle ?? null,
        numero: data.numero ?? null,
        depto: data.depto ?? null,
        nota: data.nota ?? null,
        notifyWhatsapp: data.notifyWhatsapp ?? false,
        notifyEmail: data.notifyEmail ?? true,
      },
    };
  } catch (error) {
    console.error("🔥 Error en getCurrentUserWithProfile:", error);
    return null;
  }
}

/**
 * Versión “ligera” que solo devuelve id, username y email.
 * Usa internamente getCurrentUserWithProfile para no duplicar el fetch.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const full = await getCurrentUserWithProfile();
  if (!full) return null;

  const { id, username, email } = full;
  return { id, username, email };
}
