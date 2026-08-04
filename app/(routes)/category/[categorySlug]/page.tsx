"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import localFont from "next/font/local";
import {
  ArrowDownNarrowWide,
  ArrowUpDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import ScrollReveal from "@/components/animation_page/scroll-reveal";
import SmoothScroll from "@/components/animation_page/smooth-scroll";
import { Separator } from "@/components/ui/separator";
import { ProductCardSkeleton } from "@/components/skeleton-product";
import { useGetCategories } from "@/api/useGetCategories";
import { useGetCategoryProduct } from "@/api/useGetCategoryProducts";
import type { ProductType } from "@/types/product";
import FilterCategory from "./components/filter-category";
import SearchBar from "./components/searchBar";
import ProductCard from "./components/product-card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
} from "@/components/ui/drawer";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

/*
 * FILTROS MOVILES DEL CATALOGO
 * Este archivo concentra la interfaz y la logica movil: buscador, categoria,
 * subcategorias, colecciones y orden. Los componentes `filter-category.tsx`
 * y `searchBar.tsx` se usan solamente desde el sidebar de escritorio.
 */

// TIPOS DE RESPUESTA
// Permiten leer productos aunque Strapi los entregue planos o dentro de `attributes`.
type ProductWithOptionalAttributes = ProductType & {
  id?: number | string;
  attributes?: {
    productName?: string | null;
    productName2?: string | null;
  };
  productName?: string | null;
  productName2?: string | null;
};

type SortOption = "default" | "price-asc" | "price-desc" | "recent";
type CollectionKey = "lord-of-the-rings";

type CollectionOption = {
  key: CollectionKey;
  label: string;
  query: string;
};

// TIPOGRAFIA DEL CATALOGO
// Un unico punto para cambiar la fuente de filtros, controles y textos de interfaz.
const khInterferenceRegularFont = localFont({
  src: "../../../../components/fonts/KHInterferenceTRIAL-Regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
});

// OPCIONES DE ORDEN
// El `value` se envia al hook de productos; `label` es lo que ve el cliente.
const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "Relevancia" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "recent", label: "Mas reciente" },
];

// COLECCIONES DESTACADAS
// Cada coleccion filtra por su texto configurado sin cambiar la categoria principal.
const collectionOptions: CollectionOption[] = [
  {
    key: "lord-of-the-rings",
    label: "EL SEÑOR DE LOS ANILLOS",
    query: "el señor de los anillos",
  },
];

// NORMALIZAR BUSQUEDA
// Quita acentos y diferencias de mayusculas para que las coincidencias sean mas naturales.
function normalizeFilterText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export default function Page() {
  // URL Y NAVEGACION
  // `categorySlug` determina la categoria actual y router cambia de categoria desde los filtros.
  const params = useParams();
  const router = useRouter();
  const { categorySlug } = params as { categorySlug: string };

  // ESTADOS DE FILTRO
  // Categoria/subcategoria, busqueda, coleccion, orden y pagina gobiernan la consulta de productos.
  const [activeSubSlug, setActiveSubSlug] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCollectionKey, setActiveCollectionKey] =
    useState<CollectionKey | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState(1);
  // ESTADOS MOVILES
  // Controlan que panel esta abierto y si el titulo central se reemplaza por el buscador.
  const [mobileCategoryDrawerOpen, setMobileCategoryDrawerOpen] = useState(false);
  const [mobileSortDrawerOpen, setMobileSortDrawerOpen] = useState(false);
  const [expandedMobileCategorySlug, setExpandedMobileCategorySlug] =
    useState<string | null>(categorySlug);
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  // SUBCATEGORIA PENDIENTE
  // Conserva una subcategoria si el usuario primero navega a otra categoria desde movil.
  const pendingMobileSubcategoryRef = useRef<{
    categorySlug: string;
    subcategorySlug: string;
  } | null>(null);
  // CATEGORIAS DE STRAPI
  // Alimentan los filtros laterales y el drawer de categorias en movil.
  const {
    categories,
    loading: loadingCategories,
    error: categoriesError,
  } = useGetCategories();

  useEffect(() => {
    // REINICIO AL CAMBIAR DE CATEGORIA
    // Limpia filtros incompatibles, cierra drawers y restablece la pagina uno.
    const pendingSubcategory = pendingMobileSubcategoryRef.current;
    const nextSubcategorySlug =
      pendingSubcategory?.categorySlug === categorySlug
        ? pendingSubcategory.subcategorySlug
        : null;

    setActiveSubSlug(nextSubcategorySlug);
    setSearchTerm("");
    setActiveCollectionKey(null);
    setSortBy("default");
    setCurrentPage(1);
    setMobileCategoryDrawerOpen(false);
    setMobileSortDrawerOpen(false);
    setExpandedMobileCategorySlug(categorySlug);
    setShowSearchMobile(false);

    if (nextSubcategorySlug) {
      pendingMobileSubcategoryRef.current = null;
    }
  }, [categorySlug]);

  // COLECCION ACTIVA
  // Obtiene los metadatos de la coleccion seleccionada para mostrar etiqueta y buscar productos.
  const activeCollection =
    collectionOptions.find((collection) => collection.key === activeCollectionKey) ??
    null;

  // PARAMETROS DE CONSULTA
  // Una busqueda escrita siempre consulta "todos los productos", sin limitarse a la categoria actual.
  const isGlobalSearch = searchTerm.trim().length > 0;
  const fetchSearchTerm = isGlobalSearch ? searchTerm : activeCollection?.query ?? "";

  // CONSULTA DE PRODUCTOS
  // Cualquier cambio de filtros o pagina vuelve a consultar al backend a traves de este hook.
  const { products, loading, error, totalPages } = useGetCategoryProduct({
    categorySlug: isGlobalSearch ? "todos-los-productos" : categorySlug,
    subSlug: isGlobalSearch ? null : activeSubSlug,
    page: currentPage,
    pageSize: 8,
    searchTerm: fetchSearchTerm,
    sortBy,
  });
  const showInitialProductsLoading = loading && products.length === 0;
  const showProducts = products.length > 0 || (!loading && !error);

  const handleSelectSubcategory = (slugSub: string | null) => {
    setActiveSubSlug(slugSub);
    setSearchTerm("");
    setActiveCollectionKey(null);
    setCurrentPage(1);
  };

  const mobileCategoryLabel = useMemo(() => {
    if (activeSubSlug) {
      for (const category of categories) {
        const subcategory = category.subcategories?.find(
          (item) => item.slug === activeSubSlug
        );

        if (subcategory) return subcategory.categoryName;
      }
    }

    return (
      categories.find((category) => category.slug === categorySlug)?.categoryName ??
      "TODOS LOS PRODUCTOS"
    );
  }, [activeSubSlug, categories, categorySlug]);

  // FILTRO LOCAL COMPLEMENTARIO
  // Revisa nombre y subtitulo por si la respuesta remota requiere una coincidencia adicional en pantalla.
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    const typedProducts = products as ProductWithOptionalAttributes[];
    const term = normalizeFilterText(searchTerm);
    const collectionTerm = normalizeFilterText(activeCollection?.query ?? "");

    if (term === "" && collectionTerm === "") return typedProducts;

    return typedProducts.filter((product) => {
      const attributes = product.attributes ?? product;
      const name = normalizeFilterText(String(attributes.productName ?? ""));
      const name2 = normalizeFilterText(String(attributes.productName2 ?? ""));
      const matchesSearch =
        term === "" || name.includes(term) || name2.includes(term);
      const matchesCollection =
        collectionTerm === "" ||
        name.includes(collectionTerm) ||
        name2.includes(collectionTerm);

      return matchesSearch && matchesCollection;
    });
  }, [products, searchTerm, activeCollection]);

  // NAVEGACION DE PAGINAS
  // Valida limites antes de actualizar la pagina solicitada.
  const goToPage = (page: number) => {
    if (page < 1) return;
    if (page > totalPages) return;

    setCurrentPage(page);
  };

  const handlePrev = () => goToPage(currentPage - 1);
  const handleNext = () => goToPage(currentPage + 1);

  // CAMBIAR ORDEN
  // Reinicia a la primera pagina para evitar que un nuevo orden muestre una pagina invalida.
  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
    setCurrentPage(1);
  };

  // ACTIVAR COLECCION
  // Un segundo click desactiva la coleccion; ambos casos reinician la paginacion.
  const handleCollectionToggle = (key: CollectionKey) => {
    setActiveCollectionKey((current) => (current === key ? null : key));
    setCurrentPage(1);
  };

  // CONTROL DE COLECCIONES
  // Se reutiliza en escritorio y en drawer movil. `compact` adapta su ancho al contenedor.
  const CollectionControl = ({ compact = false }: { compact?: boolean }) => (
    <div
      className={`flex items-center gap-4 text-black ${
        compact ? "w-full flex-col items-start" : ""
      }`}
    >
      <span
        className={`${khInterferenceRegularFont.className} text-xl uppercase leading-none tracking-[0] sm:text-2xl`}
      >
        COLECCIONES
      </span>

      <div className="flex flex-wrap gap-2">
        {collectionOptions.map((collection) => {
          const isActive = activeCollectionKey === collection.key;

          return (
            <button
              key={collection.key}
              type="button"
              onClick={() => handleCollectionToggle(collection.key)}
              className={`${khInterferenceRegularFont.className} h-10 border px-5 text-sm uppercase leading-none tracking-[0] transition ${
                isActive
                  ? "border-black bg-black text-white"
                  : "border-black/70 bg-white text-black hover:border-black hover:bg-black hover:text-white"
              } ${compact ? "w-full justify-center" : ""}`}
            >
              {collection.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  // CONTROL DE ORDEN
  // Editar `h-[44px]` cambia la altura. El select usa borde recto para coincidir con el catalogo.
  const SortControl = ({ compact = false }: { compact?: boolean }) => (
    <label
      className={`flex h-[40px] items-center gap-3 text-black ${
        compact ? "w-full" : "justify-end"
      }`}
    >
      
      <span className="sr-only">Ordenar por</span>
      <select
        value={sortBy}
        onChange={(event) => handleSortChange(event.target.value)}
        className={`
          ${khInterferenceRegularFont.className}
          h-full cursor-pointer appearance-auto border border-black/40 
          bg-white px-8
          text-[12px] uppercase tracking-[0.14em] outline-none transition-colors
          hover:bg-neutral-100 focus:bg-neutral-100
          ${compact ? "w-full" : "min-w-[210px]"}
        `}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );

  // COLECCIONES MOVILES
  // Barra horizontal con scroll. `overflow-x-auto` evita comprimir los botones
  // y `h-10` controla la altura visible de cada coleccion en movil.
  const MobileCollectionControl = () => (
    <div
      className="
        flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1
        [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden
      "
    >
      {collectionOptions.map((collection) => {
        const isActive = activeCollectionKey === collection.key;

        return (
          <button
            key={collection.key}
            type="button"
            onClick={() => handleCollectionToggle(collection.key)}
            className={`
              ${khInterferenceRegularFont.className}
              h-10 shrink-0  border border-black
              bg-black px-5 text-xs uppercase leading-none text-white
              transition hover:bg-white hover:text-black
              ${isActive ? "ring-2 ring-black ring-offset-2" : ""}
            `}
          >
            {collection.label}
          </button>
        );
      })}
    </div>
  );

  // SELECCIONAR CATEGORIA MOVIL
  // Cierra el drawer, limpia filtros y navega a la categoria elegida.
  const selectMobileCategory = (slug: string) => {
    setMobileCategoryDrawerOpen(false);
    setExpandedMobileCategorySlug(slug);
    setActiveSubSlug(null);
    setSearchTerm("");
    setActiveCollectionKey(null);
    setCurrentPage(1);
    router.push(`/category/${slug}`);
  };

  // SELECCIONAR SUBCATEGORIA MOVIL
  // Si cambia de categoria, guarda temporalmente la subcategoria para aplicarla tras la navegacion.
  const selectMobileSubcategory = (
    selectedCategorySlug: string,
    selectedSubcategorySlug: string
  ) => {
    setMobileCategoryDrawerOpen(false);

    if (selectedCategorySlug === categorySlug) {
      handleSelectSubcategory(selectedSubcategorySlug);
      return;
    }

    pendingMobileSubcategoryRef.current = {
      categorySlug: selectedCategorySlug,
      subcategorySlug: selectedSubcategorySlug,
    };
    router.push(`/category/${selectedCategorySlug}`);
  };

  return (
    // CONTENEDOR PRINCIPAL
    // Los paddings `md` y `lg` controlan el margen del catalogo en pantallas grandes.
    <SmoothScroll>
      <section className="w-full px-0 pb-28 pt-25 md:px-8 
      md:pb-0 lg:px-12 lg:pt-30">
        
        {/* ================================================================
            FILTRO MOVIL: BARRA SUPERIOR
            `md:hidden` hace que este control exista solo en celulares.
            Incluye buscador, categoria activa, colecciones y orden.
           ================================================================ */}
        <ScrollReveal delay={0.08}>
          <div className="bg-white px-5 pb-5 pt-6 md:hidden">
            {/* FILA PRINCIPAL: `56px` controla el tamano de ambos botones circulares. */}
            <div
              className="
                grid grid-cols-[56px_minmax(0,1fr)_56px]
                items-center gap-3
              "
            >
              {/* BOTON BUSCAR: alterna entre el nombre de categoria y el input de texto. */}
              <button
                type="button"
                aria-label={showSearchMobile ? "Cerrar buscador" : "Buscar productos"}
                aria-expanded={showSearchMobile}
                className="
                  flex h-14 w-14 items-center justify-center 
                  
                text-black
                  
                "
                onClick={() => {
                  setShowSearchMobile((value) => !value);
                  setMobileCategoryDrawerOpen(false);
                  setMobileSortDrawerOpen(false);
                }}
              >
                {showSearchMobile ? (
                  <X className="h-6 w-6" strokeWidth={2} />
                ) : (
                  <Search className="h-6 w-6" strokeWidth={2} />
                )}
              </button>

              {/* CENTRO: muestra el input al buscar o el nombre de la categoria activa. */}
              {showSearchMobile ? (
                <label
                  className={`
                    ${khInterferenceRegularFont.className}
                    flex h-14 min-w-0 items-center 
                    border border-black px-3
                    text-xs uppercase text-black
                  `}
                  htmlFor="catalog-mobile-search"
                >
                  <span className="sr-only">Buscar productos</span>
                  <input
                    id="catalog-mobile-search"
                    autoFocus
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setActiveCollectionKey(null);
                      setCurrentPage(1);
                    }}
                    placeholder="BUSCAR"
                    className="
                      min-w-0 flex-1 bg-transparent
                      text-xs uppercase outline-none
                      placeholder:text-black/45
                    "
                  />
                </label>
              ) : (
                <div
                  className={`
                    ${khInterferenceRegularFont.className}
                    flex h-12 min-w-0 items-center justify-center 
                    border border-black/20 px-3
                    text-center text-xs uppercase leading-none text-black
                  `}
                >
                  <span className="line-clamp-2">{mobileCategoryLabel}</span>
                </div>
              )}

              {/* BOTON FILTROS: abre el drawer inferior con categorias y subcategorias. */}
              <button
                type="button"
                aria-label="Filtrar por categoria"
                aria-expanded={mobileCategoryDrawerOpen}
                className="
                  flex h-14 w-14 items-center justify-center 
                text-black
                  
                "
                onClick={() => {
                  setMobileCategoryDrawerOpen(true);
                  setMobileSortDrawerOpen(false);
                }}
              >
                <SlidersHorizontal className="h-6 w-6" strokeWidth={2} />
              </button>
            </div>

            {/*
              FILA SECUNDARIA: la columna final de 56px replica el eje del
              boton de filtros superior y mantiene ambos iconos alineados.
            */}
            <div
              className="
                mt-5 grid grid-cols-[minmax(0,1fr)_56px]
                items-center gap-3
              "
            >
              <MobileCollectionControl />
              <button
                type="button"
                aria-label="Ordenar productos"
                aria-expanded={mobileSortDrawerOpen}
                className="
                  flex h-14 w-14 items-center justify-center
                  text-black
                "
                onClick={() => {
                  setMobileSortDrawerOpen(true);
                  setMobileCategoryDrawerOpen(false);
                }}
              >
                <ArrowDownNarrowWide className="h-6 w-6" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* ================================================================
            FILTRO MOVIL: DRAWER DE CATEGORIAS
            Panel inferior. `max-h-[82vh]` limita su altura y `overflow-y-auto`
            habilita el scroll interno al existir muchas categorias.
           ================================================================ */}
        <Drawer
          open={mobileCategoryDrawerOpen}
          onOpenChange={setMobileCategoryDrawerOpen}
          direction="bottom"
        >
          <DrawerContent
            className="
              max-h-[82vh] overflow-y-auto rounded-t-[18px] border-t-0
              bg-[#090909] p-0 text-white
              md:hidden
              [&>div:first-child]:hidden
            "
          >
            {/* CIERRE DEL DRAWER: cambiar `right-5` o `top-5` mueve la X. */}
            <DrawerClose
              className="
                absolute right-5 top-5 z-10 text-white/80
                transition-colors hover:text-white
              "
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Cerrar categorias</span>
            </DrawerClose>

            <div className="px-6 pb-9 pt-10">
              {/* TITULO DEL PANEL: cambiar `text-2xl` modifica solo este encabezado. */}
              <h2 className={`${khInterferenceRegularFont.className} text-2xl uppercase`}>
                Categorias
              </h2>

              <div className="mt-7 space-y-2">
                {/* TODOS LOS PRODUCTOS: limpia la categoria actual y recupera el catalogo completo. */}
                <div className="border-b border-white/15 pb-2">
                  <button
                    type="button"
                    onClick={() => selectMobileCategory("todos-los-productos")}
                    className={`${khInterferenceRegularFont.className} flex w-full items-center justify-between py-3 text-left text-sm uppercase transition ${
                      categorySlug === "todos-los-productos"
                        ? "text-[#adff00]"
                        : "text-white hover:text-white/60"
                    }`}
                  >
                    Todos los productos
                    <span className="text-white/45">
                      {categorySlug === "todos-los-productos" ? "ACTIVA" : ""}
                    </span>
                  </button>
                </div>

                {loadingCategories && (
                  <p className={`${khInterferenceRegularFont.className} py-4 text-xs uppercase text-white/50`}>
                    Cargando categorias...
                  </p>
                )}

                {!loadingCategories && categoriesError && (
                  <p className={`${khInterferenceRegularFont.className} py-4 text-xs uppercase text-red-300`}>
                    No se pudieron cargar las categorias.
                  </p>
                )}

                {/* LISTA DE CATEGORIAS: permite expandir subcategorias antes de navegar. */}
                {!loadingCategories && !categoriesError && categories.map((category) => {
                  const isCurrentCategory = category.slug === categorySlug;
                  const hasSubcategories = Boolean(category.subcategories?.length);
                  const isExpanded = expandedMobileCategorySlug === category.slug;

                  return (
                    <div key={category.id} className="border-b border-white/15 pb-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!hasSubcategories) {
                            selectMobileCategory(category.slug);
                            return;
                          }

                          setExpandedMobileCategorySlug((current) =>
                            current === category.slug ? null : category.slug
                          );
                        }}
                        className={`
                          ${khInterferenceRegularFont.className}
                          flex w-full items-center justify-between py-3
                          text-left text-sm uppercase transition
                          ${
                            isCurrentCategory
                              ? "text-[#ADFE00]"
                              : "text-white hover:text-white/60"
                          }
                        `}
                      >
                        {category.categoryName}
                        <span className="text-white/45">
                          {hasSubcategories
                            ? isExpanded
                              ? "-"
                              : "+"
                            : isCurrentCategory
                              ? "ACTIVA"
                              : ""}
                        </span>
                      </button>

                      {isExpanded && category.subcategories?.length ? (
                        <div className="pb-2 pl-3">
                          <button
                            type="button"
                            onClick={() => selectMobileCategory(category.slug)}
                            className={`
                              ${khInterferenceRegularFont.className}
                              block w-full py-2 text-left text-xs uppercase
                              text-white/80 transition hover:text-[#ADFE00]
                            `}
                          >
                            Ver todo en {category.categoryName}
                          </button>

                          {category.subcategories.map((subcategory) => (
                            <button
                              key={subcategory.id}
                              type="button"
                              onClick={() => selectMobileSubcategory(category.slug, subcategory.slug)}
                              className={`
                                ${khInterferenceRegularFont.className}
                                block w-full py-2 text-left text-xs uppercase
                                transition
                                ${
                                  isCurrentCategory &&
                                  activeSubSlug === subcategory.slug
                                    ? "text-[#ADFE00]"
                                    : "text-white/55 hover:text-white"
                                }
                              `}
                            >
                              {subcategory.categoryName}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* ================================================================
            FILTRO MOVIL: DRAWER DE ORDEN
            Lista las opciones de orden. Al elegir una, se cierra el panel y
            el catalogo solicita nuevamente sus productos ordenados.
           ================================================================ */}
        <Drawer
          open={mobileSortDrawerOpen}
          onOpenChange={setMobileSortDrawerOpen}
          direction="bottom"
        >
          <DrawerContent
            className="
              max-h-[62vh] overflow-y-auto rounded-t-[18px] border-t-0
              bg-[#090909] p-0 text-white
              md:hidden
              [&>div:first-child]:hidden
            "
          >
            {/* CIERRE DEL DRAWER DE ORDEN. */}
            <DrawerClose
              className="
                absolute right-5 top-5 z-10 text-white/80
                transition-colors hover:text-white
              "
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Cerrar ordenamiento</span>
            </DrawerClose>

            <div className="px-6 pb-9 pt-10">
              {/* TITULO DEL PANEL DE ORDEN. */}
              <h2 className={`${khInterferenceRegularFont.className} text-2xl uppercase`}>
                Ordenar por
              </h2>

              <div className="mt-7 space-y-2">
                {sortOptions.map((option) => {
                  const isActive = sortBy === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        handleSortChange(option.value);
                        setMobileSortDrawerOpen(false);
                      }}
                      className={`
                        ${khInterferenceRegularFont.className}
                        flex w-full items-center justify-between rounded-lg
                        border px-4 py-3 text-left text-sm uppercase transition
                        ${
                          isActive
                            ? "border-[#ADFE00] bg-[#ADFE00] text-black"
                            : "border-white/20 text-white hover:border-white/60"
                        }
                      `}
                    >
                      {option.label}
                      {isActive ? <span>ACTIVO</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </DrawerContent>
        </Drawer>

       

        {/* ESTRUCTURA DE ESCRITORIO
            Desde md aparece sidebar de filtros a la izquierda y productos a la derecha. */}
        <ScrollReveal delay={0.16}>
          <div className="grid grid-cols-1 md:grid-cols-[205px_1fr] shadow-none gap-4">
            {/* SIDEBAR: buscador y arbol de categorias. `p-4` controla su aire interior. */}
            <aside className="hidden p-4 text-sm md:block">
              <div className="mb-5">
                <SearchBar
                  value={searchTerm}
                  onChange={(value) => {
                    setSearchTerm(value);
                    setActiveCollectionKey(null);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <FilterCategory
                categorySlug={categorySlug}
                activeSubSlug={activeSubSlug}
                categories={categories}
                loading={loadingCategories}
                error={categoriesError}
                onSelectSubcategory={handleSelectSubcategory}
              />
            </aside>

            {/* AREA DE RESULTADOS: controles, grilla, estados y paginacion. */}
            <main className="w-auto px-0 shadow-none md:p-2">
              {/* CONTROLES ESCRITORIO: colecciones a la izquierda y selector Relevancia a la derecha. */}
              <div className="mb-3 hidden items-center 
              justify-between gap-6 md:flex">
                <CollectionControl />
                <SortControl />
              </div>

              {/* CARGA INICIAL: skeletons con la misma grilla final para evitar saltos visuales. */}
              {showInitialProductsLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-1">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <ProductCardSkeleton
                      key={`catalog-product-skeleton-${index}`}
                    />
                  ))}
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm">
                  Error cargando productos.
                </p>
              )}

              {/* GRILLA DE PRODUCTOS
                  Los breakpoints `md`, `xl` y `2xl` cambian cuantas tarjetas se ven por fila. */}
              {showProducts && !error && (
                <>
                  <div
                    className={`
                      grid
                      grid-cols-2
                      pr-0
                      sm:pr-0
                      sm:grid-cols-2
                      xl:grid-cols-3
                      md:grid-cols-3
                      2xl:grid-cols-4
                      min-[1600px]:grid-cols-4
                      gap-1
                      sm:gap-3
                      rounded-none
                      flex-wrap
                      transition-opacity duration-200
                      ${loading ? "opacity-60" : "opacity-100"}
                    `}
                  >
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <ProductCard key={String(product.id)} product={product} />
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No encontramos productos que coincidan con{" "}
                        {activeCollection?.label ?? searchTerm}.
                      </p>
                    )}
                  </div>

                  {/* PAGINACION: solo se muestra si el backend informa mas de una pagina. */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination>
                        <PaginationContent className="flex flex-wrap gap-2">
                          <PaginationItem>
                            <button
                              onClick={handlePrev}
                              disabled={currentPage === 1}
                              className={`px-3 py-2 rounded-md text-sm ${
                                currentPage === 1
                                  ? "cursor-not-allowed opacity-50"
                                  : "hover:bg-accent hover:text-accent-foreground"
                              }`}
                            >
                              <PaginationPrevious />
                            </button>
                          </PaginationItem>

                          {Array.from({ length: totalPages }).map((_, index) => {
                            const pageNum = index + 1;
                            const isActive = pageNum === currentPage;

                            return (
                              <PaginationItem key={pageNum}>
                                <button
                                  onClick={() => goToPage(pageNum)}
                                  className={`px-3 py-2 rounded-md text-sm ${
                                    isActive
                                      ? "text-black border"
                                      : "hover:bg-accent hover:text-accent-foreground"
                                  }`}
                                >
                                  <PaginationLink isActive={isActive}>
                                    {pageNum}
                                  </PaginationLink>
                                </button>
                              </PaginationItem>
                            );
                          })}

                          <PaginationItem>
                            <button
                              onClick={handleNext}
                              disabled={currentPage === totalPages}
                              className={`px-3 py-2 rounded-md border text-sm ${
                                currentPage === totalPages
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:bg-accent hover:text-accent-foreground"
                              }`}
                            >
                              <PaginationNext />
                            </button>
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </ScrollReveal>
      </section>
    </SmoothScroll>
  );
}
