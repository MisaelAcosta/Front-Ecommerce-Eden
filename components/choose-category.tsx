
"use client";

import Link from "next/link";
import { Gamepad2 } from "lucide-react"; // Ícono fallback
import { useGetCategories } from "@/api/getProducts";
import { ResponseType } from "@/types/response";
import Image from "next/image";
import { CategoryType } from "@/types/category"; // 👈 este es tu tipo actual


const ChooseCategory = () => {
  // Llamado al hook que trae categorías desde Strapi
  const { result, loading, error }: ResponseType = useGetCategories();

  // Filtramos solo las categorías destacadas
  const categories = Array.isArray(result)
    ? result.filter((c: CategoryType) => c.isFeatured) // 👈 usamos el boolean
    : [];

  return (
    <section className="bg-neutral-950 w-full py-10 sm:py-14">
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-0">
      {/* Título */}
      <h3 className="text-4xl text-white text-center sm:text-6xl font-extrabold mb-5 sm:mb-8">
        CATEGORÍAS DESTACADAS
      </h3>

      {/* Estado de error */}
      {error && (
        <p className="text-sm text-red-600 mb-6">
          Ocurrió un problema cargando las categorías.
        </p>
      )}

      {/* Grid responsive: 
          - 1 columna en móvil
          - 2 en tablet
          - 4 en desktop */}
      <div className="grid grid-cols-1 divide-y text-center sm:text-left sm:divide-y-0 sm:divide-x divide-zinc-200 sm:grid-cols-3 gap-4 lg:gap-8">
        {/* Loading con skeletons */}
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="animate-pulse rounded-2xl border border-zinc-200/70 p-5"
            >
              <div className="h-10 w-10 rounded-xl bg-zinc-200 mb-4" />
              <div className="h-4 w-2/3 bg-zinc-200 rounded mb-2" />
              <div className="h-3 w-full bg-zinc-200 rounded mb-1" />
              <div className="h-3 w-5/6 bg-zinc-200 rounded" />
            </div>
          ))}

        {/* Render categorías reales */}
        {!loading &&
          categories.map((category: CategoryType) => {
            const name = category.categoryName;
            const slug = category.slug;
            const mainImageUrl = category.mainImage?.url; 

            return (
              <Link
                key={category.id}
                href={`/category/${slug}`}
                className="
                  group relative  
                  bg-neutral-950 
                  p-6 flex flex-col justify-start
                  min-h-[200px] sm:min-h-[380px]
                  transition-all duration-300 ease-out
                  
                "
              >
                
                <div className="flex flex-col flex-1 order-1 sm:order-2 justify-center items-center sm:items-start">
                  {/* Imagen principal dentro de un cuadro negro */}
                  <div className="h-12 w-17 sm:h-15 sm:w-18   flex items-center justify-center mb-4 sm:mb-8">
                    {mainImageUrl && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${mainImageUrl}`}
                        alt={name}
                        width={48}
                        height={48}
                        className="h-17 w-17 pt-object-contain"
                      />
                    )}
                  </div>

                  {/* Texto */}
                  <div>
                    <h4 className="text-2xl sm:text-4xl text-white font-extrabold">
                      {name}
                    </h4>
                    {category.description && (
                      <p className="mt-3 sm:mt-5 font-light text-sm sm:text-xl text-zinc-200 leading-snug line-clamp-3">
                        {category.description}
                      </p>
                    )}
                  </div>
                  
                </div>
              </Link>
              
            );
          })}

        {/* Si no hay destacadas */}
        {!loading && categories.length === 0 && (
          <p className="col-span-full text-sm text-zinc-600">
            No hay categorías destacadas por ahora.
          </p>
        )}
      </div>
    </div>
    </section>
  );
};

export default ChooseCategory;




















































/*"use client"
import { useGetCategories } from "@/api/getProducts";
import Link from "next/link";
import { ResponseType } from "@/types/response";
import { CategoryType } from "@/types/category";

const ChooseCategory = () => {
  const { result, loading }: ResponseType = useGetCategories();
  console.log(result);

  return (
    <div className="max-w-6xl mx-auto sm:py-16 sm:px-24">
      <h3 className="px-6 pb-4 text-3xl sm:pb-8">Categorías Populares</h3>

      <div className="grid gap-5 sm:grid-cols-3">
        {!loading && result && result.length > 0 && (
          result.map((category: CategoryType) => {
            const slug = category.slug;
            const name = category.categoryName;
            const mainImageUrl = category.mainImage?.url;

            return (
              <Link
                key={category.id}
                href={`/category/${slug}`}
                className="relative max-w-xs mx-auto overflow-hidden bg-no-repeat bg-cover rounded-lg"
              >
                {mainImageUrl && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${mainImageUrl}`}
                    alt={name}
                    className="max-w-[270px] transition duration-300 ease-in-out rounded-lg hover:scale-110"
                    />
                )}
                <p className="absolute w-full py-2 text-lg font-bold text-center text-white bottom-5 backdrop-blur-lg ">
                    {category.categoryName}
                </p>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChooseCategory; */


/*"use client"
import { useGetCategories } from "@/api/getProducts";
import Link from "next/link";
import { ResponseType } from "@/types/response";
import { CategoryType } from "@/types/category";


const ChooseCategory = () => {
    const { result, loading }:  ResponseType = useGetCategories();
    console.log(result);

    return (
        <div className="max-w-6xl mx-auto sm:py-16 sm:px-24">
            <h3 className="px-6 pb-4 text-3xl sm:pb-8">Categorias Populares</h3>

            <div className="grid gap-5 sm:grid-cols-3">
                {!loading && result === undefined &&(
                    result.map((category: CategoryType) => (  
                        <Link key={category.id} href={`/category/${category.attributes.slug}`} className="relative max-w-xs mx-auto overflow-hidden bg-no-repeat bg-cover rounded-lg">
                            <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${category.attributes.mainImage.data}`} 
                                 alt={category.attributes.name} 
                                 className="max-w-[270px] transition duration-300 ease-in-out rounded-lg hover:sacle-110"/> 
                        </Link>
                    ))
                )}

            </div>
        </div>

    );
}
export default ChooseCategory; */