"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductType } from "@/types/product";

type ProductCardProps = {
  product: ProductType; // ahora sí tipado correcto
};

const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();

  // atajo para no repetir tanto
  const attrs = product?.attributes || {};

  // helper: arma URL absoluta con el backend
  const toAbsUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;

    const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
    const clean = url.replace(/^\/+/, "");
    return `${base}/${clean}`;
  };

  // --- IMAGEN PRINCIPAL ---
  // tu Strapi devuelve imágenes a veces como array simple, a veces como { data: [...] }
  let rawImageUrl: string | null = null;

  // mainImage (si algún día la usas)
  if (attrs?.mainImage?.url) {
    rawImageUrl = attrs.mainImage.url;
  } else if (attrs?.mainImage?.data?.attributes?.url) {
    rawImageUrl = attrs.mainImage.data.attributes.url;
  }

  // images como array plano
  if (!rawImageUrl && Array.isArray(attrs?.images) && attrs.images[0]) {
    rawImageUrl =
      attrs.images[0]?.url ??
      attrs.images[0]?.formats?.medium?.url ??
      attrs.images[0]?.formats?.thumbnail?.url ??
      null;
  }
  // images como { data: [...] }
  else if (
    !rawImageUrl &&
    attrs?.images?.data?.[0]?.attributes?.url
  ) {
    rawImageUrl = attrs.images.data[0].attributes.url;
  }

  const imageUrl = toAbsUrl(rawImageUrl);

  // --- CATEGORÍA PRINCIPAL ---
  // ojo: en tu RAW log, category venía PLANO (id, slug, categoryName, etc.)
  // no venía con { data: { attributes: ... } }, pero dejamos fallback igual
  const categoryLabel =
    attrs?.category?.categoryName ??
    attrs?.category?.attributes?.categoryName ??
    attrs?.category?.data?.attributes?.categoryName ??
    "—";

  // --- SUBTÍTULO ---
  const subtitle =
    attrs?.productName2 ??
    attrs?.variant ??
    attrs?.subCategory ??
    "";

  // --- DATOS BASE ---
  const displayName = attrs?.productName ?? "Producto sin nombre";

  const displayPrice =
    attrs?.price !== undefined && attrs?.price !== null
      ? attrs.price
      : "—";

  const productSlug = attrs?.slug ?? "";

  return (
    <Card
      className="
        group relative rounded-2xl
        border pt-8 border-[#515151]
        shadow-none hover:shadow-sm
        transition-shadow
        bg-background
      "
    >
      {/* HEADER: categoría + iconito */}
      <div className="flex items-start justify-between px-5 pt-4">
        <span className="text-sm text-muted-foreground">
          {categoryLabel}
        </span>

        <button
          className="
            h-9 w-9 shrink-0
            backdrop-blur hover:bg-white
            flex items-center justify-center
            rounded-full
          "
          type="button"
          aria-label="Detalles"
        >
          <Image
            src="/icons/CirculoPlaneta.svg"
            alt="icono"
            width={56}
            height={56}
            className="opacity-100"
          />
        </button>
      </div>

      <CardContent className="px-8 pb-0 pt-none">
        {/* IMAGEN */}
        <div
          className="
            rounded-xl bg-muted/10
            aspect-square w-full overflow-hidden
            mb-4 flex items-center justify-center
          "
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={displayName}
              className="
                max-h-full max-w-full object-contain
                transition-all duration-300 ease-out
                transform group-hover:scale-110
              "
            />
          ) : (
            <span className="text-sm text-muted-foreground">
              Sin imagen
            </span>
          )}
        </div>

        {/* NOMBRE + SUBTÍTULO */}
        <div className="mb-2">
          <h3 className="text-base font-semibold leading-tight line-clamp-2">
            {displayName}
          </h3>

          {subtitle && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* PRECIO + CTA */}
        <div className="flex items-center justify-between pb-4">
          <p className="text-base font-medium">
            ${displayPrice}
          </p>

          <Button
            onClick={() => {
              if (!productSlug) return;
              router.push(`/product/${productSlug}`);
            }}
            size="sm"
            className="
              font-regular bg-[#191919] rounded-lg cursor-pointer
              transition-all duration-300 ease-out
              transform hover:scale-105
            "
          >
            Agregar <CirclePlus className="ml-1 h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;


