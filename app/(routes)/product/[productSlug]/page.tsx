"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useGetProductBySlug } from "@/api/getProductBySlug";
import { useGetVariant } from "@/api/getVariant";
import ScrollReveal from "@/components/animation_page/scroll-reveal";
import SmoothScroll from "@/components/animation_page/smooth-scroll";
import type { ProductType } from "@/types/product";
import InfoProduct from "./components/info-product";
import Recommmended from "./components/recommended";

// TIPO DE PRODUCTO DE ESTA RUTA
// Incluye la categoria porque Recomendados necesita su slug para traer productos relacionados.
type ProductPageItem = ProductType & {
  id: number;
  category?: {
    slug?: string;
  } | null;
};

export default function Page() {
  // NAVEGACION Y SLUG
  // `productSlug` viene de la URL /product/[productSlug] y define que producto se consulta.
  const router = useRouter();
  const params = useParams();
  const { productSlug } = params as { productSlug: string };

  // CONSULTAS DE STRAPI
  // Producto principal y variantes se consultan por separado para no bloquear la ficha visual.
  const { result: productResult, loading: loadingProduct } =
    useGetProductBySlug(productSlug);
  const { result: variantsResult } = useGetVariant(productSlug);

  // NORMALIZACION
  // El hook devuelve arreglo; la ruta trabaja siempre con el primer resultado encontrado.
  const products = (productResult ?? []) as ProductPageItem[];

  // ESTADO DE CARGA
  // Evita renderizar una ficha incompleta mientras Strapi responde.
  if (loadingProduct || products.length === 0) {
    return <div>Cargando...</div>;
  }

  const product = products[0];

  return (
    // CONTENEDOR GENERAL
    // En escritorio `lg:max-w-none lg:px-0` permite que la galeria llegue al borde izquierdo.
    <SmoothScroll>
      <div
        className="
          mx-auto max-w-[1240px] px-4 py-8
          sm:px-8 sm:py-18
          lg:max-w-none lg:px-0 lg:py-0
        "
      >
       

        {/* FICHA PRINCIPAL: galeria, informacion, variantes, favoritos y carrito. */}
        <ScrollReveal delay={0.08}>
          <InfoProduct product={product} variantsData={variantsResult ?? []} />
        </ScrollReveal>

        {/* RECOMENDADOS: `pt-24` movil y `lg:pt-32` escritorio controlan la separacion. */}
        <ScrollReveal delay={0.12} className="pt-24 lg:pt-32">
          <Recommmended
            currentProductId={product.id}
            categorySlug={product.category?.slug ?? ""}
          />
        </ScrollReveal>
      </div>
    </SmoothScroll>
  );
}
