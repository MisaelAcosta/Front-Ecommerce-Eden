// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1338";

type StrapiMeUser = {
  id?: number;
  username?: string | null;
  email?: string | null;
  nombre?: string | null;
  rut?: string | null;
  telefono?: string | null;
  region?: string | null;
  comuna?: string | null;
  calle?: string | null;
  numero?: string | null;
  depto?: string | null;
  nota?: string | null;
  notifyWhatsapp?: boolean | null;
  notifyEmail?: boolean | null;
};

type ProfileUpdateBody = {
  userId: number;
  nombre?: string;
  rut?: string;
  telefono?: string;
  region?: string | null;
  comuna?: string | null;
  calle?: string;
  numero?: string;
  depto?: string;
  nota?: string;
  notifyWhatsapp?: boolean;
  notifyEmail?: boolean;
};

type UpdatePayload = {
  nombre: string;
  rut: string;
  telefono: string;
  calle: string;
  numero: string;
  depto: string;
  nota: string;
  notifyWhatsapp: boolean;
  notifyEmail: boolean;
  region?: string;
  comuna?: string;
};

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type GenericJsonObject = {
  [key: string]: JsonValue;
};

/**
 *  GET /api/profile
 * Devuelve el perfil del usuario autenticado desde Strapi.
 * Usamos /api/users/me para NO depender de userId.
 *
 *  Nuevo: también devolvemos account.email (email real del user)
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
      return NextResponse.json(
        { ok: true, profile: null, account: null },
        { status: 200 }
      );
    }

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
      return NextResponse.json(
        { ok: true, profile: null, account: null, detail: meText },
        { status: 200 }
      );
    }

    let user: StrapiMeUser | null = null;
    try {
      user = JSON.parse(meText) as StrapiMeUser;
    } catch {
      user = null;
    }

    if (!user) {
      return NextResponse.json(
        { ok: true, profile: null, account: null },
        { status: 200 }
      );
    }

    const account = {
      id: user.id ?? null,
      email: user.email ?? null,
      username: user.username ?? null,
    };

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
  } catch (err: unknown) {
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

    const body = (await req.json()) as ProfileUpdateBody;
    console.log("🟦 /api/profile BODY recibido desde el cliente:", body);

    const { userId, ...profile } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Falta userId en el body" },
        { status: 400 }
      );
    }

    const updatePayload: UpdatePayload = {
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
    console.log(
      "🟥 Respuesta de Strapi al actualizar user:",
      updateRes.status,
      updateText
    );

    if (!updateRes.ok) {
      return NextResponse.json(
        { error: "Error al actualizar perfil en Strapi", detail: updateText },
        { status: 500 }
      );
    }

    let updatedUser: GenericJsonObject | string = updateText;
    try {
      updatedUser = JSON.parse(updateText) as GenericJsonObject;
    } catch {
      updatedUser = updateText;
    }

    return NextResponse.json({ ok: true, user: updatedUser });
  } catch (err: unknown) {
    console.error("💥 Error inesperado en /api/profile:", err);
    return NextResponse.json(
      { error: "Error inesperado en el servidor" },
      { status: 500 }
    );
  }
}




