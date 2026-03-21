"use client";

import { useGetFeaturedBlock1 } from "@/api/useGetFeaturedBlock1";
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
  imageBlock1Movile?: MediaItem | MediaItem[] | null;
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
      return typeof firstMedia?.alternativeText === "string"
        ? firstMedia.alternativeText
        : null;
    }

    if (typeof media === "object" && "alternativeText" in media) {
      return typeof media.alternativeText === "string"
        ? media.alternativeText
        : null;
    }

    return null;
  };

  if (loading) {
    return (
      <div className="w-full h-227.5 flex items-center 
      shadow-none bg-white justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (error) return <p className="text-red-500">{String(error)}</p>;

  const items = (result ?? []) as Block1Item[];

  if (items.length === 0) return null;

  return (
    <section className="relative shadow-none">
      <Carousel
        className="w-full overflow-hidden"
        plugins={[
          Autoplay({
            delay: 4500,
          }),
        ]}
      >
        <CarouselContent>
          {items.map((item: Block1Item) => {
            const id = item.id ?? item.documentId ?? crypto.randomUUID();
            const titulo = item.tituloBlock1 ?? "";
            const description = item.description ?? "";
            const blockSlug = item.slug ?? "";

            const categorySlug = item.category?.slug ?? null;
            const productSlug = item.product?.slug ?? null;

            const desktopRel = getMediaUrl(item, "imageBlock1");
            const desktopUrl = toAbsUrl(desktopRel);
            const desktopAlt =
              getMediaAlt(item, "imageBlock1") || titulo || "Banner principal";

            const mobileRel = getMediaUrl(item, "imageBlock1Movile");
            const mobileUrl = toAbsUrl(mobileRel);
            const mobileAlt =
              getMediaAlt(item, "imageBlock1Movile") || titulo || "Banner principal";

            const finalMobileUrl = mobileUrl || desktopUrl;
            const finalMobileAlt = mobileUrl ? mobileAlt : desktopAlt;

            const finalDesktopUrl = desktopUrl || mobileUrl;
            const finalDesktopAlt = desktopUrl ? desktopAlt : mobileAlt;

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
                  role={hasLink ? "link" : "group"}
                  tabIndex={hasLink ? 0 : -1}
                  aria-label={titulo || "ver más"}
                  onClick={hasLink ? handleClick : undefined}
                  onKeyDown={
                    hasLink
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleClick();
                          }
                        }
                      : undefined
                  }
                  className={`relative w-full h-screen shadow overflow-hidden ${
                    hasLink ? "cursor-pointer" : ""
                  }`}
                >
                  {finalMobileUrl || finalDesktopUrl ? (
                    <>
                      {finalMobileUrl && (
                        <div className="
                        absolute inset-0 min-h-[103svh]
                        max-h-[113svh] block sm:hidden">
                          <Image
                            src={finalMobileUrl}
                            alt={finalMobileAlt}
                            fill
                            className="object-cover object-center"
                            sizes="100vw"
                            unoptimized
                            priority
                          />
                        </div>
                      )}



                      {finalDesktopUrl && (
                        <div className="absolute inset-0 
                        min-h-[101svh]
                        max-h-[113svh]
                        hidden sm:block">
                          <Image
                            src={finalDesktopUrl}
                            alt={finalDesktopAlt}
                            fill
                            className="object-cover object-center"
                            sizes="100vw"
                            unoptimized
                            priority
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full " />
                  )}

                  <div className="absolute inset-0 " />

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
                        type="button"
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




                  