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

type StrapiSingleResponse<T> = {
  data?: T;
  error?: {
    message?: string;
    [key: string]: unknown;
  };
};

type CreatedOrderData = {
  id: number;
  documentId: string;
};

type CreatedOrderItemData = {
  id: number;
  documentId?: string;
};

type OrderPayload = {
  data: {
    orderName: string;
    orderNumber: string;
    commerceOrder: string;
    statusOrder: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    customerName: string;
    rutBody: string;
    rutDv: string;
    phone: string;
    region: string | null;
    comuna: string | null;
    calle: string;
    numero: string;
    depto: string;
    nota: string;
    paymentProvider: string;
    customer?: number;
  };
};

type OrderItemPayload = {
  data: {
    orderItemName: string;
    order: string;
    variant: number;
    qty: number;
    unitPrice: number;
    lineTotal: number;
    skuSnapshot: string;
    variantNameSnapshot: string;
    productNameSnapshot: string;
    imageUrlSnapshot: string;
  };
};

function nowCommerceOrder() {
  return `EDEN-${Date.now()}`;
}

async function getCustomerIdFromJwtCookie(): Promise<number | null> {
  const cookieStore = await cookies();
  const jwt =
    cookieStore.get("eden_jwt")?.value ||
    cookieStore.get("jwt")?.value ||
    cookieStore.get("token")?.value ||
    null;

  if (!jwt) return null;

  const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1338";
  const res = await fetch(`${STRAPI_URL}/api/users/me?fields[0]=id`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const me = (await res.json()) as { id?: unknown };
  return typeof me.id === "number" ? me.id : null;
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

    const phone = `+569${String(body.step02.phoneRest || "")
      .replace(/\D/g, "")
      .slice(0, 8)}`;

    const rutBody = String(body.step02.rutBody || "")
      .replace(/\D/g, "")
      .slice(0, 8);

    const rutDv = String(body.step02.rutDv || "")
      .slice(0, 1)
      .toUpperCase();

    const region = body.step03.region ?? null;
    const comuna = body.step03.comuna ?? null;

    const orderPayload: OrderPayload = {
      data: {
        orderName: `Pedido ${commerceOrder}`,
        orderNumber: commerceOrder,
        commerceOrder,
        statusOrder: "PENDING_PAYMENT",
        subtotal: Math.round(body.subtotal),
        shippingCost: Math.round(body.shippingCost),
        total: Math.round(body.total),
        customerName: body.step02.name?.trim() ?? "",
        rutBody,
        rutDv,
        phone,
        region,
        comuna,
        calle: body.step03.calle?.trim() ?? "",
        numero: body.step03.numero?.trim() ?? "",
        depto: body.step03.depto?.trim() ?? "",
        nota: body.step03.nota?.trim() ?? "",
        paymentProvider: "FLOW",
      },
    };

    if (customerId) {
      orderPayload.data.customer = customerId;
    }

    console.log("ORDER PAYLOAD", JSON.stringify(orderPayload, null, 2));

    const createdOrder = await strapiAdminFetch<
      StrapiSingleResponse<CreatedOrderData>
    >("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderPayload),
    });

    console.log("ORDER CREATED", JSON.stringify(createdOrder, null, 2));

    const orderId = createdOrder?.data?.id;
    const orderDocumentId = createdOrder?.data?.documentId;

    console.log("ORDER IDS", {
      orderId,
      orderDocumentId,
    });

    if (!orderId || !orderDocumentId) {
      return NextResponse.json(
        { ok: false, error: "No se pudo crear Order correctamente" },
        { status: 500 }
      );
    }

    const createdItemIds: number[] = [];

    for (let i = 0; i < body.items.length; i++) {
      const it = body.items[i];

      const qty = Math.max(1, Number(it.qty || 1));
      const unitPrice = Math.round(Number(it.unitPrice || 0));
      const lineTotal = Math.round(unitPrice * qty);

      const variantName = (it.variantName ?? "").trim();

      const friendlyOrderItemName = variantName
        ? `${variantName} x${qty}`
        : `Item ${commerceOrder}-${i + 1} x${qty}`;

      const itemPayload: OrderItemPayload = {
        data: {
          orderItemName: friendlyOrderItemName,
          order: orderDocumentId,
          variant: Number(it.variantId),
          qty,
          unitPrice,
          lineTotal,
          skuSnapshot: it.sku ?? "",
          variantNameSnapshot: variantName,
          productNameSnapshot: it.productName ?? "",
          imageUrlSnapshot: it.imageUrl ?? "",
        },
      };

      console.log(
        `ORDER ITEM PAYLOAD [${i}]`,
        JSON.stringify(itemPayload, null, 2)
      );

      const createdItem = await strapiAdminFetch<
        StrapiSingleResponse<CreatedOrderItemData>
      >("/api/order-items", {
        method: "POST",
        body: JSON.stringify(itemPayload),
      });

      console.log(
        `ORDER ITEM CREATED [${i}]`,
        JSON.stringify(createdItem, null, 2)
      );

      const createdItemId = createdItem?.data?.id;

      if (!createdItemId) {
        throw new Error(`No se pudo crear OrderItem en índice ${i}`);
      }

      createdItemIds.push(createdItemId);
    }

    console.log("ORDER ITEM IDS", createdItemIds);
    console.log(
      "RELATION TEST OK: se omitió temporalmente el update final de order_items para probar relación directa desde OrderItem -> Order"
    );

    return NextResponse.json(
      {
        ok: true,
        orderId,
        orderDocumentId,
        commerceOrder,
        createdItemIds,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creando orden";
    console.error("💥 /api/orders/create error:", message);

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
