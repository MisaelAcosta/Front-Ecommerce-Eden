"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import localFont from "next/font/local";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

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

const khInterferenceRegularFont = localFont({
  src: "../../../../components/fonts/KHInterferenceTRIAL-Regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
});

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "Relevancia" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "recent", label: "Mas reciente" },
];

const collectionOptions: CollectionOption[] = [
  {
    key: "lord-of-the-rings",
    label: "EL SEÑOR DE LOS ANILLOS",
    query: "el señor de los anillos",
  },
];

function normalizeFilterText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export default function Page() {
  const params = useParams();
  const { categorySlug } = params as { categorySlug: string };

  const [activeSubSlug, setActiveSubSlug] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCollectionKey, setActiveCollectionKey] =
    useState<CollectionKey | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFiltersMobile, setShowFiltersMobile] = useState(true);
  const {
    categories,
    loading: loadingCategories,
    error: categoriesError,
  } = useGetCategories();

  useEffect(() => {
    setActiveSubSlug(null);
    setSearchTerm("");
    setActiveCollectionKey(null);
    setSortBy("default");
    setCurrentPage(1);
    setShowFiltersMobile(true);
  }, [categorySlug]);

  const activeCollection =
    collectionOptions.find((collection) => collection.key === activeCollectionKey) ??
    null;

  const fetchSearchTerm = activeCollection?.query ?? searchTerm;

  const { products, loading, error, totalPages } = useGetCategoryProduct({
    categorySlug,
    subSlug: activeSubSlug,
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
    setShowFiltersMobile(true);
  };

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

  const goToPage = (page: number) => {
    if (page < 1) return;
    if (page > totalPages) return;

    setCurrentPage(page);
  };

  const handlePrev = () => goToPage(currentPage - 1);
  const handleNext = () => goToPage(currentPage + 1);

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
    setCurrentPage(1);
  };

  const handleCollectionToggle = (key: CollectionKey) => {
    setActiveCollectionKey((current) => (current === key ? null : key));
    setCurrentPage(1);
  };

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
              className={`${khInterferenceRegularFont.className} h-10 rounded-full border px-5 text-sm uppercase leading-none tracking-[0] transition ${
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

  const SortControl = ({ compact = false }: { compact?: boolean }) => (
    <label
      className={`flex items-center gap-2 text-black ${
        compact ? "w-full" : "justify-end"
      }`}
    >
      <ArrowUpDown className="h-4 w-4 shrink-0" strokeWidth={1.5} />
      <span className="sr-only">Ordenar por</span>
      <select
        value={sortBy}
        onChange={(event) => handleSortChange(event.target.value)}
        className={`
          h-10 cursor-pointer rounded-none border border-black/10 bg-white px-3
          text-xs uppercase tracking-[0.16em] outline-none transition
          hover:border-black/30 focus:border-black
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

  return (
    <SmoothScroll>
      <section className="pt-25 w-full px-1 md:px-8 lg:px-12 pb-28 md:pb-0">
        

        <ScrollReveal delay={0.08}>
          <div className="md:hidden flex left-0 right-0 z-50 bg-white/90 px-5 pt-10 pb-3">
            <div className="flex items-center justify-between w-full bg-[#f5f5f5] px-4 py-2 pt-3">
              <div className="flex-1">
                <SearchBar
                  value={searchTerm}
                  onChange={(value) => {
                    setSearchTerm(value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <button
                aria-label="Abrir filtros"
                className="ml-3 flex-shrink-10 text-black"
                onClick={() => setShowFiltersMobile((value) => !value)}
              >
                <SlidersHorizontal className="w-6 h-6" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {showFiltersMobile && (
          <ScrollReveal delay={0.12}>
            <div className="md:hidden px-10 items-center text-center content-center justify-center max-h-[105vh] bg-white">
              <div className="pt-4">
                <SortControl compact />
              </div>

              <div className="pt-4">
                <CollectionControl compact />
              </div>

              <div className="p-1">
                <FilterCategory
                  categorySlug={categorySlug}
                  activeSubSlug={activeSubSlug}
                  categories={categories}
                  loading={loadingCategories}
                  error={categoriesError}
                  onSelectSubcategory={(slug) => {
                    handleSelectSubcategory(slug);
                    setShowFiltersMobile(true);
                  }}
                />
              </div>
            </div>
          </ScrollReveal>
        )}

        <Separator className="my-2" />

        <ScrollReveal delay={0.16}>
          <div className="grid grid-cols-1 md:grid-cols-[205px_1fr] shadow-none gap-4">
            <aside className="rounded-md p-4 text-sm hidden md:block">
              <div className="mb-5">
                <SearchBar
                  value={searchTerm}
                  onChange={(value) => {
                    setSearchTerm(value);
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

            <main className="w-auto px-0 shadow-none md:p-8">
              <div className="mb-5 hidden items-center justify-between gap-6 md:flex">
                <CollectionControl />
                <SortControl />
              </div>

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

                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination>
                        <PaginationContent className="flex flex-wrap gap-2">
                          <PaginationItem>
                            <button
                              onClick={handlePrev}
                              disabled={currentPage === 1}
                              className={`px-3 py-2 rounded-md border text-sm ${
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
