"use client";

import Image from "next/image";
import Link from "next/link";
import { useLoved } from "@/hooks/use-loved";

const Page = () => {
  const items = useLoved((s) => s.items);

  if (items.length === 0) {
    return (
      <div className="py-20 text-center text-black/40">
        Aún no tienes productos favoritos 💔
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pt-20 ">

      <h1 className=" text-2xl sm:text-4xl ps-6 sm:pb-5 pt-6 
      sm:ps-14 font-bold">
        FAVORITOS
      </h1>

      <div className="grid sm:gap-14 gap-5 grid-cols-2 
      sm:grid-cols-2 lg:grid-cols-3 
      px-4 sm:px-15 pb-10 ">
        {items.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.slug}`}
          className="border p-4 transition"
        >
          <div className="relative w-full aspect-square overflow-hidden 
          rounded-lg ">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black/10">
                Sin imagen
              </div>
            )}
          </div>

          <h3 className="mt-3 font-medium text-center">{product.title}</h3>
          <p className="text-sm   text-black/60 text-center">
            ${product.price.toLocaleString("es-CL")}
          </p>
        </Link>
      ))}

    </div>  
    </div>
  );
};

export default Page;

