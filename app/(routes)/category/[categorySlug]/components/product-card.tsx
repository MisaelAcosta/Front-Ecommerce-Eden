"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CirclePlus, Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductType } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import { useState } from "react";

type ProductCardProps = {
  product: ProductType;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const attrs = product?.attributes || {};

  const [hover, setHover] = useState(false);

  // Helper URL absoluta
  const toAbsUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;

    const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
    const clean = url.replace(/^\/+/, "");
    return `${base}/${clean}`;
  };

  // -------------------------
  //   OBTENER IMÁGENES
  // -------------------------
  const imagesArray =
    Array.isArray(attrs?.images)
      ? attrs.images
      : attrs?.images?.data?.map((i: any) => i.attributes) || [];

  const firstImage = imagesArray?.[0]?.url ?? null;
  const secondImage = imagesArray?.[1]?.url ?? null;

  const image1 = toAbsUrl(firstImage);
  const image2 = toAbsUrl(secondImage);

  // -------------------------

  const displayName = attrs?.productName ?? "Producto sin nombre";
  const secondaryName =
    attrs?.productName2 ?? attrs?.variant ?? attrs?.subCategory ?? "";
  const displayPrice =
    attrs?.price !== undefined && attrs?.price !== null ? attrs.price : "—";
  const isActive = attrs?.active ?? true;
  const productSlug = attrs?.slug ?? "";

  return (
    <Card
      className="
        group relative w-full
        overflow-hidden
        rounded-none
        sm:rounded-[15px] sm:border-[0.5px] md:border-[#b9b9b9]
        bg-[#ffffff]
        flex flex-col justify-between
        py-1 sm:py-4
      "
    >
      <CardContent className="flex flex-col px-3 pt-0 pb-0">

        {/* IMAGEN */}
        <div
          className="
            relative mb-3 sm:mb-4 
            mt-0 w-full 
            rounded-[14px] sm:rounded-[24px]
          bg-white
            flex items-center justify-center overflow-hidden
            pt-1 pb-1 cursor-pointer
          "
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => router.push(`/product/${product.attributes.slug}`)}
        >
          {/* Imagen por defecto */}
          {image1 && (
            <img
              src={image1}
              alt={displayName}
              className={`
                max-h-[380px] sm:max-h-[310px] w-auto object-contain
                transition-all duration-300 ease-out
                ${hover && image2 ? "opacity-0" : "opacity-100"}
              `}
            />
          )}

          {/* 2da imagen al hover */}
          {image2 && (
            <img
              src={image2}
              alt={displayName}
              className={`
                absolute max-h-[210px] sm:max-h-[410px] max-w-[320px] object-contain
                transition-all duration-600 ease-out
                ${hover ? "opacity-100" : "opacity-0"}
              `}
            />
          )}

          {!image1 && (
            <span className="text-sm text-muted-foreground">Sin imagen</span>
          )}
        </div>

        {/* NOMBRE */}
        <h3
          className="
            text-[15px] sm:text-[18px]
            leading-tight
            text-center
            font-black uppercase
            mb-1
            line-clamp-1
          "
        >
          {displayName}
        </h3>


        {/* SEPARATOR 1 */}
        <div className="h-px w-full bg-[#c0c0c0] " />



        {/* SUB*/}
        <div className="flex justify-center py-1 md:py-3">
           <div className="flex items-center gap-2 text-center">
          <p className="text-sm md:text-lg font-medium  text-black leading-none md:leading-3">
             {secondaryName}
           </p>
          </div>
          </div>            



        {/* SEPARATOR 2 */}
        <div className="h-px w-full bg-[#c0c0c0] " />


        {/* PRECIO + CTA */}
        <div className="mt-0 md:mt-3 flex items-center justify-between ">
          {/* Precio */}
          <p className="text-[16px] sm:text-[18px] pt-none font-semibold pl-2 sm:pl-4 whitespace-nowrap">
            {formatPrice(displayPrice)}
          </p>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Comprar (solo desktop) */}
            <Button
              onClick={() => router.push(`/product/${productSlug}`)}
              className="
                hidden md:inline-flex
                h-9 px-4 text-[12px] sm:text-[13px] font-medium
                rounded-[10px] bg-black text-white hover:bg-black/90
                items-center gap-2 cursor-pointer
              "
            >
              Comprar
            </Button>

            {/* Corazón */}
            <button
              className="
                inline-flex h-9 w-9 items-center justify-center cursor-pointer
                rounded-[10px] md:border border-[#E3E3E3]
                bg-white text-black/70 transition-colors
                flex-shrink-0
              "
            >
              <Heart width={20} strokeWidth={1.5} className="hover:fill-black" />
            </button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default ProductCard;
