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

export default function Page() {
  const params = useParams();
  const { categorySlug } = params as { categorySlug: string };

  const [activeSubSlug, setActiveSubSlug] = useState<string | null>(null);

  // 🆕 estado del buscador
  const [searchTerm, setSearchTerm] = useState<string>("");

  // cada vez que cambia categoría, limpiamos sub y búsqueda
  useEffect(() => {
    setActiveSubSlug(null);
    setSearchTerm("");
  }, [categorySlug]);

  const { products, loading, error } = useGetCategoryProduct({
    categorySlug: categorySlug,
    subSlug: activeSubSlug,
  });

  const handleSelectSubcategory = (slugSub: string | null) => {
    setActiveSubSlug(slugSub);
    // cuando cambio de subcategoría, reinicio búsqueda? (decisión UX)
    setSearchTerm("");
  };

  // 🧠 filtrado frontend por nombre
  // importante: en Strapi v5 normalmente el nombre está en:
  // product.attributes.productName
  // pero tu ProductType me mostraste que es:
  // product.attributes.productName  ← (sí)
  // entonces tenemos que mirar eso.
  //
  // products viene como [{ id, attributes: { productName, ... } }, ...]
  //
  const filteredProducts = useMemo(() => {
  if (!products) return [];

  const term = searchTerm.trim().toLowerCase();
  if (term === "") return products;

  return products.filter((p: any) => {
    const name = p.productName?.toLowerCase() ?? "";
    const name2 = p.productName2?.toLowerCase() ?? "";
    return name.includes(term) || name2.includes(term);
  });
}, [products, searchTerm]);


  return (
    <section className="w-full px-4 md:px-8 lg:px-12">
      {/* ENCABEZADO */}
      <div className="py-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-xl font-extrabold">
            Productos {categorySlug}
          </h1>
          <p className="text-xs text-muted-foreground">
            {activeSubSlug
              ? `${categorySlug} / ${activeSubSlug}`
              : categorySlug}
          </p>
        </div>

        {/* 🆕 barra de búsqueda */}
        <div className="w-full md:max-w-xs">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
      </div>

      <Separator className="my-2" />

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4">
        {/* SIDEBAR IZQ: filtros */}
        <aside className="border rounded-md p-4 text-sm">
          <FilterCategory
            currentCategorySlug={categorySlug}
            activeSubSlug={activeSubSlug}
            onSelectSubcategory={handleSelectSubcategory}
          />
        </aside>

        {/* LISTA DE PRODUCTOS */}
        <main className="min-h-[400px] border rounded-md p-4">
          

          {error && (
            <p className="text-red-500 text-sm">
              Error cargando productos.
            </p>
          )}

          {!loading && !error && (
            <>
              {/* resultados */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((p: any) => (
                    <ProductCard key={p.id} product={p} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No encontramos productos que coincidan con “{searchTerm}”.
                  </p>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </section>
  );
}



