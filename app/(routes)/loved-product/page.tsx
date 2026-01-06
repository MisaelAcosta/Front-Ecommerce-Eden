"use client";

import Image from "next/image";
import Link from "next/link";
import { useLoved } from "@/hooks/use-loved";

const Page = () => {
  const items = useLoved((s) => s.items);

  if (items.length === 0) {
    return (
      <div className="py-20 text-center text-black/60">
        Aún no tienes productos favoritos 💔
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-20">
      {items.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.slug}`}
          className="border rounded-xl p-4 hover:shadow-md transition"
        >
          <div className="relative w-full aspect-square overflow-hidden rounded-lg border">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black/40">
                Sin imagen
              </div>
            )}
          </div>

          <h3 className="mt-3 font-medium">{product.title}</h3>
          <p className="text-sm text-black/60">
            ${product.price.toLocaleString("es-CL")}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default Page;

