"use client";

import Link from "next/link";
import { useGetNewProducts } from "@/api/useGetNewProduct";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import SkeletonSchema from "./skeletonSchema";
import type { ResponseType } from "@/types/response";
import type { ProductType } from "@/types/product";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { CirclePlus, Box } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/**
 * NewProducts
 * Layout:
 *  - Izquierda (lg): hero card negra con título + copy + CTA "Ver todos".
 *  - Derecha (lg): espacio vacío para que PEGUES tu carrusel y tus peticiones (newProduct === true).
 *
 * En mobile se apilan: primero la hero, luego el carrusel.
 */

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


const NewProducts = () => {
    const { result, loading, error } = useGetNewProducts();
    const router = useRouter();
  return (
    <section className="w-full max-w-6xl mx-auto py-6 sm:py-12 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* IZQUIERDA: HERO CARD NEGRA */}
        <div className="lg:col-span-1">
          <div className="relative h-full min-h-[220px] rounded-2xl bg-black text-white p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-3xl sm:text-4xl font-extrabold leading-[1.05]">
                  Nuevos
                  <br /> Productos
                </h3>
                <Box className="h-8 w-8 opacity-80" aria-hidden="true" />
              </div>

              <p className="text-sm sm:text-base text-zinc-200/90">
                Descubrí las últimas creaciones en impresión 3D, recién salidas del horno.
              </p>
            </div>

            <div className="pt-6">
              <Link
                href="/products?tab=new" // ← Cambiá la ruta si querés
                className="inline-flex items-center rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-100 transition"
              >
                Ver todos
              </Link>
            </div>
          </div>
        </div>

        {/* DERECHA: CONTENEDOR PARA TU CARRUSEL */}
        <div className="lg:col-span-2">
          
<Carousel>
        <CarouselContent className="ml-1 md:-ml-4">
          {loading && <SkeletonSchema grid={3} />}

          {Array.isArray(result) &&
            result.map((product: ProductType) => {
              const { id, productName, slug, images, price } = product as any;

              const category = toText((product as any).category ?? (product as any).categoryName);
              const productName2 = toText((product as any).productName2 ?? (product as any).variant ?? (product as any).subCategory);
              const imageUrl =
                images?.[0]?.url &&
                `${process.env.NEXT_PUBLIC_BACKEND_URL}${images[0].url}`;

              return (
                <CarouselItem
                  key={id}
                  className="basis-[85%] sm:basis-1/2 lg:basis-1/1 px-1 md:px-4"
                >
                  <Card className="group relative rounded-2xl border pt-1 border-gray-200 shadow-none hover:shadow-sm transition-shadow">
                    {/* Header (categoría + icono) */}
                    <div className="flex items-start justify-between px-5 pt-4">
                      <span className="text-sm text-muted-foreground">{category ?? "—"}</span>

                      <button
                        className="h-9 w-9 shrink-0  backdrop-blur hover:bg-white flex items-center justify-center"
                        type="button"
                        aria-label="Detalles"
                      >
                        <Image
                          src="/icons/CirculoPlaneta.svg"
                          alt="icono"
                          width={56}
                          height={56}
                          className="opacity-100"
                        />
                      </button>
                    </div>

                    <CardContent className="px-8 pb-0 pt-none">
                      {/* Imagen */}
                      <div className="rounded-xl bg-muted/10 aspect-square w-full overflow-hidden mb-4 flex items-center justify-center">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={productName}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">Sin imagen</span>
                        )}
                      </div>

                      {/* Nombre + subtítulo */}
                      <div className="mb-2">
                        <h3 className="text-base font-semibold leading-tight">
                          {productName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{productName2 ?? ""}</p>
                      </div>

                      {/* Precio + CTA */}
                      <div className="flex items-center  justify-between">
                        <p className="text-base font-medium">${price}</p>

                        <Button
                          onClick={() => router.push(`/product/${slug}`)}
                          size="sm"
                          className="font-regular bg-[#191919] rounded-lg "
                        >
                          Agregar <CirclePlus className="ml-1 h-7 w-7" />
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

        </div>
      </div>
    </section>
  );
};

export default NewProducts;
