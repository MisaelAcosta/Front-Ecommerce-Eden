"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import localFont from "next/font/local";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useCartNotification } from "@/hooks/use-cart-notification";
import { formatPrice } from "@/lib/formatPrice";
import { ProductType } from "@/types/product";
import { VariantType } from "@/types/variant";
import { PromotionType } from "@/types/promotion";
import { Heart, Minus, Plus } from "lucide-react";
import { useLoved } from "@/hooks/use-loved";
import { toast } from "sonner";

import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

// TIPOGRAFIAS DE LA FICHA
// Regular se usa para titulos y acciones; Light para subtitulos, precio y texto tecnico.
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

export type InfoProductProps = {
  // Producto que se muestra en la ficha.
  product: ProductType;
  // Variantes consultadas desde Strapi para seleccionar color, modelo o material.
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
  // CARRITO Y NOTIFICACIONES
  // `addItem` guarda la linea de compra; las notificaciones se conservan para flujos de variantes.
  const { addItem } = useCart();
  const { notifySelectVariant, notifyProductWithoutVariants } =
    useCartNotification();
  // CANTIDAD Y FAVORITOS
  // La cantidad se limita entre 1 y 99; `loved` indica si el usuario marco este producto.
  const [qty, setQty] = useState<number>(1);

  const toggleLoved = useLoved((s) => s.toggleLoved);
  const isLoved = useLoved((s) => s.isLoved);

  // ID NORMALIZADO
  // Soporta respuestas de Strapi con id plano o id anidado dentro de attributes.
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

  // CONTROLES DE CANTIDAD
  // Cambiar estos valores modifica el minimo y maximo que puede agregar el cliente.
  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  console.log("product.variants =>", product.variants);
  console.log("variantsData =>", variantsData);

  useEffect(() => {
    console.log("🟣 currentVariant FULL:", currentVariant);
    console.log("🟣 currentVariant.image:", currentVariant?.image);
  }, [currentVariant]);

  /* ---------------- precio + promo (variant > product) ---------------- */

  // PRECIO FINAL
  // Una promocion de variante tiene prioridad sobre una promocion del producto base.
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

  // GALERIA DE IMAGENES
  // La imagen de variante se muestra primero; despues se agregan fotos del producto sin duplicados.
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

  // ESTADO DEL CARRUSEL
  // `api` permite que miniaturas y flechas cambien la foto; `currentSlide` marca la miniatura activa.
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

  // URL DE IMAGEN
  // Convierte una ruta relativa de Strapi en URL completa usando la variable del backend.
  const srcOf = (u?: string) =>
    u?.startsWith("http")
      ? u
      : `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${u ?? ""}`;

  /* -------------------- agregar variante al carrito ------------------- */

  // AGREGAR AL CARRITO
  // Valida variante, calcula imagen/precio actual y agrega una linea de carrito con la cantidad elegida.
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
      kind: "product",
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

  // DATOS PARA FAVORITOS
  // El store de favoritos usa esta version resumida del producto fuera de la ficha.
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
    // CONTENEDOR DE FICHA
    // `lg:max-w-none` permite ocupar todo el ancho de escritorio en vez de centrar la ficha.
    <div className="mx-auto w-full max-w-[1120px] pt-1 md:pt-0 lg:max-w-none">
      {/* ESTRUCTURA 50 / 50 EN ESCRITORIO
          La primera columna usa `50vw`; la segunda contiene la informacion con margen interno. */}
      <div className="grid gap-9 lg:grid-cols-[50vw_minmax(0,1fr)] lg:gap-0">
        {/* COLUMNA IZQUIERDA: CARRUSEL */}
        <div className="pt-1 md:pt-0">
          {images.length === 0 ? (
            <div className="text-centerpy-8 text-muted-foreground">
              No hay imágenes disponibles.
            </div>
          ) : (
            <>
              {/* CARRUSEL PRINCIPAL: `setApi` conecta las miniaturas y flechas con la foto actual. */}
              <Carousel
                setApi={setApi}
                opts={{ align: "start", loop: false }}
                className="relative"
              >
                {/* `lg:-ml-0` y `lg:pl-0` eliminan el padding por defecto para tocar el borde izquierdo. */}
                <CarouselContent className="lg:-ml-0">
                  {images.map((img, index) => (
                    <CarouselItem key={img.id ?? index} className="lg:pl-0">
                      {/* MARCO DE FOTO: `lg:aspect-[4/5]` 
                      controla el alto desktop. */}
                      <div
                        className="
                          flex w-full items-center justify-center overflow-hidden
                          aspect-[4/5] bg-black/5
                          sm:aspect-[5/6]
                          lg:aspect-[6.3/6] lg:bg-[#ececec]
                        "
                      >
                        <ImageZoom>
                          {/* IMAGEN PRINCIPAL
                              - `object-contain` evita que se recorte el archivo original.
                              - `lg:scale-[0.82]` deja margen interior en escritorio. Baja el valor
                                (ej. 0.72) para hacerla mas pequena o subelo (ej. 0.9) para agrandarla.
                              - `object-center` centra el modelo; se puede cambiar por `object-bottom`
                                o `object-top` si alguna foto necesita otro encuadre. */}
                          <Image
                            src={srcOf(img.url ?? undefined) || "/no-image.png"}
                            alt={`Imagen ${index + 1} del producto`}
                            className="
                              h-full w-full object-contain object-center
                              transition-transform duration-300
                              lg:scale-[1]
                            "
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
                {/* FLECHAS: se ven desde lg. `left-3` y `right-3` controlan su posicion. */}
                <CarouselPrevious className="left-3 top-1/2 hidden -translate-y-1/2 rounded-none border-0 bg-transparent shadow-none hover:bg-transparent lg:flex" />
                <CarouselNext className="right-3 top-1/2 hidden -translate-y-1/2 rounded-none border-0 bg-transparent shadow-none hover:bg-transparent lg:flex" />

                {/* MINIATURAS SUPERPUESTAS
                    `bottom-2 right-2` controla la esquina dentro de la imagen.
                    Al estar dentro del Carousel no agrega altura debajo de la galeria. */}
                <div className="absolute bottom-2 right-2 z-30 flex gap-1 bg-white/30 p-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      aria-label={`Ir a la imagen ${i + 1}`}
                      onClick={() => api?.scrollTo(i)}
                      className={`relative size-10 overflow-hidden border transition-colors ${
                        currentSlide === i
                          ? "border-black"
                          : "border-transparent opacity-65 hover:border-black/40 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={srcOf(img.url ?? undefined) || "/no-image.png"}
                        alt={`Miniatura ${i + 1} del producto`}
                        fill
                        className="object-cover"
                        sizes="40px"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              </Carousel>

              {/* Puntos de paginación */}
              <div className="hidden mt-2 flex justify-end gap-1 lg:mt-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    aria-label={`Ir a la imagen ${i + 1}`}
                    onClick={() => api?.scrollTo(i)}
                    className={`relative size-10 overflow-hidden border 
                      transition-colors ${
                      currentSlide === i
                        ? "border-black"
                        : "border-transparent opacity-65 hover:border-black/40 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={srcOf(img.url ?? undefined) || "/no-image.png"}
                      alt={`Miniatura ${i + 1} del producto`}
                      fill
                      className="object-cover"
                      sizes="40px"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* COLUMNA DERECHA - INFORMACION
            `lg:pl-14` es el margen entre imagen y ficha; `lg:max-w-[440px]` limita el ancho. */}
        <div className="w-full pt-1 lg:max-w-[600px] lg:pl-30 lg:pt-30">
          {/* CABECERA: titulo/subtitulo a la izquierda y stock/precio a la derecha. */}
          <div className="flex items-start justify-between gap-5 px-1 md:px-0">
            <div className="min-w-0">
              <h1
                className={`${khInterferenceRegularFont.className}
                  text-3xl leading-none tracking-[0]
                  sm:text-5xl lg:text-[66px]`}
              >
                {product.productName}
              </h1>
              {product.productName2 ? (
                <h2
                  className={`${khInterferenceLightFont.className}
                    mt-2 text-xl leading-tight text-black/65
                    sm:text-2xl lg:text-[16px] lg:uppercase`}
                >
                  {product.productName2}
                </h2>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1 pt-1">
              <span
                className={`${khInterferenceRegularFont.className} 
                text-[16px] uppercase ${
                  product.active
                    ? "text-[#6d9500]"
                    : "text-black/45"
                }`}
              >
                {product.active ? "DISPONIBLE" : "NO DISPONIBLE"}
              </span>

              {hasDiscount ? (
                <div className="flex flex-col items-end leading-tight">
                  <p
                    className={`${khInterferenceLightFont.className} text-[16px] line-through text-black/45`}
                  >
                    {formatPrice(basePrice)}
                  </p>
                  <p
                    className={`${khInterferenceLightFont.className} text-[16px] tabular-nums text-red-500`}
                  >
                    {formatPrice(finalPrice)}
                  </p>
                </div>
              ) : (
                <p
                  className={`${khInterferenceLightFont.className} text-[16px] tabular-nums`}
                >
                  {formatPrice(basePrice)}
                </p>
              )}
            </div>
          </div>

          {/* SEPARADOR: `my-6` y `lg:my-7` ajustan el aire vertical entre bloques. */}
          <Separator className="my-6 bg-white lg:my-7" />

          {/* DESCRIPCION: el encabezado se oculta en desktop para seguir la ficha compacta. */}
          <section className="space-y-2 px-1 md:px-0">
            
            <p className={`${khInterferenceLightFont.className} text-sm 
            leading-relaxed text-black/65 lg:max-w-[400px] lg:text-[14px] 
            lg:leading-[1.18] lg:uppercase`}>
              {product.description}
            </p>
          </section>

          {/* ESPECIFICACIONES: bordes superior/inferior y texto tecnico en mayusculas desde desktop. */}
          <section className="mt-6 space-y-2 border-y border-black/30 px-1 py-4 md:px-0 lg:mt-7 lg:space-y-0">
            <h3
              className={`${khInterferenceRegularFont.className} text-2xl leading-none tracking-[0] lg:hidden`}
            >
              ESPECIFICACIONES
            </h3>
            <p className={`${khInterferenceLightFont.className} text-sm 
            leading-relaxed text-black/65 whitespace-pre-line 
            lg:text-[14px] lg:leading-[1.45] lg:uppercase`}>
              {specsToShow}
            </p>
          </section>

          {/* SELECTOR DE VARIANTES: cada miniatura actualiza imagen, precio y especificaciones. */}
          {variants.length > 0 && (
            <section className="mt-6 space-y-3 px-1 md:px-0">
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
                        className={`flex size-13 cursor-pointer items-center justify-center border transition-colors ${
                          selected ? "border-black bg-black/5" : "border-black/20 bg-white hover:border-black"
                        }`}
                        aria-pressed={selected}
                      >
                        {thumb?.url ? (
                          <Image
                            src={srcOf(thumb.url) || "/no-image.png"}
                            alt={v.variantName}
                            className="size-11 object-cover"
                            width={52}
                            height={52}
                            draggable={false}
                            unoptimized
                          />
                        ) : (
                          <span
                            className={`${khInterferenceLightFont.className} px-1 text-center text-xs text-muted-foreground`}
                          >
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

          {/* SEPARADOR ANTES DE COMPRA */}
          <Separator className="my-6 bg-white" />

          {/* CTA: cantidad + botón + wishlist */}
          <div className="flex flex-col items-stretch gap-4 px-1 sm:flex-row sm:items-center sm:justify-start md:px-0">
            <button
              type="button"
              aria-label={loved ? "Quitar de favoritos" : "Agregar a favoritos"}
              onClick={() => toggleLoved(lovedPayload)}
              className="grid h-10 w-10 shrink-0 place-items-center border border-black/25 bg-[#efefef] transition-colors hover:bg-[#ADFE00]"
            >
              <Heart
                width={18}
                strokeWidth={1.6}
                className={loved ? "fill-black" : ""}
              />
            </button>

            <div className="inline-flex h-10 items-center justify-between border border-black bg-black px-2 text-white">
              <button
                type="button"
                aria-label="Disminuir cantidad"
                onClick={dec}
                className="grid size-8 place-items-center transition-colors hover:bg-white/15"
              >
                <Minus size={18} strokeWidth={1.5} />
              </button>
              <span
                className={`${khInterferenceLightFont.className} w-8 text-center text-sm tabular-nums`}
              >
                {qty}
              </span>
              <button
                type="button"
                aria-label="Aumentar cantidad"
                onClick={inc}
                className="grid size-8 place-items-center text-[#ADFE00] transition-colors hover:bg-white/15"
              >
                <Plus size={18} strokeWidth={1.5} />
              </button>
            </div>

            <Button
              disabled={!product.active}
              onClick={handleAddToCart}
              className={`${khInterferenceRegularFont.className} h-10 flex-1 rounded-none bg-[#efefef] text-[11px] uppercase text-black hover:bg-[#ADFE00] sm:flex-none sm:px-5`}
            >
              Agregar al carrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoProduct;
