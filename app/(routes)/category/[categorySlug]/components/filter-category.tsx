"use client";

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
  onSelectSubcategory: (slugSub: string | null) => void;
};

const FilterCategory = ({ onSelectSubcategory }: FilterCategoryProps) => {
  const router = useRouter();
  const { categories, loading, error } = useGetCategories();

  // 👉 Navegar a categoría y limpiar subSlug activo
  const goCategory = (slugCat: string) => {
    router.push(`/category/${slugCat}`);
    onSelectSubcategory(null);
  };

  // 👉 Seleccionar subcategoría SIN navegar
  const goSubcategory = (slugSub: string) => {
    onSelectSubcategory(slugSub);
  };

  // 🧩 Inyectar la categoría virtual "Todos los productos" al inicio
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

  const allCategories = [allProductsCategory, ...(categories || [])];

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error cargando categorías</p>;

  return (
    <aside className="my-5 text-black text-sm space-y-4">
      {allCategories.map((cat) => {
        const hasSubs = cat.subcategories && cat.subcategories.length > 0;

        // CASO 1: categoría SIN subcategorías -> item simple, sin acordeón
        if (!hasSubs) {
          return (
            <button
              key={cat.id}
              onClick={() => goCategory(cat.slug)}
              className="
                w-full text-left
                px-2 py-2
                rounded-md
                hover:bg-gray-100
                border border-transparent
                hover:border-gray-300
                transition
              "
            >
              {cat.categoryName}
            </button>
          );
        }

        // CASO 2: categoría CON subcategorías -> acordeón
        return (
          <Accordion
            // type single = solo se abre uno a la vez
            type="single"
            collapsible
            key={cat.id}
            className="border border-gray-200 rounded-md"
          >
            <AccordionItem value={cat.slug} className="border-b-0">
              {/* 🔻 el trigger ahora SOLO sirve para abrir/cerrar subcats
                  y NO hace navigate directamente */}
              <AccordionTrigger className="px-2 py-2 text-left">
                {cat.categoryName}
              </AccordionTrigger>

              <AccordionContent className="px-2 pb-2">
                {/* Lista de subcategorías como radios */}
                <RadioGroup className="flex flex-col space-y-2">
                  {cat.subcategories?.map((sub) => (
                    <Label
                      key={sub.id}
                      className="
                        cursor-pointer flex items-center gap-2
                        rounded-md px-2 py-1
                        hover:bg-gray-100
                      "
                      // hacemos click también en el label
                      onClick={() => {
                        // no navegamos a otra página
                        goSubcategory(sub.slug);
                      }}
                    >
                      <RadioGroupItem
                        value={sub.slug}
                        id={`sub-${sub.slug}`}
                        // evitamos que cambie ruta al click en el circulito,
                        // solo dispara el filtrado local
                        onClick={(e) => {
                          e.stopPropagation();
                          goSubcategory(sub.slug);
                        }}
                      />
                      {sub.categoryName}
                    </Label>
                  ))}

                  {/* EXTRA OPCIONAL:
                      Si querés un botón "Ver todo {cat.categoryName}"
                      que navegue a la categoría padre, lo agregamos aquí.
                      Si NO lo querés, borra todo este bloque. */}
                  <button
                    onClick={() => goCategory(cat.slug)}
                    className="
                      text-left ml-6 mt-2 text-xs text-gray-500
                      hover:underline
                    "
                  >
                    Ver todo {cat.categoryName}
                  </button>
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </aside>
  );
};

export default FilterCategory;
