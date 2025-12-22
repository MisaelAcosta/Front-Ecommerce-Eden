
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
import { Button } from "./ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/formatPrice";

/** Helper URL absoluta (mismo criterio que ProductCard) */
const toAbsUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;

  const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
  const clean = url.replace(/^\/+/, "");
  return `${base}/${clean}`;
};

const TempProducts = () => {
  // OJO: cambia 'halloween' por el slug real que quieras usar
  const { result, loading }: ResponseType = useGetTempProducts("halloween");
  const router = useRouter();

  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-0 py-8 sm:py-14">
      <div>
        <h3 className="text-4xl text-center sm:text-left tracking-tight sm:text-5xl  font-black mb-2 sm:mb-4">
        PROMOCIONES.
      </h3>
      <p className="text-black/35 sm:text-left text-center tracking-normal leading-none mb-6 text-base sm:text-base ">
        Disfruta de las mejores promociones y ofertas exclusivas en nuestros productos seleccionados.
      </p>
      </div>

      <Carousel>
        <CarouselContent className="ml-1 md:-ml-4">
          {loading && <SkeletonSchema grid={3} />}

          {!loading &&
            Array.isArray(result) &&
            result.map((product: any) => {
              const raw = product;
              const attrs = raw.attributes ?? raw;

              const id = raw.id ?? attrs.id;

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

              const isActive = attrs?.active ?? true;
              const productSlug = attrs?.slug ?? "";

              return (
                <CarouselItem
                  key={id}
                  className="basis-[85%] sm:basis-1/2 lg:basis-1/3 px-4 md:px-4"
                >
                  <Card
                    className="
                      group relative 
                      shadow-none
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
                    <CardContent className="flex flex-col justify-around px-3 md:px-3 pt-0 pb-0">
                      {/* IMAGEN (estilo ProductCard, hover CSS para segunda imagen) */}
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
                        {/* Imagen principal */}
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
                          font-black  uppercase pt-0
                          mb-2
                        "
                      >
                        {displayName}
                      </h3>

                       {/* SEPARATOR 1 */}
                      <div className="h-px w-full bg-[#c0c0c0]" />

                      {/* SUB*/}
                  <div className="flex justify-center py-1 gap-2">
                    <div className="flex items-center gap-2 text-center">
                      <p className="text-lg font-semibold text-black">
                        {secondaryName}
                      </p>
                    </div>
                  </div>

                      {/* SEPARATOR 2 */}
                      <div className="h-px w-full bg-[#c0c0c0] " />

                      {/* PRECIO + CTA */}
                      <div className="mt-3 flex items-center justify-between gap-2">
                        {/* Badge Disponible / No disponible */}
                        <p className="text-[15px] pl-2 sm:inline-flex items-center justify-center font-semibold">
                        {formatPrice(displayPrice)}
                      </p>


                        {/* Botón de compra + corazón visual */}
                        <div className="flex w-full sm:w-auto items-center justify-end sm:justify-end gap-2">
                          <Button
                            onClick={() => router.push(`/product/${productSlug}`)}
                            className="
                              h-8 px-5 sm:h-9 sm:px-4 text-[12px] sm:text-[13px] font-medium
                              rounded-[10px] bg-black text-white hover:bg-black/90 
                              flex items-center gap-2
                              flex-none sm:flex-none cursor-pointer 
                            "
                          >
                            Comprar
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
                              className="hover:fill-black"
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

export default TempProducts;
