"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductType } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import type { PromotionType } from "@/types/promotion";
import { LovedButton } from "@/components/loved-button";
import { toAbsUrl } from "@/lib/media";
import { useNavigationTransition } from "@/components/navigation-transition-provider";

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
  const { navigateWithTransition } = useNavigationTransition();
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
      className="group relative flex w-full flex-col rounded-none border-none bg-white shadow-none"
    >
      <CardContent className="flex flex-col p-0">
        {/* Contenedor visual del producto e interaccion principal. */}
        <div
          className="
            relative flex w-full cursor-pointer items-center justify-center overflow-hidden
            bg-neutral-100 text-left
            aspect-[1.08/1.2]
            lg:aspect-[1.08/1]
          "
          onClick={() =>
            productSlug && navigateWithTransition(`/product/${productSlug}`)
          }
        >
          {hasDiscount && (
            <div className="absolute left-3 top-3 z-10 bg-black px-2 py-1 text-[10px] font-black tracking-wide text-[#ADFE00] lg:left-4 lg:top-4 lg:px-3 lg:text-[11px]">
              OFERTA
            </div>
          )}

          <div className="absolute right-3 top-3 z-20 lg:right-4 lg:top-4">
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

          <div className="relative size-full">
            {image1 && (
              <Image
                src={image1}
                alt={displayName}
                fill
                sizes="(max-width: 480px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
                className="
                  object-cover transition-all duration-300 ease-out
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
                  object-cover transition-all duration-500 ease-out
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

        <div className="flex items-baseline justify-between gap-2 px-1 pt-2 text-left sm:px-0 sm:gap-3">
          <h3
            className={`${khInterferenceRegularFont.className}
              line-clamp-1 min-w-0 flex-1 text-[12px] uppercase leading-[1.2]
              sm:text-[18px] sm:leading-[1.25]
            `}
          >
            {displayName}
          </h3>
          {hasDiscount ? (
            <div className="shrink-0 leading-none text-right">
              <p
                className={`${khInterferenceLightFont.className}
                  text-[10px] text-black/40 line-through
                  sm:text-[15px]`}
              >
                {formatPrice(basePrice)}
              </p>
              <p
                className={`${khInterferenceLightFont.className}
                  whitespace-nowrap text-[12px] text-black tabular-nums
                  sm:text-[18px]`}
              >
                {formatPrice(finalPrice)}
              </p>
            </div>
          ) : (
            <p
              className={`${khInterferenceLightFont.className}
                shrink-0 whitespace-nowrap text-[12px] text-right leading-[1.2]
                sm:text-[18px]`}
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
