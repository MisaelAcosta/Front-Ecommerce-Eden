/*"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ProductType } from "@/types/product";

type Props = {
  product: ProductType;
  iconSrc?: string;           // opcional: ruta del planeta (svg/png)
};

export default function ProductCard({ product, iconSrc = "/icons/planet.svg" }: Props) {
  const router = useRouter();

  const { id, productName, slug, images, price } = product as any;

  // categoría opcional (ajusta según tu API de Strapi)
  const category: string | undefined =
    (product as any)?.category?.name ||
    (product as any)?.category?.title ||
    (product as any)?.category ||
    undefined;

  // primera imagen segura desde tu backend
  const imgPath = images?.[0]?.url ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${images[0].url}` : null;

  return (
    <Card
      className="group relative rounded-2xl border border-gray-200 shadow-none hover:shadow-sm transition-shadow"
      key={id}
    >
      {/* Header (categoría + icono) */
      /*<div className="flex items-start justify-between px-5 pt-4">
        <span className="text-sm text-muted-foreground">{category ?? "—"}</span>

        {/* Botón circular con icono (usa tu svg/png si existe; si no, Globe de Lucide) */
        /*<button
          className="h-8 w-8 shrink-0 rounded-full border border-gray-200 bg-white/70 backdrop-blur hover:bg-white flex items-center justify-center"
          aria-label="Detalles"
          type="button"
        >
          {iconSrc ? (
            <Image
              src={iconSrc}
              alt="icono"
              width={16}
              height={16}
              className="opacity-90"
            />
          ) : (
            <Globe size={16} className="opacity-90" />
          )}
        </button>
      </div>

      <CardContent className="px-5 pb-5 pt-2">
        {/* Imagen del producto */
        /*<div className="rounded-xl bg-muted/10 aspect-square w-full overflow-hidden mb-4 flex items-center justify-center">
          {imgPath ? (
            <img
              src={imgPath}
              alt={productName}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
            />
          ) : (
            <span className="text-sm text-muted-foreground">Sin imagen</span>
          )}
        </div>

        {/* Títulos */
        /*<div className="mb-2">
          <h3 className="text-base font-semibold leading-tight">{productName}</h3>
          {/* Subtítulo (usa tu subcategoría, variante, o slug si no hay) */
          /*<p className="text-sm text-muted-foreground">
            {(product as any)?.subtitle ?? (product as any)?.variant ?? (product as any)?.subCategory ?? "—"}
          </p>
        </div>

        {/* Precio + CTA */
        /*<div className="flex items-center justify-between">
          <p className="text-base font-semibold">${price}</p>

          <Button
            onClick={() => router.push(`/product/${slug}`)}
            size="sm"
            className="rounded-full"
          >
            Agregar <Plus className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} */
