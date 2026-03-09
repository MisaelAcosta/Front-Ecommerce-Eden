"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatPrice";
import { ProductType } from "@/types/product";
import { VariantType } from "@/types/variant";
import { PromotionType } from "@/types/promotion";
import { Heart, Minus, Plus } from "lucide-react";
import { useLoved } from "@/hooks/use-loved";

import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

export type InfoProductProps = {
  product: ProductType;
  variantsData?: VariantType[] | null;
};

type ProductWithOptionalAttributes = ProductType & {
  id?: number;
  attributes?: {
    id?: number;
  };
};

type ImageLike = {
  id?: number | string;
  url?: string | null;
};

type ImageInput = ImageLike | ImageLike[] | null | undefined;

/* ----------------------- helpers de promociones ----------------------- */

function isPromoActive(p: PromotionType, now = new Date()) {
  if (!p.active) return false;
  const start = p.startAt ? new Date(p.startAt) : null;
  const end = p.endAt ? new Date(p.endAt) : null;
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

function applyPromo(basePrice: number, promo: PromotionType | null) {
  if (!promo) return basePrice;

  const val = Number(promo.value || 0);
  let discount = 0;

  if (val <= 1) {
    discount = basePrice * val;
  } else if (val <= 100) {
    discount = basePrice * (val / 100);
  } else {
    discount = val;
  }

  const finalPrice = Math.max(0, Math.round(basePrice - discount));
  return finalPrice;
}

function pickBestPromo(basePrice: number, promos?: PromotionType[] | null) {
  if (!promos || promos.length === 0) return null;

  const actives = promos.filter((p) => isPromoActive(p));
  if (actives.length === 0) return null;

  let best: { promo: PromotionType; finalPrice: number } | null = null;

  for (const p of actives) {
    const fp = applyPromo(basePrice, p);
    if (!best || fp < best.finalPrice) {
      best = { promo: p, finalPrice: fp };
    }
  }

  return best ? best.promo : null;
}

const InfoProduct = ({ product, variantsData }: InfoProductProps) => {
  const { addItem } = useCart();
  const [qty, setQty] = useState<number>(1);

  const toggleLoved = useLoved((s) => s.toggleLoved);
  const isLoved = useLoved((s) => s.isLoved);

  const productData = product as ProductWithOptionalAttributes;
  const productId = productData?.id ?? productData?.attributes?.id ?? 0;
  const loved = isLoved(productId);

  /* ----------------------- Carusel y variantes ----------------------- */

  const variants: VariantType[] =
    ((variantsData && variantsData.length ? variantsData : product.variants) ?? []).filter(
      (v) => v.active
    );

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

  const currentVariant =
    selectedVariantId != null
      ? variants.find((v) => v.id === selectedVariantId) ?? null
      : null;

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  console.log("product.variants =>", product.variants);
  console.log("variantsData =>", variantsData);

  useEffect(() => {
    console.log("🟣 currentVariant FULL:", currentVariant);
    console.log("🟣 currentVariant.image:", currentVariant?.image);
  }, [currentVariant]);

  /* ---------------- precio + promo (variant > product) ---------------- */

  const basePrice = currentVariant?.price ?? product.price ?? 0;

  const bestVariantPromo = currentVariant
    ? pickBestPromo(basePrice, currentVariant.promotions)
    : null;

  const bestProductPromo = !bestVariantPromo
    ? pickBestPromo(basePrice, product.promotions)
    : null;

  const appliedPromo = bestVariantPromo ?? bestProductPromo ?? null;

  const finalPrice = appliedPromo ? applyPromo(basePrice, appliedPromo) : basePrice;
  const hasDiscount = appliedPromo !== null && finalPrice < basePrice;

  const specsToShow = currentVariant?.specs || product.specs || "";

  /* -------------------- imágenes para el carrusel --------------------- */

  const normalizeImages = (imgs: ImageInput): ImageLike[] =>
    Array.isArray(imgs) ? imgs : imgs ? [imgs] : [];

  const productImages = normalizeImages(product.images as ImageInput);
  const variantImages = normalizeImages(currentVariant?.image as ImageInput);

  const images = [
    ...variantImages,
    ...productImages.filter(
      (pImg) => !variantImages.some((vImg) => vImg.url === pImg.url)
    ),
  ];

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrentSlide(api.selectedScrollSnap());
    const onSelect = () => setCurrentSlide(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    api.scrollTo(0);
    setCurrentSlide(0);
  }, [currentVariant?.id, api]);

  const srcOf = (u?: string) =>
    u?.startsWith("http")
      ? u
      : `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${u ?? ""}`;

  /* -------------------- agregar variante al carrito ------------------- */

  const handleAddToCart = () => {
    if (variants.length > 0 && !currentVariant) {
      alert("Selecciona una variante primero 🙏");
      return;
    }

    if (!currentVariant) {
      alert("Este producto no tiene variantes configuradas.");
      return;
    }

    const variantFirstImg = Array.isArray(currentVariant.image)
      ? currentVariant.image[0]
      : currentVariant.image;

    const imageUrl = variantFirstImg?.url
      ? srcOf(variantFirstImg.url)
      : product.images?.[0]?.url
      ? srcOf(product.images[0].url)
      : "/no-image.png";

    addItem({
      productId: product.id,
      productSlug: product.slug,

      variantId: currentVariant.id,
      variantName: currentVariant.variantName,

      imageUrl,
      sku: currentVariant.sku ?? null,

      unitPrice: finalPrice,
      qty,
    });
  };

  const productFirstImg = Array.isArray(product.images)
    ? product.images?.[0]
    : product.images?.[0];

  const lovedPayload = {
    id: productId,
    title: product.productName ?? "Producto sin nombre",
    secondaryName: product.productName2 ?? null,
    price: Number(product.price ?? 0),
    imageUrl: productFirstImg?.url ? srcOf(productFirstImg.url) : null,
    slug: product.slug,
  };

  return (
    <div className="w-full max-w-6xl mx-auto pt-1 md:pt-0 ">
      <div className="grid gap-8 md:gap-14 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* COLUMNA IZQUIERDA: CARRUSEL */}
        <div className=" pt-1 md:pt-0">
          {images.length === 0 ? (
            <div className="text-centerpy-8 text-muted-foreground">
              No hay imágenes disponibles.
            </div>
          ) : (
            <>
              <Carousel
                setApi={setApi}
                opts={{ align: "start", loop: false }}
                className="relative"
              >
                <CarouselContent>
                  {images.map((img, index) => (
                    <CarouselItem key={img.id ?? index}>
                      <div
                        className="
                          w-full aspect-4/5
                          sm:aspect-5/6
                          md:border md:rounded-none
                          overflow-hidden
                          bg-black/5
                          flex items-center justify-center
                        "
                      >
                        <ImageZoom>
                          <Image
                            src={srcOf(img.url ?? undefined) || "/no-image.png"}
                            alt={`Imagen ${index + 1} del producto`}
                            className="h-full w-full object-contain object-center"
                            height={800}
                            width={800}
                            draggable={false}
                            unoptimized
                          />
                        </ImageZoom>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 hidden md:flex" />
                <CarouselNext className="right-2 top-1/2 -translate-y-1/2 hidden md:flex" />
              </Carousel>

              {/* Puntos de paginación */}
              <div className="mt-3 flex items-center justify-center gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Ir a la imagen ${i + 1}`}
                    onClick={() => api?.scrollTo(i)}
                    className={`h-2 w-2 rounded-full transition ${
                      currentSlide === i
                        ? "bg-foreground"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* COLUMNA DERECHA: INFO */}
        <div className="w-full max-w-180 md:max-w-none md:pl-16 pt-1 md:pt-0">
          <div className="flex items-start justify-between gap-2 px-5 md:px-0">
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

              {hasDiscount ? (
                <div className="flex flex-col items-end leading-tight">
                  <p className="text-sm line-through text-muted-foreground">
                    {formatPrice(basePrice)}
                  </p>
                  <p className="text-2xl font-extrabold tabular-nums text-red-500">
                    {formatPrice(finalPrice)}
                  </p>
                </div>
              ) : (
                <p className="text-2xl font-extrabold tabular-nums">
                  {formatPrice(basePrice)}
                </p>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          <section className="space-y-2 px-5 md:px-0">
            <h3 className="text-xl font-black">DESCRIPCION</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </section>

          <section className="mt-6 space-y-2 px-5 md:px-0">
            <h3 className="text-xl font-black">ESPECIFICACIONES</h3>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {specsToShow}
            </p>
          </section>

          {/* Selector de variantes */}
          {variants.length > 0 && (
            <section className="mt-6 space-y-3 px-5 md:px-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {variants.map((v) => {
                    const selected = currentVariant?.id === v.id;
                    const vImgs = normalizeImages(v.image as ImageInput);
                    const thumb = vImgs[0];

                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`flex h-15 w-15 items-center cursor-pointer justify-center rounded-full border transition hover:shadow-sm ${
                          selected ? "border-black bg-black/5" : "border-zinc-200 bg-white"
                        }`}
                        aria-pressed={selected}
                      >
                        {thumb?.url ? (
                          <Image
                            src={srcOf(thumb.url) || "/no-image.png"}
                            alt={v.variantName}
                            className="h-13 w-13 rounded-full object-cover"
                            width={52}
                            height={52}
                            draggable={false}
                            unoptimized
                          />
                        ) : (
                          <span className="text-xs font-semibold text-muted-foreground text-center px-1">
                            {v.variantName}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          <Separator className="my-6" />

          {/* CTA: cantidad + botón + wishlist */}
          <div className="flex flex-col items-stretch gap-4 sm:flex-row px-8 md:px-0 sm:items-center sm:justify-start">
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

            <div className="flex items-start justify-between gap-5 md:gap-3">
              <Button
                disabled={!product.active || (variants.length > 0 && !currentVariant)}
                onClick={handleAddToCart}
                className="h-10 flex-1 sm:flex-none sm:w-auto cursor-pointer"
              >
                AGREGAR AL CARRITO
              </Button>

              <button
                type="button"
                aria-label={loved ? "Quitar de favoritos" : "Agregar a favoritos"}
                onClick={() => toggleLoved(lovedPayload)}
                className="grid h-10 w-10 place-items-center border-black/40 rounded-lg cursor-pointer border hover:bg-muted"
              >
                <Heart
                  width={22}
                  strokeWidth={1.5}
                  className={loved ? "fill-foreground" : "hover:fill-foreground/90"}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoProduct;

