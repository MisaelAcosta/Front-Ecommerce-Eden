"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useGetFeaturedBlock1 } from "@/api/useGetFeaturedBlock1";
import { useNavigationTransition } from "@/components/navigation-transition-provider";

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

const SLIDE_DURATION_MS = 5600;

function toAbsUrl(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("http")) return url;

  const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
}

function getMediaUrl(item: Block1Item, key: keyof Block1Item): string | null {
  const media = item[key];
  if (!media) return null;

  if (Array.isArray(media)) {
    return typeof media[0]?.url === "string" ? media[0].url : null;
  }

  return typeof media === "object" && "url" in media && typeof media.url === "string"
    ? media.url
    : null;
}

function getMediaAlt(item: Block1Item, key: keyof Block1Item): string | null {
  const media = item[key];
  if (!media) return null;

  if (Array.isArray(media)) {
    return typeof media[0]?.alternativeText === "string"
      ? media[0].alternativeText
      : null;
  }

  return typeof media === "object" && "alternativeText" in media && typeof media.alternativeText === "string"
    ? media.alternativeText
    : null;
}

const Block1 = () => {
  const { result, loading, error } = useGetFeaturedBlock1();
  const { navigateWithTransition } = useNavigationTransition();
  const [activeIndex, setActiveIndex] = useState(0);

  const items = (result ?? []) as Block1Item[];
  const hasMultipleSlides = items.length > 1;

  useEffect(() => {
    setActiveIndex((current) => (items.length ? Math.min(current, items.length - 1) : 0));
  }, [items.length]);

  useEffect(() => {
    if (!hasMultipleSlides) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, SLIDE_DURATION_MS);

    return () => window.clearInterval(timer);
  }, [hasMultipleSlides, items.length]);

  if (loading) {
    return (
      <div className="flex h-227.5 w-full items-center justify-center bg-white shadow-none">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (error) return <p className="text-red-500">{String(error)}</p>;
  if (!items.length) return null;

  const item = items[activeIndex];
  const title = item.tituloBlock1 ?? "";
  const description = item.description ?? "";
  const productSlug = item.product?.slug ?? null;
  const categorySlug = item.category?.slug ?? null;
  const blockSlug = item.slug ?? "";

  const mobileUrl = toAbsUrl(getMediaUrl(item, "imageBlock1Movile"));
  const desktopUrl = toAbsUrl(getMediaUrl(item, "imageBlock1"));
  const mobileAlt = getMediaAlt(item, "imageBlock1Movile") || title || "Banner principal";
  const desktopAlt = getMediaAlt(item, "imageBlock1") || title || "Banner principal";
  const finalMobileUrl = mobileUrl || desktopUrl;
  const finalDesktopUrl = desktopUrl || mobileUrl;
  const hasLink = Boolean(productSlug || categorySlug || blockSlug);

  const goToSlide = (index: number) => {
    setActiveIndex((index + items.length) % items.length);
  };

  const handleClick = () => {
    if (productSlug) {
      navigateWithTransition(`/product/${productSlug}`);
    } else if (categorySlug) {
      navigateWithTransition(`/category/${categorySlug}`);
    } else if (blockSlug) {
      navigateWithTransition(`/${blockSlug}`);
    }
  };

  return (
    <section
      className="relative h-full w-full overflow-hidden bg-black"
      aria-roledescription="carousel"
      aria-label="Destacados"
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={String(item.id ?? item.documentId ?? activeIndex)}
          initial={{ opacity: 0, scale: 1.025 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute inset-0 ${hasLink ? "cursor-pointer" : ""}`}
          role={hasLink ? "link" : undefined}
          tabIndex={hasLink ? 0 : -1}
          aria-label={hasLink ? title || "Ver mas" : undefined}
          onClick={hasLink ? handleClick : undefined}
          onKeyDown={
            hasLink
              ? (event) => {
                  if (event.key === "Enter" || event.key === " ") handleClick();
                }
              : undefined
          }
        >
          {finalMobileUrl && (
            <div className="absolute inset-0 block sm:hidden">
              <Image
                src={finalMobileUrl}
                alt={mobileUrl ? mobileAlt : desktopAlt}
                fill
                priority={activeIndex === 0}
                sizes="100vw"
                unoptimized
                className="object-cover object-center"
              />
            </div>
          )}

          {finalDesktopUrl && (
            <div className="absolute inset-0 hidden sm:block">
              <Image
                src={finalDesktopUrl}
                alt={desktopUrl ? desktopAlt : mobileAlt}
                fill
                priority={activeIndex === 0}
                sizes="100vw"
                unoptimized
                className="object-cover object-center"
              />
            </div>
          )}

          <div className="absolute inset-0 bg-black/5" />

          <div className="absolute bottom-20 left-5 right-4 md:bottom-20 md:px-15">
            <h2 className="text-3xl font-black leading-none text-white md:text-5xl">
              {title.toUpperCase()}
            </h2>
            {description && (
              <p className="mt-2 max-w-2xl text-white/90 leading-none md:text-lg lg:text-xl">
                {description}
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {hasMultipleSlides && (
        <>
          <button
            type="button"
            aria-label="Slide anterior"
            onClick={() => goToSlide(activeIndex - 1)}
            className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center text-white/80 transition-opacity hover:text-white md:flex"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Siguiente slide"
            onClick={() => goToSlide(activeIndex + 1)}
            className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center text-white/80 transition-opacity hover:text-white md:flex"
          >
            <ArrowRight className="h-6 w-6" strokeWidth={1.5} />
          </button>

          <div className="absolute bottom-5 left-5 right-5 z-20 flex gap-2 md:bottom-7 md:left-15 md:right-15">
            {items.map((slide, index) => (
              <button
                key={String(slide.id ?? slide.documentId ?? index)}
                type="button"
                aria-label={`Ir al slide ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => goToSlide(index)}
                className="group relative h-[2px] flex-1 overflow-hidden bg-white/35"
              >
                {index === activeIndex && (
                  <motion.span
                    key={activeIndex}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: SLIDE_DURATION_MS / 1000, ease: "linear" }}
                    className="absolute inset-0 origin-left bg-white"
                  />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Block1;
