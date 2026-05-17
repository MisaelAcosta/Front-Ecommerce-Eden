"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetProductBySlug } from "@/api/getProductBySlug";
import { useGetVariant } from "@/api/getVariant";
import InfoProduct from "./components/info-product";
import { ArrowLeft } from "lucide-react";
import Recommmended from "./components/recommended";
import type { ProductType } from "@/types/product";
import SmoothScroll from "@/components/animation_page/smooth-scroll";
import ScrollReveal from "@/components/animation_page/scroll-reveal";

type ProductPageItem = ProductType & {
  id: number;
  category?: {
    slug?: string;
  } | null;
};

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const { productSlug } = params as { productSlug: string };

  const { result: productResult, loading: loadingProduct } =
    useGetProductBySlug(productSlug);

  const { result: variantsResult } = useGetVariant(productSlug);

  const products = (productResult ?? []) as ProductPageItem[];

  if (loadingProduct || products.length === 0) {
    return <div>Cargando...</div>;
  }

  const product = products[0];

  return (
    <SmoothScroll>
      <div className="mx-auto max-w-7xl py-4 sm:py-22 sm:px-14 md:pr-0">
        <ScrollReveal delay={0.02}>
          <button
            onClick={() => router.back()}
            className="
              mb-2 flex items-center gap-2
              text-sm font-medium text-muted-foreground
              cursor-pointer
              transition hover:text-foreground
              pl-4 md:pl-0
              md:-ml-15 lg:-ml-8 xl:-ml-16
            "
          >
            <ArrowLeft size={23} strokeWidth={2} />
          </button>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <InfoProduct product={product} variantsData={variantsResult ?? []} />
        </ScrollReveal>

        <ScrollReveal delay={0.12} className="pt-30">
          <Recommmended
            currentProductId={product.id}
            categorySlug={product.category?.slug ?? ""}
          />
        </ScrollReveal>
      </div>
    </SmoothScroll>
  );
}




























/*

"use client"
import { useGetProductBySlug } from "@/api/getProductBySlug";
import { ResponseType } from "@/types/response";
import { useParams } from "next/navigation"
import SkeletonProdutc from "./components/skeleton-product";
import CarouselProduct from "./components/carousel-product";
import InfoProduct from "./components/info-product";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";


export default function page() {
    const router = useRouter();
    const params = useParams()
    const { productSlug } = params;

    const {result} : ResponseType = useGetProductBySlug(productSlug as string)
    
    console.log(result)

    const product = result && Array.isArray(result) ? result[0] : result;

    if(result == null) {
       return <SkeletonProdutc/>
    }


    return (

        <div className="mx-auto max-w-7xl py-4 sm:py-32 sm:px-24 ">
             {/* Flecha para volver */
             
/*            <button
                onClick={() => router.back()}
                className="
                mb-2 flex items-center gap-2
                text-sm font-medium text-muted-foreground 
                cursor-pointer
                transition hover:text-foreground
                pl-4 md:pl-0
                md:-ml-15 lg:-ml-8 xl:-ml-16"
            >
                <ArrowLeft size={23} strokeWidth={2} />
            </button>
             
              
            <div className="grid items-start
                sm:grid-cols-2
                lg:grid-cols-[1.15fr_1fr]   /* imagen un poco más ancha que la info */
/*
                gap-6 sm:gap-10 lg:gap-16 xl:gap-24">

                <div className="sm:pr-4 lg:pr-8">
                    <CarouselProduct images={product.images}></CarouselProduct>
                </div>

                <div className="sm:px-12">
                    <InfoProduct product={product} variantsData={variantData}/>
                </div>

            </div>
        </div>
    )
}*/

