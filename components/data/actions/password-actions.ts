// components/data/actions/password-actions.ts
"use server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "http://localhost:1338";

export type ForgotState = {
  ok: boolean;
  message: string | null;
};

export async function forgotPasswordAction(
  prevState: ForgotState,
  formData: FormData
): Promise<ForgotState> {
  const email = formData.get("email")?.toString().trim();

  if (!email) {
    return { ok: false, message: "Ingresa tu correo." };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }), // ✅ sin url
    });

    const raw = await res.text();

    if (!res.ok) {
      console.log("❌ forgot-password:", res.status, raw);
      return {
        ok: false,
        message: "No se pudo enviar el correo. Intenta nuevamente.",
      };
    }

    return {
      ok: true,
      message: "Si el correo existe, te enviaremos un enlace de recuperación. ✅",
    };
  } catch (e) {
    console.error("🔥 forgotPasswordAction error:", e);
    return { ok: false, message: "Error inesperado. Intenta nuevamente." };
  }
}

