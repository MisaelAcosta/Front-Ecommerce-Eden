"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";
import { useGetCategories } from "@/api/getProducts";
import type { ResponseType } from "@/types/response";
import type { CategoryType } from "@/types/category";

// Tipografias locales de la seccion categorias.
const maratypeFont = localFont({
  src: "./fonts/Maratype.otf",
  display: "swap",
});

const khInterferenceLightFont = localFont({
  src: "./fonts/KHInterferenceTRIAL-Light.otf",
  weight: "300",
  style: "normal",
  display: "swap",
});

const khInterferenceRegularFont = localFont({
  src: "./fonts/KHInterferenceTRIAL-Regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
});

type CategoryKey = "libros" | "soporte" | "geek";

type CategoryVisualConfig = {
  key: CategoryKey;
  label: string;
  fallbackSlug: string;
  matches: string[];
  description: string;
  images: {
    primary: string;
    secondary: string;
    bottom: string;
  };
};

type CategoryCardData = {
  key: CategoryKey;
  label: string;
  slug: string;
  href: string;
  description: string;
  images: {
    primary: string;
    secondary: string;
    bottom: string;
  };
};

// Rutas locales faciles de reemplazar cuando quieras cambiar las imagenes.
const CATEGORY_VISUALS: CategoryVisualConfig[] = [
  {
    key: "libros",
    label: "LIBROS",
    fallbackSlug: "libros",
    matches: ["libros", "libro"],
    description:
      "Encuentra una amplia variedad de productos para tus libros, desde separadores hasta accesorios.",
    images: {
      primary: "/01.jpg",
      secondary: "/03.png",
      bottom: "/02.jpg",
    },
  },
  {
    key: "soporte",
    label: "SOPORTE",
    fallbackSlug: "soporte",
    matches: ["soporte", "soportes"],
    description:
      "Descubre soportes y accesorios funcionales para organizar, exhibir y aprovechar mejor tus espacios.",
    images: {
      primary: "/soporte.png",
      secondary: "/dispensador.png",
      bottom: "/imagen2.png",
    },
  },
  {
    key: "geek",
    label: "GEEK",
    fallbackSlug: "geek",
    matches: ["geek"],
    description:
      "Descubre articulos de tus series favoritas con piezas decorativas, figuras y detalles para coleccionar.",
    images: {
      primary: "/ss.jfif",
      secondary: "/culst.png",
      bottom: "/545864729_781082927834530_93935471925152915_n.webp",
    },
  },
];

// Normaliza textos para comparar nombres y slugs sin depender de acentos.
function normalizeText(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

// Busca la categoria real en Strapi para conservar el slug correcto del catalogo.
function findCategoryByConfig(
  config: CategoryVisualConfig,
  categories: CategoryType[]
) {
  return categories.find((category) => {
    const normalizedName = normalizeText(category.categoryName);
    const normalizedSlug = normalizeText(category.slug);

    return config.matches.some((match) => {
      const normalizedMatch = normalizeText(match);
      return (
        normalizedName.includes(normalizedMatch) ||
        normalizedSlug.includes(normalizedMatch)
      );
    });
  });
}

// Convierte la configuracion visual en los datos finales que usa la interfaz.
function buildCategoryCards(categories: CategoryType[]): CategoryCardData[] {
  return CATEGORY_VISUALS.map((config) => {
    const matchedCategory = findCategoryByConfig(config, categories);
    const slug = matchedCategory?.slug ?? config.fallbackSlug;

    return {
      key: config.key,
      label: config.label,
      slug,
      href: `/category/${slug}`,
      description: config.description,
      images: config.images,
    };
  });
}

// Boton de seleccion para cambiar la categoria activa.
function CategoryTab({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${khInterferenceRegularFont.className} rounded-xl px-5 py-3 text-base leading-none transition-colors duration-200 ${
        isActive
          ? "bg-black text-white"
          : "bg-[#efefef] text-black hover:bg-[#e4e4e4]"
      }`}
    >
      {label}
    </button>
  );
}

// Tarjeta visual para cada imagen del mosaico.
function CategoryImageTile({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[14px] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}

const ChooseCategory = () => {
  const { result, loading, error }: ResponseType = useGetCategories();
  const categories = Array.isArray(result) ? (result as CategoryType[]) : [];
  const categoryCards = useMemo(() => buildCategoryCards(categories), [categories]);
  const [activeCategoryKey, setActiveCategoryKey] = useState<CategoryKey>("libros");

  // Mantiene una categoria visible aunque Strapi falle o aun no responda.
  const activeCategory =
    categoryCards.find((category) => category.key === activeCategoryKey) ??
    categoryCards[0];

  return (
    <section className="w-full bg-white py-8 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-0">
        <h3
          className={`${maratypeFont.className} mb-4 text-left text-4xl leading-none text-black sm:mb-8 sm:text-6xl`}
        >
          CATEGORIAS
        </h3>

        {error && (
          <p className="mb-5 text-sm text-red-600">
            Ocurrio un problema cargando las categorias.
          </p>
        )}

        {loading && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
            <div className="grid grid-cols-2 gap-3">
              <div className="animate-pulse rounded-[14px] bg-zinc-200 h-[252px] sm:h-[380px]" />
              <div className="animate-pulse rounded-[14px] bg-zinc-200 h-[252px] sm:h-[380px]" />
              <div className="col-span-2 animate-pulse rounded-[14px] bg-zinc-200 h-[132px] sm:h-[255px]" />
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`tab-skeleton-${index}`}
                    className="h-12 w-24 animate-pulse rounded-xl bg-zinc-200"
                  />
                ))}
              </div>
              <div className="h-28 animate-pulse rounded-[14px] bg-zinc-200" />
              <div className="h-16 w-40 animate-pulse rounded-[14px] bg-zinc-200" />
            </div>
          </div>
        )}

        {!loading && activeCategory && (
          <>
            {/* Vista escritorio y tablet. */}
            <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8">
              <div className="grid grid-cols-[0.36fr_0.64fr] gap-3">
                <CategoryImageTile
                  src={activeCategory.images.primary}
                  alt={`${activeCategory.label} imagen principal`}
                  className="h-[380px]"
                  priority
                />
                <CategoryImageTile
                  src={activeCategory.images.secondary}
                  alt={`${activeCategory.label} imagen secundaria`}
                  className="h-[380px]"
                  priority
                />
                <CategoryImageTile
                  src={activeCategory.images.bottom}
                  alt={`${activeCategory.label} imagen inferior`}
                  className="col-span-2 h-[255px]"
                />
              </div>

              <div className="flex min-h-full flex-col items-center pt-0">
                <div className="mb-14 flex w-full justify-center gap-3">
                  {categoryCards.map((category) => (
                    <CategoryTab
                      key={category.key}
                      label={category.label}
                      isActive={category.key === activeCategory.key}
                      onClick={() => setActiveCategoryKey(category.key)}
                    />
                  ))}
                </div>

                <p
                  className={`${khInterferenceRegularFont.className} max-w-[280px] 
                  text-center text-[18px] sm:uppercase leading-[1.15] text-black`}
                >
                  {activeCategory.description}
                </p>

                <Link
                  href={activeCategory.href}
                  className="mt-14 inline-flex min-h-[86px] min-w-[156px] 
                  items-start justify-between rounded-[10px] bg-[#d2ff00] px-5 
                  py-4 text-black transition-transform duration-200 hover:scale-[1.02]"
                >
                  <span
                    className={`${khInterferenceRegularFont.className} text-left 
                    text-[17px] uppercase leading-[0.95]`}
                  >
                    VER
                    <br />
                    CATEGORIAS
                  </span>
                  <span className="text-xl leading-none">-&gt;</span>
                </Link>
              </div>
            </div>

            {/* Vista movil. */}
            <div className="lg:hidden">
              <div className="grid grid-cols-2 gap-3">
                <CategoryImageTile
                  src={activeCategory.images.primary}
                  alt={`${activeCategory.label} imagen principal`}
                  className="h-[252px]"
                  priority
                />
                <CategoryImageTile
                  src={activeCategory.images.secondary}
                  alt={`${activeCategory.label} imagen secundaria`}
                  className="h-[252px]"
                  priority
                />
                <CategoryImageTile
                  src={activeCategory.images.bottom}
                  alt={`${activeCategory.label} imagen inferior`}
                  className="col-span-2 h-[132px]"
                />
              </div>

              <div className="mt-6 flex items-end justify-between gap-4">
                <p
                  className={`${khInterferenceRegularFont.className} max-w-[175px] 
                  text-left text-[12px] tracking-widest 
                  sm:text-right sm:leading-[1.05] text-black`}
                >
                  {activeCategory.description}
                </p>

                <Link
                  href={activeCategory.href}
                  className="inline-flex min-h-[82px] min-w-[118px] 
                  items-start justify-between rounded-[10px] bg-[#d2ff00] 
                  px-4 py-3 text-black transition-transform duration-200 
                  hover:scale-[1.02]"
                >
                  <span
                    className={`${khInterferenceRegularFont.className} text-left text-[16px] uppercase leading-[0.95]`}
                  >
                    VER
                    <br />
                    CATEGORIAS
                  </span>
                  <span className="text-lg leading-none">-&gt;</span>
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {categoryCards.map((category) => (
                  <CategoryTab
                    key={category.key}
                    label={category.label}
                    isActive={category.key === activeCategory.key}
                    onClick={() => setActiveCategoryKey(category.key)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ChooseCategory;
