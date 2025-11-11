'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatPrice";
import { ProductType } from "@/types/product";
import { Heart, Minus, Plus } from "lucide-react";

export type InfoProductProps = {
  product: ProductType;
};

const InfoProduct = ({ product }: InfoProductProps) => {
  const { addItem } = useCart();
  const [qty, setQty] = useState<number>(1);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const handleAddToCart = () => {
    // Si tu carrito aún no soporta cantidad, agrega N veces:
    for (let i = 0; i < qty; i++) addItem(product);
    // Recomendación: luego podemos ajustar el store para recibir {product, qty}
  };

  return (
    <div className="w-full max-w-[720px] md:max-w-none pt-7 md:pt-0 ">
      {/* Header: títulos, disponibilidad y precio */}
        <div className="flex items-start justify-between gap-2 px-5 md:px-0">
        {/* Títulos */}
        <div className="min-w-0 mr-3">
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight">
            {product.productName}
            </h1>
            {product.productName2 ? (
            <h2 className="text-xl font-semibold text-muted-foreground leading-tight">
                {product.productName2}
            </h2>
            ) : null}
        </div>

        {/* Disponibilidad y precio (derecha, badge arriba y precio abajo) */}
        <div className="shrink-0 flex flex-col items-end gap-1">
            <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                product.active
                ? "border-emerald-500/40 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                : "border-zinc-300/40 bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
            }`}
            >
            {product.active ? "DISPONIBLE" : "NO DISPONIBLE"}
            </span>
            <p className="text-2xl font-extrabold tabular-nums">
            {formatPrice(product.price)}
            </p>
        </div>
        </div>

      <Separator className="my-4" />

      {/* Descripción */}
      <section className="space-y-2 px-5 md:px-0">
        <h3 className="text-xl font-black">DESCRIPCION</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </section>

      {/* Especificaciones */}
      <section className="mt-6 space-y-2 px-5 md:px-0">
        <h3 className="text-xl font-black">ESPECIFICACIONES</h3>
        {/* Si en Strapi guardas un texto largo en specs, lo mostramos directo.
            Si luego lo pasas a lista, podemos parsearlo a bullets. */}
        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
          {product.specs}
        </p>
      </section>

      <Separator className="my-6" />

      {/* CTA: cantidad + botón + wishlist */}
      <div className="flex flex-col items-stretch gap-4 sm:flex-row px-8 md:px-0 sm:items-center sm:justify-start">
        {/* Stepper cantidad */}
        <div className="inline-flex h-10 items-center justify-between rounded-lg border px-2">
          <button
            type="button"
            aria-label="Disminuir cantidad"
            onClick={dec}
            className="grid size-8 place-items-center rounded-md hover:bg-muted"
          >
            <Minus size={18} strokeWidth={1.5} />
          </button>
          <span className="w-8 text-center text-sm font-semibold tabular-nums">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Aumentar cantidad"
            onClick={inc}
            className="grid size-8 place-items-center rounded-md hover:bg-muted"
          >
            <Plus size={18} strokeWidth={1.5} />
          </button>
        </div>
        
        {/* Botón agregar al carrito */}
        <div className="flex items-start justify-between gap-5 md:gap-3">
        <Button
          disabled={!product.active}
          onClick={handleAddToCart}
          className="h-10 flex-1 sm:flex-none sm:w-auto cursor-pointer"
        >
          AGREGAR AL CARRITO
        </Button>

        <button
          type="button"
          aria-label="Agregar a favoritos"
          onClick={() => console.log("Add to loved product")}
          className="grid h-10 w-10 place-items-center border-black/40 rounded-lg cursor-pointer border hover:bg-muted"
        >
          <Heart width={22} strokeWidth={1.5} className="hover:fill-foreground/90" />
        </button>


        </div>
        
      </div>
    </div>
  );
};

export default InfoProduct;
