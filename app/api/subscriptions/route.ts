import { NextResponse } from "next/server";
import { strapiAdminFetch } from "@/lib/strapi-admin";

type StrapiListResponse = {
  data?: Array<{ id?: number }>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    // Normaliza el valor antes de validar y guardar: evita duplicados por mayusculas
    // o espacios, por ejemplo "Correo@Ejemplo.com" vs "correo@ejemplo.com".
    const body = (await request.json()) as { email?: unknown };
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Ingresa un correo valido." },
        { status: 400 }
      );
    }

    // Consulta previa para responder de forma amable si el email ya fue registrado.
    // El campo email tambien es unico en Strapi, que actua como segunda proteccion.
    const existing = await strapiAdminFetch<StrapiListResponse>(
      `/api/suscripciones?filters[email][$eq]=${encodeURIComponent(email)}&fields[0]=id`
    );

    if ((existing.data ?? []).length > 0) {
      return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
    }

    // Crea el registro en la coleccion Suscripciones de Strapi mediante el token
    // privado del servidor. No exponemos credenciales del backend al navegador.
    await strapiAdminFetch("/api/suscripciones", {
      method: "POST",
      body: JSON.stringify({ data: { email } }),
    });

    return NextResponse.json({ ok: true, duplicate: false }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar el correo.";
    console.error("/api/subscriptions error:", message);

    return NextResponse.json(
      { ok: false, error: "No pudimos registrar tu correo. Intenta nuevamente." },
      { status: 500 }
    );
  }
}
