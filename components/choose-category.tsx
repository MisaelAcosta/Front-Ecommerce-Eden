"use client";

import Link from "next/link";
import Image from "next/image";
import { useGetCategories } from "@/api/getProducts";
import { ResponseType } from "@/types/response";
import { CategoryType } from "@/types/category";

const ChooseCategory = () => {
  const { result, loading, error }: ResponseType = useGetCategories();

  // ✅ ahora usamos 3 para armar el layout (1 grande + 2 chicos)
  const categories = Array.isArray(result)
    ? result.filter((c: CategoryType) => c.isFeatured).slice(0, 3)
    : [];

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  const CategoryBlock = ({
    category,
    className = "",
    heightClass = "h-[260px]",
  }: {
    category: CategoryType;
    className?: string;
    heightClass?: string;
  }) => {
    const name = category.categoryName;
    const slug = category.slug;

    const mainImageUrl = category.mainImage?.url
      ? `${backend}${category.mainImage.url}`
      : "";



    return (
      <Link
        key={category.id}
        href={`/category/${slug}`}
        className={`group relative overflow-hidden ${heightClass} ${className}`}
      >
        {/* fondo */}
        <div className="absolute inset-0">
          {mainImageUrl ? (
            <Image
              src={mainImageUrl}
              alt={name}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="
              absolute inset-0
              h-full w-full
              object-cover object-center
              transition-transform duration-500 ease-out
              group-hover:scale-[1.04]"
            />
          ) : (
            <div className="h-full w-full bg-zinc-200" />
          )}
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* ✅ texto esquina inferior derecha (como tu imagen) */}
        <div className="absolute bottom-5 right-5 z-10 text-right">
          <h4 className="text-white font-extrabold tracking-tight text-2xl sm:text-3xl">
            {(name || "").toUpperCase()}
          </h4>

          {category.description && (
            <p className="mt-1 text-white/85 text-sm sm:text-base line-clamp-2 max-w-[24ch] ml-auto">
              {category.description}
            </p>
          )}
        </div>

        {/* hover CTA */}
        <div
          className="
            absolute inset-0 z-10 flex items-end
            opacity-0 translate-y-2
            transition-all duration-300 ease-out
            group-hover:opacity-100 group-hover:translate-y-0
          "
        >
          
        </div>
      </Link>
    );
  };

  return (
    <section className="bg-white  w-full pt-8 sm:py-14">
      <div className="max-w-6xl mx-auto px-0 sm:px-8 lg:px-0">
        <h3 className="text-4xl text-black tracking-tight text-center 
        sm:text-6xl font-black mb-6 sm:mb-10">
          CATEGORÍAS DESTACADAS
        </h3>

        {error && (
          <p className="text-sm text-red-600 mb-6">
            Ocurrió un problema cargando las categorías.
          </p>
        )}

        {/* SKELETON (ahora 3) */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className={`animate-pulse rounded-2xl border border-zinc-200/70 p-5 ${
                  i === 0 ? "sm:col-span-2 min-h-80" : "min-h-64"
                }`}
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
            {/* DESKTOP / TABLET: 1 arriba grande + 2 abajo */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-2 gap-4 lg:gap-3">
                {/* bloque grande */}
                {categories[0] && (
                  <CategoryBlock
                    category={categories[0]}

                    className="col-span-2"
                    heightClass="h-[320px] lg:h-[520px]"
                  />
                )}

                {/* 2 bloques abajo */}
                {categories[1] && (
                  <CategoryBlock
                    category={categories[1]}

                    heightClass="h-[260px] lg:h-[480px]"
                  />
                )}
                {categories[2] && (
                  <CategoryBlock
                    category={categories[2]}

                    heightClass="h-[260px] lg:h-[480px]"
                  />
                )}
              </div>
            </div>

            {/*  MOBILE: 1 arriba + 2 abajo */}
            <div className="sm:hidden grid grid-cols-2 gap-1">
              {categories[0] && (
                <CategoryBlock
                  category={categories[0]}

                  className="col-span-2"
                  heightClass="h-[340px]"
                />
              )}

              {categories[1] && (
                <CategoryBlock category={categories[1]}  heightClass="h-[295px]" />
              )}
              {categories[2] && (
                <CategoryBlock category={categories[2]}  heightClass="h-[295px]" />
              )}
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





































