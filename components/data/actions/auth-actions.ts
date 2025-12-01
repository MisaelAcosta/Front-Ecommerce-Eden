// components/data/actions/auth-actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 👇 Usamos el mismo BACKEND_URL que ya tienes configurado
const STRAPI_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "http://localhost:1338"; // puerto por defecto como el de tu .env
  
type StrapiAuthOk = {
  jwt: string;
  user: unknown;
};

type StrapiAuthError = {
  error?: {
    status?: number;
    name?: string;
    message?: string;
    details?: Record<string, unknown>;
  };
};

type StrapiAuthResponse = StrapiAuthOk | StrapiAuthError;

// 🔹 REGISTRO
export async function registerUserAction(formData: FormData) {
  console.log("▶ registerUserAction");

  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirm_password")?.toString();

  if (!email || !password || !confirmPassword) {
    console.log("❌ Faltan campos en el registro");
    return;
  }

  if (password !== confirmPassword) {
    console.log("❌ Las contraseñas no coinciden");
    return;
  }

  const username = email.split("@")[0] || email;

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const raw = await res.text(); // 👈 leemos como texto SIEMPRE
    console.log("🔍 Raw response registro Strapi:", res.status, raw);

    if (!res.ok) {
      console.log("❌ Strapi respondió error en registro:", res.status);
      // Aquí más adelante podemos mapear mensajes bonitos
      return;
    }

    let data: StrapiAuthResponse;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.error("❌ No se pudo parsear JSON en registro:", e);
      return;
    }

    console.log("🔁 Respuesta registro Strapi (JSON):", data);

    if (!("jwt" in data)) {
      console.log("❌ No vino jwt en la respuesta de registro");
      return;
    }

    const cookieStore = await cookies(); // 👈 con await
    cookieStore.set("jwt", data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log("✅ Usuario registrado y cookie seteada");
    redirect("/");
  } catch (error) {
    console.error("🔥 Error inesperado en registerUserAction:", error);
    return;
  }
}

// 🔹 LOGIN
export async function loginUserAction(formData: FormData) {
  console.log("▶ loginUserAction");

  const identifier = formData.get("identifier")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!identifier || !password) {
    console.log("❌ Faltan campos en el login");
    return;
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    const raw = await res.text();
    console.log("🔍 Raw response login Strapi:", res.status, raw);

    if (!res.ok) {
      console.log("❌ Strapi respondió error en login:", res.status);
      return;
    }

    let data: StrapiAuthResponse;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.error("❌ No se pudo parsear JSON en login:", e);
      return;
    }

    console.log("🔁 Respuesta login Strapi (JSON):", data);

    if (!("jwt" in data)) {
      console.log("❌ No vino jwt en la respuesta de login");
      return;
    }

    const cookieStore = await cookies();
    cookieStore.set("jwt", data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log("✅ Login correcto y cookie seteada");
    redirect("/");
  } catch (error) {
    console.error("🔥 Error inesperado en loginUserAction:", error);
    return;
  }
}

