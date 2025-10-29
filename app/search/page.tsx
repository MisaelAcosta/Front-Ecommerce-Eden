// app/search/page.tsx
import Image from "next/image";

// ⚠ esto corre en el server component por defecto
// así que podemos hacer fetch directo acá sin "use client"

type ProductType = {
  id: number;
  productName: string;
  slug: string;
  price?: number;
  images?: { url: string }[];
};

async function fetchResults(q: string): Promise<ProductType[]> {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;

  // armamos la query con filtros $or
  const url = new URL(`${base}/api/products`);

  // Filtros OR por nombre y descripción (ajustá los field names reales)
  url.searchParams.append(
    "filters[$or][0][productName][$containsi]",
    q
  );
  url.searchParams.append(
    "filters[$or][1][description][$containsi]",
    q
  );

  // populate imágenes (ajusta si tus imágenes viven en "images")
  url.searchParams.append("populate", "*");

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // opcional: no caches en prod si querés "en vivo"
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("[/search] bad response", res.status);
    return [];
  }

  const json = await res.json();

  // adaptar al tipo plano que usas en el front
  const mapped: ProductType[] =
    json?.data?.map((item: any) => {
      // soportar v5 plano y v4 con attributes
      const src = item.attributes ?? item;

      // imagen principal
      let imgs: { url: string }[] = [];

      // v5 plano (images es array de media)
      if (Array.isArray(src.images)) {
        imgs = src.images.map((img: any) => ({
          url: img.url?.startsWith("http")
            ? img.url
            : `${base}${img.url}`,
        }));
      }

      // v4 style populate
      else if (Array.isArray(src.images?.data)) {
        imgs = src.images.data.map((imgWrap: any) => {
          const urlImg = imgWrap?.attributes?.url;
          return {
            url: urlImg?.startsWith("http")
              ? urlImg
              : `${base}${urlImg}`,
          };
        });
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

  // si no hay término -> mensaje vacío
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

  // buscamos
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
