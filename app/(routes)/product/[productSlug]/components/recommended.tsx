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
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatPrice";
import { useRouter } from "next/navigation";

// helper igual que FeaturedProducts
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

// Helper URL absoluta (igual que en ProductCard)
const toAbsUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;

  const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
  const clean = url.replace(/^\/+/, "");
  return `${base}/${clean}`;
};

type RecommendedProps = {
  currentProductId: number;
  categorySlug: string;
};

const Recommmended = ({ currentProductId, categorySlug }: RecommendedProps) => {
  const { addItem } = useCart();
  const router = useRouter();

  // Featured
  const {
    result: featuredResult,
    loading: loadingFeatured,
  }: ResponseType = useGetFeaturedProducts(categorySlug);

  // Category → usando tu hook EXACTO
  const {
    result: categoryResult,
    loading: loadingCategory,
  }: ResponseType = getCategoryRecommended(categorySlug);

  const loading = loadingFeatured || loadingCategory;

  let products: ProductType[] = [];

  // 1. productos de la categoría (sin el producto actual)
  if (Array.isArray(categoryResult)) {
    products = categoryResult.filter((p) => p.id !== currentProductId);
  }

  // 2. agregamos los destacados sin duplicar
  if (Array.isArray(featuredResult)) {
    const featuredClean = featuredResult.filter(
      (p) =>
        p.id !== currentProductId &&
        !products.some((existing) => existing.id === p.id)
    );

    products = [...products, ...featuredClean];
  }

  // debug
  console.log("[Recommended] categoryResult:", categoryResult);
  console.log("[Recommended] featuredResult:", featuredResult);
  console.log("[Recommended] final products:", products);

  // 3. max 6 items
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
      <h3 className="
      text-3xl
      sm:text-4xl 
      text-center sm:text-left
      font-black 
      mb-8">TE PUEDE INTERESAR</h3>

      <Carousel>
        <CarouselContent className="ml-1 md:-ml-4">
          {products.map((product: ProductType) => {
            // Soportar tanto product.attributes como objeto plano
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

            const displayPrice =
              attrs?.price !== undefined && attrs?.price !== null
                ? attrs.price
                : "—";

            const isActive = attrs?.active ?? true;
            const productSlug = attrs?.slug ?? "";

            return (
              <CarouselItem
                key={raw.id}
                className="basis-[85%] sm:basis-1/2 lg:basis-1/3 px-4 md:px-4"
              >
                <Card
                  className="
                    group relative 
                    w-full
                    h-auto
                    pt-4
                    pb-4
                    overflow-hidden 
                    rounded-[15px]
                    sm:rounded-[15px] sm:border-[0.5px] border-[#b9b9b9]
                    bg-[#f0f0f0]
                    flex flex-col 
                    justify-between
                  "
                >
                  <CardContent className="flex flex-col justify-around px-3 md:px-3 pt-0 pb-0">
                    {/* IMAGEN (mismo estilo que ProductCard, pero con hover por CSS) */}
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
                      {/* Imagen 1 por defecto */}
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

                      {/* Imagen 2 al hover */}
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
                      {/* Badge Disponible / No disponible */}
                      <span
                        className={`
                          sm:inline-flex items-center hidden justify-center
                          rounded-[10px] h-9 px-4 py-1
                          text-[11px] sm:text-xs font-extrabold uppercase
                          ${
                            isActive
                              ? "bg-[#62DF70] text-white"
                              : "bg-[#E5E5E5] text-[#777777]"
                          }
                        `}
                      >
                        {isActive ? "Disponible" : "No disponible"}
                      </span>

                      {/* Botón Agregar (manteniendo la funcionalidad original) */}
                      <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-2">
                        <Button
                          onClick={() => router.push(`/product/${productSlug}`)}
                          className="
                            h-9 px-4 text-[12px] sm:text-[13px] font-medium
                            rounded-[10px] bg-black text-white hover:bg-black/90 
                            flex items-center gap-2
                            flex-1 sm:flex-none cursor-pointer
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

