"use client";

import { useGetTempProducts } from "@/api/useGetTempProducts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import SkeletonSchema from "./skeletonSchema";
import type { ResponseType } from "@/types/response";
import { Card, CardContent } from "./ui/card";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/formatPrice";
import type { PromotionType } from "@/types/promotion";
import { LovedButton } from "./loved-button";
import { toAbsUrl } from "@/lib/media";
import Image from "next/image";
import type { ProductType } from "@/types/product";

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
  subCategory?: string | null;
  sub_category?: string | null;
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

  const promoValue = promo as PromotionLike;
  const val = Number(promoValue.value || 0);
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

/* -------------------- normalizar promos (strapi) -------------------- */
function normalizePromotions(
  input:
    | PromotionType[]
    | StrapiRelationArray<PromotionStrapiItem>
    | StrapiRelationSingle<PromotionStrapiItem>
    | null
    | undefined
): PromotionType[] {
  if (!input) return [];
  if (Array.isArray(input)) return input as PromotionType[];

  if ("data" in input && Array.isArray(input.data)) {
    return input.data.map((x: PromotionStrapiItem) => ({
      id: x?.id ?? x?.attributes?.id,
      ...(x?.attributes ?? x),
    })) as PromotionType[];
  }

  if ("data" in input && input.data && typeof input.data === "object") {
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

const TempProducts = () => {
  const { result, loading }: ResponseType = useGetTempProducts("halloween");
  const router = useRouter();

  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-0 py-8 sm:py-14">
      <div>
        <h3 className="text-4xl text-center sm:text-left tracking-tight sm:text-5xl font-black mb-2 sm:mb-4">
          PROMOCIONES.
        </h3>
        <p className="text-black/35 sm:text-left text-center tracking-normal leading-none mb-6 text-base sm:text-base">
          Disfruta de las mejores promociones y ofertas exclusivas en nuestros
          productos seleccionados.
        </p>
      </div>

      <Carousel>
        <CarouselContent className="ml-1 md:-ml-4">
          {loading && <SkeletonSchema grid={3} />}

          {!loading &&
            Array.isArray(result) &&
            result.map((product: ProductType) => {
              const raw = product as ProductWithAttributes;
              const attrs: ProductAttrs = raw.attributes ?? raw;

              const imagesArray = getImagesArray(attrs);

              const firstImage = imagesArray[0]?.url ?? null;
              const secondImage = imagesArray[1]?.url ?? null;

              const image1 = toAbsUrl(firstImage);
              const image2 = toAbsUrl(secondImage);

              const displayName = attrs.productName ?? "Producto sin nombre";
              const secondaryName =
                attrs.productName2 ??
                attrs.variant ??
                attrs.subCategory ??
                attrs.sub_category ??
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
                  key={raw.id}
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
                        "
                        onClick={() =>
                          productSlug && router.push(`/product/${productSlug}`)
                        }
                      >
                        <div className="absolute top-3 right-3 z-20">
                          <LovedButton
                            product={{
                              id: raw.id,
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
                          pb-0
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

export default TempProducts;
