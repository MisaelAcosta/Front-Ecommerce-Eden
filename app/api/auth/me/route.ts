// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "http://localhost:1338";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ user: null }, { status: res.status });
    }

    const user = await res.json();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error en /api/auth/me:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
