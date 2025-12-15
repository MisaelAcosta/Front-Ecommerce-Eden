"use client";

import Link from "next/link";
import { useGetCategories } from "@/api/getProducts";
import { ResponseType } from "@/types/response";
import { CategoryType } from "@/types/category";

const ChooseCategory = () => {
  const { result, loading, error }: ResponseType = useGetCategories();

  const categories = Array.isArray(result)
    ? result.filter((c: CategoryType) => c.isFeatured).slice(0, 4)
    : [];

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  return (
    <section className="bg-white w-full py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-0">
        <h3 className="text-4xl text-black tracking-tight text-center sm:text-6xl font-black mb-6 sm:mb-10">
          CATEGORÍAS DESTACADAS
        </h3>

        {error && (
          <p className="text-sm text-red-600 mb-6">
            Ocurrió un problema cargando las categorías.
          </p>
        )}

        {/* SKELETON */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="animate-pulse rounded-2xl border border-zinc-200/70 p-5 min-h-[240px]"
              >
                <div className="h-10 w-10 rounded-xl bg-zinc-200 mb-4" />
                <div className="h-4 w-2/3 bg-zinc-200 rounded mb-2" />
                <div className="h-3 w-full bg-zinc-200 rounded mb-1" />
                <div className="h-3 w-5/6 bg-zinc-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {!loading && categories.length > 0 && (
          <>
            {/* ✅ DESKTOP: paneles expandibles */}
            <div className="hidden sm:block">
              <div className="rounded-2xl overflow-hidden bg-white">
                {/* contenedor panel */}
                <div className="flex h-[460px] w-full">
                  {categories.map((category, idx) => {
                    const name = category.categoryName;
                    const slug = category.slug;

                    const mainImageUrl = category.mainImage?.url
                      ? `${backend}${category.mainImage.url}`
                      : "";

                    const secondImageUrl = category.secondImage?.url
                      ? `${backend}${category.secondImage.url}`
                      : "";

                    const number = String(idx + 1).padStart(2, "0");

                    return (
                      <Link
                        key={category.id}
                        href={`/category/${slug}`}
                        className="
                          group relative flex-1 
                          transition-[flex] duration-500 ease-out
                          hover:flex-[2.2]
                        "
                      >
                        {/* fondo mainImage */}
                        <div className="absolute inset-0">
                          {mainImageUrl ? (
                            <img
                              src={mainImageUrl}
                              alt={name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-zinc-200" />
                          )}
                          <div className="absolute inset-0 bg-black/25" />
                        </div>

                        {/* número */}
                        <div className="absolute bottom-4 right-5 z-10 pointer-events-none">
                          <span className="text-white/85 font-extrabold text-6xl leading-none drop-shadow">
                            {number}
                          </span>
                        </div>

                        {/* ✅ overlay hover: secondImage + desc + link */}
                        <div
                          className="
                            absolute inset-0 z-10 flex items-end
                            opacity-0 translate-y-2
                            transition-all duration-300 ease-out
                            group-hover:opacity-100 group-hover:translate-y-0
                          "
                        >
                          <div className="w-full p-5">
                            <div className="rounded-xl bg-black/55 backdrop-blur-md p-4 border border-white/10">
                              <div className="flex items-start gap-4">
                                
                                <div className="min-w-0">
                                  {category.description && (
                                    <p className="text-white/90 text-sm leading-snug line-clamp-3">
                                      {category.description}
                                    </p>
                                  )}

                                  <div className="mt-3 inline-flex items-center gap-2 text-white font-semibold text-sm">
                                    Ver categoría <span className="opacity-80">→</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ✅ nombre abajo (como tu 1era imagen) */}
                        <div className="absolute -bottom-[56px] left-0 right-0 z-20 bg-white">
                          <div className="py-4 text-center text-black font-extrabold tracking-tight">
                            {(name || "").toUpperCase()}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* espacio para el nombre de abajo */}
                <div className="h-[56px]" />
              </div>
            </div>

            {/* ✅ MOBILE: tu estilo “cards” */}
            <div className="sm:hidden grid grid-cols-2 gap-2">
              {categories.map((category) => {
                const name = category.categoryName;
                const slug = category.slug;

                const mainImageUrl = category.mainImage?.url
                  ? `${backend}${category.mainImage.url}`
                  : "";

                return (
                  <Link
                    key={category.id}
                    href={`/category/${slug}`}
                    className="rounded-2xl overflow-hidden border "
                  >
                    <div className="relative h-[240px] ">
                      {mainImageUrl ? (
                        <img
                          src={mainImageUrl}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full " />
                      )}
                      <div className="absolute inset-0 bg-black/35" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-white text-xl font-medium tracking-tight">
                          {name}
                        </h4>
                        {category.description && (
                          <p className="mt-2 text-white/90 hidden text-sm line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {!loading && categories.length === 0 && (
          <p className="text-sm text-zinc-600 text-center">
            No hay categorías destacadas por ahora.
          </p>
        )}
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