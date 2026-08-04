"use client";

import { useEffect, useMemo, useState } from "react";
import localFont from "next/font/local";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { CategoryType } from "@/types/category";
import { useRouter } from "next/navigation";

// Tipografias locales usadas en el filtro de categorias.
const khInterferenceRegularFont = localFont({
  src: "../../../../../components/fonts/KHInterferenceTRIAL-Regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
});

type FilterCategoryProps = {
  categorySlug: string;
  activeSubSlug: string | null;
  categories: CategoryType[];
  loading?: boolean;
  error?: boolean;
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

const FilterCategorySkeleton = () => {
  return (
    <aside
      className="space-y-4 bg-white text-black"
      aria-hidden="true"
    >
      <Skeleton className="h-[52px] w-full bg-black/8" />

      <div className="space-y-3">
        <Skeleton className="h-5 w-4/5 rounded-none bg-black/8 sm:h-6" />
        <div className="space-y-2 pl-1 pt-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full bg-black/8" />
            <Skeleton className="h-4 w-24 rounded-none bg-black/8" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full bg-black/8" />
            <Skeleton className="h-4 w-28 rounded-none bg-black/8" />
          </div>
        </div>
      </div>

      <Skeleton className="h-11 w-11/12 rounded-none bg-black/8" />
      <Skeleton className="h-11 w-4/5 rounded-none bg-black/8" />
      <Skeleton className="h-11 w-full rounded-none bg-black/8" />
    </aside>
  );
};

const FilterCategory = ({
  categorySlug,
  activeSubSlug,
  categories,
  loading = false,
  error = false,
  onSelectSubcategory,
}: FilterCategoryProps) => {
  const router = useRouter();
  const [openSlug, setOpenSlug] = useState<string | undefined>(undefined);

  useEffect(() => {
    setOpenSlug(categorySlug ?? undefined);
  }, [categorySlug]);

  const goCategory = (slugCat: string) => {
    setOpenSlug(slugCat);
    onSelectSubcategory(null);
    router.push(`/category/${slugCat}`);
  };

  const goSubcategory = (slugSub: string) => {
    onSelectSubcategory(slugSub);
  };

  const allCategories = useMemo(
    () => [allProductsCategory, ...(categories || [])],
    [categories]
  );

  if (loading && categories.length === 0) {
    return <FilterCategorySkeleton />;
  }

  if (error) {
    return (
      <p className={`${khInterferenceRegularFont.className} uppercase`}>
        Error cargando categorias
      </p>
    );
  }

  return (
    <aside
      className={`${khInterferenceRegularFont.className} space-y-5 
      bg-white text-black`}
    >
      <Accordion
        type="single"
        collapsible
        value={openSlug}
        onValueChange={(value) => setOpenSlug(value || undefined)}
        className="space-y-1 shadow-none"
      >
        {allCategories.map((category) => {
          const hasSubs =
            category.subcategories && category.subcategories.length > 0;
          const isCategoryActive = categorySlug === category.slug;

          if (!hasSubs) {
            return (
              <button
                key={category.id}
                onClick={() => goCategory(category.slug)}
                className={`
                  ${khInterferenceRegularFont.className}
                  w-full px-1 py-4 text-left
                  text-[18px] uppercase leading-[1.1] transition-colors
                  ${
                    isCategoryActive
                      ? "text-[#6d9500]"
                      : "text-black hover:text-[#6d9500]"
                  }
                `}
              >
                {category.categoryName}
              </button>
            );
          }

          return (
            <AccordionItem
              key={category.id}
              value={category.slug}
              className="overflow-hidden border-b border-black/8"
            >
              <AccordionTrigger
                onClick={() => goCategory(category.slug)}
                className={`
                  ${khInterferenceRegularFont.className}
                  cursor-pointer px-1 py-4 text-left
                  text-[18px] uppercase leading-[1.1]
                  hover:no-underline
                  ${isCategoryActive ? "text-[#6d9500]" : "text-black"}
                `}
              >
                {category.categoryName}
              </AccordionTrigger>

              <AccordionContent className="px-1 pb-3">
                <div className="flex flex-col gap-1 border-l border-black/20 pl-4">
                  {(category.subcategories ?? []).map((subcategory) => (
                    <button
                      key={subcategory.id}
                      type="button"
                      className={`${khInterferenceRegularFont.className}
                        w-full py-2 text-left text-[12px] 
                        uppercase transition-colors
                        ${
                          isCategoryActive && activeSubSlug === subcategory.slug
                            ? "text-[#6d9500]"
                            : "text-black/65 hover:text-black"
                        }`}
                      onClick={() => goSubcategory(subcategory.slug)}
                    >
                      {subcategory.categoryName}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </aside>
  );
};

export default FilterCategory;
export { FilterCategorySkeleton };
