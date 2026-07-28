"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { useGetFeaturedProducts } from "@/api/useGetFeaturedProducts";
import { getCategoryRecommended } from "@/api/getCategoryRecommend";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SkeletonSchema from "@/components/skeletonSchema";
import type { ResponseType } from "@/types/response";
import type { ProductType } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import type { PromotionType } from "@/types/promotion";
import { LovedButton } from "@/components/loved-button";
import { toAbsUrl } from "@/lib/media";
import { useNavigationTransition } from "@/components/navigation-transition-provider";

// TIPOGRAFIAS DE RECOMENDADOS
// Se mantienen separadas de la ficha para que esta seccion pueda ajustar su escala independientemente.
const khInterferenceLightFont = localFont({
  src: "../../../../../components/fonts/KHInterferenceTRIAL-Light.otf",
  weight: "300",
  style: "normal",
  display: "swap",
});

const khInterferenceRegularFont = localFont({
  src: "../../../../../components/fonts/KHInterferenceTRIAL-Regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
});

/* ----------------------- TIPOS Y NORMALIZADORES ----------------------- */
// Estos tipos aceptan respuestas planas o anidadas de Strapi sin afectar la tarjeta visual.

type StrapiEntity<T> = {
  id?: number;
  attributes?: T;
} & T;

type ProductImage = {
  url?: string;
};

type SubCategoryLike =
  | string
  | {
      id?: number;
      documentId?: string;
      categoryName?: string;
      slug?: string;
    }
  | null;

type ProductAttrs = {
  id?: number;
  slug?: string;
  price?: number | string;
  productName?: string;
  productName2?: string;
  variant?: string;
  subCategory?: string | null;
  sub_category?: SubCategoryLike;
  images?:
    | ProductImage[]
    | {
        data?: StrapiEntity<ProductImage>[];
      };
  promotions?:
  | PromotionType[]
  | {
      data?: StrapiEntity<PromotionType> | StrapiEntity<PromotionType>[];
    }
  | null;
};

type ProductWithAttrs = ProductType & {
  attributes?: ProductAttrs;
};

type PromotionWithValue = PromotionType & {
  value?: number | string;
};

/* ----------------------- PRECIOS Y PROMOCIONES ----------------------- */
// Las mismas reglas de precio de la ficha se aplican aqui para que las recomendaciones sean consistentes.

function isPromoActive(p: PromotionType, now = new Date()) {
  if (!p?.active) return false;
  const start = p.startAt ? new Date(p.startAt) : null;
  const end = p.endAt ? new Date(p.endAt) : null;
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

function applyPromo(basePrice: number, promo: PromotionType | null) {
  if (!promo) return basePrice;

  const promoWithValue = promo as PromotionWithValue;
  const val = Number(promoWithValue.value ?? 0);
  let discount = 0;

  if (val <= 1) discount = basePrice * val;
  else if (val <= 100) discount = basePrice * (val / 100);
  else discount = val;

  return Math.max(0, Math.round(basePrice - discount));
}

function pickBestPromo(basePrice: number, promos?: PromotionType[] | null) {
  if (!promos || promos.length === 0) return null;

  const actives = promos.filter((p) => isPromoActive(p));
  if (actives.length === 0) return null;

  let best: { promo: PromotionType; finalPrice: number } | null = null;

  for (const p of actives) {
    const fp = applyPromo(basePrice, p);
    if (!best || fp < best.finalPrice) best = { promo: p, finalPrice: fp };
  }

  return best ? best.promo : null;
}

function normalizePromotions(
  input: ProductAttrs["promotions"]
): PromotionType[] {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input;
  }

  if (Array.isArray(input?.data)) {
    return input.data.map((x) => ({
      ...(x?.attributes ?? x),
      id: x?.id ?? x?.attributes?.id,
    })) as PromotionType[];
  }

  if (input?.data && typeof input.data === "object" && !Array.isArray(input.data)) {
    const x = input.data;
    return [
      {
        ...(x?.attributes ?? x),
        id: x?.id ?? x?.attributes?.id,
      } as PromotionType,
    ];
  }

  return [];
}

// IMAGENES DE STRAPI
// Convierte la relacion `images.data` a un arreglo simple que consume la tarjeta recomendada.
function getImagesArray(images: ProductAttrs["images"]): ProductImage[] {
  if (!images) return [];

  if (Array.isArray(images)) {
    return images;
  }

  if (Array.isArray(images.data)) {
    return images.data.map((img) => img.attributes ?? img);
  }

  return [];
}

/* -------------------------------------------------------------------- */

// PROPS DE RECOMENDADOS
// El id actual evita sugerir el mismo producto; el slug entrega prioridad a su categoria.
type RecommendedProps = {
  currentProductId: number;
  categorySlug: string;
};

const Recommmended = ({
  currentProductId,
  categorySlug,
}: RecommendedProps) => {
  // NAVEGACION Y FUENTES
  // Primero se cargan productos de la categoria y luego destacados como respaldo.
  const { navigateWithTransition } = useNavigationTransition();

  const {
    result: featuredResult,
    loading: loadingFeatured,
  }: ResponseType = useGetFeaturedProducts();

  const {
    result: categoryResult,
    loading: loadingCategory,
  }: ResponseType = getCategoryRecommended(categorySlug);

  // ESTADO DE CARGA
  // El skeleton se mantiene hasta que ambas fuentes respondan.
  const loading = loadingFeatured || loadingCategory;

  // ARMAR LISTA FINAL
  // Elimina el producto actual, evita duplicados y limita el carrusel a seis tarjetas.
  let products: ProductType[] = [];

  if (Array.isArray(categoryResult)) {
    products = categoryResult.filter((p) => p.id !== currentProductId);
  }

  if (Array.isArray(featuredResult)) {
    const featuredClean = featuredResult.filter(
      (p) =>
        p.id !== currentProductId &&
        !products.some((existing) => existing.id === p.id)
    );
    products = [...products, ...featuredClean];
  }

  products = products.slice(0, 6);

  if (loading) {
    return (
      // ESTADO VISUAL DE CARGA
      // Cambiar los breakpoints del titulo o el `grid` del Skeleton altera su composicion responsive.
      <section className="mx-auto max-w-[1350px] px-4 py-10 sm:px-6 lg:px-0">
        <h3
          className={`${khInterferenceRegularFont.className} mb-6 text-4xl uppercase leading-none tracking-[0] text-black sm:text-6xl`}
        >
          TE PUEDE INTERESAR
        </h3>
        <SkeletonSchema grid={3} />
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    // CONTENEDOR DE RECOMENDADOS
    // `max-w-[1350px]` alinea esta seccion con las demas bandas de la pagina Inicio.
    <section className="mx-auto max-w-[1350px] px-4 py-10 sm:px-6 lg:px-0">
      {/* TITULO: editar text-4xl/sm:text-6xl cambia su escala movil y escritorio. */}
      <h3
        className={`${khInterferenceRegularFont.className} mb-8 text-4xl uppercase leading-none tracking-[0] text-black sm:mb-12 sm:text-6xl`}
      >
        TE PUEDE INTERESAR
      </h3>

      {/* CARRUSEL: muestra las tarjetas relacionadas sin convertir la seccion en una grilla estatica. */}
      <Carousel>
        <CarouselContent className="ml-1 md:-ml-4">
          {products.map((product) => {
            const raw = product as ProductWithAttrs;
            const attrs: ProductAttrs = raw.attributes ?? raw;

            const imagesArray = getImagesArray(attrs.images);

            const firstImage = imagesArray[0]?.url ?? null;
            const secondImage = imagesArray[1]?.url ?? null;

            const image1 = toAbsUrl(firstImage);
            const image2 = toAbsUrl(secondImage);

            const displayName = attrs.productName ?? "Producto sin nombre";
            const subCategoryLabel =
            typeof attrs.sub_category === "string"
              ? attrs.sub_category
              : attrs.sub_category?.categoryName ?? "";

          const secondaryName =
            attrs.productName2 ??
            attrs.variant ??
            attrs.subCategory ??
            subCategoryLabel ??
            "";

            const productSlug = attrs.slug ?? "";

            const basePrice = Number(attrs.price ?? 0);

            const promos = normalizePromotions(attrs.promotions);
            const appliedPromo = pickBestPromo(basePrice, promos);

            const finalPrice = appliedPromo
              ? applyPromo(basePrice, appliedPromo)
              : basePrice;

            const hasDiscount =
              appliedPromo !== null && finalPrice < basePrice;

            return (
              <CarouselItem
                key={raw.id ?? productSlug}
                className="basis-[95%] px-1 sm:basis-1/2 md:px-1 lg:basis-1/4"
              >
                <Card
                  className="group relative flex h-auto w-full flex-col justify-between overflow-hidden border-none bg-white pb-4 pt-4 shadow-none"
                >
                  {hasDiscount && (
                    <div
                      className="absolute left-3 top-3 z-10 bg-black px-2 py-1 text-[10px] font-black tracking-wide text-[#ADFE00] lg:left-4 lg:top-4 lg:px-3 lg:text-[11px]"
                    >
                      OFERTA
                    </div>
                  )}

                  <CardContent className="flex flex-col justify-around px-1 pb-0 pt-0 md:px-3">
                    <div
                      className="relative mt-0 flex w-full cursor-pointer items-center justify-center overflow-hidden bg-white pb-1 pt-1 sm:mb-4"
                      onClick={() =>
                        productSlug &&
                        navigateWithTransition(`/product/${productSlug}`)
                      }
                    >
                      <div className="absolute top-3 right-3 z-20">
                        <LovedButton
                          product={{
                            id: raw.id ?? 0,
                            title: displayName,
                            secondaryName,
                            price: basePrice,
                            slug: productSlug,
                            imageUrl: image1,
                          }}
                        />
                      </div>

                      {image1 && (
                        <Image
                          src={image1}
                          alt={displayName}
                          width={700}
                          height={700}
                          unoptimized
                          className="h-auto w-auto object-contain opacity-100 transition-all duration-300 ease-out group-hover:opacity-0 sm:max-h-102.5"
                        />
                      )}

                      {image2 && (
                        <Image
                          src={image2}
                          alt={displayName}
                          fill
                          unoptimized
                          className="absolute inset-0 object-cover opacity-0 transition-all duration-300 ease-out group-hover:opacity-100"
                        />
                      )}

                      {!image1 && (
                        <span className="text-sm text-muted-foreground">
                          Sin imagen
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between gap-3">
                      <h3
                        className={`${khInterferenceLightFont.className} min-w-0 flex-1 text-left text-lg uppercase leading-[1.25] sm:text-[17px]`}
                      >
                        {displayName}
                      </h3>
                      {hasDiscount ? (
                        <div className="shrink-0 text-right leading-tight">
                          <p
                            className={`${khInterferenceLightFont.className} text-[12px] font-semibold text-black/40 line-through`}
                          >
                            {formatPrice(basePrice)}
                          </p>
                          <p
                            className={`${khInterferenceLightFont.className} text-[17px] font-extrabold text-black tabular-nums`}
                          >
                            {formatPrice(finalPrice)}
                          </p>
                        </div>
                      ) : (
                        <p
                          className={`${khInterferenceLightFont.className} shrink-0 text-[15px] font-semibold text-right leading-[1.25]`}
                        >
                          {formatPrice(basePrice)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
};

export default Recommmended;

