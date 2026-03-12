"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import SkeletonSchema from "@/components/skeletonSchema";
import FilterCategory from "./components/filter-category";
import SearchBar from "./components/searchBar";
import ProductCard from "./components/product-card";
import CarouselTextBanner from "@/components/carousel-text-banner";
import { useGetCategoryProduct } from "@/api/useGetCategoryProducts";
import { ProductType } from "@/types/product";
import { SlidersHorizontal } from "lucide-react";

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

export default function Page() {
  const params = useParams();
  const { categorySlug } = params as { categorySlug: string };

  const [activeSubSlug, setActiveSubSlug] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFiltersMobile, setShowFiltersMobile] = useState(true);

  useEffect(() => {
    setActiveSubSlug(null);
    setSearchTerm("");
    setCurrentPage(1);
    setShowFiltersMobile(true);
  }, [categorySlug]);

  const { products, loading, error, totalPages } = useGetCategoryProduct({
    categorySlug: categorySlug,
    subSlug: activeSubSlug,
    page: currentPage,
    pageSize: 8,
    searchTerm,
  });

  const handleSelectSubcategory = (slugSub: string | null) => {
    setActiveSubSlug(slugSub);
    setSearchTerm("");
    setCurrentPage(1);
    setShowFiltersMobile(true);
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    const typedProducts = products as ProductWithOptionalAttributes[];
    const term = searchTerm.trim().toLowerCase();

    if (term === "") return typedProducts;

    return typedProducts.filter((p) => {
      const a = p.attributes ?? p;
      const name = String(a.productName ?? "").toLowerCase();
      const name2 = String(a.productName2 ?? "").toLowerCase();
      return name.includes(term) || name2.includes(term);
    });
  }, [products, searchTerm]);

  const goToPage = (page: number) => {
    if (page < 1) return;
    if (page > totalPages) return;
    setCurrentPage(page);
  };

  const handlePrev = () => goToPage(currentPage - 1);
  const handleNext = () => goToPage(currentPage + 1);

  return (
    <section className="pt-15 w-full px-1 md:px-8 lg:px-12 pb-28 md:pb-0">
      <div className="pt-6">
        <CarouselTextBanner />
      </div>

      <div className="pt-2 hidden md:flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div />
        <div className="w-full md:max-w-xs text-center item-center">
          <SearchBar
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="md:hidden flex left-0 right-0 z-50 bg-white/90 px-5 pt-10 pb-3">
        <div className="flex items-center justify-between w-full bg-[#f5f5f5] px-4 py-2 pt-3">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(val) => {
                setSearchTerm(val);
              }}
            />
          </div>

          <button
            aria-label="Abrir filtros"
            className="ml-3 flex-shrink-10 text-black"
            onClick={() => setShowFiltersMobile((v) => !v)}
          >
            <SlidersHorizontal className="w-6 h-6" />
          </button>
        </div>
      </div>

      {showFiltersMobile && (
        <div className="md:hidden px-10 items-center text-center content-center justify-center max-h-[105vh] bg-white">
          <div className="p-1">
            <FilterCategory
              categorySlug={categorySlug}
              activeSubSlug={activeSubSlug}
              onSelectSubcategory={(slug) => {
                handleSelectSubcategory(slug);
                setShowFiltersMobile(true);
              }}
            />
          </div>
        </div>
      )}

      <Separator className="my-2" />

      <div className="grid grid-cols-1 md:grid-cols-[205px_1fr] shadow-none gap-4">
        <aside className="rounded-md p-4 text-sm hidden md:block">
          <FilterCategory
            categorySlug={categorySlug}
            activeSubSlug={activeSubSlug}
            onSelectSubcategory={handleSelectSubcategory}
          />
        </aside>

        <main className="w-auto px-0 shadow-none md:p-8">
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-1">
              <SkeletonSchema grid={8} />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm">Error cargando productos.</p>
          )}

          {!loading && !error && (
            <>
              <div
                className="
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
                "
              >
                {filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <ProductCard key={String(p.id)} product={p} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No encontramos productos que coincidan con “{searchTerm}”.
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

                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
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
    </section>
  );
}





