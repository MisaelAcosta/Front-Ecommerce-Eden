"use client";

import { useGetFeaturedProducts } from "@/api/useGetFeaturedProducts";
import localFont from "next/font/local";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import SkeletonSchema from "./skeletonSchema";
import type { ResponseType } from "@/types/response";
import type { ProductType } from "@/types/product";
import type { PromotionType } from "@/types/promotion";
import { Card, CardContent } from "./ui/card";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/formatPrice";
import { LovedButton } from "./loved-button";
import { toAbsUrl } from "@/lib/media";
import Image from "next/image";

// Local fonts used only by the featured products section.
const maratypeFont = localFont({
  src: "./fonts/Maratype.otf",
  display: "swap",
});

const khInterferenceLightFont = localFont({
  src: "./fonts/KHInterferenceTRIAL-Light.otf",
  weight: "300",
  style: "normal",
  display: "swap",
});

const khInterferenceRegularFont = localFont({
  src: "./fonts/KHInterferenceTRIAL-Regular.otf",
  weight: "800",
  style: "normal",
  display: "swap",
});

type ProductImage = {
  url?: string | null;
};

type StrapiImageWrapper = {
  attributes?: ProductImage | null;
};

type StrapiRelationArray<T> = {
  data?: T[] | null;
};

type StrapiRelationSingle<T> = {
  data?: T | null;
};

type PromotionLike = PromotionType & {
  value?: number | string | null;
};

type PromotionStrapiItem = {
  id?: number;
  attributes?: PromotionLike;
} & PromotionLike;

type ProductAttrs = {
  productName?: string | null;
  productName2?: string | null;
  variant?: string | null;
  slug?: string | null;
  price?: number | string | null;
  images?: ProductImage[] | StrapiRelationArray<StrapiImageWrapper> | null;
  promotions?:
    | PromotionType[]
    | StrapiRelationArray<PromotionStrapiItem>
    | StrapiRelationSingle<PromotionStrapiItem>
    | null;
};

type ProductWithAttributes = ProductType & {
  id: number;
  attributes?: ProductAttrs;
} & ProductAttrs;

type FeaturedProductCardData = {
  id: number;
  displayName: string;
  secondaryName: string;
  productSlug: string;
  basePrice: number;
  finalPrice: number;
  hasDiscount: boolean;
  image1: string | null;
  image2: string | null;
};

// Promotion helpers used to decide the final visible price.
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

  const promoValue = promo as PromotionLike;
  const val = Number(promoValue.value || 0);
  let discount = 0;

  if (val <= 1) {
    discount = basePrice * val;
  } else if (val <= 100) {
    discount = basePrice * (val / 100);
  } else {
    discount = val;
  }

  return Math.max(0, Math.round(basePrice - discount));
}

function pickBestPromo(basePrice: number, promos?: PromotionType[] | null) {
  if (!promos || promos.length === 0) return null;

  const actives = promos.filter((p) => isPromoActive(p));
  if (actives.length === 0) return null;

  let best: { promo: PromotionType; finalPrice: number } | null = null;

  for (const p of actives) {
    const fp = applyPromo(basePrice, p);

    if (!best || fp < best.finalPrice) {
      best = { promo: p, finalPrice: fp };
    }
  }

  return best ? best.promo : null;
}

// Normalize Strapi promotion payloads into a flat array the UI can consume.
function normalizePromotionItem(x: PromotionStrapiItem): PromotionType {
  const source = x?.attributes ?? x;
  const { id: sourceId, ...rest } = source;

  return {
    ...rest,
    id: x?.id ?? sourceId,
  } as PromotionType;
}

function normalizePromotions(
  input:
    | PromotionType[]
    | StrapiRelationArray<PromotionStrapiItem>
    | StrapiRelationSingle<PromotionStrapiItem>
    | null
    | undefined
): PromotionType[] {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input as PromotionType[];
  }

  if ("data" in input && Array.isArray(input.data)) {
    return input.data.map(normalizePromotionItem);
  }

  if (
    "data" in input &&
    input.data &&
    !Array.isArray(input.data) &&
    typeof input.data === "object"
  ) {
    return [normalizePromotionItem(input.data)];
  }

  return [];
}

// Resolve product images regardless of whether Strapi returns raw arrays or relations.
function getImagesArray(attrs: ProductAttrs): ProductImage[] {
  if (Array.isArray(attrs.images)) {
    return attrs.images;
  }

  if (attrs.images && "data" in attrs.images && Array.isArray(attrs.images.data)) {
    return attrs.images.data
      .map((i: StrapiImageWrapper) => i.attributes)
      .filter((img): img is ProductImage => Boolean(img));
  }

  return [];
}

// Convert the raw product payload into the shape used by the card UI.
function buildFeaturedProductCardData(product: ProductType): FeaturedProductCardData {
  const raw = product as ProductWithAttributes;
  const attrs: ProductAttrs = raw.attributes ?? raw;
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
    id: raw.id,
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

// Product card renderer used by the carousel to keep the main section compact.
function FeaturedProductCard({
  product,
  onOpenProduct,
}: {
  product: FeaturedProductCardData;
  onOpenProduct: (slug: string) => void;
}) {
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
  } = product;

  return (
    <CarouselItem
      key={id}
      className="basis-[85%] sm:basis-1/2 lg:basis-1/3 
      px-3 md:px-4"
    >
      <Card
        className="
          shadow-none
          group relative
          w-full
          h-auto
          pt-4
          pb-4
          overflow-hidden
          border-none
          bg-[#ffffff]
          flex flex-col
          justify-between
        "
      >
        {hasDiscount && (
          <div
            className="
              absolute left-4 top-4 z-10
              rounded-full px-3 py-1
              text-[11px] font-black tracking-wide
              bg-green-500 text-white
            "
          >
            OFERTA
          </div>
        )}

        <CardContent className="flex flex-col 
        justify-around px-1 md:px-3 pt-0 pb-0">
          <div
            className="
              relative mb-3 sm:mb-4
              mt-0 w-full
              bg-white
              flex items-center justify-center overflow-hidden
              pt-1 pb-1 cursor-pointer
            "
            onClick={() => onOpenProduct(productSlug)}
          >
            <div className="absolute top-3 cursor-pointer 
            right-3 z-20">
              <LovedButton
                product={{
                  id,
                  title: displayName,
                  secondaryName,
                  price: basePrice,
                  slug: productSlug,
                  imageUrl: image1,
                }}
              />
            </div>

            {image1 && (
              <Image
                src={image1}
                alt={displayName}
                width={700}
                height={700}
                unoptimized
                className="
                  sm:max-h-102.5 h-auto w-auto object-contain
                  transition-all duration-300 ease-out
                  opacity-100 group-hover:opacity-0
                "
              />
            )}

            {image2 && (
              <Image
                src={image2}
                alt={displayName}
                fill
                unoptimized
                className="
                  absolute inset-0
                  object-cover
                  transition-all duration-300 ease-out
                  opacity-0 group-hover:opacity-100
                "
              />
            )}

            {!image1 && (
              <span className="text-sm text-muted-foreground">Sin imagen</span>
            )}
          </div>

          <h3
            className={`${khInterferenceRegularFont.className}
              text-lg
              leading-none
              text-left sm:text-2xl
              uppercase pt-0
              pb-0
            `}
          >
            {displayName}
          </h3>

          <div className="flex justify-start gap-2">
            <div className="flex items-center gap-2 text-left">
              <p
                className={`${khInterferenceLightFont.className} 
                text-lg font-normal text-left text-black`}
              >
                {secondaryName}
              </p>
            </div>
          </div>

          <div className="flex items-center 
          justify-start gap-2">
            {hasDiscount ? (
              <div className="leading-tight tp-0 text-left">
                <p
                  className={`${khInterferenceLightFont.className} text-[12px] font-semibold text-black/40 line-through`}
                >
                  {formatPrice(basePrice)}
                </p>
                <p
                  className={`${khInterferenceLightFont.className} 
                  text-[17px] sm:text-[17px] 
                  font-extrabold text-red-500 tabular-nums`}
                >
                  {formatPrice(finalPrice)}
                </p>
              </div>
            ) : (
              <p
                className={`${khInterferenceLightFont.className} text-[15px] sm:inline-flex items-center 
                justify-start font-semibold text-left`}
              >
                {formatPrice(basePrice)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </CarouselItem>
  );
}

const FeaturedProducts = () => {
  const { result, loading }: ResponseType = useGetFeaturedProducts();
  const router = useRouter();
  const featuredProducts = Array.isArray(result)
    ? result.map(buildFeaturedProductCardData)
    : [];

  // Keep navigation logic in one place instead of repeating it in the JSX.
  const handleOpenProduct = (slug: string) => {
    if (!slug) return;
    router.push(`/product/${slug}`);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-0 py-8 sm:py-14">
      <div>
        <h3
          className={`${maratypeFont.className} text-4xl 
          text-left tracking-wide sm:tracking-tight sm:text-5xl mb-2 sm:mb-4`}
        >
          TOP VENTAS
        </h3>
        <p
          className={`${khInterferenceLightFont.className} text-black/35 text-left leading-none tracking-normal mb-6 text-base sm:text-base`}
        >
          Los modelos más pedidos y mejor valorados
        </p>
      </div>

      <Carousel>
        <CarouselContent className="ml-1 md:-ml-4">
          {loading && <SkeletonSchema grid={1} />}

          {featuredProducts.map((product) => (
            <FeaturedProductCard
              key={product.id}
              product={product}
              onOpenProduct={handleOpenProduct}
            />
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
};

export default FeaturedProducts;



