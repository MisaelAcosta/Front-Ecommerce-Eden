// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1338";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const jwt =
      cookieStore.get("eden_jwt")?.value ||
      cookieStore.get("jwt")?.value ||
      cookieStore.get("token")?.value || null; // ajusta según cómo guardaste el token

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
      return NextResponse.json(
        { error: "Falta userId en el body" },
        { status: 400 }
      );
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
    if (profile.region) {
      updatePayload.region = profile.region;
    }
    if (profile.comuna) {
      updatePayload.comuna = profile.comuna;
    }

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
    console.log(
      "🟥 Respuesta de Strapi al actualizar user:",
      updateRes.status,
      updateText
    );

    if (!updateRes.ok) {
      return NextResponse.json(
        {
          error: "Error al actualizar perfil en Strapi",
          detail: updateText,
        },
        { status: 500 }
      );
    }

    let updatedUser: any;
    try {
      updatedUser = JSON.parse(updateText);
    } catch {
      updatedUser = updateText;
    }

    return NextResponse.json({
      ok: true,
      user: updatedUser,
    });
  } catch (err) {
    console.error("💥 Error inesperado en /api/profile:", err);
    return NextResponse.json(
      { error: "Error inesperado en el servidor" },
      { status: 500 }
    );
  }
}



