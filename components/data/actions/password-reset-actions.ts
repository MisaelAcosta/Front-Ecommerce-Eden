// components/data/actions/password-reset-actions.ts
"use server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "http://localhost:1338";

export type ResetPasswordState = {
  ok: boolean;
  message: string | null;
};

export async function resetPasswordAction(
  prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const code = formData.get("code")?.toString();
  const password = formData.get("password")?.toString();
  const passwordConfirmation = formData.get("passwordConfirmation")?.toString();

  if (!code) {
    return { ok: false, message: "Código inválido o faltante." };
  }

  if (!password || !passwordConfirmation) {
    return { ok: false, message: "Completa ambos campos." };
  }

  if (password.length < 6) {
    return { ok: false, message: "La contraseña debe tener al menos 6 caracteres." };
  }

  if (password !== passwordConfirmation) {
    return { ok: false, message: "Las contraseñas no coinciden." };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        password,
        passwordConfirmation,
      }),
    });

    const raw = await res.text();

    if (!res.ok) {
      console.log("❌ reset-password:", res.status, raw);
      return {
        ok: false,
        message: "No se pudo restablecer la contraseña. El enlace puede haber expirado.",
      };
    }

    return {
      ok: true,
      message: "Contraseña actualizada correctamente ✅ Ya puedes iniciar sesión.",
    };
  } catch (e) {
    console.error("🔥 resetPasswordAction error:", e);
    return { ok: false, message: "Error inesperado. Intenta nuevamente." };
  }
}
