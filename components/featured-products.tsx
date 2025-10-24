"use client";

import { useGetFeaturedProducts } from "@/api/useGetFeaturedProducts";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import SkeletonSchema from "./skeletonSchema";
import type { ResponseType } from "@/types/response";
import type { ProductType } from "@/types/product";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { CirclePlus, } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// helper para convertir category a string
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

const FeaturedProducts = () => {
  const { result, loading }: ResponseType = useGetFeaturedProducts();
  const router = useRouter();

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
              const { id, productName, slug, images, price } = product as any;

              const category = toText((product as any).category ?? (product as any).categoryName);
              const productName2 = toText((product as any).productName2 ?? (product as any).variant ?? (product as any).subCategory);
              const imageUrl =
                images?.[0]?.url &&
                `${process.env.NEXT_PUBLIC_BACKEND_URL}${images[0].url}`;

              return (
                <CarouselItem
                  key={id}
                  className="basis-[85%] sm:basis-1/2
                   lg:basis-1/3 px-4 md:px-4
                    "
                >
                  <Card className="group relative rounded-2xl
                  border pt-1 border-[#515151]
                  shadow-none hover:shadow-sm
                  transition-shadow">
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
                            className="max-h-full max-w-full object-contain
                            transition-all duration-300 ease-out
                            transform hover:scale-113
                            "
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
                          className="font-regular bg-[#191919] rounded-lg cursor-pointer
                          transition-all duration-300 ease-out
                            transform hover:scale-103 "
                        >
                          Agregar <CirclePlus className="ml-1 h-7 w-7 " />
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

export default FeaturedProducts;








/*"use client"

import { useGetFeaturedProducts } from "@/api/useGetFeaturedProducts";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import SkeletonSchema from "./skeletonSchema";
import { ResponseType } from "@/types/response";
import { ProductType } from "@/types/product";
import { Card, CardContent } from "./ui/card";




const FeaturedProducts = () => {
    const {result, loading}: ResponseType = useGetFeaturedProducts()
    console.log(result);

    return (
        <div className="w max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
            <h3 className="px-6 text-3xl sm:pb-8">Productos destacados</h3>
            <Carousel>
                <CarouselContent className="ml-2 md:-ml-4">
                    {loading && (
                        <SkeletonSchema grid={3} />
                    )}
                    
                    {result != null &&(
                        result.map((Product: ProductType) =>{
                            const { id, attributes } = Product;
                             if (!attributes) return null; // 🔒 Evita romper si no existe
                            const {slug, productName, images} = attributes;


                            return (
                                <CarouselItem key={id} className="md:basis-1/2 lg:basis-1/3 group">
                                    <div className="p-1">
                                        <Card className ="py-4 border border-gray-200 shadow-none">
                                            <CardContent className="realtive flex items-center justify-center px-6 py-2">
                                                <img 
                                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${images.data[0].attributes.url}`} 
                                                alt="Image featured"></img>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            )
                        })
                    )}

                </CarouselContent>
            </Carousel>
        </div>
    );
};

export default FeaturedProducts; */