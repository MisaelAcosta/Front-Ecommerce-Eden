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
    group relative rounded-none  md:rounded-xl 
    md:border-[#515151] shadow-none bg-white
    flex flex-col justify-between pb-3 pt-0 md:pb-4
    w-full max-w-[360px] sm:max-w-none   /* se expande en tablet/pc */
      "
    >
    



      <CardContent className="px-4 sm:px-6 md:px-8 pb-0 pt-0">
     {/* IMAGEN */}
    <div
      className="
       bg-muted/10 overflow-hidden mb-2
      relative h-56 sm:h-52 md:h-86      /* altura responsiva */
      flex items-center justify-center
     "
   >
    {imageUrl ? (
      <img
        src={imageUrl}
        alt={displayName}
        className="
          max-h-full max-w-full object-contain
          transition-transform duration-300 ease-out
          group-hover:scale-105
        "
      />
      ) : (
      <span className="text-sm text-muted-foreground">Sin imagen</span>
      )}
     </div>

        {/* NOMBRE + SUBTÍTULO */}
<div className="mb-2">
  <h3 className="text-[15px] sm:text-base font-semibold leading-tight line-clamp-2">
    {displayName}
  </h3>

  {subtitle && (
    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
      {subtitle}
    </p>
  )}
</div>

{/* PRECIO + CTA para moviles */}

<div className="mt-auto flex flex-col md:hidden ">
  <Button

  onClick={() => {
      if (!productSlug) return;
      router.push(`/product/${productSlug}`);
    }}
  className="text-[15px] sm:text-base font-medium cursor-pointer">
    ${displayPrice}

    <CirclePlus className="ml-3 h-5 w-5" />

  </Button>
</div>


{/* PRECIO + CTA  para pc y tablet*/}

<div className="mt-auto flex hidden md:flex  flex-col sm:flex-row sm:items-center sm:justify-between ">
  <p
  className="text-[15px] sm:text-base font-medium">
    ${displayPrice}
  </p>

  <Button
    onClick={() => {
      if (!productSlug) return;
      router.push(`/product/${productSlug}`);
    }}
    size="sm"
    className="
      bg-black rounded-lg cursor-pointer
      px-3 sm:px-4
      w-full sm:w-auto justify-center
      transition-all duration-300 ease-out
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


