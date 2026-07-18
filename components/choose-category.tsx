"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { AnimatePresence, motion } from "motion/react";
import { useGetCategories } from "@/api/useGetCategories";
import type { CategoryType } from "@/types/category";
import { toAbsUrl } from "@/lib/media";
import { fadeUp } from "@/lib/fade-up";
import {
  khInterferenceLightFont,
  khInterferenceRegularFont,
  khInterferenceBoldFont
} from "@/app/(routes)/cart/components/cart-fonts";

const maratypeFont = localFont({
  src: "./fonts/Maratype.otf",
  display: "swap",
});

type CategoryKey = "libros" | "soporte" | "geek";

type CategoryVisualConfig = {
  key: CategoryKey;
  label: string;
  fallbackSlug: string;
  matches: string[];
  description: string;
  fallbackImages: string[];
};

type CategoryCardData = {
  key: CategoryKey;
  label: string;
  href: string;
  description: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
};

// Esta configuracion fija el orden visual de las tres pestanas y mantiene
// contenido de respaldo mientras Strapi no tenga una categoria o imagen cargada.
const CATEGORY_VISUALS: CategoryVisualConfig[] = [
  {
    key: "libros",
    label: "LIBROS",
    fallbackSlug: "libros",
    matches: ["libros", "libro"],
    description:
      "Encuentra una amplia variedad de productos para tus libros, desde separadores hasta accesorios. Descubre articulos de tus series favoritas.",
    fallbackImages: ["/01.jpg", "/03.png", "/02.jpg"],
  },
  {
    key: "soporte",
    label: "SOPORTE",
    fallbackSlug: "soporte",
    matches: ["soporte", "soportes"],
    description:
      "Descubre soportes y accesorios funcionales para organizar, exhibir y aprovechar mejor tus espacios.",
    fallbackImages: ["/soporte.png", "/dispensador.png", "/imagen2.png"],
  },
  {
    key: "geek",
    label: "GEEK",
    fallbackSlug: "geek",
    matches: ["geek"],
    description:
      "Descubre articulos de tus series favoritas con piezas decorativas, figuras y detalles para coleccionar.",
    fallbackImages: ["/ss.jfif", "/culst.png", "/545864729_781082927834530_93935471925152915_n.webp"],
  },
];

// Animacion que se reutiliza al cambiar de categoria: reemplaza texto e imagenes
// con una transicion corta, evitando que el bloque salte bruscamente.
const categorySwapVariants = {
  initial: {
    opacity: 0,
    y: 8,
    filter: "blur(6px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    filter: "blur(4px)",
    transition: {
      duration: 0.35,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
};

function normalizeText(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

// Relaciona una categoria real de Strapi con una de las pestanas configuradas,
// tolerando diferencias de mayusculas, acentos y nombres en singular/plural.
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

// Obtiene las imagenes multiples de `mainImages` desde Strapi. Si todavia no
// existen, usa los recursos de public definidos arriba para que la seccion no
// quede vacia. El relleno final asegura tres imagenes en escritorio.
function getCategoryImages(
  config: CategoryVisualConfig,
  category?: CategoryType
): CategoryCardData["images"] {
  const strapiImages =
    category?.mainImages
      ?.map((image) => {
        const src = toAbsUrl(image.url);
        if (!src) return null;

        return {
          src,
          alt: image.alternativeText || `${category.categoryName} categoria`,
        };
      })
      .filter(Boolean) ?? [];

  const images = strapiImages.length
    ? (strapiImages as CategoryCardData["images"])
    : config.fallbackImages.map((src) => ({
        src,
        alt: `${config.label} categoria`,
      }));

  while (images.length < 3) {
    images.push(images[images.length - 1] ?? {
      src: config.fallbackImages[0],
      alt: `${config.label} categoria`,
    });
  }

  return images;
}

// Convierte los datos remotos y los respaldos visuales en los datos simples que
// consume la interfaz: etiqueta, enlace, descripcion e imagenes por categoria.
function buildCategoryCards(categories: CategoryType[]): CategoryCardData[] {
  return CATEGORY_VISUALS.map((config) => {
    const matchedCategory = findCategoryByConfig(config, categories);
    const slug = matchedCategory?.slug ?? config.fallbackSlug;

    return {
      key: config.key,
      label: config.label,
      href: `/category/${slug}`,
      description: matchedCategory?.description || config.description,
      images: getCategoryImages(config, matchedCategory),
    };
  });
}

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
    // Boton de cada categoria. `isActive` cambia el fondo a negro para indicar
    // que descripcion, enlace e imagenes estan mostrando esa seleccion.
    <button
      type="button"
      onClick={onClick}
      className={`${khInterferenceRegularFont.className}
       h-[26px] min-w-[56px] cursor-pointer
       bg-[#e7e7e7] px-3
       text-[12px] uppercase leading-[22px] text-black
       transition-colors hover:bg-[#dcdcdc]
       ${
        isActive ? "bg-black text-white hover:bg-black" : ""
      }
       md:h-[40px] md:min-w-[84px] md:px-4 md:text-[18px] md:leading-[30px]`}
    >
      {label}
    </button>
  );
}

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
    // Contenedor con altura controlada por quien lo usa. `fill` hace que la
    // fotografia cubra todo el bloque sin cambiar las proporciones del layout.
    <div className={`relative overflow-hidden bg-zinc-100 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
      />
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    // Placeholder exclusivo de escritorio: conserva el ancho de las tres
    // columnas mientras llega la respuesta de categorias desde Strapi.
    <div className="mt-9 grid grid-cols-[1.45fr_1.35fr_0.9fr] gap-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-[clamp(285px,32vw,430px)] animate-pulse bg-zinc-200"
        />
      ))}
    </div>
  );
}

const ChooseCategory = () => {
  // Hook que trae categorias y sus `mainImages` desde Strapi.
  const { categories, loading, error } = useGetCategories();
  // Solo recalcula los datos visuales cuando cambia la respuesta del backend.
  const categoryCards = useMemo(
    () => buildCategoryCards(categories),
    [categories]
  );
  const [activeCategoryKey, setActiveCategoryKey] =
    useState<CategoryKey>("libros");

  // La categoria activa alimenta ambas versiones de la seccion. El fallback
  // evita una pantalla vacia durante la carga inicial de datos.
  const activeCategory =
    categoryCards.find((category) => category.key === activeCategoryKey) ??
    categoryCards[0];

  return (
    // BLOQUE: CONTENEDOR DE CATEGORIAS
    // Define el ancho maximo y los margenes internos compartidos con Inicio.
    <section
      className="
        mx-auto max-w-[1350px] bg-white px-4 py-10
        sm:px-6 sm:py-14
        lg:px-0
      "
    >
      <div className="w-full">
        {error && (
          <p className="mb-4 text-xs text-red-600">
            Ocurrio un problema cargando las categorias.
          </p>
        )}

        {/* BLOQUE ESCRITORIO: se activa desde md y muestra tres imagenes horizontales. */}
        <div className="hidden md:block">
          {/* TITULO: nombre fijo de la seccion y animacion de entrada. */}
          <motion.h3
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.85 }}
            className={`${khInterferenceBoldFont.className}
              text-4xl leading-none text-black
              lg:text-5xl`}
          >
            CATEGORIAS
          </motion.h3>

          {/* CONTENIDO SUPERIOR: selector, descripcion y enlace de la categoria activa. */}
          <div className="mt-5 flex gap-8">
            <div className="w-[550px]">
              {/* SELECTOR: actualiza `activeCategoryKey` al elegir Libros, Soporte o Geek. */}
              <div className="flex gap-2 ">
                {categoryCards.map((category) => (
                  <CategoryTab
                    key={category.key}
                    label={category.label}
                    isActive={category.key === activeCategory?.key}
                    onClick={() => setActiveCategoryKey(category.key)}
                  />
                ))}
              </div>

              {/* DESCRIPCION: cambia con la categoria activa y usa la animacion definida arriba. */}
              <AnimatePresence mode="wait" initial={false}>
                {activeCategory && (
                  <motion.p
                    key={`desktop-copy-${activeCategory.key}`}
                    variants={categorySwapVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`${khInterferenceLightFont.className}
                      mt-10 max-w-[700px]
                      text-[18px] uppercase leading-[1.08] text-black/65`}
                  >
                    {activeCategory.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {activeCategory && (
              // CTA: redirige al catalogo filtrado de la categoria seleccionada.
              <div className="ml-auto flex items-end pb-1">
                <Link
                  href={activeCategory.href}
                  className={`${khInterferenceRegularFont.className}
                    flex h-[58px] w-[155px] items-center
                    bg-[#b7ff00] px-6
                    text-[18px] uppercase leading-[1.05] text-black
                    transition-transform hover:text-white`}
                >
                  VER
                  <br />
                  CATEGORIAS
                </Link>
              </div>
            )}
          </div>

          {/* CARGA DE IMAGENES: conserva el alto de la grilla antes de recibir Strapi. */}
          {loading && <CategoriesSkeleton />}

          {!loading && activeCategory && (
            <AnimatePresence mode="wait" initial={false}>
              {/* IMAGENES: toma las tres primeras `mainImages` de la categoria activa. */}
              <motion.div
                key={`desktop-images-${activeCategory.key}`}
                variants={categorySwapVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mt-9 grid grid-cols-[1.45fr_1.35fr_0.9fr] gap-3"
              >
                {activeCategory.images.slice(0, 3).map((image, index) => (
                  <CategoryImageTile
                    key={`${activeCategory.key}-${image.src}-${index}`}
                    src={image.src}
                    alt={image.alt}
                    className="h-[clamp(285px,32vw,430px)]"
                    priority={index === 0}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* BLOQUE MOVIL: se muestra antes de md y apila solo dos imagenes. */}
        <div className="md:hidden">
          <div className="flex items-start justify-between gap-4">
            {/* TITULO MOVIL */}
            <motion.h3
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.85 }}
              className={`${khInterferenceRegularFont.className}
                text-[34px] leading-none text-black`}
            >
              CATEGORIAS
            </motion.h3>

            {activeCategory && (
              // CTA MOVIL: mantiene el enlace compacto junto al titulo.
              <Link
                href={activeCategory.href}
                className={`${khInterferenceRegularFont.className}
                  flex h-[40px] w-[100px] items-center
                  bg-[#b7ff00] px-2
                  text-[14px] uppercase leading-[0.95] text-black`}
              >
                VER
                <br />
                CATEGORIAS
              </Link>
            )}
          </div>

          {/* SELECTOR MOVIL: utiliza las mismas pestanas y estado del escritorio. */}
          <div className="mt-4 flex gap-2">
            {categoryCards.map((category) => (
              <CategoryTab
                key={category.key}
                label={category.label}
                isActive={category.key === activeCategory?.key}
                onClick={() => setActiveCategoryKey(category.key)}
              />
            ))}
          </div>

          {/* DESCRIPCION MOVIL: ancho limitado para conservar la composicion del diseno. */}
          <AnimatePresence mode="wait" initial={false}>
            {activeCategory && (
              <motion.p
                key={`mobile-copy-${activeCategory.key}`}
                variants={categorySwapVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`${khInterferenceLightFont.className}
                  mt-5 max-w-[410px]
                  text-[14px] uppercase 
                  leading-[1.1] text-black/65`}
              >
                {activeCategory.description}
              </motion.p>
            )}
          </AnimatePresence>

          {/* CARGA MOVIL: replica las alturas de las fotos finales para evitar saltos. */}
          {loading && (
            <div className="mt-3 space-y-1">
              <div className="h-[207px] animate-pulse bg-zinc-200" />
              <div className="h-[280px] animate-pulse bg-zinc-200" />
            </div>
          )}

          {!loading && activeCategory && (
            <AnimatePresence mode="wait" initial={false}>
              {/* IMAGENES MOVIL: muestra las dos primeras fotos en formato vertical. */}
              <motion.div
                key={`mobile-images-${activeCategory.key}`}
                variants={categorySwapVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mt-3 space-y-1"
              >
                {activeCategory.images.slice(0, 2).map((image, index) => (
                  <CategoryImageTile
                    key={`${activeCategory.key}-${image.src}-${index}`}
                    src={image.src}
                    alt={image.alt}
                    className={index === 0 ? "h-[207px]" : "h-[280px]"}
                    priority={index === 0}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChooseCategory;
