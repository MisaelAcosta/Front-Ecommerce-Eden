"use client";

import { useGetFeaturedProducts } from "@/api/useGetFeaturedProducts";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import SkeletonSchema from "./skeletonSchema";
import { ResponseType } from "@/types/response";
import { ProductType } from "@/types/product";
import { Card, CardContent } from "./ui/card";
import { Expand, ShoppingCart } from "lucide-react";
import IconButton from "./icon-button";
import { useRouter } from "next/navigation";

const FeaturedProducts = () => {
  const { result, loading }: ResponseType = useGetFeaturedProducts();
  const router = useRouter();

  return (
    <div className="w max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
      <h3 className="px-6 text-3xl sm:pb-8">Productos destacados</h3>
      <Carousel>
        <CarouselContent className="ml-2 md:-ml-4">
          {loading && <SkeletonSchema grid={3} />}

          {result != null &&
            result.map((product: ProductType) => {
              const { id, productName, slug, images, price } = product;

              // Manejo seguro de imágenes
              const imageUrl =
                images?.[0]?.url &&
                `${process.env.NEXT_PUBLIC_BACKEND_URL}${images[0].url}`;

              return (
                <CarouselItem
                  key={id}
                  className="md:basis-1/2 lg:basis-1/3 group"
                >
                  <div className="p-1">

                    <Card className="py-4 border border-gray-200 shadow-none">
                      <CardContent className="relative flex flex-col items-center justify-center px-6 py-2">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={productName}
                            className="rounded-md"
                          />
                        ) : (
                          <span className="text-gray-400">No image</span>
                        )}

                        <div className="absolute w-full px-6 background:white transition duration-200 opacity-0 group-hover:opacity-100 botton-5">
                        <div className="flex justify-center gap-x-10 mt-35">
                          <IconButton
                            onClick={() => router.push(`/product/${slug}`)}
                            icon={<Expand size={20} />}
                            className="text-gray-600"
                          />
                          <IconButton
                            onClick={() => console.log("Add item")}
                            icon={<ShoppingCart size={20} />}
                            className="text-gray-600"
                          />
                        </div>
                        </div>
                      </CardContent>

                      <div className="flex justify-between gap-4 px-8">
                        <h3 className="text-lg font-bold">{productName}</h3>
                        <div className="flex item-center justify-between gap-3">
                            <p className="px-2 py-1 text-white bg-black rounded-full dark:bg-white dark:text-black w-fit ">${price}</p>
                        </div>
                      </div>

                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
        </CarouselContent>
        <CarouselPrevious/>
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
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