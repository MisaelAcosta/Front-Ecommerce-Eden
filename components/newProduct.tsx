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
import { ShoppingCart, Box, Heart, ChevronRight } from "lucide-react";
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
    <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-0 py-8 sm:py-14">
      {/* Título */}
      {/* Título */}
      <div>
        <h3 className="text-4xl text-center sm:text-left tracking-tight sm:text-5xl  font-black mb-2 sm:mb-4">
        NOVEDADES.
      </h3>
      <p className="text-black/35 sm:text-left text-center tracking-normal leading-none  mb-6 text-base sm:text-base ">
        Recien salidos del horno, descubre los últimos modelos añadidos a nuestro catálogo.
      </p>
      </div>

        {/* DERECHA: CONTENEDOR PARA TU CARRUSEL */}
        <div className="lg:col-span-3 md:pl-8">
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
                      className="basis-[85%] sm:basis-1/2 lg:basis-1/3 px-3 md:px-4"
                    >
                      {/* Corazón */}
                      <button
                        className="
                          flex w-full  items-center justify-end sm:justify-end gap-2
                          rounded-[10px] 
                          bg-white text-black/70 transition-colors
                          flex-shrink-0
                        "
                      >
                        <Heart width={20} strokeWidth={1.5} className="hover:fill-black" />
                      </button>
                    
                      <Card
                        className="
                          group relative 
                          w-full
                          h-auto
                          shadow-none
                          pt-4
                          pb-4
                          overflow-hidden 
                          border-none
                          
                          bg-[#ffffff]
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
                                  absolute max-h-[410px] sm:max-h-[410px] max-w-[320px] object-contain
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
                              text-xl
                              leading-none
                              text-center sm:text-2xl 
                              font-black  uppercase
                              pb-2
                            "
                          >
                            {displayName}
                          </h3>

                          

                              {/* SUB*/}
                          <div className="flex justify-center py-1 gap-2">
                            <div className="flex items-center gap-2 text-center">
                              <p className="text-lg font-semibold text-black">
                                {secondaryName}
                              </p>
                            </div>
                          </div>

                          

                         {/* PRECIO */}
                      <div className="mt-1 flex items-center justify-between gap-2">
                        
                        <p className="text-[15px] pl-4 sm:inline-flex items-center justify-center font-semibold">
                        {formatPrice(displayPrice)}
                      </p>

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
                              >
                                <ChevronRight
                                  width={25}
                                  strokeWidth={2}
                                  className=""
                                />
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
        </div>
    </section>
  );
};

export default NewProducts;
