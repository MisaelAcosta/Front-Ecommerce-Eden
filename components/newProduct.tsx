"use client";

import { useGetNewProducts } from "@/api/useGetNewProduct";
import { useEffect, useMemo, useState } from "react";
import localFont from "next/font/local";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./ui/carousel";
import SkeletonSchema from "./skeletonSchema";
import type { ResponseType } from "@/types/response";
import type { ProductType } from "@/types/product";
import { toAbsUrl } from "@/lib/media";
import Image from "next/image";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/fade-up";
import { useNavigationTransition } from "@/components/navigation-transition-provider";
import { khInterferenceRegularFont } from "@/app/(routes)/cart/components/cart-fonts";
import { ArrowRight } from "lucide-react";

// Fuente del titulo; coincide con la seccion Top Ventas.
const khInterferenceBoldFont = localFont({
  src: "./fonts/KHInterferenceTRIAL-Bold.otf",
  weight: "700",
  style: "normal",
  display: "swap",
});

const khInterferenceLightFont = localFont({
  src: "./fonts/KHInterferenceTRIAL-Light.otf",
  weight: "300",
  style: "normal",
  display: "swap",
});

type ProductImage = {
  url?: string | null;
};

type StrapiImageWrapper = {
  attributes?: ProductImage | null;
};

type StrapiRelationArray<T> = {
  data?: T[] | null;
};

type StrapiRelationSingle<T> = {
  data?: T | null;
};

type SubCategoryLike = {
  categoryName?: string | null;
  attributes?: {
    categoryName?: string | null;
  } | null;
};

type ProductAttrs = {
  productName?: string | null;
  productName2?: string | null;
  variant?: string | null;
  slug?: string | null;
  images?: ProductImage[] | StrapiRelationArray<StrapiImageWrapper> | null;
  sub_category?: SubCategoryLike | StrapiRelationSingle<SubCategoryLike> | null;
};

type ProductWithAttributes = ProductType & {
  id: number;
  attributes?: ProductAttrs;
} & ProductAttrs;

type NewProductCardData = {
  id: number;
  productSlug: string;
  image1: string | null;
  subCategoryName: string;
};

// Resolve product images regardless of whether Strapi returns raw arrays or relations.
function getImagesArray(attrs: ProductAttrs): ProductImage[] {
  if (Array.isArray(attrs.images)) {
    return attrs.images;
  }

  if (
    attrs.images &&
    "data" in attrs.images &&
    Array.isArray(attrs.images.data)
  ) {
    return attrs.images.data
      .map((i: StrapiImageWrapper) => i.attributes)
      .filter((img): img is ProductImage => Boolean(img));
  }

  return [];
}

// SUBCATEGORIA VISIBLE
// Acepta tanto la respuesta plana de Strapi v5 como la relacion anidada.
function getSubCategoryName(value: ProductAttrs["sub_category"]) {
  if (!value) return "";

  const relation = "data" in value ? value.data : value;
  if (!relation) return "";

  const source = relation as SubCategoryLike;

  return source.attributes?.categoryName?.trim()
    ?? source.categoryName?.trim()
    ?? "";
}

// Convierte el producto crudo en los datos visuales minimos del nuevo riel.
function buildNewProductCardData(product: ProductType): NewProductCardData {
  const raw = product as ProductWithAttributes;
  const attrs: ProductAttrs = raw.attributes ?? raw;
  const imagesArray = getImagesArray(attrs);
  const image1 = toAbsUrl(imagesArray[0]?.url ?? null);
  const productSlug = attrs.slug ?? "";

  return {
    id: raw.id,
    productSlug,
    image1,
    subCategoryName: getSubCategoryName(attrs.sub_category),
  };
}

// TARJETA DEL RIEL
// Solo muestra la imagen: los productos deben sentirse como una coleccion visual.
function NewProductCard({
  product,
  onOpenProduct,
}: {
  product: NewProductCardData;
  onOpenProduct: (slug: string) => void;
}) {
  const { id, productSlug, image1 } = product;

  // RIEL MOVIL: replica Top Ventas con una tarjeta principal y parte de la
  // siguiente. Desde `sm` se ven dos, manteniendo el gesto horizontal.
  return (
    <CarouselItem
      key={id}
      className="basis-[76%] px-1 sm:basis-1/2 md:px-1 lg:basis-1/2 lg:px-4"
    >
      <button
        type="button"
        aria-label="Ver producto"
        onClick={() => onOpenProduct(productSlug)}
        className="
          group relative block w-full cursor-pointer overflow-hidden
          bg-[#eeeeee] text-left aspect-square
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ADFE00]
        "
      >
        {image1 ? (
          <Image
            src={image1}
            alt="Nuevo producto"
            fill
            sizes="(max-width: 1023px) 50vw, 310px"
            unoptimized
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03] lg:p-5"
          />
        ) : (
          <span
            className={`${khInterferenceLightFont.className} grid h-full place-items-center text-sm text-black/45`}
          >
            Sin imagen
          </span>
        )}
      </button>
    </CarouselItem>
  );
}

const NewProducts = () => {
  const { result, loading }: ResponseType = useGetNewProducts();
  const { navigateWithTransition } = useNavigationTransition();
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const newProducts = Array.isArray(result)
    ? result.map(buildNewProductCardData)
    : [];

  // SINCRONIZACION DEL RIEL
  // El indice permite actualizar las subcategorias de los dos productos visibles.
  useEffect(() => {
    if (!carouselApi) return;

    const updateActiveIndex = () => setActiveIndex(carouselApi.selectedScrollSnap());
    updateActiveIndex();
    carouselApi.on("select", updateActiveIndex);

    return () => {
      carouselApi.off("select", updateActiveIndex);
    };
  }, [carouselApi]);

  // SUBCATEGORIAS ACTIVAS
  // Elimina duplicados para mostrar, por ejemplo, "SEPARA LIBROS · FIGURAS".
  const visibleSubCategories = useMemo(() => {
    const visibleProducts = newProducts.slice(activeIndex, activeIndex + 2);

    return [...new Set(
      visibleProducts
        .map((product) => product.subCategoryName)
        .filter(Boolean)
    )];
  }, [activeIndex, newProducts]);

  // NAVEGACION A LA FICHA DEL PRODUCTO.
  const handleOpenProduct = (slug: string) => {
    if (!slug) return;
    navigateWithTransition(`/product/${slug}`);
  };

  // AVANCE DEL RIEL: el control inferior izquierdo conserva el gesto editorial de la referencia.
  const handleNextProducts = () => carouselApi?.scrollNext();

  // BLOQUE COLECCIONES: columna editorial a la izquierda y dos productos a la derecha.
  return (
    <section className="mx-auto max-w-[1350px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 2xl:px-0">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        custom={0.2}
        className="grid gap-7 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-20"
      >
        {/* COLUMNA EDITORIAL: titulo, descripcion y subcategorias de los productos visibles. */}
        <div className="flex min-h-full flex-col justify-between py-1 lg:py-2">
          <div>
            <h3
              className={`${khInterferenceRegularFont.className} text-2xl 
              uppercase leading-none
              sm:text-3xl lg:text-4xl`}
            >
              Nuevos Productos
            </h3>
            <p
              className={`${khInterferenceLightFont.className} mt-5 max-w-[285px]
              text-[13px] uppercase leading-[1.12] text-black/75
              sm:text-[15px] lg:mt-6 lg:text-[16px]`}
            >
              Descubre nuestros ultimos lanzamientos y encuentra productos nuevos pensados para darle un toque unico a tu espacio.
            </p>
          </div>

          {/* PIE DEL BLOQUE: categoria e indicadores arriba de las imagenes en movil. */}
          <div className="mt-5 flex items-center justify-between gap-4 lg:mt-12">
            <p
              className={`${khInterferenceLightFont.className} 
              text-[13px] uppercase leading-none sm:text-lg lg:hidden text-black/75`}
            >
              {visibleSubCategories.length > 0
                ? visibleSubCategories.join(" · ")
                : "Nuevos productos"}
            </p>
            <p
              className={`${khInterferenceLightFont.className} hidden text-lg uppercase leading-none lg:block`}
            >
              {visibleSubCategories.length > 0
                ? visibleSubCategories.join(" · ")
                : "Nuevos productos"}
            </p>

            {/* INDICADORES MOVIL: cada punto representa un producto y permite ir a el. */}
            <div className="flex items-center gap-2 lg:hidden">
              {newProducts.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  aria-label={`Ver producto ${index + 1}`}
                  aria-current={activeIndex === index}
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={`size-2 rounded-full transition-colors ${
                    activeIndex === index ? "bg-black" : "bg-black/15"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Ver siguientes productos"
              onClick={handleNextProducts}
              className="hidden size-10 shrink-0 place-items-center transition-colors hover:text-[#ADFE00] disabled:opacity-30 lg:grid"
              disabled={!carouselApi || activeIndex >= newProducts.length - 2}
            >
              <ArrowRight size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* RIEL: mismo gesto y proporcion movil que Top Ventas. */}
        <Carousel
          setApi={setCarouselApi}
          opts={{ align: "start", slidesToScroll: 1 }}
          className="group/carousel min-w-0"
        >
          <CarouselContent className="ml-1 md:-ml-4 lg:-ml-8">
            {loading && <SkeletonSchema grid={2} />}

            {newProducts.map((product) => (
              <NewProductCard
                key={product.id}
                product={product}
                onOpenProduct={handleOpenProduct}
              />
            ))}
          </CarouselContent>

          {/* FLECHAS DEL CARRUSEL: ocultas hasta entrar al riel. Sin fondo; el borde
              cuadrado solo aparece al posar el puntero directamente sobre el control. */}
          <CarouselPrevious
            variant="ghost"
            className="
              hidden left-2 z-20 rounded-none border border-transparent bg-transparent text-black
              opacity-0 shadow-none pointer-events-none transition-opacity
              hover:border-black hover:bg-transparent hover:text-black
              group-hover/carousel:pointer-events-auto group-hover/carousel:opacity-100
              disabled:!pointer-events-none disabled:!opacity-0 lg:flex lg:left-3
            "
          />
          <CarouselNext
            variant="ghost"
            className="
              hidden right-2 z-20 rounded-none border border-transparent bg-transparent text-black
              opacity-0 shadow-none pointer-events-none transition-opacity
              hover:border-black hover:bg-transparent hover:text-black
              group-hover/carousel:pointer-events-auto group-hover/carousel:opacity-100
              disabled:!pointer-events-none disabled:!opacity-0 lg:flex lg:right-3
            "
          />
        </Carousel>
      </motion.div>
    </section>
  );
};

export default NewProducts;
