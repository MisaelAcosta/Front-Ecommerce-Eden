"use client";

import { useGetFeaturedProducts } from "@/api/useGetFeaturedProducts";
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
import { Heart, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/formatPrice";
import { LovedButton } from "./loved-button";
import { toAbsUrl } from "@/lib/media";


// helper para convertir category a string (lo dejamos por si lo quieres usar luego)
function toText(v: any): string | undefined {
  if (v == null) return undefined;
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (typeof v === "object") {
    if (v.name) return String(v.name);
    if (v.categoryName) return String(v.categoryName);
    if (v.title) return String(v.title);
    if (v.data?.attributes?.name) return String(v.data.attributes.name);
  }
  return undefined;
}

// Helper URL absoluta

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
  if (val <= 1) {
    discount = basePrice * val;
  }
  // 20 => 20%
  else if (val <= 100) {
    discount = basePrice * (val / 100);
  }
  // 1500 => $1500 off
  else {
    discount = val;
  }

  const finalPrice = Math.max(0, Math.round(basePrice - discount));
  return finalPrice;
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

/* -------------------- normalizar promos (strapi) -------------------- */
function normalizePromotions(input: any): PromotionType[] {
  if (!input) return [];
  // si ya es array plano
  if (Array.isArray(input)) return input as PromotionType[];

  // strapi: { data: [...] }
  if (Array.isArray(input?.data)) {
    return input.data.map((x: any) => ({
      id: x?.id ?? x?.attributes?.id,
      ...(x?.attributes ?? x),
    })) as PromotionType[];
  }

  // strapi: { data: { ... } }
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

const FeaturedProducts = () => {
  const { result, loading }: ResponseType = useGetFeaturedProducts();
  const router = useRouter();
  

  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-0 py-8 sm:py-14">
      {/* Título */}
      <div>
        <h3 className="text-4xl text-center sm:text-left tracking-tight sm:text-5xl font-black mb-2 sm:mb-4">
          TOP VENTAS.
        </h3>
        <p className="text-black/35 sm:text-left text-center leading-none tracking-normal mb-6 text-base sm:text-base ">
          Los modelos más pedidos y mejor valorados.
        </p>
      </div>

      <Carousel>
        <CarouselContent className="ml-1 md:-ml-4">
          {loading && <SkeletonSchema grid={3} />}

          {Array.isArray(result) &&
            result.map((product: ProductType) => {
              const raw: any = product;
              const attrs = raw.attributes ?? raw;

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
                attrs?.productName2 ??
                attrs?.variant ??
                attrs?.subCategory ??
                attrs?.sub_category ??
                "";

              const productSlug = attrs?.slug ?? "";
              const isActive = attrs?.active ?? true;

              // -------------------------
              //   PRECIO + PROMO (PRODUCT)
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
                          bg-white
                          flex items-center justify-center overflow-hidden
                          pt-1 pb-1 cursor-pointer
                        "
                        onClick={() => productSlug && router.push(`/product/${productSlug}`)}
                      >
                        {/* ❤️ CORAZÓN dentro del recuadro */}
                        <div className="absolute top-3 cursor-pointer right-3 z-20">
                          <LovedButton
                            product={{
                              id: raw.id,
                              title: displayName,
                              secondaryName,
                              price: basePrice,
                              slug: productSlug,
                              imageUrl: image1, // usa la misma que ya calculaste
                            }}
                          />
                        </div>

                        {/* Imagen por defecto */}
                        {image1 && (
                          <img
                            src={image1}
                            alt={displayName}
                            className="
                              sm:max-h-102.5 w-auto object-contain
                              transition-all duration-300 ease-out
                              opacity-100 group-hover:opacity-0
                            "
                          />
                        )}

                        {/* Segunda imagen al hover */}
                        {image2 && (
                          <img
                            src={image2}
                            alt={displayName}
                            className="
                              absolute sm:max-h-full sm:w-full object-cover
                              transition-all duration-300 ease-out
                              opacity-0 group-hover:opacity-100
                            "
                          />
                        )}

                        {!image1 && (
                          <span className="text-sm text-muted-foreground">Sin imagen</span>
                        )}
                      </div>

                      {/* NOMBRE */}
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

                      {/* SUB */}
                      <div className="flex justify-center py-1 gap-2">
                        <div className="flex items-center gap-2 text-center">
                          <p className="text-lg font-normal text-black">
                            {secondaryName}
                          </p>
                        </div>
                      </div>

                      {/* PRECIO + DESCUENTO */}
                      <div className="mt-1 flex items-center justify-center gap-2">
                        {hasDiscount ? (
                          <div className=" leading-tight text-center">
                            <p className="text-[12px] font-semibold text-black/40 line-through">
                              {formatPrice(basePrice)}
                            </p>
                            <p className=" text-[17px] sm:text-[17px] font-extrabold text-red-500 tabular-nums">
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

export default FeaturedProducts;




