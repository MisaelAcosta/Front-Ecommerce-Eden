"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import SkeletonSchema from "@/components/skeletonSchema";
import FilterCategory from "./components/filter-category";
import SearchBar from "./components/searchBar";
import ProductCard from "./components/product-card";
import { useGetCategoryProduct } from "@/api/useGetCategoryProducts";
import { ProductType } from "@/types/product";
import { SlidersHorizontal } from "lucide-react"; // ícono filtros

// ⬇ importa los componentes de paginación de shadcn
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

export default function Page() {
  const params = useParams();
 
  const [lastScrollY, setLastScrollY] = useState(0);
  const { categorySlug } = params as { categorySlug: string };

  const [activeSubSlug, setActiveSubSlug] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage ] = useState<number>(1);

  // NUEVO: control del dropdown de filtros en mobile
  const [showFiltersMobile, setShowFiltersMobile] = useState(true);

  // cuando cambia categoría => limpio sub, búsqueda y pag
  const [elevated, setElevated] = useState(false);

useEffect(() => {
  const handleScroll = () => setLastScrollY(window.scrollY);
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

    useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);



  useEffect(() => {
    setActiveSubSlug(null);
    setSearchTerm("");
    setCurrentPage(1);
    setShowFiltersMobile(true);
  }, [categorySlug]);

  // hook al backend con paginación real
  const { products, loading, error, totalPages } = useGetCategoryProduct({
    categorySlug: categorySlug,
    subSlug: activeSubSlug,
    page: currentPage,
    pageSize: 6,
    searchTerm, // <-- 6 productos por página
  });

  const handleSelectSubcategory = (slugSub: string | null) => {
    setActiveSubSlug(slugSub);
    setSearchTerm("");
    setCurrentPage(1);// reset page cuando cambias sub
    setShowFiltersMobile(true); // cerrar dropdown en mobile al elegir
  };

  // filtro frontend por texto del buscador aqui es donde hay que tocar si falla el buscador
  const filteredProducts = useMemo(() => {
  if (!products) return [];

  const term = searchTerm.trim().toLowerCase();
  if (term === "") return products;

  return products.filter((p: any) => {
    const a = p.attributes ?? p; // soporta plano o con attributes
    const name  = (a.productName  ?? "").toLowerCase();
    const name2 = (a.productName2 ?? "").toLowerCase();
    return name.includes(term) || name2.includes(term);
  });
}, [products, searchTerm]);


  // handlers de paginación
  const goToPage = (page: number) => {
    if (page < 1) return;
    if (page > totalPages) return;
      setCurrentPage(page);
    
  };

  const handlePrev = () => goToPage(currentPage - 1);
  const handleNext = () => goToPage(currentPage + 1);

  return (
    <section className="w-full px-1 md:px-8 lg:px-12 pb-28 md:pb-0">
      {/* ENCABEZADO (Desktop) */}
      <div className="pt-8 hidden md:flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-xl font-extrabold">Productos</h1>
          <p className="text-xs text-muted-foreground">
            {activeSubSlug ? `${categorySlug} / ${activeSubSlug}` : categorySlug}
          </p>
        </div>

        {/* barra de búsqueda (desktop) */}
        <div className="w-full md:max-w-xs">
          <SearchBar
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
              
            }}
          />
        </div>
      </div>

      {/* ==== BARRA FLOTANTE  (MOBILE) ==== */}
<div
  className="
    md:hidden
    flex left-0 right-0 z-50
    bg-white/90 
    px-5 pt-3 pb-3"
>
  <div
    className="
      flex items-center justify-between
      w-full bg-[#f5f5f5]
      rounded-full px-4 py-3
    "
  >
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

{/* ==== PANEL DE FILTROS FLOTANTE (MOBILE) ==== */}
{showFiltersMobile && (
  <div
    className="
      md:hidden
      flex left-0 right-0
      bottom-[180px] /* altura aprox de la barra + margen */
      max-h-[85vh]
      mx-4
      rounded-2xl border border-neutral-200 bg-white 
      z-50
    "
  >
    <div className="p-3">
      <FilterCategory
        currentCategorySlug={categorySlug}
        activeSubSlug={activeSubSlug}
        onSelectSubcategory={(slug) => {
          handleSelectSubcategory(slug);
          setShowFiltersMobile(true); // cerrar al elegir
        }}
      />
    </div>
  </div>
)}


      <Separator className="my-2" />

      {/* LAYOUT principal */}
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4">
        {/* SIDEBAR IZQ: filtros (solo desktop) */}
        <aside className="border rounded-md p-4 text-sm hidden md:block">
          <FilterCategory
            currentCategorySlug={categorySlug}
            activeSubSlug={activeSubSlug}
            onSelectSubcategory={handleSelectSubcategory}
            
          />
        </aside>



        {/* LISTA DE PRODUCTOS */}
        <main className="w-auto px-0 md:p-8 ">
          {loading && (
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-6 md:gap-1 ">
              <SkeletonSchema grid={3} />
              
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm">Error cargando productos.</p>
          )}

          {!loading && !error && (
            <>
              {/* resultados */}
              <div className="
              grid
              grid-cols-2
              sm:grid-cols-2
              xl:grid-cols-3     /* a 1280px -> 2 columnas */
              2xl:grid-cols-3
              min-[1600px]:grid-cols-4   /* 4 columnas solo en pantallas grandes */
              gap-0
              sm:gap-6
              
              flex-wrap
              ">
                {filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((p: ProductType | any) => (
                    <ProductCard key={p.id} product={p} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No encontramos productos que coincidan con “{searchTerm}”.
                  </p>
                )}
              </div>







              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination>
                    <PaginationContent className="flex flex-wrap gap-2">
                      {/* Prev */}
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

                      {/* Números de página */}
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

                      {/* Next */}
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





