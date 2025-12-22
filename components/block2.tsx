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

const Block2 = () => {
  const { result, loading, error } = useGetFeaturedBlock2();
  const router = useRouter();

  // URL absoluta segura (http(s) + path correcto)
  const toAbsUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${base}${path}`;
  };

  // Strapi v5: imageBlock2 es multiple media => array [{ id, url, alternativeText }]
  const getMediaUrl = (item: any, key: string): string | null => {
    const media = item?.[key];
    if (!media) return null;

    if (Array.isArray(media)) {
      const first = media[0];
      if (first && typeof first.url === "string") return first.url;
    }

    if (typeof media?.url === "string") return media.url;

    return null;
  };

  const getMediaAlt = (item: any, key: string): string | null => {
    const media = item?.[key];
    if (!media) return null;

    if (Array.isArray(media)) {
      const first = media[0];
      if (first && typeof first.alternativeText === "string") {
        return first.alternativeText;
      }
    }

    if (typeof media?.alternativeText === "string") return media.alternativeText;

    return null;
  };

  if (loading) return <SkeletonSchema grid={1} />;
  if (error)
    return <p className="text-red-500 text-sm">Error: {String(error)}</p>;
  if (!Array.isArray(result) || result.length === 0) return null;

  return (
    <section className="relative w-full">
      <Carousel>
        <CarouselContent>
          {(result as any[]).map((item) => {
            // Campos directos en Strapi v5
            const id = item?.id ?? item?.documentId ?? crypto.randomUUID();
            const titulo = item?.tituloBlock2 ?? "";
            const description = item?.description ?? "";
            const blockSlug = item?.slug ?? "";

            // Relaciones sin .data ni attributes
            const categorySlug = item?.category?.slug ?? null;
            const productSlug = item?.product?.slug ?? null;

            // Imagen
            const urlRel = getMediaUrl(item, "imageBlock2");
            const imgUrl = toAbsUrl(urlRel);
            const altTxt = getMediaAlt(item, "imageBlock2") || titulo || "Banner";

            // Lógica de navegación
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
              <CarouselItem key={id}>
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
                    mx-auto max-w-7xl px-4 sm:px-6 lg:px-8
                    h-[280px]
                    sm:h-[220px]
                    md:h-[300px]
                    lg:h-[460px]
                    overflow-hidden
                    
                    cursor-pointer

                  "
                >
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={altTxt}
                      fill
                      className="
                        object-cover
                        transition-transform
                        duration-500
                        ease-out
                        group-hover:scale-[1.03]
                      "
                      // quita esto cuando agregues el dominio del backend en next.config.js
                      unoptimized
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-neutral-200 to-neutral-700" />
                  )}

                  {/* Overlay degradado + texto + CTA */}
                  <div
                    className="
                      absolute inset-0
                      flex items-end
                      bg-gradient-to-t
                      from-black/60
                      via-black/20
                      to-transparent
                      p-4
                      sm:p-6
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
                          className="mt-3 text-sm font-medium text-white underline underline-offset-4"
                        >
                          
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="hidden " />
        <CarouselNext className="hidden " />
      </Carousel>
    </section>
  );
};

export default Block2;



