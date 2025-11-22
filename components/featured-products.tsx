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
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {Heart, ShoppingCart} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatPrice";

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

// Helper URL absoluta (igual que en ProductCard)
const toAbsUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;

  const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
  const clean = url.replace(/^\/+/, "");
  return `${base}/${clean}`;
};

const FeaturedProducts = () => {
  const { result, loading }: ResponseType = useGetFeaturedProducts();
  const router = useRouter();
  const { addItem, items } = useCart();
  console.log(items);

  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-0 py-8 sm:py-14">
      {/* Título */}
      <h3 className="text-4xl text-center sm:text-6xl font-black mb-6 sm:mb-8">
        PRODUCTOS DESTACADOS
      </h3>

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
                      {/* IMAGEN (mismo estilo que ProductCard, hover CSS) */}
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
                        {/* Imagen por defecto */}
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

                        {/* Segunda imagen al hover */}
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

                        {/* Botón Agregar (mantiene funcionalidad original) + corazón visual */}
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
                              items-center justify-center cursor-pointer
                              rounded-[10px] border border-[#E3E3E3]
                              bg-white text-black/70 
                              transition-colors
                              flex-shrink-0
                            "
                            type="button"
                          >
                            <Heart
                              width={20}
                              strokeWidth={1.5}
                              className="hover:fill-red-500"
                            />
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

export default FeaturedProducts;



