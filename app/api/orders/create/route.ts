// app/api/orders/create/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { strapiAdminFetch } from "@/lib/strapi-admin";

type CreateOrderBody = {
  items: Array<{
    variantId: number;
    qty: number;
    unitPrice: number;

    sku?: string | null;
    variantName?: string | null;
    productName?: string | null;
    imageUrl?: string | null;
  }>;
  step02: {
    name: string;
    email: string;
    rutBody: string;
    rutDv: string;
    phoneRest: string;
  };
  step03: {
    region: string | null;
    comuna: string | null;
    calle: string;
    numero: string;
    depto?: string;
    nota?: string;
    shippingCost?: number;
  };
  subtotal: number;
  shippingCost: number;
  total: number;
};

function nowCommerceOrder() {
  return `EDEN-${Date.now()}`; // simple y efectivo
}

async function getCustomerIdFromJwtCookie(): Promise<number | null> {
  // Si el usuario está logueado, intentamos leer su id con JWT (opcional).
  // Si no hay cookie -> guest checkout -> null.
  const cookieStore = await cookies();
  const jwt =
    cookieStore.get("eden_jwt")?.value ||
    cookieStore.get("jwt")?.value ||
    cookieStore.get("token")?.value ||
    null;

  if (!jwt) return null;

  // OJO: /api/users/me NO va con api::order, sino con Strapi users-permissions.
  // Pero aquí usamos fetch normal (con jwt) para saber el id del usuario actual.
  const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1338";
  const res = await fetch(`${STRAPI_URL}/api/users/me?fields[0]=id`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });

  if (!res.ok) return null;
  const me = await res.json();
  return typeof me?.id === "number" ? me.id : null;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateOrderBody;

    if (!body?.items?.length) {
      return NextResponse.json(
        { ok: false, error: "Carrito vacío" },
        { status: 400 }
      );
    }

    const commerceOrder = nowCommerceOrder();
    const customerId = await getCustomerIdFromJwtCookie();

    // Normaliza teléfono a +569XXXXXXXX
    const phone = `+569${String(body.step02.phoneRest || "").replace(/\D/g, "").slice(0, 8)}`;
    const rutBody = String(body.step02.rutBody || "").replace(/\D/g, "").slice(0, 8);
    const rutDv = String(body.step02.rutDv || "").slice(0, 1).toUpperCase();

    const region = body.step03.region ?? null;
    const comuna = body.step03.comuna ?? null;

    // 1) Crear ORDER
    const orderPayload: any = {
      data: {
        // UIDs: tú los tienes, así que los seteamos sí o sí:
        orderName: `Pedido ${commerceOrder}`,
        orderNumber: commerceOrder, // UID
        commerceOrder: commerceOrder,

        statusOrder: "PENDING_PAYMENT", // asegúrate que exista en tu enum

        subtotal: Math.round(body.subtotal),
        shippingCost: Math.round(body.shippingCost),
        total: Math.round(body.total),

        customerName: body.step02.name?.trim() ?? "",
        rutBody,
        rutDv,
        phone,

        // envío
        region,
        comuna,
        calle: body.step03.calle?.trim() ?? "",
        numero: body.step03.numero?.trim() ?? "",
        depto: body.step03.depto?.trim() ?? "",
        nota: body.step03.nota?.trim() ?? "",

        paymentProvider: "FLOW", // enum
      },
    };

    // relacionar con user si existe
    if (customerId) {
      // en Strapi v5 suele aceptar id directo en relations:
      orderPayload.data.customer = customerId;
    }

    const createdOrder = await strapiAdminFetch<any>("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderPayload),
    });

    const orderId = createdOrder?.data?.id;
    if (!orderId) {
      return NextResponse.json(
        { ok: false, error: "No se pudo crear Order" },
        { status: 500 }
      );
    }

    // 2) Crear ORDER ITEMS
    for (let i = 0; i < body.items.length; i++) {
      const it = body.items[i];

      const qty = Math.max(1, Number(it.qty || 1));
      const unitPrice = Math.round(Number(it.unitPrice || 0));
      const lineTotal = Math.round(unitPrice * qty);

      const itemPayload = {
        data: {
          // UID ligado a name:
          orderItemName: `Item ${commerceOrder}-${i + 1}`,
          // order + variant relations:
          order: orderId,
          variant: it.variantId,

          qty,
          unitPrice,
          lineTotal,

          skuSnapshot: it.sku ?? "",
          variantNameSnapshot: it.variantName ?? "",
          productNameSnapshot: it.productName ?? "",
          imageUrlSnapshot: it.imageUrl ?? "",
        },
      };

      await strapiAdminFetch<any>("/api/order-items", {
        method: "POST",
        body: JSON.stringify(itemPayload),
      });
    }

    return NextResponse.json(
      { ok: true, orderId, commerceOrder },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("💥 /api/orders/create error:", err?.message ?? err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Error creando orden" },
      { status: 500 }
    );
  }
}

