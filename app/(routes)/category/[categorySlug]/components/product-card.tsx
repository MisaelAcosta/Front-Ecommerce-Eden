"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductType } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import type { PromotionType } from "@/types/promotion";
import { LovedButton } from "@/components/loved-button";
import { toAbsUrl } from "@/lib/media";
import { useNavigationTransition } from "@/components/navigation-transition-provider";

// TIPOGRAFIAS DE TARJETA
// Regular para titulo y Light para precios; cambiar aqui modifica todas las tarjetas del catalogo.
const khInterferenceLightFont = localFont({
  src: "../../../../../components/fonts/KHInterferenceTRIAL-Light.otf",
  weight: "300",
  style: "normal",
  display: "swap",
});

const khInterferenceRegularFont = localFont({
  src: "../../../../../components/fonts/KHInterferenceTRIAL-Regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
});

type PromotionLike = PromotionType & {
  value?: number | string | null;
};

type StrapiPromotionNode = {
  id?: number | string;
  attributes?: PromotionType & {
    id?: number | string;
  };
} & (PromotionType & {
  id?: number | string;
});

type PromotionsInput =
  | PromotionType[]
  | {
      data?: StrapiPromotionNode[] | StrapiPromotionNode | null;
    }
  | null
  | undefined;

type ProductImage = {
  url?: string | null;
};

type ProductAttrs = {
  id?: number | string;
  productName?: string | null;
  productName2?: string | null;
  variant?: string | null;
  slug?: string | null;
  price?: number | string | null;
  promotions?: PromotionsInput;
  images?:
    | ProductImage[]
    | {
        data?: Array<{
          attributes?: ProductImage;
        }> | null;
      }
    | null;
};

type ProductWithOptionalAttributes = ProductType & {
  id?: number | string;
  attributes?: ProductAttrs;
};

type ProductCardData = {
  id?: number | string;
  displayName: string;
  secondaryName: string;
  productSlug: string;
  basePrice: number;
  finalPrice: number;
  hasDiscount: boolean;
  image1: string | null;
  image2: string | null;
};

type ProductCardProps = {
  product: ProductType;
};

// VALIDAR PROMOCION
// Evalua estado y rango de fechas antes de mostrar cualquier precio rebajado.
function isPromoActive(promo: PromotionType, now = new Date()) {
  if (!promo?.active) return false;

  const start = promo.startAt ? new Date(promo.startAt) : null;
  const end = promo.endAt ? new Date(promo.endAt) : null;

  if (start && now < start) return false;
  if (end && now > end) return false;

  return true;
}

// CALCULAR DESCUENTO
// Acepta porcentaje (0-100), decimal (0-1) o monto fijo y devuelve el precio final.
function applyPromo(basePrice: number, promo: PromotionType | null) {
  if (!promo) return basePrice;

  const promoValue = (promo as PromotionLike).value;
  const value = Number(promoValue || 0);
  let discount = 0;

  if (value <= 1) discount = basePrice * value;
  else if (value <= 100) discount = basePrice * (value / 100);
  else discount = value;

  return Math.max(0, Math.round(basePrice - discount));
}

// ELEGIR MEJOR PROMOCION
// Si Strapi entrega varias promociones, muestra la que deja el precio menor al cliente.
function pickBestPromo(basePrice: number, promos?: PromotionType[] | null) {
  if (!promos || promos.length === 0) return null;

  const activePromos = promos.filter((promo) => isPromoActive(promo));
  if (activePromos.length === 0) return null;

  let best: { promo: PromotionType; finalPrice: number } | null = null;

  for (const promo of activePromos) {
    const finalPrice = applyPromo(basePrice, promo);
    if (!best || finalPrice < best.finalPrice) {
      best = { promo, finalPrice };
    }
  }

  return best ? best.promo : null;
}

// NORMALIZAR PROMOCIONES
// Soporta las dos formas de respuesta de Strapi: arreglo plano o relacion dentro de `data`.
function normalizePromotions(input: PromotionsInput): PromotionType[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;

  if (Array.isArray(input.data)) {
    return input.data.map((item) => ({
      ...(item?.attributes ?? item),
      id: item?.id ?? item?.attributes?.id,
    })) as PromotionType[];
  }

  if (input.data && typeof input.data === "object" && !Array.isArray(input.data)) {
    const item = input.data;
    return [
      {
        ...(item?.attributes ?? item),
        id: item?.id ?? item?.attributes?.id,
      } as PromotionType,
    ];
  }

  return [];
}

// NORMALIZAR IMAGENES
// Extrae las fotos sin importar si Strapi las entrega planas o dentro de una relacion `data`.
function getImagesArray(attrs: ProductAttrs): ProductImage[] {
  if (Array.isArray(attrs.images)) {
    return attrs.images;
  }

  if (attrs.images?.data && Array.isArray(attrs.images.data)) {
    return attrs.images.data
      .map((item) => item.attributes)
      .filter((image): image is ProductImage => Boolean(image));
  }

  return [];
}

// PREPARAR DATOS DE TARJETA
// Centraliza nombre, slug, fotos y precios para que la parte visual no dependa de Strapi directamente.
function buildProductCardData(product: ProductType): ProductCardData {
  const productData = product as ProductWithOptionalAttributes;
  const attrs: ProductAttrs = productData.attributes ?? (product as ProductAttrs) ?? {};
  const imagesArray = getImagesArray(attrs);
  const image1 = toAbsUrl(imagesArray[0]?.url ?? null);
  const image2 = toAbsUrl(imagesArray[1]?.url ?? null);
  const displayName = attrs.productName ?? "Producto sin nombre";
  const secondaryName = attrs.productName2 ?? attrs.variant ?? "";
  const productSlug = attrs.slug ?? "";
  const basePrice = Number(attrs.price ?? 0);
  const promos = normalizePromotions(attrs.promotions);
  const appliedPromo = pickBestPromo(basePrice, promos);
  const finalPrice = appliedPromo
    ? applyPromo(basePrice, appliedPromo)
    : basePrice;

  return {
    id: productData.id ?? attrs.id,
    displayName,
    secondaryName,
    productSlug,
    basePrice,
    finalPrice,
    hasDiscount: appliedPromo !== null && finalPrice < basePrice,
    image1,
    image2,
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  // NAVEGACION DE PRODUCTO
  // El click de la imagen usa la transicion global para abrir el detalle con suavidad.
  const { navigateWithTransition } = useNavigationTransition();
  const productCard = buildProductCardData(product);
  const {
    id,
    displayName,
    secondaryName,
    productSlug,
    basePrice,
    finalPrice,
    hasDiscount,
    image1,
    image2,
  } = productCard;

  return (
    // CONTENEDOR DE TARJETA
    // La tarjeta no tiene borde ni sombra; su separacion la entrega la grilla del catalogo.
    <Card
      className="group relative flex w-full 
      flex-col rounded-none border-none bg-white shadow-none"
    >
      <CardContent className="flex flex-col p-0">
        {/* AREA DE IMAGEN
            `aspect-[1.08/1.2]` cambia la proporcion movil.
            `lg:aspect-[1.08/1]` cambia la proporcion para pantallas grandes. */}
        <div
          className="
            relative flex w-full cursor-pointer items-center justify-center 
            overflow-hidden
            bg-neutral-100 text-left
            aspect-[1.08/1.3]
            lg:aspect-[1.08/1.2]
          "
          onClick={() =>
            productSlug && navigateWithTransition(`/product/${productSlug}`)
          }
        >
          {/* SELLO OFERTA: solo aparece si hay promocion activa. Ajustar left/top mueve su posicion. */}
          {hasDiscount && (
            <div
              className="
                absolute left-3 top-3 z-10 bg-black px-2 py-1
                text-[10px] font-black tracking-wide text-[#ADFE00]
                lg:left-4 lg:top-4 lg:px-3 lg:text-[11px]
              "
            >
              OFERTA
            </div>
          )}

          {/* FAVORITO: posicion absoluta sobre la imagen; right/top controlan su esquina. */}
          <div className="absolute right-3 top-3 z-20 lg:right-4 lg:top-4">
            <LovedButton
              product={{
                id: Number(id) || 0,
                title: displayName,
                secondaryName,
                price: basePrice,
                slug: productSlug,
                imageUrl: image1,
              }}
            />
          </div>

          {/* FOTOS: la primera es visible; la segunda aparece al hover en escritorio. */}
          <div className="relative size-full">
            {image1 && (
              <Image
                src={image1}
                alt={displayName}
                fill
                sizes="(max-width: 480px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
                className="
                  object-cover transition-all duration-300 ease-out
                  opacity-100 group-hover:opacity-0
                "
              />
            )}

            {image2 && (
              <Image
                src={image2}
                alt={displayName}
                fill
                sizes="(max-width: 480px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
                className="
                  object-cover transition-all duration-500 ease-out
                  opacity-0 group-hover:opacity-100
                "
              />
            )}

            {!image1 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Sin imagen</span>
              </div>
            )}
          </div>
        </div>

        {/* INFORMACION: nombre a la izquierda y precio a la derecha.
            En movil usa texto pequeno para que ambos quepan en dos columnas. */}
        <div
          className="
            flex items-baseline justify-between gap-2 px-1 pt-2 text-left
            sm:gap-3 sm:px-0
          "
        >
          <h3
            className={`${khInterferenceRegularFont.className}
              line-clamp-1 min-w-0 flex-1 text-[12px] uppercase leading-[1.2]
              sm:text-[18px] sm:leading-[1.25]
            `}
          >
            {displayName}
          </h3>
          {hasDiscount ? (
            // PRECIO EN OFERTA: precio original tachado + valor final debajo.
            <div className="shrink-0 leading-none text-right">
              <p
                className={`${khInterferenceLightFont.className}
                  text-[10px] text-black/40 line-through
                  sm:text-[15px]`}
              >
                {formatPrice(basePrice)}
              </p>
              <p
                className={`${khInterferenceLightFont.className}
                  whitespace-nowrap text-[12px] text-black tabular-nums
                  sm:text-[18px]`}
              >
                {formatPrice(finalPrice)}
              </p>
            </div>
          ) : (
            // PRECIO NORMAL: se muestra cuando no hay una promocion vigente.
            <p
              className={`${khInterferenceLightFont.className}
                shrink-0 whitespace-nowrap text-[12px] text-right leading-[1.2]
                sm:text-[18px]`}
            >
              {formatPrice(basePrice)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
