// app/api/flow/confirm/route.ts
import { NextResponse } from "next/server";
import { flowSign } from "@/lib/flow/sign";
import { strapiAdminFetch } from "@/lib/strapi-admin";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

type FlowStatusResponse = {
  status?: number | string;
  commerceOrder?: string;
  flowOrder?: number;
  amount?: number;
  payer?: string;
  optional?: string | Record<string, unknown>;
  [key: string]: unknown;
};

type StrapiListResponse<T> = {
  data?: T[];
};

function isPaidStatus(raw: unknown) {
  const s = String(raw ?? "").toLowerCase();
  return s === "2" || s.includes("paid") || s.includes("authorized") || s.includes("success");
}

export async function POST(req: Request) {
  try {
    const FLOW_API_KEY = mustEnv("FLOW_API_KEY");
    const FLOW_SECRET_KEY = mustEnv("FLOW_SECRET_KEY");
    const FLOW_API_BASE = mustEnv("FLOW_API_BASE");

    const form = await req.formData();
    const token = String(form.get("token") ?? "");

    if (!token) {
      return new NextResponse("missing token", { status: 200 });
    }

    const params: Record<string, string> = {
      apiKey: FLOW_API_KEY,
      token,
    };

    const s = flowSign(params, FLOW_SECRET_KEY);

    const qs = new URLSearchParams({
      ...params,
      s,
    });

    const flowRes = await fetch(`${FLOW_API_BASE}/payment/getStatus?${qs.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    const flowJson = (await flowRes.json()) as FlowStatusResponse;

    if (!flowRes.ok) {
      console.error("Flow confirm getStatus error:", flowJson);
      return new NextResponse("ok", { status: 200 });
    }

    const commerceOrder = String(flowJson?.commerceOrder ?? "");

    if (commerceOrder) {
      const orderSearch = await strapiAdminFetch<
        StrapiListResponse<{ documentId: string }>
      >(
        `/api/orders?filters[commerceOrder][$eq]=${encodeURIComponent(
          commerceOrder
        )}&fields[0]=documentId`,
        { method: "GET" }
      );

      const orderDocumentId = orderSearch?.data?.[0]?.documentId;

      if (orderDocumentId) {
        const payload = {
          data: {
            statusOrder: isPaidStatus(flowJson?.status) ? "PAID" : "PENDING_PAYMENT",
            paidAt: isPaidStatus(flowJson?.status) ? new Date().toISOString() : null,
          },
        };

        await strapiAdminFetch(`/api/orders/${orderDocumentId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }
    }

    return new NextResponse("ok", { status: 200 });
  } catch (err) {
    console.error("💥 /api/flow/confirm error:", err);
    return new NextResponse("ok", { status: 200 });
  }
}