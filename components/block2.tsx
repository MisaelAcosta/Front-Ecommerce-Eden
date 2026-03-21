"use client";

import SkeletonSchema from "./skeletonSchema";
import { useGetFeaturedBlock2 } from "@/api/useGetFeaturedBlock2";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";

type MediaItem = {
  url?: string | null;
  alternativeText?: string | null;
};

type RelatedEntity = {
  slug?: string | null;
};

type Block2Item = {
  id?: number | string;
  documentId?: string;
  tituloBlock2?: string | null;
  description?: string | null;
  slug?: string | null;
  category?: RelatedEntity | null;
  product?: RelatedEntity | null;
  imageBlock2?: MediaItem | MediaItem[] | null;
  imageMobile?: MediaItem | MediaItem[] | null;
};

const Block2 = () => {
  const { result, loading, error } = useGetFeaturedBlock2();
  const router = useRouter();

  const toAbsUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${base}${path}`;
  };

  const getMediaUrl = (item: Block2Item, key: keyof Block2Item): string | null => {
    const media = item[key];
    if (!media) return null;

    if (Array.isArray(media)) {
      const first = media[0];
      return typeof first?.url === "string" ? first.url : null;
    }

    if (typeof media === "object" && "url" in media) {
      return typeof media.url === "string" ? media.url : null;
    }

    return null;
  };

  const getMediaAlt = (item: Block2Item, key: keyof Block2Item): string | null => {
    const media = item[key];
    if (!media) return null;

    if (Array.isArray(media)) {
      const first = media[0];
      return typeof first?.alternativeText === "string"
        ? first.alternativeText
        : null;
    }

    if (typeof media === "object" && "alternativeText" in media) {
      return typeof media.alternativeText === "string"
        ? media.alternativeText
        : null;
    }

    return null;
  };

  if (loading) return <SkeletonSchema grid={1} />;
  if (error) return <p className="text-red-500">{String(error)}</p>;

  const items = (result ?? []) as Block2Item[];

  if (items.length === 0) return null;

  return (
    <section className="relative w-full">
      <Carousel>
        <CarouselContent>
          {items.map((item: Block2Item) => {
            const id = item.id ?? item.documentId ?? crypto.randomUUID();
            const titulo = item.tituloBlock2 ?? "";
            const description = item.description ?? "";
            const blockSlug = item.slug ?? "";

            const categorySlug = item.category?.slug ?? null;
            const productSlug = item.product?.slug ?? null;

            const desktopRel = getMediaUrl(item, "imageBlock2");
            const desktopUrl = toAbsUrl(desktopRel);
            const desktopAlt =
              getMediaAlt(item, "imageBlock2") || titulo || "Banner";

            const mobileRel = getMediaUrl(item, "imageMobile");
            const mobileUrl = toAbsUrl(mobileRel);
            const mobileAlt =
              getMediaAlt(item, "imageMobile") || titulo || "Banner";

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
            if (e.key === "Enter" || e.key === " ") handleClick();
          }
        : undefined
    }
    className="
      group
      relative
      mx-auto w-full max-w-7xl
      px-0
      sm:px-6
      lg:px-8
      cursor-pointer
      shadow-none
    "
  >
    <div
      className="
        group
        relative
        mx-auto w-full max-w-7xl
        px-0 sm:px-6 lg:px-8
        min-h-[75svh]
        max-h-[88svh]
        sm:h-55
        md:h-75
        lg:h-150
        overflow-hidden
        cursor-pointer
        bg-white
        
        shadow-none
      "
    >
      {finalMobileUrl || finalDesktopUrl ? (
        <>
          {finalMobileUrl && (
            <div className="absolute inset-0 block sm:hidden">
              <Image
                src={finalMobileUrl}
                alt={finalMobileAlt}
                fill
                className="
                  object-cover
                  object-top
                "
                sizes="100vw"
                unoptimized
                priority
              />
            </div>
          )}

          {finalDesktopUrl && (
            <div className="absolute inset-0 hidden sm:block">
              <Image
                src={finalDesktopUrl}
                alt={finalDesktopAlt}
                fill
                className="
                  object-center sm:object-cover
                  transition-transform duration-500 ease-out
                  group-hover:scale-[1]
                "
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

      <div
        className="
          pointer-events-none

          absolute inset-0
          flex items-end
          bg-linear-to-t 
          p-4 sm:p-6
        "
      >
        <div className="max-w-xl">
          {titulo && (
            <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
              {titulo}
            </h3>
          )}

          {description && (
            <p className="mt-1 sm:mt-2 text-white/90 text-sm sm:text-base line-clamp-2">
              {description}
            </p>
          )}

          {hasLink && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="pointer-events-auto mt-3 text-sm font-medium text-white underline underline-offset-4"
            >
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
</CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="hidden" />
        <CarouselNext className="hidden" />
      </Carousel>
    </section>
  );
};

export default Block2;



