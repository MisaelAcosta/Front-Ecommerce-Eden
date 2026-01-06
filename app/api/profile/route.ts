// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1338";

/**
 * ✅ GET /api/profile
 * Devuelve el perfil del usuario autenticado desde Strapi.
 * Usamos /api/users/me para NO depender de userId.
 *
 * ✅ Nuevo: también devolvemos account.email (email real del user)
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const jwt =
      cookieStore.get("eden_jwt")?.value ||
      cookieStore.get("jwt")?.value ||
      cookieStore.get("token")?.value ||
      null;

    if (!jwt) {
      // Para Step02 conviene devolver 200 con profile null (no romper UX)
      return NextResponse.json(
        { ok: true, profile: null, account: null },
        { status: 200 }
      );
    }

    // 👇 Pedimos campos del perfil + email/id/username (para checkout)
    // Nota: en /api/users/me el email es campo base del user (users-permissions).
    const fields = [
      "id",
      "username",
      "email",
      "nombre",
      "rut",
      "telefono",
      "region",
      "comuna",
      "calle",
      "numero",
      "depto",
      "nota",
      "notifyWhatsapp",
      "notifyEmail",
    ].join(",");

    const meRes = await fetch(`${STRAPI_URL}/api/users/me?fields=${fields}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    });

    const meText = await meRes.text();

    if (!meRes.ok) {
      // Si el token expiró o algo falló, devolvemos null para no crashear Step02
      return NextResponse.json(
        { ok: true, profile: null, account: null, detail: meText },
        { status: 200 }
      );
    }

    let user: any;
    try {
      user = JSON.parse(meText);
    } catch {
      user = null;
    }

    if (!user) {
      return NextResponse.json(
        { ok: true, profile: null, account: null },
        { status: 200 }
      );
    }

    // ✅ account: datos base del user (incluye email real)
    const account = {
      id: user.id ?? null,
      email: user.email ?? null,
      username: user.username ?? null,
    };

    // ✅ profile: tu shape actual (INFO)
    const profile = {
      nombre: user.nombre ?? null,
      rut: user.rut ?? null,
      telefono: user.telefono ?? null,
      region: user.region ?? null,
      comuna: user.comuna ?? null,
      calle: user.calle ?? null,
      numero: user.numero ?? null,
      depto: user.depto ?? null,
      nota: user.nota ?? null,
      notifyWhatsapp: !!user.notifyWhatsapp,
      notifyEmail: user.notifyEmail ?? true,
    };

    return NextResponse.json({ ok: true, profile, account }, { status: 200 });
  } catch (err) {
    console.error("💥 Error inesperado en GET /api/profile:", err);
    return NextResponse.json(
      { ok: true, profile: null, account: null },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const jwt =
      cookieStore.get("eden_jwt")?.value ||
      cookieStore.get("jwt")?.value ||
      cookieStore.get("token")?.value ||
      null;

    if (!jwt) {
      return NextResponse.json(
        { error: "No autenticado (no se encontró JWT en cookies)" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("🟦 /api/profile BODY recibido desde el cliente:", body);

    const { userId, ...profile } = body;

    if (!userId) {
      return NextResponse.json({ error: "Falta userId en el body" }, { status: 400 });
    }

    // Mapeamos solo los campos que queremos actualizar
    const updatePayload: Record<string, any> = {
      nombre: profile.nombre || "",
      rut: profile.rut || "",
      telefono: profile.telefono || "",
      calle: profile.calle || "",
      numero: profile.numero || "",
      depto: profile.depto || "",
      nota: profile.nota || "",
      notifyWhatsapp: !!profile.notifyWhatsapp,
      notifyEmail: !!profile.notifyEmail,
    };

    // Región y comuna: solo si vienen definidas
    if (profile.region) updatePayload.region = profile.region;
    if (profile.comuna) updatePayload.comuna = profile.comuna;

    console.log(
      "🟨 Payload enviado a Strapi PUT /api/users/:id:",
      JSON.stringify(updatePayload, null, 2)
    );

    const updateRes = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(updatePayload),
    });

    const updateText = await updateRes.text();
    console.log("🟥 Respuesta de Strapi al actualizar user:", updateRes.status, updateText);

    if (!updateRes.ok) {
      return NextResponse.json(
        { error: "Error al actualizar perfil en Strapi", detail: updateText },
        { status: 500 }
      );
    }

    let updatedUser: any;
    try {
      updatedUser = JSON.parse(updateText);
    } catch {
      updatedUser = updateText;
    }

    return NextResponse.json({ ok: true, user: updatedUser });
  } catch (err) {
    console.error("💥 Error inesperado en /api/profile:", err);
    return NextResponse.json(
      { error: "Error inesperado en el servidor" },
      { status: 500 }
    );
  }
}





