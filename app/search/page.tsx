// app/search/page.tsx
import Image from "next/image";

// corre en server component por defecto

type ProductImage = {
  url: string;
};

type ProductType = {
  id: number;
  productName: string;
  slug: string;
  price?: number | null;
  images?: ProductImage[];
};

type StrapiMediaV5 = {
  url?: string | null;
};

type StrapiMediaV4 = {
  attributes?: {
    url?: string | null;
  } | null;
};

type ProductSource = {
  productName?: string | null;
  slug?: string | null;
  price?: number | null;
  images?:
    | StrapiMediaV5[]
    | {
        data?: StrapiMediaV4[] | null;
      }
    | null;
};

type StrapiProductItem = {
  id: number;
  attributes?: ProductSource;
} & ProductSource;

type StrapiProductsResponse = {
  data?: StrapiProductItem[];
};

function buildImageUrl(
  base: string,
  url?: string | null
): string {
  if (!url) return "";
  return url.startsWith("http") ? url : `${base}${url}`;
}

async function fetchResults(q: string): Promise<ProductType[]> {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!base) {
    console.error("[/search] NEXT_PUBLIC_BACKEND_URL no está definido");
    return [];
  }

  const url = new URL(`${base}/api/products`);

  url.searchParams.append(
    "filters[$or][0][productName][$containsi]",
    q
  );
  url.searchParams.append(
    "filters[$or][1][description][$containsi]",
    q
  );

  url.searchParams.append("populate", "*");

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("[/search] bad response", res.status);
    return [];
  }

  const json: StrapiProductsResponse = await res.json();

  const mapped: ProductType[] =
    json.data?.map((item: StrapiProductItem) => {
      const src: ProductSource = item.attributes ?? item;

      let imgs: ProductImage[] = [];

      // v5 plano
      if (Array.isArray(src.images)) {
        imgs = src.images
          .map((img: StrapiMediaV5) => ({
            url: buildImageUrl(base, img.url),
          }))
          .filter((img) => img.url !== "");
      }

      // v4 populate
      else if (Array.isArray(src.images?.data)) {
        imgs = src.images.data
          .map((imgWrap: StrapiMediaV4) => ({
            url: buildImageUrl(base, imgWrap.attributes?.url),
          }))
          .filter((img) => img.url !== "");
      }

      return {
        id: item.id,
        productName: src.productName ?? "",
        slug: src.slug ?? String(item.id),
        price: src.price ?? null,
        images: imgs,
      };
    }) ?? [];

  return mapped;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = (searchParams?.q ?? "").trim();

  if (!q) {
    return (
      <section className="px-6 py-10">
        <h1 className="text-xl font-bold mb-4 text-black">
          Buscar productos
        </h1>
        <p className="text-sm text-zinc-500">
          Escribí algo en la barra de la izquierda para buscar.
        </p>
      </section>
    );
  }

  const results = await fetchResults(q);

  return (
    <section className="px-6 py-10">
      <h1 className="text-xl font-bold text-black mb-2">
        Resultados para: <span className="text-zinc-700">&quot;{q}&quot;</span>
      </h1>

      {results.length === 0 && (
        <p className="text-sm text-zinc-500">
          No encontramos nada con ese término.
        </p>
      )}

      {results.length > 0 && (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {results.map((prod) => (
            <li
              key={prod.id}
              className="border border-zinc-200 rounded-xl p-4 hover:shadow-md cursor-pointer bg-white"
            >
              <div className="relative w-full pt-[100%] mb-3 rounded-lg overflow-hidden bg-zinc-100">
                {prod.images?.[0]?.url && (
                  <Image
                    src={prod.images[0].url}
                    alt={prod.productName}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <p className="text-sm font-semibold text-black line-clamp-2">
                {prod.productName}
              </p>

              {prod.price != null && (
                <p className="text-[13px] text-zinc-600 mt-1">
                  ${prod.price}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
