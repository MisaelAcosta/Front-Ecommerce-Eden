// app/api/orders/set-status/route.ts
import { NextResponse } from "next/server";
import { strapiAdminFetch } from "@/lib/strapi-admin";

type OrderStatusPayload = {
  data: {
    statusOrder: string;
    paidAt?: string;
  };
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const orderId = Number(body?.orderId);
    const statusOrder = String(body?.statusOrder ?? "");
    const paidAt = body?.paidAt ? new Date(body.paidAt).toISOString() : null;

    if (!orderId || !statusOrder) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos (orderId, statusOrder)" },
        { status: 400 }
      );
    }

    const payload: OrderStatusPayload = {
      data: { statusOrder },
    };

    if (statusOrder === "PAID") {
      payload.data.paidAt = paidAt ?? new Date().toISOString();
    }

    await strapiAdminFetch(`/api/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (err: unknown) {

    const message =
      err instanceof Error ? err.message : "Error set-status";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
