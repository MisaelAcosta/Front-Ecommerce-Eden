// app/api/flow/status/route.ts
import { NextResponse } from "next/server";
import { flowSign } from "@/lib/flow/sign";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function GET(req: Request) {
  try {
    const FLOW_API_KEY = mustEnv("FLOW_API_KEY");
    const FLOW_SECRET_KEY = mustEnv("FLOW_SECRET_KEY");
    const FLOW_API_BASE = mustEnv("FLOW_API_BASE");

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ ok: false, error: "Falta token" }, { status: 400 });
    }

    // Parámetros requeridos por Flow para getStatus
    const params: Record<string, string> = {
      apiKey: FLOW_API_KEY,
      token,
    };

    const s = flowSign(params, FLOW_SECRET_KEY);

    const form = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => form.append(k, v));
    form.append("s", s);

    const res = await fetch(`${FLOW_API_BASE}/payment/getStatus`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      cache: "no-store",
    });

    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "Flow error", detail: json },
        { status: 502 }
      );
    }

    // Flow devuelve data con estado, etc.
    return NextResponse.json({ ok: true, data: json }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Error interno" },
      { status: 500 }
    );
  }
}
