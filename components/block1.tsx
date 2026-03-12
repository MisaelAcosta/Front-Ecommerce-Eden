"use client";

import { useGetFeaturedBlock1 } from "@/api/useGetFeaturedBlock1";
import SkeletonSchema from "./skeletonSchema";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Autoplay from "embla-carousel-autoplay";

type MediaItem = {
  url?: string | null;
  alternativeText?: string | null;
};

type RelatedEntity = {
  slug?: string | null;
};

type Block1Item = {
  id?: number | string;
  documentId?: string;
  tituloBlock1?: string | null;
  description?: string | null;
  slug?: string | null;
  category?: RelatedEntity | null;
  product?: RelatedEntity | null;
  imageBlock1?: MediaItem | MediaItem[] | null;
};

const Block1 = () => {
  const { result, loading, error } = useGetFeaturedBlock1();
  const router = useRouter();

  const toAbsUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${base}${path}`;
  };

  const getMediaUrl = (item: Block1Item, key: keyof Block1Item): string | null => {
    const media = item[key];

    if (!media) return null;

    if (Array.isArray(media)) {
      const firstMedia = media[0];
      return typeof firstMedia?.url === "string" ? firstMedia.url : null;
    }

    if (typeof media === "object" && "url" in media) {
      return typeof media.url === "string" ? media.url : null;
    }

    return null;
  };

  const getMediaAlt = (item: Block1Item, key: keyof Block1Item): string | null => {
    const media = item[key];

    if (!media) return null;

    if (Array.isArray(media)) {
      const firstMedia = media[0];
      return firstMedia?.alternativeText ?? null;
    }

    if (typeof media === "object" && "alternativeText" in media) {
      return media.alternativeText ?? null;
    }

    return null;
  };

 if (loading) {
  return (
    <div className="w-full h-[500px] flex items-center justify-center">
      <p className="text-gray-500">Cargando...</p>
    </div>
  );
}

  if (error) return <p className="text-red-500">{String(error)}</p>;
  if (!Array.isArray(result) || result.length === 0) return null;

  return (
    <section className="relative">
      <Carousel
        className="w-full overflow-hidden"
        plugins={[
          Autoplay({
            delay: 4500,
          }),
        ]}
      >
        <CarouselContent>
          {(result as Block1Item[]).map((item: Block1Item) => {
            console.log("🧱 Block1 item:", item);

            const id = item.id ?? item.documentId;
            const titulo = item.tituloBlock1 ?? "Destacado";
            const description = item.description ?? "";
            const blockSlug = item.slug ?? "";

            const categorySlug = item.category?.slug ?? null;
            const productSlug = item.product?.slug ?? null;

            const img = getMediaUrl(item, "imageBlock1");
            const imgUrl = toAbsUrl(img);
            const altTxt = getMediaAlt(item, "imageBlock1") || titulo;

            const handleClick = () => {
              if (productSlug) {
                router.push(`/product/${productSlug}`);
              } else if (categorySlug) {
                router.push(`/category/${categorySlug}`);
              } else if (blockSlug) {
                router.push(`/${blockSlug}`);
              }
            };

            const hasLink = Boolean(productSlug || categorySlug || blockSlug);

            return (
              <CarouselItem key={String(id)}>
                <div
                  className={`relative w-full h-screen sm:w-full overflow-hidden ${
                    hasLink ? "cursor-pointer" : ""
                  }`}
                  onClick={hasLink ? handleClick : undefined}
                >
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={altTxt}
                      fill
                      className="object-cover object-center"
                      unoptimized
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-300" />
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10" />

                  <div className="absolute left-5 right-4 md:px-15 bottom-20 md:bottom-20">
                    <h2 className="text-3xl md:text-5xl leading-none font-black text-white">
                      {titulo.toUpperCase()}
                    </h2>

                    {description && (
                      <p className="mt-2 text-white/90 md:text-lg leading-none lg:text-xl max-w-2xl">
                        {description}
                      </p>
                    )}

                    {hasLink && (
                      <button
                        className="mt-4 md:mt-4 px-1 md:px-1 cursor-pointer font-normal text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClick();
                        }}
                      >
                        Ver más
                      </button>
                    )}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="lg:hidden md:left-6" />
        <CarouselNext className="hidden md:right-9" />
      </Carousel>
    </section>
  );
};

export default Block1;




                  