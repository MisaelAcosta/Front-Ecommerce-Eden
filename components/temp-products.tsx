"use client";

import { useGetTempProducts } from "@/api/useGetTempProducts";
import localFont from "next/font/local";
import SkeletonSchema from "./skeletonSchema";
import type { ResponseType } from "@/types/response";
import { formatPrice } from "@/lib/formatPrice";
import type { PromotionType } from "@/types/promotion";
import { toAbsUrl } from "@/lib/media";
import Image from "next/image";
import type { ProductType } from "@/types/product";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/fade-up";
import { useNavigationTransition } from "@/components/navigation-transition-provider";

// Local fonts used only by the temp products section.
const maratypeFont = localFont({
  src: "./fonts/Maratype.otf",
  display: "swap",
});

const khInterferenceLightFont = localFont({
  src: "./fonts/KHInterferenceTRIAL-Light.otf",
  weight: "300",
  style: "normal",
  display: "swap",
});

const khInterferenceRegularFont = localFont({
  src: "./fonts/KHInterferenceTRIAL-Regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
});

type ProductImage = {
  url?: string | null;
};

type StrapiImageWrapper = {
  attributes?: ProductImage | null;
};

type StrapiRelationArray<T> = {
  data?: T[] | null;
};

type StrapiRelationSingle<T> = {
  data?: T | null;
};

type PromotionLike = PromotionType & {
  value?: number | string | null;
};

type PromotionStrapiItem = {
  id?: number;
  attributes?: PromotionLike;
} & PromotionLike;

type ProductAttrs = {
  productName?: string | null;
  productName2?: string | null;
  variant?: string | null;
  slug?: string | null;
  price?: number | string | null;
  images?: ProductImage[] | StrapiRelationArray<StrapiImageWrapper> | null;
  promotions?:
    | PromotionType[]
    | StrapiRelationArray<PromotionStrapiItem>
    | StrapiRelationSingle<PromotionStrapiItem>
    | null;
};

type ProductWithAttributes = ProductType & {
  id: number;
  attributes?: ProductAttrs;
} & ProductAttrs;

type TempProductCardData = {
  id: number;
  displayName: string;
  secondaryName: string;
  productSlug: string;
  basePrice: number;
  finalPrice: number;
  hasDiscount: boolean;
  image1: string | null;
  image2: string | null;
};

// Promotion helpers used to decide the final visible price.
function isPromoActive(p: PromotionType, now = new Date()) {
  if (!p?.active) return false;
  const start = p.startAt ? new Date(p.startAt) : null;
  const end = p.endAt ? new Date(p.endAt) : null;
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

function applyPromo(basePrice: number, promo: PromotionType | null) {
  if (!promo) return basePrice;

  const promoValue = promo as PromotionLike;
  const val = Number(promoValue.value || 0);
  let discount = 0;

  if (val <= 1) discount = basePrice * val;
  else if (val <= 100) discount = basePrice * (val / 100);
  else discount = val;

  return Math.max(0, Math.round(basePrice - discount));
}

function pickBestPromo(basePrice: number, promos?: PromotionType[] | null) {
  if (!promos || promos.length === 0) return null;

  const actives = promos.filter((p) => isPromoActive(p));
  if (actives.length === 0) return null;

  let best: { promo: PromotionType; finalPrice: number } | null = null;

  for (const p of actives) {
    const fp = applyPromo(basePrice, p);
    if (!best || fp < best.finalPrice) best = { promo: p, finalPrice: fp };
  }

  return best ? best.promo : null;
}

// Normalize Strapi promotion payloads into a flat array the UI can consume.
function normalizePromotionItem(x: PromotionStrapiItem): PromotionType {
  const source = x?.attributes ?? x;
  const { id: sourceId, ...rest } = source;

  return {
    ...rest,
    id: x?.id ?? sourceId,
  } as PromotionType;
}

function normalizePromotions(
  input:
    | PromotionType[]
    | StrapiRelationArray<PromotionStrapiItem>
    | StrapiRelationSingle<PromotionStrapiItem>
    | null
    | undefined
): PromotionType[] {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input;
  }

  const data = "data" in input ? input.data : null;

  if (Array.isArray(data)) {
    return data.map(normalizePromotionItem);
  }

  if (data && typeof data === "object") {
    return [normalizePromotionItem(data)];
  }

  return [];
}

// Resolve product images regardless of whether Strapi returns raw arrays or relations.
function getImagesArray(attrs: ProductAttrs): ProductImage[] {
  if (Array.isArray(attrs.images)) {
    return attrs.images;
  }

  if (
    attrs.images &&
    "data" in attrs.images &&
    Array.isArray(attrs.images.data)
  ) {
    return attrs.images.data
      .map((i: StrapiImageWrapper) => i.attributes)
      .filter((img): img is ProductImage => Boolean(img));
  }

  return [];
}

// Convert the raw product payload into the shape used by the card UI.
function buildTempProductCardData(product: ProductType): TempProductCardData {
  const raw = product as ProductWithAttributes;
  const attrs: ProductAttrs = raw.attributes ?? raw;
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
    id: raw.id,
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

// Product card renderer used by the promotions grid.
function TempProductCard({
  product,
  onOpenProduct,
}: {
  product: TempProductCardData;
  onOpenProduct: (slug: string) => void;
}) {
  const {
    id,
    displayName,
    secondaryName,
    productSlug,
    basePrice,
    finalPrice,
    hasDiscount,
    image1,
  } = product;

  return (
    <article key={id} className="group w-full">
      <button
        type="button"
        className="
          relative block w-full overflow-hidden bg-neutral-100
          aspect-[1.08/1] cursor-pointer text-left
        "
        onClick={() => onOpenProduct(productSlug)}
        aria-label={`Ver ${displayName}`}
      >
        {hasDiscount && (
          <span
            className="
              absolute left-4 top-4 z-10 bg-black px-3 py-1
              text-[11px] font-black tracking-wide text-white
            "
          >
            OFERTA
          </span>
        )}

        {image1 ? (
          <Image
            src={image1}
            alt={displayName}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            unoptimized
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sin imagen
          </span>
        )}
      </button>

      <div className="pt-2 text-left">
        <h3
          className={`${khInterferenceRegularFont.className}
            text-2xl leading-none text-black sm:text-[26px]
            uppercase
          `}
        >
          {displayName}
        </h3>

        {secondaryName && (
          <p
            className={`${khInterferenceLightFont.className}
              text-[17px] leading-none text-black sm:text-[18px]
              uppercase
            `}
          >
            {secondaryName}
          </p>
        )}

        {hasDiscount ? (
          <div className="pt-1 leading-none">
            <p
              className={`${khInterferenceLightFont.className} text-[15px] text-black/40 line-through`}
            >
              {formatPrice(basePrice)}
            </p>
            <p
              className={`${khInterferenceLightFont.className} text-[18px] text-black tabular-nums`}
            >
              {formatPrice(finalPrice)}
            </p>
          </div>
        ) : (
          <p
            className={`${khInterferenceLightFont.className} pt-1 text-[18px] leading-none text-black tabular-nums`}
          >
            {formatPrice(basePrice)}
          </p>
        )}
      </div>
    </article>
  );
}

const TempProducts = () => {
  const { result, loading }: ResponseType = useGetTempProducts("halloween");
  const { navigateWithTransition } = useNavigationTransition();
  const tempProducts = Array.isArray(result)
    ? result.map(buildTempProductCardData).slice(0, 2)
    : [];

  // Keep navigation logic in one place instead of repeating it in the JSX.
  const handleOpenProduct = (slug: string) => {
    if (!slug) return;
    navigateWithTransition(`/product/${slug}`);
  };

  return (
    <section className="mx-auto max-w-[1350px] px-6 py-8 sm:px-8 sm:py-14 lg:px-0">
      <div>
        <motion.h3
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          custom={0}
          className={`${maratypeFont.className} text-4xl 
          text-left tracking-wide sm:tracking-tight sm:text-5xl mb-2 sm:mb-4`}
        >
          PROMOCIONES
        </motion.h3>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          custom={0.12}
          className={`${khInterferenceLightFont.className} text-black/55 text-left leading-none tracking-normal mb-6 text-base sm:text-base uppercase`}
        >
          Disfruta promociones y ofertas exclusivas en productos seleccionados.
        </motion.p>
      </div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        custom={0.2}
      >
        {loading && <SkeletonSchema grid={2} />}

        {!loading && (
          <div className="grid gap-1 md:grid-cols-2">
            {tempProducts.map((product) => (
              <TempProductCard
                key={product.id}
                product={product}
                onOpenProduct={handleOpenProduct}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default TempProducts;
