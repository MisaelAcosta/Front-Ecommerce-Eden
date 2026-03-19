// app/api/orders/get-status/route.ts
import { NextResponse } from "next/server";
import { strapiAdminFetch } from "@/lib/strapi-admin";

type OrderData = {
  id?: number;
  documentId?: string;
  statusOrder?: string;
  paidAt?: string | null;
  commerceOrder?: string;
  flowToken?: string | null;
};

type StrapiListResponse<T> = {
  data?: T[];
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderDocumentId = String(searchParams.get("orderDocumentId") ?? "");
    const commerceOrder = String(searchParams.get("commerceOrder") ?? "");

    if (!orderDocumentId && !commerceOrder) {
      return NextResponse.json(
        { ok: false, error: "Falta orderDocumentId o commerceOrder" },
        { status: 400 }
      );
    }

    let path = "";

    if (orderDocumentId) {
      path = `/api/orders/${orderDocumentId}?fields[0]=statusOrder&fields[1]=paidAt&fields[2]=commerceOrder&fields[3]=flowToken`;
      const order = await strapiAdminFetch<{ data?: OrderData }>(path, {
        method: "GET",
      });

      return NextResponse.json(
        { ok: true, data: order?.data ?? null },
        { status: 200 }
      );
    }

    path = `/api/orders?filters[commerceOrder][$eq]=${encodeURIComponent(
      commerceOrder
    )}&fields[0]=statusOrder&fields[1]=paidAt&fields[2]=commerceOrder&fields[3]=flowToken`;

    const result = await strapiAdminFetch<StrapiListResponse<OrderData>>(path, {
      method: "GET",
    });

    return NextResponse.json(
      { ok: true, data: result?.data?.[0] ?? null },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Error obteniendo estado de orden";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}