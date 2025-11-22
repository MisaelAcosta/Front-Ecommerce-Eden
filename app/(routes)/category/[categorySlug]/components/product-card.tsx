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
        group relative 
        w-full
        h-auto
        pt-4
        pb-4
        overflow-hidden 
        rounded-none
        sm:rounded-[15px] sm:border-[0.5px] border-[#b9b9b9]
        bg-[#f0f0f0]
        flex flex-col 
        justify-between
      "
    >
      <CardContent className="flex flex-col justify-around px-3 md:px-3 pt-0 pb-0">

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
                sm:max-h-[310px] w-auto object-contain
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
            text-lg
            leading-none
            text-center sm:text-2xl 
            font-black  uppercase
            mb-1
          "
        >
          {displayName}
        </h3>


        {/* SEPARATOR 1 */}
        <div className="h-px w-full bg-[#c0c0c0] mb-1" />



        {/* SUB + PRECIO */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-l font-semibold text-black ">
            {secondaryName}
          </p>

          <p className="text-[15px] font-semibold">
            {formatPrice(displayPrice)}
          </p>
        </div>



        {/* SEPARATOR 2 */}
        <div className="h-px w-full bg-[#c0c0c0] mb-1" />



        {/* ESTADO + CTA */}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Badge */}
          <span
            className={`
              sm:inline-flex items-center hidden ustify-center
              rounded-[10px] h-9 px-4 py-1
              text-[11px] sm:text-xs font-extrabold uppercase
              ${isActive ? "bg-[#62DF70] text-white" : "bg-[#E5E5E5] text-[#777777]"}
            `}
          >
            {isActive ? "Disponible" : "No disponible"}
          </span>

          {/* Botón + favorito */}
          <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-2">
            <Button
              onClick={() => router.push(`/product/${productSlug}`)}
              className="
                h-9 px-4 text-[12px] sm:text-[13px] font-medium
                rounded-[10px] bg-black text-white hover:bg-black/90 
                flex items-center gap-2
                flex-1 sm:flex-none
              "
            >
              <ShoppingCart
              width={15}
              strokeWidth={3}>

              </ShoppingCart>
            </Button>

            <button
              className="
                inline-flex h-9 w-9 
                sm:
                items-center justify-center cursor-pointer
                rounded-[10px] border border-[#E3E3E3]
                bg-white text-black/70 
                transition-colors
                flex-shrink-0
              "
            >
              <Heart 
              width={20}
              strokeWidth={1.5}
              className="hover:fill-red-500" />
            </button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default ProductCard;
