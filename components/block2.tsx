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
  if (error) return <p className="text-red-500 text-sm">Error: {String(error)}</p>;
  if (!Array.isArray(result) || result.length === 0) return null;

  return (
    <section className="relative">
      <Carousel>
        <CarouselContent>
          {(result as any[]).map((item) => {
            console.log("🧱 Block2 item:", item);

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
            const altTxt =
              getMediaAlt(item, "imageBlock2") || titulo || "Banner";

            // Lógica de navegación igual que Block1
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
                  className="relative w-full h-[510px] md:h-[746px] rounded-2xl overflow-hidden cursor-pointer"
                >
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={altTxt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      // quita esto cuando agregues el dominio del backend en next.config.js
                      unoptimized
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-neutral-200 to-neutral-700" />
                  )}

                  {/* Título y descripción (si los quieres visibles, quita "hidden") */}
                  <div className="hidden absolute left-4 right-4 bottom-4 md:left-6 md:right-6 md:bottom-6">
                    {titulo && (
                      <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow">
                        {titulo}
                      </h3>
                    )}
                    {description && (
                      <p className="mt-2 text-white/90 text-sm md:text-base max-w-2xl">
                        {description}
                      </p>
                    )}
                  </div>

                  {/* Botón Ver más (usa la misma lógica de navegación) */}
                  {hasLink && (
                    <div className="absolute left-5 right-4 bottom-8 md:bottom-14 md:right-6 md:bottom-6">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClick();
                        }}
                        className="mt-3 group relative cursor-pointer inline-flex md:h-13 h-10 items-center justify-center bg-white overflow-hidden rounded-md bg-neutral-950 px-6 lg:px-10 font-semibold text-neutral-200 duration-900"
                      >
                        <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0 text-black">
                          Ver más
                        </div>
                        <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-black"
                          >
                            <path
                              d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="hidden md:left-4" />
        <CarouselNext className="hidden md:right-4" />
      </Carousel>
    </section>
  );
};

export default Block2;


