// components/data/actions/auth-actions.ts
"use server";

import { cookies } from "next/headers";
import type {
  RegisterState,
  LoginState,
} from "@/components/data/actions/auth-state";

// 👇 Usamos el mismo BACKEND_URL que ya tienes configurado
const STRAPI_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "http://localhost:1338"; // ajusta si cambia el puerto

type StrapiAuthOk = {
  jwt?: string;
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

/* ------------------------------------------------------------------
   REGISTRO CON ESTADO (useActionState en RegisterForm)
-------------------------------------------------------------------*/

export async function registerUserAction(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  console.log("▶ registerUserAction");

  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirm_password")?.toString();

  if (!email || !password || !confirmPassword) {
    console.log("❌ Faltan campos en el registro");
    return {
      ok: false,
      message: "Completa todos los campos.",
    };
  }

  if (password !== confirmPassword) {
    console.log("❌ Las contraseñas no coinciden");
    return {
      ok: false,
      message: "Las contraseñas no coinciden.",
    };
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

    const raw = await res.text();
    console.log("🔍 Raw response registro Strapi:", res.status, raw);

    let data: StrapiAuthResponse | null = null;
    try {
      data = raw ? (JSON.parse(raw) as StrapiAuthResponse) : null;
    } catch (e) {
      console.error("❌ No se pudo parsear JSON en registro:", e);
    }

    if (!res.ok) {
      console.log("❌ Strapi respondió error en registro:", res.status, data);
      const msg =
        (data as StrapiAuthError)?.error?.message ??
        "No se pudo crear la cuenta. Intenta nuevamente.";
      return {
        ok: false,
        message: msg,
      };
    }

    console.log("✅ Usuario registrado correctamente en Strapi");

    // 🔥 Nuevo mensaje pensado para confirmación por correo:
    return {
      ok: true,
      message:
        "Cuenta creada correctamente. Te enviamos un correo para confirmar tu cuenta. Revisa tu bandeja de entrada. ✅",
    };
  } catch (error) {
    console.error("🔥 Error inesperado en registerUserAction:", error);
    return {
      ok: false,
      message: "Error inesperado. Intenta nuevamente.",
    };
  }
}


/* ------------------------------------------------------------------
   LOGIN CON ESTADO (useActionState en LoginForm)
-------------------------------------------------------------------*/

export async function loginUserAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  console.log("▶ loginUserAction");

  const identifier = formData.get("identifier")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!identifier || !password) {
    console.log("❌ Faltan campos en el login");
    return {
      ok: false,
      message: "Completa correo y contraseña.",
    };
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

    let data: StrapiAuthResponse | null = null;
    try {
      data = raw ? (JSON.parse(raw) as StrapiAuthResponse) : null;
    } catch (e) {
      console.error("❌ No se pudo parsear JSON en login:", e);
    }

    if (!res.ok) {
      console.log("❌ Strapi respondió error en login:", res.status, data);

      const rawMsg = (data as StrapiAuthError)?.error?.message ?? "";
      let msg = "Credenciales inválidas. Intenta nuevamente.";

      // 🔥 Si Strapi se queja de email no confirmado, mensaje especial
      if (rawMsg.toLowerCase().includes("confirm")) {
        msg =
          "Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.";
      }

      return {
        ok: false,
        message: msg,
      };
    }

    if (!data || !("jwt" in data) || !data.jwt) {
      console.log("❌ No vino jwt en la respuesta de login");
      return {
        ok: false,
        message: "No se pudo iniciar sesión. Intenta nuevamente.",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("jwt", data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log("✅ Login correcto y cookie seteada");

    return {
      ok: true,
      message: "Sesión iniciada correctamente. ✅",
    };
  } catch (error) {
    console.error("🔥 Error inesperado en loginUserAction:", error);
    return {
      ok: false,
      message: "Error inesperado. Intenta nuevamente.",
    };
  }
}

