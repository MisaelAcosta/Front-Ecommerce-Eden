"use client";

import Image from "next/image";
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
import { useRouter } from "next/navigation";
import { LovedButton } from "@/components/loved-button";
import { toAbsUrl } from "@/lib/media";

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
      };
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
  const router = useRouter();

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
      <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-0 py-10">
        <h3 className="text-2xl font-bold mb-4">Te puede interesar</h3>
        <SkeletonSchema grid={3} />
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-0 py-10">
      <h3
        className="
          text-3xl
          sm:text-4xl
          text-center sm:text-left
          font-black
          mb-8
        "
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
                className="basis-[85%] sm:basis-1/2 lg:basis-1/3 px-3 md:px-4"
              >
                <Card
                  className="
                    shadow-none
                    group relative
                    w-full
                    h-auto
                    pt-4
                    pb-4
                    px-5
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

                  <CardContent className="flex flex-col justify-around px-3 md:px-3 pt-0 pb-0">
                    <div
                      className="
                        relative mb-3 sm:mb-4
                        mt-0 w-full
                        bg-white
                        flex items-center justify-center overflow-hidden
                        pt-1 pb-1 cursor-pointer
                        min-h-[260px]
                      "
                      onClick={() =>
                        productSlug && router.push(`/product/${productSlug}`)
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

                      {image1 && (
                        <Image
                          src={image1}
                          alt={displayName}
                          width={500}
                          height={500}
                          className="
                            sm:max-h-[410px] h-auto w-auto object-contain
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
                          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                          className="
                            absolute inset-0 object-cover
                            transition-all duration-300 ease-out
                            opacity-0 group-hover:opacity-100
                          "
                        />
                      )}

                      {!image1 && (
                        <span className="text-sm text-muted-foreground">
                          Sin imagen
                        </span>
                      )}
                    </div>

                    <h3
                      className="
                        text-xl
                        leading-none
                        text-center sm:text-3xl
                        font-black uppercase pt-0
                        pb-2
                      "
                    >
                      {displayName}
                    </h3>

                    <div className="flex justify-center py-1 gap-2">
                      <div className="flex items-center gap-2 text-center">
                        <p className="text-lg font-normal text-black">
                          {secondaryName}
                        </p>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center justify-center gap-2">
                      {hasDiscount ? (
                        <div className="leading-tight text-center">
                          <p className="text-[12px] font-semibold text-black/40 line-through">
                            {formatPrice(basePrice)}
                          </p>
                          <p className="text-[17px] sm:text-[17px] font-extrabold text-red-500 tabular-nums">
                            {formatPrice(finalPrice)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[15px] sm:inline-flex items-center justify-center font-semibold text-center">
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

