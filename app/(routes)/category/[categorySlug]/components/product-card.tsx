"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ProductType } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import { useState } from "react";
import type { PromotionType } from "@/types/promotion";
import { LovedButton } from "@/components/loved-button";

/* ----------------------- helpers de promociones ----------------------- */

type PromotionLike = PromotionType & {
  value?: number | string | null;
};

type StrapiPromotionNode = {
  id?: number | string;
  attributes?: PromotionType & {
    id?: number | string;
  };
} & (PromotionType & {
  id?: number | string;
});

type PromotionsInput =
  | PromotionType[]
  | {
      data?: StrapiPromotionNode[] | StrapiPromotionNode | null;
    }
  | null
  | undefined;

type ProductAttrs = {
  id?: number | string;
  productName?: string | null;
  productName2?: string | null;
  variant?: string | null;
  subCategory?: string | null;
  slug?: string | null;
  price?: number | string | null;
  promotions?: PromotionsInput;
  images?:
    | Array<{ url?: string | null }>
    | {
        data?: Array<{
          attributes?: {
            url?: string | null;
          };
        }>;
      }
    | null;
};

type ProductWithOptionalAttributes = ProductType & {
  id?: number | string;
  attributes?: ProductAttrs;
};

function isPromoActive(p: PromotionType, now = new Date()) {
  if (!p?.active) return false;
  const start = p.startAt ? new Date(p.startAt) : null;
  const end = p.endAt ? new Date(p.endAt) : null;
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

function applyPromo(basePrice: number, promo: PromotionType | null) {
  if (!promo) return basePrice;

  const promoValue = (promo as PromotionLike).value;
  const val = Number(promoValue || 0);
  let discount = 0;

  if (val <= 1) discount = basePrice * val;
  else if (val <= 100) discount = basePrice * (val / 100);
  else discount = val;

  return Math.max(0, Math.round(basePrice - discount));
}

function pickBestPromo(basePrice: number, promos?: PromotionType[] | null) {
  if (!promos || promos.length === 0) return null;

  const actives = promos.filter((p) => isPromoActive(p));
  if (actives.length === 0) return null;

  let best: { promo: PromotionType; finalPrice: number } | null = null;

  for (const p of actives) {
    const fp = applyPromo(basePrice, p);
    if (!best || fp < best.finalPrice) best = { promo: p, finalPrice: fp };
  }

  return best ? best.promo : null;
}

function normalizePromotions(input: PromotionsInput): PromotionType[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;

  if (Array.isArray(input?.data)) {
    return input.data.map((x: StrapiPromotionNode) => ({
      ...(x?.attributes ?? x),
      id: x?.id ?? x?.attributes?.id,
    })) as PromotionType[];
  }

  if (
    input?.data &&
    typeof input.data === "object" &&
    !Array.isArray(input.data)
  ) {
    const x = input.data;
    return [
      {
        ...(x?.attributes ?? x),
        id: x?.id ?? x?.attributes?.id,
      } as PromotionType,
    ];
  }

  return [];
}

type ProductCardProps = {
  product: ProductType;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const productData = product as ProductWithOptionalAttributes;
  const attrs: ProductAttrs =
    productData?.attributes ?? (product as ProductAttrs) ?? {};

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
  const imagesArray = Array.isArray(attrs?.images)
    ? attrs.images
    : attrs?.images?.data?.map((i) => i.attributes ?? {}) || [];

  const firstImage = imagesArray?.[0]?.url ?? null;
  const secondImage = imagesArray?.[1]?.url ?? null;

  const image1 = toAbsUrl(firstImage);
  const image2 = toAbsUrl(secondImage);

  // -------------------------
  const displayName = attrs?.productName ?? "Producto sin nombre";
  const secondaryName =
    attrs?.productName2 ?? attrs?.variant ?? attrs?.subCategory ?? "";

  const productSlug = attrs?.slug ?? "";

  // -------------------------
  //   PRECIO + PROMO
  // -------------------------
  const basePrice = Number(attrs?.price ?? 0);
  const promos = normalizePromotions(attrs?.promotions);
  const appliedPromo = pickBestPromo(basePrice, promos);

  const finalPrice = appliedPromo
    ? applyPromo(basePrice, appliedPromo)
    : basePrice;

  const hasDiscount = appliedPromo !== null && finalPrice < basePrice;

  return (
    <Card
      className="
        group relative w-full
        sm:overflow-hidden
        rounded-none
        border-none
        bg-[#ffffff]
        flex flex-col justify-between
        pb-6 sm:py-4
        shadow-none
      "
    >
      <CardContent className="flex flex-col px-0 sm:px-0 pt-0 pb-0">
        {/* Badge OFERTA */}
        {hasDiscount && (
          <div
            className="
              absolute left-3 top-3 z-10
              rounded-full px-3 py-1
              text-[11px] font-black tracking-wide
              bg-green-500 text-white
            "
          >
            OFERTA
          </div>
        )}

        {/* IMAGEN */}
          <div
            className="
              relative mb-3 sm:mb-4
              mt-0 w-full
              bg-white
              flex items-center justify-center overflow-hidden
              pt-1 pb-1 cursor-pointer
            "
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => router.push(`/product/${productSlug}`)}
          >
            {/* ❤️ Corazón dentro del recuadro */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-5 z-20">
              <LovedButton
                product={{
                  id: productData?.id ?? attrs?.id,
                  title: displayName,
                  secondaryName,
                  price: basePrice,
                  slug: productSlug,
                  imageUrl: image1,
                }}
              />
            </div>

            <div
              className="
                relative w-full
                aspect-4/5
                sm:aspect-4/5
                md:aspect-4/5
              "
            >
              {/* Imagen por defecto */}
              {image1 && (
                <Image
                  src={image1}
                  alt={displayName}
                  fill
                  sizes="(max-width: 480px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
                  className={`
                    object-contain
                    transition-all duration-300 ease-out
                    ${hover && image2 ? "opacity-0" : "opacity-100"}
                  `}
                />
              )}

              {/* 2da imagen al hover */}
              {image2 && (
                <Image
                  src={image2}
                  alt={displayName}
                  fill
                  sizes="(max-width: 480px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
                  className={`
                    object-contain
                    transition-all duration-500 ease-out
                    ${hover ? "opacity-100" : "opacity-0"}
                  `}
                />
              )}

              {!image1 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Sin imagen</span>
                </div>
              )}
            </div>
          </div>

        {/* NOMBRE */}
        <h3
          className="
            text-[15px] sm:text-[18px]
            leading-tight
            text-center
            font-black uppercase
            line-clamp-1
          "
        >
          {displayName}
        </h3>

        {/* SUB */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-center">
            <p className="text-sm md:text-lg font-light text-black leading-none md:leading-3">
              {secondaryName}
            </p>
          </div>
        </div>

        {/* PRECIO */}
        <div className="mt-0 md:mt-1 flex justify-center items-center text-center">
          {hasDiscount ? (
            <div className="leading-tight">
              <p className="text-[12px] sm:text-[13px] font-semibold text-black/40 line-through">
                {formatPrice(basePrice)}
              </p>
              <p className="text-[16px] sm:text-[18px] font-extrabold text-red-500 tabular-nums whitespace-nowrap">
                {formatPrice(finalPrice)}
              </p>
            </div>
          ) : (
            <p className="text-[16px] sm:text-[18px] font-semibold whitespace-nowrap">
              {formatPrice(basePrice)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

