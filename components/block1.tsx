"use client";

import { useGetFeaturedBlock1 } from "@/api/useGetFeaturedBlock1";
import SkeletonSchema from "./skeletonSchema";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ResponseType } from "@/types/response";
import  Autoplay  from "embla-carousel-autoplay";

const Block1 = () => {
  const { result, loading, error }: ResponseType = useGetFeaturedBlock1();
  const router = useRouter();

  // Normaliza la base y la ruta (evita // o falta de /)
  const toAbsUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${base}${path}`;
  };

  // Lee campos plano o con attributes
  const getField = (item: any, key: string) => item?.[key] ?? item?.attributes?.[key];

  // Escanea posibles ubicaciones de la URL de media (single/multiple/formats/flat)
  const getMediaUrl = (item: any, key: string): string | null => {
    const media = getField(item, key);
    if (!media) return null;

    // 0) plano directo
    if (typeof media?.url === "string") return media.url;

    // 1) single: data.attributes.url
    const single = media?.data?.attributes?.url;
    if (typeof single === "string") return single;

    // 2) multiple: data[0].attributes.url
    const multi = Array.isArray(media?.data) ? media.data[0]?.attributes?.url : null;
    if (typeof multi === "string") return multi;

    // 3) plano con array: media[0].url
    const flatArr = Array.isArray(media) ? media[0]?.url : null;
    if (typeof flatArr === "string") return flatArr;

    // 4) formatos (Strapi < v5 o custom upload): formats.large/url/medium/small/thumbnail
    const formats =
      media?.formats ||
      media?.data?.attributes?.formats ||
      (Array.isArray(media?.data) ? media.data[0]?.attributes?.formats : null);

    if (formats) {
      const cand =
        formats.large?.url ||
        formats.medium?.url ||
        formats.small?.url ||
        formats.thumbnail?.url;
      if (typeof cand === "string") return cand;
    }

    return null;
  };

  const getMediaAlt = (item: any, key: string): string | null => {
    const media = getField(item, key);
    if (!media) return null;
    if (typeof media?.alternativeText === "string") return media.alternativeText;

    const altSingle = media?.data?.attributes?.alternativeText;
    if (typeof altSingle === "string") return altSingle;

    const altMulti = Array.isArray(media?.data)
      ? media.data[0]?.attributes?.alternativeText
      : null;
    if (typeof altMulti === "string") return altMulti;

    return null;
  };

  if (loading) return <SkeletonSchema grid={1} />;
  if (error) return <p className="text-red-500 text-sm">Error: {String(error)}</p>;
  if (!Array.isArray(result) || result.length === 0) return null;

  return (
    <section className="relative">
      <Carousel 
       className="w-full justify-between overflow-hidden " 
       plugins={[
         Autoplay({
         delay: 3500 //ms
        })
        ]}>
        
        <CarouselContent className=" ">
          {(result as any[]).map((item) => {
            const id = item?.id ?? item?.documentId ?? crypto.randomUUID();
            const titulo = getField(item, "tituloBlock1") ?? "Destacado";
            const description = getField(item, "description") ?? "";
            const slug = getField(item, "slug") ?? "";
            const category = getField(item, "category") ?? "";

            const urlRel = getMediaUrl(item, "imageBlock1");
            const imgUrl = toAbsUrl(urlRel);
            const altTxt = getMediaAlt(item, "imageBlock1") || titulo;

            // Debug
            const isDev = process.env.NODE_ENV !== "production";

            return (
              <CarouselItem key={id} className="">
                <div className="relative w-full h-[510px] md:h-[750px] saturate-150  rounded-3xl overflow-hidden">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={altTxt}
                      fill
                      className="object-cover"
                      // quitar esto cuando agregue el dominio del backend a next.config.js
                      unoptimized
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-neutral-200 to-neutral-700" />
                  )}

                  <div className="absolute bg-gradient-to-t from-black/20  " />

                  {/* Caption */}
                  <div className="absolute left-4 top-4 md:left-6 md:top-6">
                    <span className="text-white/90 text-sm md:text-base font-medium drop-shadow">
                      Destacado
                    </span>
                  </div>
                  
                  
                  {/* Texto principal */}
                  <div className="absolute left-5 right-4 bottom-8 md:bottom-14 md:left-15 md:right-6 md:bottom-6">
                    <h2 className="text-3xl md:text-7xl font-black text-white ">
                      {String(titulo).toUpperCase()}
                    </h2>
                    {description && (
                      <p className="mt-2 md:mt-3 text-white/90 md:text-base lg:text-2xl font-medium max-w-2xl">
                        {description}
                      </p>
                    )}
                    {slug && (

                      <button
                        onClick={() => router.push(`/categoria/${category}`)}
                        className="mt-3 group relative cursor-pointer inline-flex md:h-13 h-10 items-center justify-center bg-white overflow-hidden rounded-md bg-neutral-950 px-6 lg:px-10 font-semibold text-neutral-200 duration-900"
                      >
                        <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0 text-black">Ver mas</div>
                        <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black">
                        <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                        </svg>
                        </div>
                        
                      </button>

                      
                    )}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="lg:hidden md:left-6 " />
        <CarouselNext className="hidden md:right-9 transition-all duration-300 ease-out" />
      </Carousel>
    </section>
  );
};

export default Block1;

                  