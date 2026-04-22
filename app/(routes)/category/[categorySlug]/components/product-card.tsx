"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import type { ProductType } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import type { PromotionType } from "@/types/promotion";
import { LovedButton } from "@/components/loved-button";
import { toAbsUrl } from "@/lib/media";

// Tipografias locales usadas en la tarjeta del catalogo.
const khInterferenceLightFont = localFont({
  src: "../../../../../components/fonts/KHInterferenceTRIAL-Light.otf",
  weight: "300",
  style: "normal",
  display: "swap",
});

const khInterferenceRegularFont = localFont({
  src: "../../../../../components/fonts/KHInterferenceTRIAL-Regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
});

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

type ProductImage = {
  url?: string | null;
};

type ProductAttrs = {
  id?: number | string;
  productName?: string | null;
  productName2?: string | null;
  variant?: string | null;
  slug?: string | null;
  price?: number | string | null;
  promotions?: PromotionsInput;
  images?:
    | ProductImage[]
    | {
        data?: Array<{
          attributes?: ProductImage;
        }> | null;
      }
    | null;
};

type ProductWithOptionalAttributes = ProductType & {
  id?: number | string;
  attributes?: ProductAttrs;
};

type ProductCardData = {
  id?: number | string;
  displayName: string;
  secondaryName: string;
  productSlug: string;
  basePrice: number;
  finalPrice: number;
  hasDiscount: boolean;
  image1: string | null;
  image2: string | null;
};

type ProductCardProps = {
  product: ProductType;
};

// Evalua si una promocion sigue vigente segun fechas y estado.
function isPromoActive(promo: PromotionType, now = new Date()) {
  if (!promo?.active) return false;

  const start = promo.startAt ? new Date(promo.startAt) : null;
  const end = promo.endAt ? new Date(promo.endAt) : null;

  if (start && now < start) return false;
  if (end && now > end) return false;

  return true;
}

// Aplica el valor de la promocion al precio base.
function applyPromo(basePrice: number, promo: PromotionType | null) {
  if (!promo) return basePrice;

  const promoValue = (promo as PromotionLike).value;
  const value = Number(promoValue || 0);
  let discount = 0;

  if (value <= 1) discount = basePrice * value;
  else if (value <= 100) discount = basePrice * (value / 100);
  else discount = value;

  return Math.max(0, Math.round(basePrice - discount));
}

// Escoge la promocion activa que deje el precio final mas bajo.
function pickBestPromo(basePrice: number, promos?: PromotionType[] | null) {
  if (!promos || promos.length === 0) return null;

  const activePromos = promos.filter((promo) => isPromoActive(promo));
  if (activePromos.length === 0) return null;

  let best: { promo: PromotionType; finalPrice: number } | null = null;

  for (const promo of activePromos) {
    const finalPrice = applyPromo(basePrice, promo);
    if (!best || finalPrice < best.finalPrice) {
      best = { promo, finalPrice };
    }
  }

  return best ? best.promo : null;
}

// Aplana las promociones cuando Strapi las entrega anidadas.
function normalizePromotions(input: PromotionsInput): PromotionType[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;

  if (Array.isArray(input.data)) {
    return input.data.map((item) => ({
      ...(item?.attributes ?? item),
      id: item?.id ?? item?.attributes?.id,
    })) as PromotionType[];
  }

  if (input.data && typeof input.data === "object" && !Array.isArray(input.data)) {
    const item = input.data;
    return [
      {
        ...(item?.attributes ?? item),
        id: item?.id ?? item?.attributes?.id,
      } as PromotionType,
    ];
  }

  return [];
}

// Obtiene las imagenes del producto sin importar si vienen planas o relacionadas.
function getImagesArray(attrs: ProductAttrs): ProductImage[] {
  if (Array.isArray(attrs.images)) {
    return attrs.images;
  }

  if (attrs.images?.data && Array.isArray(attrs.images.data)) {
    return attrs.images.data
      .map((item) => item.attributes)
      .filter((image): image is ProductImage => Boolean(image));
  }

  return [];
}

// Prepara todos los datos necesarios para renderizar la tarjeta.
function buildProductCardData(product: ProductType): ProductCardData {
  const productData = product as ProductWithOptionalAttributes;
  const attrs: ProductAttrs = productData.attributes ?? (product as ProductAttrs) ?? {};
  const imagesArray = getImagesArray(attrs);
  const image1 = toAbsUrl(imagesArray[0]?.url ?? null);
  const image2 = toAbsUrl(imagesArray[1]?.url ?? null);
  const displayName = attrs.productName ?? "Producto sin nombre";
  const secondaryName = attrs.productName2 ?? attrs.variant ?? "";
  const productSlug = attrs.slug ?? "";
  const basePrice = Number(attrs.price ?? 0);
  const promos = normalizePromotions(attrs.promotions);
  const appliedPromo = pickBestPromo(basePrice, promos);
  const finalPrice = appliedPromo
    ? applyPromo(basePrice, appliedPromo)
    : basePrice;

  return {
    id: productData.id ?? attrs.id,
    displayName,
    secondaryName,
    productSlug,
    basePrice,
    finalPrice,
    hasDiscount: appliedPromo !== null && finalPrice < basePrice,
    image1,
    image2,
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const productCard = buildProductCardData(product);
  const {
    id,
    displayName,
    secondaryName,
    productSlug,
    basePrice,
    finalPrice,
    hasDiscount,
    image1,
    image2,
  } = productCard;

  return (
    <Card
      className="
        group relative flex w-full flex-col justify-between
        rounded-none border-none bg-white pb-6 shadow-none
        sm:overflow-hidden sm:py-4
      "
    >
      {hasDiscount && (
        <div
          className="
            absolute left-3 top-3 z-10 rounded-full bg-green-500
            px-3 py-1 text-[11px] font-black tracking-wide text-white
          "
        >
          OFERTA
        </div>
      )}

      <CardContent className="flex flex-col px-0 pt-0 pb-0 sm:px-0">
        {/* Contenedor visual del producto e interaccion principal. */}
        <div
          className="
            relative mt-0 mb-3 flex w-full cursor-pointer items-center
            justify-center overflow-hidden bg-white pt-1 pb-1 sm:mb-4
          "
          onClick={() => productSlug && router.push(`/product/${productSlug}`)}
        >
          <div className="absolute top-2 right-2 z-20 sm:top-4 sm:right-5">
            <LovedButton
              product={{
                id: Number(id) || 0,
                title: displayName,
                secondaryName,
                price: basePrice,
                slug: productSlug,
                imageUrl: image1,
              }}
            />
          </div>

          <div className="relative aspect-4/5 w-full">
            {image1 && (
              <Image
                src={image1}
                alt={displayName}
                fill
                sizes="(max-width: 480px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
                className="
                  object-contain transition-all duration-300 ease-out
                  opacity-100 group-hover:opacity-0
                "
              />
            )}

            {image2 && (
              <Image
                src={image2}
                alt={displayName}
                fill
                sizes="(max-width: 480px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
                className="
                  object-contain transition-all duration-500 ease-out
                  opacity-0 group-hover:opacity-100
                "
              />
            )}

            {!image1 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Sin imagen</span>
              </div>
            )}
          </div>
        </div>

        <h3
          className={`${khInterferenceRegularFont.className}
            line-clamp-1 text-left text-[15px] 
            leading-tight tracking-wide sm:tracking-tight
            sm:text-xl
          `}
        >
          {displayName}
        </h3>

        <div className="flex justify-start">
          <div className="flex items-center gap-2 text-left">
            <p
              className={`${khInterferenceLightFont.className} text-left 
              text-[14px]  tracking-wide sm:tracking-tight
               text-black md:text-lg md:leading-3`}
            >
              {secondaryName}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-start text-left">
          {hasDiscount ? (
            <div className="leading-tight text-left">
              <p
                className={`${khInterferenceLightFont.className} 
                text-[12px] text-black/40 line-through sm:text-[13px]`}
              >
                {formatPrice(basePrice)}
              </p>
              <p
                className={`${khInterferenceLightFont.className} 
                whitespace-nowrap text-[13px] text-red-500 tabular-nums 
                sm:text-[18px]`}
              >
                {formatPrice(finalPrice)}
              </p>
            </div>
          ) : (
            <p
              className={`${khInterferenceLightFont.className} 
              whitespace-nowrap text-[13px] text-left sm:text-[18px]`}
            >
              {formatPrice(basePrice)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
