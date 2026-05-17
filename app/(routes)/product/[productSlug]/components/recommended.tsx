"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { useGetFeaturedProducts } from "@/api/useGetFeaturedProducts";
import { getCategoryRecommended } from "@/api/getCategoryRecommend";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SkeletonSchema from "@/components/skeletonSchema";
import type { ResponseType } from "@/types/response";
import type { ProductType } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import type { PromotionType } from "@/types/promotion";
import { LovedButton } from "@/components/loved-button";
import { toAbsUrl } from "@/lib/media";
import { useNavigationTransition } from "@/components/navigation-transition-provider";

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

/* ----------------------- types auxiliares ----------------------- */

type StrapiEntity<T> = {
  id?: number;
  attributes?: T;
} & T;

type ProductImage = {
  url?: string;
};

type SubCategoryLike =
  | string
  | {
      id?: number;
      documentId?: string;
      categoryName?: string;
      slug?: string;
    }
  | null;

type ProductAttrs = {
  id?: number;
  slug?: string;
  price?: number | string;
  productName?: string;
  productName2?: string;
  variant?: string;
  subCategory?: string | null;
  sub_category?: SubCategoryLike;
  images?:
    | ProductImage[]
    | {
        data?: StrapiEntity<ProductImage>[];
      };
  promotions?:
  | PromotionType[]
  | {
      data?: StrapiEntity<PromotionType> | StrapiEntity<PromotionType>[];
    }
  | null;
};

type ProductWithAttrs = ProductType & {
  attributes?: ProductAttrs;
};

type PromotionWithValue = PromotionType & {
  value?: number | string;
};

/* ----------------------- helpers de promociones ----------------------- */

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

  const promoWithValue = promo as PromotionWithValue;
  const val = Number(promoWithValue.value ?? 0);
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

function normalizePromotions(
  input: ProductAttrs["promotions"]
): PromotionType[] {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input;
  }

  if (Array.isArray(input?.data)) {
    return input.data.map((x) => ({
      ...(x?.attributes ?? x),
      id: x?.id ?? x?.attributes?.id,
    })) as PromotionType[];
  }

  if (input?.data && typeof input.data === "object" && !Array.isArray(input.data)) {
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

function getImagesArray(images: ProductAttrs["images"]): ProductImage[] {
  if (!images) return [];

  if (Array.isArray(images)) {
    return images;
  }

  if (Array.isArray(images.data)) {
    return images.data.map((img) => img.attributes ?? img);
  }

  return [];
}

/* -------------------------------------------------------------------- */

type RecommendedProps = {
  currentProductId: number;
  categorySlug: string;
};

const Recommmended = ({
  currentProductId,
  categorySlug,
}: RecommendedProps) => {
  const { navigateWithTransition } = useNavigationTransition();

  const {
    result: featuredResult,
    loading: loadingFeatured,
  }: ResponseType = useGetFeaturedProducts();

  const {
    result: categoryResult,
    loading: loadingCategory,
  }: ResponseType = getCategoryRecommended(categorySlug);

  const loading = loadingFeatured || loadingCategory;

  let products: ProductType[] = [];

  if (Array.isArray(categoryResult)) {
    products = categoryResult.filter((p) => p.id !== currentProductId);
  }

  if (Array.isArray(featuredResult)) {
    const featuredClean = featuredResult.filter(
      (p) =>
        p.id !== currentProductId &&
        !products.some((existing) => existing.id === p.id)
    );
    products = [...products, ...featuredClean];
  }

  products = products.slice(0, 6);

  if (loading) {
    return (
      <section className="mx-auto max-w-[1350px] px-4 py-10 sm:px-6 lg:px-0">
        <h3
          className={`${khInterferenceRegularFont.className} mb-6 text-4xl uppercase leading-none tracking-[0] text-black sm:text-6xl`}
        >
          TE PUEDE INTERESAR
        </h3>
        <SkeletonSchema grid={3} />
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1350px] px-4 py-10 sm:px-6 lg:px-0">
      <h3
        className={`${khInterferenceRegularFont.className} mb-8 text-4xl uppercase leading-none tracking-[0] text-black sm:mb-12 sm:text-6xl`}
      >
        TE PUEDE INTERESAR
      </h3>

      <Carousel>
        <CarouselContent className="ml-1 md:-ml-4">
          {products.map((product) => {
            const raw = product as ProductWithAttrs;
            const attrs: ProductAttrs = raw.attributes ?? raw;

            const imagesArray = getImagesArray(attrs.images);

            const firstImage = imagesArray[0]?.url ?? null;
            const secondImage = imagesArray[1]?.url ?? null;

            const image1 = toAbsUrl(firstImage);
            const image2 = toAbsUrl(secondImage);

            const displayName = attrs.productName ?? "Producto sin nombre";
            const subCategoryLabel =
            typeof attrs.sub_category === "string"
              ? attrs.sub_category
              : attrs.sub_category?.categoryName ?? "";

          const secondaryName =
            attrs.productName2 ??
            attrs.variant ??
            attrs.subCategory ??
            subCategoryLabel ??
            "";

            const productSlug = attrs.slug ?? "";

            const basePrice = Number(attrs.price ?? 0);

            const promos = normalizePromotions(attrs.promotions);
            const appliedPromo = pickBestPromo(basePrice, promos);

            const finalPrice = appliedPromo
              ? applyPromo(basePrice, appliedPromo)
              : basePrice;

            const hasDiscount =
              appliedPromo !== null && finalPrice < basePrice;

            return (
              <CarouselItem
                key={raw.id ?? productSlug}
                className="basis-[82%] px-3 sm:basis-1/2 md:px-4 lg:basis-1/4"
              >
                <Card
                  className="group relative flex w-full flex-col justify-between rounded-none border-none bg-white pb-6 shadow-none sm:overflow-hidden sm:py-4"
                >
                  {hasDiscount && (
                    <div
                      className="absolute left-3 top-3 z-10 rounded-full bg-green-500 px-3 py-1 text-[11px] font-black tracking-wide text-white"
                    >
                      OFERTA
                    </div>
                  )}

                  <CardContent className="flex flex-col px-0 pb-0 pt-0 sm:px-0">
                    <div
                      className="relative mb-3 mt-0 flex w-full cursor-pointer items-center justify-center overflow-hidden bg-white pb-1 pt-1 sm:mb-4"
                      onClick={() =>
                        productSlug &&
                        navigateWithTransition(`/product/${productSlug}`)
                      }
                    >
                      <div className="absolute top-3 right-3 z-20">
                        <LovedButton
                          product={{
                            id: raw.id ?? 0,
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
                            sizes="(max-width: 480px) 82vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
                            unoptimized
                            className="object-contain opacity-100 transition-all duration-300 ease-out group-hover:opacity-0"
                          />
                        )}

                        {image2 && (
                          <Image
                            src={image2}
                            alt={displayName}
                            fill
                            sizes="(max-width: 480px) 82vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
                            unoptimized
                            className="object-contain opacity-0 transition-all duration-500 ease-out group-hover:opacity-100"
                          />
                        )}

                        {!image1 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">
                              Sin imagen
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <h3
                      className={`${khInterferenceRegularFont.className} line-clamp-1 text-left text-[15px] uppercase leading-tight tracking-wide text-black sm:text-xl sm:tracking-tight`}
                    >
                      {displayName}
                    </h3>

                    <div className="flex justify-start">
                      <div className="flex items-center gap-2 text-left">
                        <p
                          className={`${khInterferenceLightFont.className} line-clamp-1 text-left text-[14px] tracking-wide text-black sm:text-lg sm:tracking-tight`}
                        >
                          {secondaryName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-start text-left">
                      {hasDiscount ? (
                        <div className="text-left leading-tight">
                          <p
                            className={`${khInterferenceLightFont.className} text-[12px] text-black/40 line-through sm:text-[13px]`}
                          >
                            {formatPrice(basePrice)}
                          </p>
                          <p
                            className={`${khInterferenceLightFont.className} whitespace-nowrap text-[13px] text-red-500 tabular-nums sm:text-[18px]`}
                          >
                            {formatPrice(finalPrice)}
                          </p>
                        </div>
                      ) : (
                        <p
                          className={`${khInterferenceLightFont.className} whitespace-nowrap text-left text-[13px] sm:text-[18px]`}
                        >
                          {formatPrice(basePrice)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
};

export default Recommmended;

