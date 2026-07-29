"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { Heart } from "lucide-react";
import { useLoved, type LovedProduct } from "@/hooks/use-loved";
import { formatPrice } from "@/lib/formatPrice";
import { useNavigationTransition } from "@/components/navigation-transition-provider";

const khInterferenceLightFont = localFont({
  src: "../../../../components/fonts/KHInterferenceTRIAL-Light.otf",
  weight: "300",
  style: "normal",
  display: "swap",
});

const khInterferenceRegularFont = localFont({
  src: "../../../../components/fonts/KHInterferenceTRIAL-Regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
});

const LovedGrid = () => {
  const items = useLoved((state) => state.items);
  const removeLoved = useLoved((state) => state.removeLoved);
  const { navigateWithTransition } = useNavigationTransition();

  if (items.length === 0) {
    return (
      <section className="flex min-h-[48vh] flex-col items-center justify-center text-center">
        <p
          className={`${khInterferenceRegularFont.className} text-3xl uppercase leading-none text-black sm:text-5xl`}
        >
          FAVORITOS
        </p>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-black/45">
          Aun no tienes productos guardados. Cuando marques un producto, va a
          aparecer aqui.
        </p>
        <button
          type="button"
          onClick={() => navigateWithTransition("/")}
          className="mt-8 rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-black/85"
        >
          Explorar productos
        </button>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-8 flex flex-col gap-2 sm:mb-12">
        <h1
          className={`${khInterferenceRegularFont.className} text-4xl uppercase leading-none tracking-[0] text-black sm:text-6xl`}
        >
          FAVORITOS
        </h1>
        <p className="max-w-xl text-sm text-black/45">
          Tus piezas guardadas para volver rapido cuando quieras comprar.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-7 md:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <LovedCard
            key={product.id}
            product={product}
            onOpen={() => navigateWithTransition(`/product/${product.slug}`)}
            onRemove={() => removeLoved(product.id)}
          />
        ))}
      </div>
    </section>
  );
};

type LovedCardProps = {
  product: LovedProduct;
  onOpen: () => void;
  onRemove: () => void;
};

function LovedCard({ product, onOpen, onRemove }: LovedCardProps) {
  return (
    <article className="group relative flex h-auto w-full flex-col justify-between bg-white pb-4 pt-4">
      <div className="relative mt-0 flex w-full cursor-pointer items-center justify-center overflow-hidden bg-white pb-1 pt-1 sm:mb-4">
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onRemove();
          }}
          className="absolute right-3 top-3 z-20 cursor-pointer text-black transition hover:text-black/60"
          aria-label="Quitar de favoritos"
        >
          <Heart className="size-5 fill-current" strokeWidth={1.5} />
        </button>

        <button
          type="button"
          onClick={onOpen}
          className="relative aspect-4/5 w-full cursor-pointer"
          aria-label={`Ver ${product.title}`}
        >
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 480px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain transition duration-300 ease-out group-hover:scale-[1.025]"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/[0.03]">
              <span className="text-sm text-black/35">Sin imagen</span>
            </div>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="flex items-baseline justify-between gap-3 px-1 text-left md:px-3"
      >
        <h2
          className={`${khInterferenceLightFont.className} min-w-0 flex-1 truncate text-left text-lg uppercase leading-[1.25] text-black sm:text-[17px]`}
        >
          {product.title}
        </h2>
        <p
          className={`${khInterferenceLightFont.className} shrink-0 whitespace-nowrap text-right text-[15px] font-semibold leading-[1.25] text-black`}
        >
          {formatPrice(product.price)}
        </p>
      </button>
    </article>
  );
}

export default LovedGrid;
