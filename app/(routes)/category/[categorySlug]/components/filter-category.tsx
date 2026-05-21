"use client";

import { useEffect, useMemo, useState } from "react";
import localFont from "next/font/local";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
      className="my-5 space-y-3 bg-white text-black"
      aria-hidden="true"
    >
      <Skeleton className="h-9 w-full rounded-md bg-black/8 sm:h-10" />

      <div className="space-y-2 rounded-md px-2 py-2">
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

      <Skeleton className="h-9 w-11/12 rounded-md bg-black/8 sm:h-10" />
      <Skeleton className="h-9 w-4/5 rounded-md bg-black/8 sm:h-10" />
      <Skeleton className="h-9 w-full rounded-md bg-black/8 sm:h-10" />
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
      className={`${khInterferenceRegularFont.className} my-5 space-y-4 bg-white text-lg text-black`}
    >
      <Accordion
        type="single"
        collapsible
        value={openSlug}
        onValueChange={(value) => setOpenSlug(value || undefined)}
        className="space-y-2 shadow-none"
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
                  w-full rounded-md px-2 py-2 text-left
                  text-base uppercase tracking-normal transition
                  sm:text-lg sm:tracking-wide
                  ${isCategoryActive ? "bg-black text-white" : "hover:bg-muted"}
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
              className="overflow-hidden rounded-md"
            >
              <AccordionTrigger
                onClick={() => goCategory(category.slug)}
                className={`
                  ${khInterferenceRegularFont.className}
                  cursor-pointer px-2 py-2 text-left
                  text-base uppercase tracking-normal
                  sm:text-lg sm:tracking-wide
                  ${isCategoryActive ? "text-black" : ""}
                `}
              >
                {category.categoryName}
              </AccordionTrigger>

              <AccordionContent className="px-2 pb-2">
                <RadioGroup
                  value={activeSubSlug ?? ""}
                  className="flex flex-col space-y-2"
                >
                  {(category.subcategories ?? []).map((subcategory) => (
                    <Label
                      key={subcategory.id}
                      htmlFor={`sub-${subcategory.slug}`}
                      className={`${khInterferenceRegularFont.className} flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm uppercase tracking-wide hover:bg-gray-100`}
                      onClick={() => goSubcategory(subcategory.slug)}
                    >
                      <RadioGroupItem
                        value={subcategory.slug}
                        id={`sub-${subcategory.slug}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          goSubcategory(subcategory.slug);
                        }}
                      />
                      {subcategory.categoryName}
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
export { FilterCategorySkeleton };
