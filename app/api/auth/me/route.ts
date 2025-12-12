import { NextResponse } from "next/server";
import { getCurrentUserWithProfile } from "@/lib/auth";

export async function GET() {
  try {
    // Usa la función que ya creamos en lib/auth.ts
    const auth = await getCurrentUserWithProfile();

    if (!auth) {
      return NextResponse.json(
        { user: null, profile: null },
        { status: 401 }
      );
    }

    // Devolvemos por separado:
    // - user básico para la UI
    // - profile con todos los campos extra
    return NextResponse.json({
      user: {
        id: auth.id,
        username: auth.username,
        email: auth.email,
      },
      profile: auth.profile,
    });
  } catch (err) {
    console.error("🔥 Error en /api/auth/me:", err);
    return NextResponse.json(
      { user: null, profile: null },
      { status: 500 }
    );
  }
}

