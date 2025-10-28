"use client";

import { useRouter } from "next/navigation";
import { useGetCategories } from "@/api/useGetCategories";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// shadcn accordion
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const FilterCategory = () => {
  const router = useRouter();
  const { categories, loading, error } = useGetCategories();

  const handleSelect = (value: string) => {
    // value vendrá en formato:
    // "cat::<slugCat>"
    // "sub::<slugCat>::<slugSub>"
    const parts = value.split("::");

    if (parts[0] === "cat") {
      const slugCat = parts[1];
      router.push(`/category/${slugCat}`);
    } else if (parts[0] === "sub") {
      const slugCat = parts[1];
      const slugSub = parts[2];
      router.push(`/category/${slugCat}/${slugSub}`);
    }
  };

  return (
    <div className="my-5 text-black">
      <p className="mb-3 font-bold text-black">Categorías</p>

      {loading && (
        <p className="text-sm text-zinc-500">Cargando categorías...</p>
      )}

      {error && (
        <p className="text-sm text-red-500">
          No se pudieron cargar las categorías
        </p>
      )}

      {!loading && !error && categories.length === 0 && (
        <p className="text-sm text-zinc-500">(No hay categorías aún)</p>
      )}

      {!loading && !error && categories.length > 0 && (
        <RadioGroup
          className="space-y-4"
          onValueChange={handleSelect}
        >
          <Accordion
            type="multiple" // podés abrir varias a la vez
            className="w-full"
          >
            {categories.map((cat) => {
              const hasSubs =
                Array.isArray(cat.subcategories) &&
                cat.subcategories.length > 0;

              return (
                <AccordionItem
                  key={cat.id}
                  value={`cat-${cat.id}`}
                  className="border-b border-zinc-200 pb-4"
                >
                  {/* HEADER CATEGORÍA */}
                  <div className="flex items-start space-x-2">
                    {/* Radio para TODA la categoría */}
                    <RadioGroupItem
                      value={`cat::${cat.slug}`}
                      id={`cat-radio-${cat.id}`}
                      className="h-4 w-4 border border-muted-foreground mt-1"
                    />

                    <div className="flex flex-col flex-1">
                      {/* Nombre categoría + trigger del acordeón */}
                      <div className="flex items-start justify-between">
                        <Label
                          htmlFor={`cat-radio-${cat.id}`}
                          className="text-sm capitalize text-black"
                        >
                          {cat.categoryName || "(Sin nombre)"}
                        </Label>

                        {hasSubs && (
                          <AccordionTrigger
                            className="ml-2 text-xs text-zinc-500 hover:text-zinc-800 hover:no-underline p-0"
                          >
                            Ver subcategorías
                          </AccordionTrigger>
                        )}
                      </div>

                      {/* Descripción chiquita opcional */}
                      {cat.description && (
                        <p className="text-[11px] text-zinc-500 leading-tight mt-1 line-clamp-2">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* LISTA DE SUBCATEGORÍAS */}
                  {hasSubs && (
                    <AccordionContent className="pl-6 pt-3 space-y-3">
                      {cat.subcategories?.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-start space-x-2"
                        >
                          <RadioGroupItem
                            value={`sub::${cat.slug}::${sub.slug}`}
                            id={`sub-radio-${cat.id}-${sub.id}`}
                            className="h-3.5 w-3.5 border border-muted-foreground mt-1"
                          />

                          <Label
                            htmlFor={`sub-radio-${cat.id}-${sub.id}`}
                            className="text-[13px] text-black"
                          >
                            {sub.categoryName || "(Sin nombre)"}
                          </Label>
                        </div>
                      ))}
                    </AccordionContent>
                  )}
                </AccordionItem>
              );
            })}
          </Accordion>
        </RadioGroup>
      )}
    </div>
  );
};

export default FilterCategory;


