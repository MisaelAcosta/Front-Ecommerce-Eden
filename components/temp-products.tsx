"use client";

import { useGetTempProducts } from "@/api/useGetTempProducts";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import SkeletonSchema from "./skeletonSchema";
import type { ResponseType } from "@/types/response";
// import type { ProductType } from "@/types/product"; // si lo usas, dejalo; acá trato como any para soportar v4/v5
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/** Helpers para soportar v4 (con attributes) y v5 (flat) */
function getName(p: any): string {
  return p?.productName ?? p?.attributes?.productName ?? "Sin nombre";
}
function getVariant(p: any): string | undefined {
  return p?.productName2 ?? p?.attributes?.productName2 ?? undefined;
}
function getSlug(p: any): string | undefined {
  return p?.slug ?? p?.attributes?.slug ?? undefined;
}
function getPrice(p: any): number | string {
  const v = p?.price ?? p?.attributes?.price;
  return v ?? "—";
}
function getCategoryName(p: any): string | undefined {
  // v5
  if (p?.category?.categoryName) return p.category.categoryName;
  // v4
  return p?.attributes?.category?.data?.attributes?.categoryName ?? undefined;
}
function getFirstImageUrl(p: any): string | undefined {
  // v5: array directa
  const v5Url = p?.images?.[0]?.url;
  if (v5Url) return `${process.env.NEXT_PUBLIC_BACKEND_URL}${v5Url}`;
  // v4: images.data[0].attributes.url
  const v4Url = p?.attributes?.images?.data?.[0]?.attributes?.url;
  if (v4Url) return `${process.env.NEXT_PUBLIC_BACKEND_URL}${v4Url}`;
  return undefined;
}

const TempProducts = () => {
  // OJO: cambia 'destacados' por el slug real (ej: 'halloween') o pásalo por props/params
  const { result, loading }: ResponseType = useGetTempProducts("halloween");
  const router = useRouter();

  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-0 py-8 sm:py-14">
      <h3 className="text-4xl text-center sm:text-6xl font-black mb-6 sm:mb-8">
        PRODUCTOS EN TEMPORADA
      </h3>

      <Carousel>
        <CarouselContent className="ml-1 md:-ml-4">
          {loading && <SkeletonSchema grid={3} />}

          {!loading && Array.isArray(result) && result.map((product: any) => {
            const id = product?.id ?? product?.attributes?.id;
            const name = getName(product);
            const variant = getVariant(product);
            const slug = getSlug(product);
            const price = getPrice(product);
            const category = getCategoryName(product) ?? "—";
            const imageUrl = getFirstImageUrl(product);

            return (
              <CarouselItem
                key={id}
                className="basis-[85%] sm:basis-1/2 lg:basis-1/3 px-4 md:px-4"
              >
                <Card className="group relative rounded-2xl border pt-1 border-[#515151] shadow-none hover:shadow-sm transition-shadow">
                  {/* Header (categoría + icono) */}
                  <div className="flex items-start justify-between px-5 pt-4">
                    <span className="text-sm text-muted-foreground">{category}</span>

                    <button
                      className="h-9 w-9 shrink-0 backdrop-blur hover:bg-white/10 flex items-center justify-center rounded-full"
                      type="button"
                      aria-label="Detalles"
                    >
                      <Image
                        src="/icons/CirculoPlaneta.svg"
                        alt="icono"
                        width={28}
                        height={28}
                        className="opacity-100"
                      />
                    </button>
                  </div>

                  <CardContent className="px-8 pb-0 pt-0">
                    {/* Imagen */}
                    <div className="rounded-xl bg-muted/10 aspect-square w-full overflow-hidden mb-4 flex items-center justify-center">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={name}
                          className="max-h-full max-w-full object-contain transition-all duration-300 ease-out hover:scale-105"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">Sin imagen</span>
                      )}
                    </div>

                    {/* Nombre + subtítulo */}
                    <div className="mb-2">
                      <h3 className="text-base font-semibold leading-tight">{name}</h3>
                      {variant && <p className="text-sm text-muted-foreground">{variant}</p>}
                    </div>

                    {/* Precio + CTA */}
                    <div className="flex items-center justify-between">
                      <p className="text-base font-medium">${price}</p>

                      <Button
                        onClick={() => slug && router.push(`/product/${slug}`)}
                        size="sm"
                        className="font-normal bg-[#191919] rounded-lg cursor-pointer transition-all duration-300 ease-out hover:scale-105"
                      >
                        Agregar <CirclePlus className="ml-1 h-5 w-5" />
                      </Button>
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
