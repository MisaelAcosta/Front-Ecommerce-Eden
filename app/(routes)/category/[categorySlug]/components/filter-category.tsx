"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
  categorySlug: string;
  activeSubSlug: string | null;
  onSelectSubcategory: (slugSub: string | null) => void;
};

const allProductsCategory = {
  id: "virtual-all",
  categoryName: "Todos los productos",
  slug: "todos-los-productos",
  subcategories: [] as {
    id: string | number;
    categoryName: string;
    slug: string;
  }[],
};

const FilterCategory = ({
  categorySlug,
  activeSubSlug,
  onSelectSubcategory,
}: FilterCategoryProps) => {
  const router = useRouter();


  const { categories, loading, error } = useGetCategories();

  // 🔹 acordeón abierto
  const [openSlug, setOpenSlug] = useState<string | undefined>(undefined);

  // 🔹 mantener abierto el acordeón según la categoría actual
  useEffect(() => {
    setOpenSlug(categorySlug ?? undefined);
  }, [categorySlug]);

  // 🔹 navegar a categoría
  const goCategory = (slugCat: string) => {
    setOpenSlug(slugCat);
    onSelectSubcategory(null);
    router.push(`/category/${slugCat}`);
  };

  // 🔹 seleccionar subcategoría (sin navegar)
  const goSubcategory = (slugSub: string) => {
    onSelectSubcategory(slugSub);
  };

  const allCategories = useMemo(
    () => [allProductsCategory, ...(categories || [])],
    [categories]
  );

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error cargando categorías</p>;

  return (
    <aside className="my-5 bg-white text-black text-lg space-y-4 font-light">
      <Accordion
        type="single"
        collapsible
        value={openSlug}
        onValueChange={(val) => setOpenSlug(val || undefined)}
        className="space-y-2 shadow-none"
      >
        {allCategories.map((cat) => {
          const hasSubs = cat.subcategories && cat.subcategories.length > 0;
          const isCategoryActive = categorySlug === cat.slug;

          // 🔹 categoría sin subcategorías
          if (!hasSubs) {
            return (
              <button
                key={cat.id}
                onClick={() => goCategory(cat.slug)}
                className={`
                  w-full text-left px-2 py-2 rounded-md transition
                  ${isCategoryActive ? "bg-black text-white" : "hover:bg-muted"}
                `}
              >
                {cat.categoryName}
              </button>
            );
          }

          // 🔹 categoría con subcategorías
          return (
            <AccordionItem
              key={cat.id}
              value={cat.slug}
              className="rounded-md overflow-hidden"
            >
              <AccordionTrigger
                onClick={() => goCategory(cat.slug)}
                className={`
                  px-2 py-2 text-left cursor-pointer text-lg font-light
                  ${isCategoryActive ? "text-black" : ""}
                `}
              >
                {cat.categoryName}
              </AccordionTrigger>

              <AccordionContent className="px-2 pb-2">
                <RadioGroup
                  value={activeSubSlug ?? ""}
                  className="flex flex-col space-y-2"
                >
                  {(cat.subcategories ?? []).map((sub) => (
                    <Label
                      key={sub.id}
                      htmlFor={`sub-${sub.slug}`}
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