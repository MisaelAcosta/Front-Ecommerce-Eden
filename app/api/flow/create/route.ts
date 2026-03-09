// app/api/flow/create/route.ts
import { NextResponse } from "next/server";
import { flowSign } from "@/lib/flow/sign";

type CreateFlowBody = {
  commerceOrder: string; // tu id interno (ej: orderNumber o uuid)
  subject: string;       // ej: "Compra Eden 3D"
  amount: number;        // total final (subtotal + envio)
  email: string;         // email del pagador (Flow lo requiere)
  optional?: Record<string, unknown>; // opcional: { rut, nombre, ... }
};

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function POST(req: Request) {
  try {
    const FLOW_API_KEY = mustEnv("FLOW_API_KEY");
    const FLOW_SECRET_KEY = mustEnv("FLOW_SECRET_KEY");
    const FLOW_API_BASE = mustEnv("FLOW_API_BASE"); // ej: https://api.flow.cl

    const SITE_URL = mustEnv("SITE_URL"); // ej: https://tudominio.cl (ABSOLUTO)
    // Endpoints de tu app para retorno y confirmación:
    const urlReturn = `${SITE_URL}/cart/return`;
    const urlConfirmation = `${SITE_URL}/api/flow/confirm`;

    const body = (await req.json()) as CreateFlowBody;

    if (!body?.commerceOrder || !body?.subject || !body?.amount || !body?.email) {
      return NextResponse.json(
        { ok: false, error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Flow requiere form-urlencoded y firma "s"
    const params: Record<string, string | number> = {
      apiKey: FLOW_API_KEY,
      commerceOrder: body.commerceOrder,
      subject: body.subject,
      currency: "CLP",
      amount: body.amount,
      email: body.email,
      urlConfirmation,
      urlReturn,
    };

    // optional va como string JSON si lo usas
    if (body.optional) {
      params.optional = JSON.stringify(body.optional);
    }

    const s = flowSign(params, FLOW_SECRET_KEY);

    // form-urlencoded
    const form = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => form.append(k, String(v)));
    form.append("s", s);

    const res = await fetch(`${FLOW_API_BASE}/payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "Flow error", detail: json },
        { status: 502 }
      );
    }

    // Respuesta Flow: { url, token, flowOrder }
    const url = json?.url;
    const token = json?.token;
    const flowOrder = json?.flowOrder;

    if (!url || !token) {
      return NextResponse.json(
        { ok: false, error: "Respuesta Flow incompleta", detail: json },
        { status: 502 }
      );
    }

    const paymentUrl = `${url}?token=${token}`;

    return NextResponse.json({
      ok: true,
      paymentUrl,
      token,
      flowOrder,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error interno";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
