import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { strapiAdminFetch } from "@/lib/strapi-admin";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1338";

type StrapiMeUser = {
  id?: number;
};

type StrapiListResponse<T> = {
  data?: Array<StrapiEntity<T>>;
};

type StrapiEntity<T> = T & {
  id?: number;
  documentId?: string;
  attributes?: T;
};

type StrapiOrderItem = {
  id?: number;
  qty?: number | null;
  orderItemName?: string | null;
  variantNameSnapshot?: string | null;
  productNameSnapshot?: string | null;
};

type StrapiOrder = {
  id?: number;
  documentId?: string;
  createdAt?: string | null;
  paidAt?: string | null;
  orderNumber?: string | null;
  commerceOrder?: string | null;
  total?: number | null;
  order_items?: Array<StrapiEntity<StrapiOrderItem>> | { data?: Array<StrapiEntity<StrapiOrderItem>> };
};

function unwrapEntity<T>(entity: StrapiEntity<T>): T & { id?: number; documentId?: string } {
  return {
    ...(entity.attributes ?? entity),
    id: entity.id,
    documentId: entity.documentId,
  };
}

function unwrapRelationList<T>(
  relation: Array<StrapiEntity<T>> | { data?: Array<StrapiEntity<T>> } | null | undefined
) {
  if (!relation) return [];
  const items = Array.isArray(relation) ? relation : relation.data ?? [];
  return items.map(unwrapEntity);
}

async function getCustomerIdFromJwt(): Promise<number | null> {
  const cookieStore = await cookies();
  const jwt =
    cookieStore.get("eden_jwt")?.value ||
    cookieStore.get("jwt")?.value ||
    cookieStore.get("token")?.value ||
    null;

  if (!jwt) return null;

  const res = await fetch(`${STRAPI_URL}/api/users/me?fields[0]=id`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const user = (await res.json()) as StrapiMeUser;
  return typeof user.id === "number" ? user.id : null;
}

export async function GET() {
  try {
    const customerId = await getCustomerIdFromJwt();

    if (!customerId) {
      return NextResponse.json({ ok: false, orders: [] }, { status: 401 });
    }

    const query = new URLSearchParams({
      "filters[customer][id][$eq]": String(customerId),
      "sort[0]": "createdAt:desc",
      "pagination[pageSize]": "20",
      "populate[order_items][fields][0]": "orderItemName",
      "populate[order_items][fields][1]": "variantNameSnapshot",
      "populate[order_items][fields][2]": "productNameSnapshot",
      "populate[order_items][fields][3]": "qty",
    });

    const response = await strapiAdminFetch<StrapiListResponse<StrapiOrder>>(
      `/api/orders?${query.toString()}`
    );

    const orders = (response.data ?? []).map((entry) => {
      const order = unwrapEntity(entry);
      const items = unwrapRelationList(order.order_items).map((item) => ({
        name:
          item.variantNameSnapshot ||
          item.productNameSnapshot ||
          item.orderItemName ||
          "Articulo",
        qty: Number(item.qty || 1),
      }));

      return {
        id: order.orderNumber || order.commerceOrder || order.documentId || String(order.id ?? ""),
        date: order.paidAt || order.createdAt || null,
        total: Number(order.total || 0),
        items,
      };
    });

    return NextResponse.json({ ok: true, orders }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "No se pudieron cargar los pedidos";
    console.error("/api/profile/orders error:", message);

    return NextResponse.json(
      { ok: false, error: message, orders: [] },
      { status: 500 }
    );
  }
}
