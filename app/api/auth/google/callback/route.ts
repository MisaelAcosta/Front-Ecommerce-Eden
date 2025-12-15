import { NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1338";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const access_token = searchParams.get("access_token");

  if (!access_token) {
    return NextResponse.redirect(new URL("/?google=missing_token", req.url));
  }

  // 1) Canjear el access_token (del provider) por el JWT de Strapi
  const strapiRes = await fetch(
    `${STRAPI_URL}/api/auth/google/callback?access_token=${encodeURIComponent(access_token)}`,
    { cache: "no-store" }
  );

  if (!strapiRes.ok) {
    return NextResponse.redirect(new URL("/?google=auth_failed", req.url));
  }

  const data = await strapiRes.json();
  const jwt = data?.jwt;

  if (!jwt) {
    return NextResponse.redirect(new URL("/?google=no_jwt", req.url));
  }

  // 2) Setear cookie httpOnly (igual que tu login local)
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("jwt", jwt, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // maxAge opcional: por ejemplo 7 días
    // maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
