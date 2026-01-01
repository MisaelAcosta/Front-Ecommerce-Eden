"use client";

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
import { Heart, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import type { PromotionType } from "@/types/promotion";
import { useRouter } from "next/navigation";

/** Helper URL absoluta (igual que en ProductCard) */
const toAbsUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;

  const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
  const clean = url.replace(/^\/+/, "");
  return `${base}/${clean}`;
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

  const val = Number((promo as any).value || 0);
  let discount = 0;

  // 0.2 => 20%
  if (val <= 1) discount = basePrice * val;
  // 20 => 20%
  else if (val <= 100) discount = basePrice * (val / 100);
  // 1500 => $1500 off
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

/* -------------------- normalizar promos (strapi) -------------------- */
function normalizePromotions(input: any): PromotionType[] {
  if (!input) return [];
  if (Array.isArray(input)) return input as PromotionType[];

  if (Array.isArray(input?.data)) {
    return input.data.map((x: any) => ({
      id: x?.id ?? x?.attributes?.id,
      ...(x?.attributes ?? x),
    })) as PromotionType[];
  }

  if (input?.data && typeof input.data === "object") {
    const x = input.data;
    return [
      {
        id: x?.id ?? x?.attributes?.id,
        ...(x?.attributes ?? x),
      } as PromotionType,
    ];
  }

  return [];
}

type RecommendedProps = {
  currentProductId: number;
  categorySlug: string;
};

const Recommmended = ({ currentProductId, categorySlug }: RecommendedProps) => {
  const router = useRouter();

  // Featured (según tu hook)
  const {
    result: featuredResult,
    loading: loadingFeatured,
  }: ResponseType = useGetFeaturedProducts(categorySlug);

  // Category (según tu hook exacto)
  const {
    result: categoryResult,
    loading: loadingCategory,
  }: ResponseType = getCategoryRecommended(categorySlug);

  const loading = loadingFeatured || loadingCategory;

  let products: ProductType[] = [];

  // 1) categoría (sin el producto actual)
  if (Array.isArray(categoryResult)) {
    products = categoryResult.filter((p) => p.id !== currentProductId);
  }

  // 2) agregamos destacados sin duplicar
  if (Array.isArray(featuredResult)) {
    const featuredClean = featuredResult.filter(
      (p) =>
        p.id !== currentProductId &&
        !products.some((existing) => existing.id === p.id)
    );
    products = [...products, ...featuredClean];
  }

  // 3) max 6
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
          {products.map((product: ProductType) => {
            const raw: any = product;
            const attrs = raw.attributes ?? raw;

            // -------------------------
            //   IMÁGENES
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
            //   TEXTO
            // -------------------------
            const displayName = attrs?.productName ?? "Producto sin nombre";
            const secondaryName =
              attrs?.productName2 ??
              attrs?.variant ??
              attrs?.subCategory ??
              attrs?.sub_category ??
              "";

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

            const hasDiscount =
              appliedPromo !== null && finalPrice < basePrice;

            return (
              <CarouselItem
                key={raw.id ?? productSlug}
                className="basis-[85%] sm:basis-1/2 lg:basis-1/3 px-4 md:px-4"
              >
                {/* Corazón */}
                <button
                  className="
                    flex w-full items-center justify-end sm:justify-end gap-2
                    rounded-[10px]
                    bg-white text-black/70 transition-colors
                    flex-shrink-0
                  "
                  type="button"
                >
                  <Heart
                    width={20}
                    strokeWidth={1.5}
                    className="hover:fill-black"
                  />
                </button>

                <Card
                  className="
                    group relative
                    w-full
                    h-auto
                    pt-4
                    pb-4
                    overflow-hidden
                    border-none
                    shadow-none
                    bg-[#ffffff]
                    flex flex-col
                    justify-between
                  "
                >
                  {/* Badge OFERTA */}
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
                      onClick={() =>
                        productSlug && router.push(`/product/${productSlug}`)
                      }
                    >
                      {/* Imagen 1 */}
                      {image1 && (
                        <img
                          src={image1}
                          alt={displayName}
                          className="
                            sm:max-h-[310px] w-auto object-contain
                            transition-all duration-300 ease-out
                            opacity-100 group-hover:opacity-0
                          "
                        />
                      )}

                      {/* Imagen 2 */}
                      {image2 && (
                        <img
                          src={image2}
                          alt={displayName}
                          className="
                            absolute max-h-[210px] sm:max-h-[410px] max-w-[320px] object-contain
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

                    {/* NOMBRE */}
                    <h3
                      className="
                        text-lg
                        leading-none
                        text-center sm:text-2xl
                        font-black uppercase
                        mb-1
                      "
                    >
                      {displayName}
                    </h3>

                    {/* SUB */}
                    <div className="flex justify-center py-1 gap-2">
                      <div className="flex items-center gap-2 text-center">
                        <p className="text-lg font-semibold text-black">
                          {secondaryName}
                        </p>
                      </div>
                    </div>

                    {/* PRECIO + DESCUENTO */}
                    <div className="mt-1 flex items-center justify-between gap-2">
                      {hasDiscount ? (
                        <div className="pl-4 leading-tight">
                          <p className="text-[12px] font-semibold text-black/40 line-through">
                            {formatPrice(basePrice)}
                          </p>
                          <p className="text-[17px] sm:text-[17px] font-extrabold text-red-500 tabular-nums">
                            {formatPrice(finalPrice)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[15px] pl-4 sm:inline-flex items-center justify-center font-semibold">
                          {formatPrice(basePrice)}
                        </p>
                      )}

                      <button
                        className="
                          inline-flex h-9 w-9
                          items-center justify-center cursor-pointer
                          rounded-[10px]
                          bg-white text-black/70
                          transition-colors
                          flex-shrink-0
                        "
                        type="button"
                        onClick={() =>
                          productSlug && router.push(`/product/${productSlug}`)
                        }
                      >
                        <ChevronRight width={25} strokeWidth={2} />
                      </button>
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

