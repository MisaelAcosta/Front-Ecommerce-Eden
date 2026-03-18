// app/api/orders/attach-flow/route.ts
import { NextResponse } from "next/server";
import { strapiAdminFetch } from "@/lib/strapi-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const orderDocumentId = String(body?.orderDocumentId ?? "");
    const flowToken = String(body?.flowToken ?? "");
    const paymentUrl = String(body?.paymentUrl ?? "");

    if (!orderDocumentId || !flowToken || !paymentUrl) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos (orderDocumentId, flowToken, paymentUrl)" },
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

    await strapiAdminFetch(`/api/orders/${orderDocumentId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error attach-flow";

    console.error("💥 /api/orders/attach-flow error:", message);

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
