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

const Block1 = () => {
  const { result, loading, error } = useGetFeaturedBlock1();
  const router = useRouter();

  // Convertir URL relativa -> absoluta
  const toAbsUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${base}${path}`;
  };

  // Manejo de imágenes Strapi v5
  const getMediaUrl = (item: any, key: string): string | null => {
    const media = item?.[key];
    if (!media) return null;

    // Multiple Media = array
    if (Array.isArray(media)) {
      return typeof media[0]?.url === "string" ? media[0].url : null;
    }

    // Single Media = objeto
    if (typeof media?.url === "string") return media.url;

    return null;
  };

  const getMediaAlt = (item: any, key: string) => {
    const media = item?.[key];

    if (!media) return null;

    if (Array.isArray(media)) {
      return media[0]?.alternativeText ?? null;
    }

    return media?.alternativeText ?? null;
  };

  if (loading) return <SkeletonSchema grid={1} />;
  if (error) return <p className="text-red-500">{String(error)}</p>;
  if (!Array.isArray(result) || result.length === 0) return null;

  return (
    <section className="relative">
      <Carousel
        className="w-full overflow-hidden"
        plugins={[
          Autoplay({
            delay: 3500,
          }),
        ]}
      >
        <CarouselContent>
          {result.map((item: any) => {
            console.log("🧱 Block1 item:", item);

            // Campos directos (Strapi v5)
            const id = item.id ?? item.documentId;
            const titulo = item.tituloBlock1 ?? "Destacado";
            const description = item.description ?? "";
            const blockSlug = item.slug ?? "";

            // Relaciones (sin attributes y sin .data)
            const categorySlug = item.category?.slug ?? null;
            const productSlug = item.product?.slug ?? null;

            // Imagen
            const img = getMediaUrl(item, "imageBlock1");
            const imgUrl = toAbsUrl(img);
            const altTxt = getMediaAlt(item, "imageBlock1") || titulo;

            // A dónde navegar según lo que mandó Strapi
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
                  className={`relative w-full h-[510px] md:h-[750px] rounded-3xl overflow-hidden ${
                    hasLink ? "cursor-pointer" : ""
                  }`}
                  onClick={hasLink ? handleClick : undefined}
                >
                  {/* Imagen */}
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={altTxt}
                      fill
                      className="object-cover"
                      unoptimized
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-300" />
                  )}

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10" />

                  {/* Etiqueta */}
                  <div className="absolute left-4 top-4 md:left-6 md:top-6">
                    <span className="text-white/90 text-sm md:text-base font-medium drop-shadow">
                      Destacado
                    </span>
                  </div>

                  {/* Texto */}
                  <div className="absolute left-5 right-4 bottom-8 md:bottom-14">
                    <h2 className="text-3xl md:text-7xl font-black text-white">
                      {titulo.toUpperCase()}
                    </h2>

                    {description && (
                      <p className="mt-2 text-white/90 md:text-lg lg:text-2xl max-w-2xl">
                        {description}
                      </p>
                    )}

                    {/* Botón Ver más */}
                    {hasLink && (
                      <button
                        className="mt-3 relative inline-flex h-10 md:h-13 items-center justify-center px-6 lg:px-10 font-semibold rounded-md bg-white text-black overflow-hidden group"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClick();
                        }}
                      >
                        <span className="transition group-hover:-translate-x-[150%]">
                          Ver más
                        </span>
                        <span className="absolute opacity-0 translate-x-[150%] group-hover:opacity-100 group-hover:translate-x-0 transition">
                          ➜
                        </span>
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




                  