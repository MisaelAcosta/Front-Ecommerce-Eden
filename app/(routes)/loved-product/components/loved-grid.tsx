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
    <article className="group relative flex w-full flex-col justify-between bg-white pb-4">
      <div className="relative mb-3 flex w-full items-center justify-center overflow-hidden bg-white sm:mb-4">
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onRemove();
          }}
          className="absolute right-2 top-2 z-20 grid size-9 cursor-pointer place-items-center rounded-full border border-black/10 bg-white/90 text-black shadow-sm backdrop-blur transition hover:scale-105 hover:bg-black hover:text-white sm:right-4 sm:top-4"
          aria-label="Quitar de favoritos"
        >
          <Heart className="size-4 fill-current" strokeWidth={1.5} />
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

      <button type="button" onClick={onOpen} className="text-left">
        <h2
          className={`${khInterferenceRegularFont.className} line-clamp-1 text-[15px] uppercase leading-tight tracking-wide text-black sm:text-xl sm:tracking-tight`}
        >
          {product.title}
        </h2>

        {product.secondaryName ? (
          <p
            className={`${khInterferenceLightFont.className} line-clamp-1 text-[14px] tracking-wide text-black sm:text-lg sm:tracking-tight`}
          >
            {product.secondaryName}
          </p>
        ) : null}

        <p
          className={`${khInterferenceLightFont.className} mt-1 whitespace-nowrap text-[13px] text-black sm:text-[18px]`}
        >
          {formatPrice(product.price)}
        </p>
      </button>
    </article>
  );
}

export default LovedGrid;
