// app/api/orders/attach-flow/route.ts
import { NextResponse } from "next/server";
import { strapiAdminFetch } from "@/lib/strapi-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const orderId = Number(body?.orderId);
    const flowToken = String(body?.flowToken ?? "");
    const paymentUrl = String(body?.paymentUrl ?? "");

    if (!orderId || !flowToken || !paymentUrl) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos (orderId, flowToken, paymentUrl)" },
        { status: 400 }
      );
    }

    const payload = {
      data: {
        flowToken,
        paymentUrl,
        statusOrder: "PENDING_PAYMENT",
        paymentProvider: "FLOW",
      },
    };

    await strapiAdminFetch(`/api/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Error attach-flow" },
      { status: 500 }
    );
  }
}
