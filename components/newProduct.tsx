"use client";

import Link from "next/link";
import { useGetNewProducts } from "@/api/useGetNewProduct";
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
import { ShoppingCart, Box, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/formatPrice";

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

const NewProducts = () => {
  const { result, loading, error }: ResponseType = useGetNewProducts();
  const router = useRouter();

  return (
    <section className="w-full max-w-6xl mx-auto py-6 sm:py-12 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* IZQUIERDA: HERO CARD NEGRA */}
        <div className="lg:col-span-1">
          <div
            className="
              relative 
              h-full min-h-[220px] rounded-2xl bg-black 
              transition-all duration-300 ease-out
              transform hover:scale-103 
              text-white p-6 sm:p-8 flex flex-col justify-between
            "
          >
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-3xl sm:text-4xl font-extrabold leading-[1.05]">
                  Nuevos
                  <br /> Productos
                </h3>
                <Box
                  className="h-23 w-23 sm:pb-8 sm:pt-0 opacity-100"
                  aria-hidden="true"
                />
              </div>

              <p className="text-sm sm:text-base text-zinc-200/90">
                Descubre las últimas creaciones en impresión 3D, recién salidas
                del horno.
              </p>
            </div>

            <div className="pt-6">
              <Link
                href="/products?tab=new"
                className="inline-flex items-center rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-100 transition"
              >
                Ver todos
              </Link>
            </div>
          </div>
        </div>

        {/* DERECHA: CONTENEDOR PARA TU CARRUSEL */}
        <div className="lg:col-span-2 md:pl-8">
          <Carousel>
            <CarouselContent className="ml-1 md:-ml-4 md:pl-2">
              {loading && <SkeletonSchema grid={3} />}

              {Array.isArray(result) &&
                result.map((product: ProductType) => {
                  const raw: any = product;
                  const attrs = raw.attributes ?? raw;

                  const id = raw.id ?? attrs.id;

                  // Campos base (nombre, subnombre, slug, precio)
                  const displayName =
                    attrs?.productName ?? "Producto sin nombre";
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

                  const productSlug = attrs?.slug ?? "";
                  const isActive = attrs?.active ?? true;

                  // Imágenes (v4/v5)
                  const imagesArray =
                    Array.isArray(attrs?.images)
                      ? attrs.images
                      : attrs?.images?.data?.map((i: any) => i.attributes) ||
                        [];

                  const firstImage = imagesArray?.[0]?.url ?? null;
                  const secondImage = imagesArray?.[1]?.url ?? null;

                  const image1 = toAbsUrl(firstImage);
                  const image2 = toAbsUrl(secondImage);

                  return (
                    <CarouselItem
                      key={id}
                      className="basis-[85%] sm:basis-1/2 lg:basis-1/2 px-3 md:px-4"
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
                          {/* IMAGEN (estilo ProductCard con hover a 2da imagen) */}
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
                              productSlug &&
                              router.push(`/product/${productSlug}`)
                            }
                          >
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
                              {typeof displayPrice === "number"
                                ? formatPrice(displayPrice)
                                : displayPrice}
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

                            {/* Botón ir al producto + corazón */}
                            <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-2">
                              <Button
                                onClick={() =>
                                  productSlug &&
                                  router.push(`/product/${productSlug}`)
                                }
                                className="
                                  h-9 px-4 text-[12px] sm:text-[13px] font-medium
                                  rounded-[10px] bg-black text-white hover:bg-black/90 
                                  flex items-center gap-2
                                  flex-1 sm:flex-none cursort-pointer
                                "
                              >
                                <ShoppingCart width={15} strokeWidth={3} />
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
        </div>
      </div>
    </section>
  );
};

export default NewProducts;
