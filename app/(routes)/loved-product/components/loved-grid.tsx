"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useLoved } from "@/hooks/use-loved";

const LovedGrid = () => {
  const items = useLoved((s) => s.items);
  const removeLoved = useLoved((s) => s.removeLoved);

  if (items.length === 0) {
    return (
      <div className="py-20 text-center text-black/40">
        Aún no tienes productos favoritos 💔
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pt-20">
      <h1 className="text-2xl sm:text-4xl ps-6 sm:pb-5 pt-6 sm:ps-14 font-bold">
        FAVORITOS
      </h1>

      <div className="grid gap-5 sm:gap-10 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-14 pb-10">
        {items.map((product) => (
          <div
            key={product.id}
            className="
              group relative
              rounded-2xl
              bg-white
              border border-black/10
              overflow-hidden
              transition
              hover:border-black/20
            "
          >
            {/* Botón quitar favorito */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeLoved(product.id);
              }}
              className="
                absolute top-3 right-3 z-20
                inline-flex h-9 w-9 items-center justify-center
                rounded-xl bg-white/90 backdrop-blur
                border border-black/10
                text-black/70
                hover:text-black
              "
              aria-label="Quitar de favoritos"
            >
              <Heart
                className="h-5 w-5 fill-black"
                strokeWidth={1.5}
              />
            </button>

            <Link
              href={`/product/${product.slug}`}
              className="block"
            >
              {/* Imagen */}
              <div className="relative w-full aspect-square bg-white overflow-hidden">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black/20">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Texto */}
              <div className="p-4">
                <h3 className="text-base sm:text-lg font-black uppercase leading-tight text-center line-clamp-2">
                  {product.title}
                </h3>

                {!!product.secondaryName && (
                  <p className="mt-1 text-sm text-black/60 text-center line-clamp-1">
                    {product.secondaryName}
                  </p>
                )}

                <p className="mt-2 text-sm sm:text-base font-semibold text-center">
                  ${Number(product.price).toLocaleString("es-CL")}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LovedGrid;