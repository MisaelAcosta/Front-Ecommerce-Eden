"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetCategories } from "@/api/useGetCategories";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type FilterCategoryProps = {
  onSelectSubcategory: (slugSub: string | null) => void;
};

const FilterCategory = ({ onSelectSubcategory }: FilterCategoryProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { categories, loading, error } = useGetCategories();

  // slug de la categoría actual tomado desde la URL: /category/[cat]/[sub]?
  const currentCatSlug = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    const catIdx = parts.indexOf("category");
    return catIdx >= 0 ? parts[catIdx + 1] ?? null : null;
  }, [pathname]);

  // Estado controlado del acordeón (qué item está abierto)
  const [openSlug, setOpenSlug] = useState<string | undefined>(undefined);

  // Mantener abierto el acordeón de la categoría actual tras navegar
  useEffect(() => {
    setOpenSlug(currentCatSlug ?? undefined);
  }, [currentCatSlug]);

  // Navegar a categoría y limpiar subSlug activo (optimista: abrimos antes de push)
  const goCategory = (slugCat: string) => {
    setOpenSlug(slugCat);
    onSelectSubcategory(null);
    router.push(`/category/${slugCat}`);
  };

  // Seleccionar subcategoría SIN navegar
  const goSubcategory = (slugSub: string) => {
    onSelectSubcategory(slugSub);
  };

  // Categoría virtual al inicio
  const allProductsCategory = {
    id: "virtual-all",
    categoryName: "Todos los productos",
    slug: "todos-los-productos",
    subcategories: [] as { id: string | number; categoryName: string; slug: string }[],
  };

  const allCategories = useMemo(
    () => [allProductsCategory, ...(categories || [])],
    [categories]
  );

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error cargando categorías</p>;

  return (
    <aside className="my-5 text-black bg-white text-lg space-y-4 font-light">
      {/* Un SOLO Accordion que contiene TODOS los items */}
      <Accordion
        type="single"
        collapsible
        value={openSlug}
        onValueChange={(val) => setOpenSlug(val || undefined)}
        className="space-y-2 shadow-none"
      >
        {allCategories.map((cat) => {
          const hasSubs = cat.subcategories && cat.subcategories.length > 0;

          // SIN subcategorías → botón simple
          if (!hasSubs) {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <button
                key={cat.id}
                onClick={() => goCategory(cat.slug)}
                className={`
                  w-full shadow-none text-left px-2 py-2 rounded-md transition cursor-pointer
                  
                  ${isActive ? "bg-black text-white" : "hover:bg-muted"}
                `}
              >
                {cat.categoryName}
              </button>
            );
          }

          // CON subcategorías → item dentro del único Accordion
          return (
            <AccordionItem
              key={cat.id}
              value={cat.slug}
              className="rounded-md overflow-hidden"
            >
              {/* El trigger abre/cierra y también navega a la categoría padre */}
              <AccordionTrigger
                onClick={() => goCategory(cat.slug)}
                className="px-2 py-2 text-left cursor-pointer text-lg font-light"
              >
                {cat.categoryName}
              </AccordionTrigger>

              <AccordionContent className="px-2 pb-2">
                <RadioGroup className="flex flex-col shadow-none space-y-2 cursor-pointer">
                  {cat.subcategories?.map((sub) => (
                    <Label
                      key={sub.id}
                      className="cursor-pointer flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100"
                      onClick={() => goSubcategory(sub.slug)}
                    >
                      <RadioGroupItem
                        value={sub.slug}
                        id={`sub-${sub.slug}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          goSubcategory(sub.slug);
                        }}
                      />
                      {sub.categoryName}
                    </Label>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </aside>
  );
};

export default FilterCategory;

