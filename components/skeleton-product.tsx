import { Skeleton } from "@/components/ui/skeleton";

type ProductCardSkeletonProps = {
  className?: string;
};

const ProductCardSkeleton = ({ className }: ProductCardSkeletonProps) => {
  return (
    <div
      className={[
        "relative flex w-full flex-col justify-between overflow-hidden border-none bg-white px-3 pt-4 pb-4 shadow-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <div className="absolute top-7 right-6 z-10">
        <Skeleton className="h-9 w-9 rounded-full bg-black/8" />
      </div>

      <div className="mb-3 flex w-full items-center justify-center overflow-hidden bg-white pt-1 pb-1 sm:mb-4">
        <Skeleton className="aspect-4/5 w-full rounded-none bg-black/8" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-5 w-4/5 rounded-none bg-black/8 sm:h-6" />
        <Skeleton className="h-4 w-1/2 rounded-none bg-black/8 sm:h-5" />
        <Skeleton className="h-4 w-24 rounded-none bg-black/8 sm:h-5" />
      </div>
    </div>
  );
};

// SKELETON DE LA FICHA
// Replica galeria, informacion y recomendados para evitar el salto visual mientras
// Strapi carga. Los bloques `bg-black/8` son el tono neutro del catalogo.
const ProductDetailSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-[1490px] pt-6 md:pt-8 lg:px-6 lg:pt-10 xl:px-0" aria-hidden="true">
      {/* FICHA PRINCIPAL: misma grilla que la pagina de producto real. */}
      <div className="grid gap-9 lg:grid-cols-2 lg:gap-0">
        {/* GALERIA: el aspect-ratio conserva el espacio final de la imagen. */}
        <div className="relative aspect-[3.5/5] bg-[#ececec] sm:aspect-[5/6] lg:aspect-square lg:pt-8 xl:pt-15">
          <Skeleton className="h-full w-full rounded-none bg-black/8" />
          <div className="absolute bottom-2 right-2 flex gap-1 bg-white/30 p-1">
            <Skeleton className="size-10 rounded-none bg-black/12" />
            <Skeleton className="size-10 rounded-none bg-black/8" />
            <Skeleton className="size-10 rounded-none bg-black/8" />
          </div>
        </div>

        {/* INFORMACION: representa titulo, precio, descripcion, variantes y compra. */}
        <div className="space-y-6 px-4 pt-7 lg:max-w-[560px] lg:justify-self-center lg:px-6 lg:pt-12 xl:max-w-[600px] xl:pl-30 xl:pr-0 xl:pt-30">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-12 w-4/5 rounded-none bg-black/8 lg:h-16" />
              <Skeleton className="h-4 w-2/5 rounded-none bg-black/8" />
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="ml-auto h-4 w-20 rounded-none bg-black/8" />
              <Skeleton className="ml-auto h-4 w-16 rounded-none bg-black/8" />
            </div>
          </div>

          <Skeleton className="h-px w-full rounded-none bg-black/10" />

          {/* DESCRIPCION Y ESPECIFICACIONES */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-full rounded-none bg-black/8" />
            <Skeleton className="h-3 w-11/12 rounded-none bg-black/8" />
            <Skeleton className="h-3 w-4/5 rounded-none bg-black/8" />
          </div>
          <div className="space-y-2 border-y border-black/10 py-4">
            <Skeleton className="h-3 w-full rounded-none bg-black/8" />
            <Skeleton className="h-3 w-3/4 rounded-none bg-black/8" />
            <Skeleton className="h-3 w-5/6 rounded-none bg-black/8" />
          </div>

          {/* VARIANTES Y ACCIONES */}
          <div className="flex gap-2">
            <Skeleton className="size-13 rounded-none bg-black/8" />
            <Skeleton className="size-13 rounded-none bg-black/8" />
            <Skeleton className="size-13 rounded-none bg-black/8" />
          </div>
          <Skeleton className="h-px w-full rounded-none bg-black/10" />
          <div className="flex gap-3">
            <Skeleton className="size-10 rounded-none bg-black/8" />
            <Skeleton className="h-10 w-28 rounded-none bg-black/8" />
            <Skeleton className="h-10 flex-1 rounded-none bg-black/8" />
          </div>
        </div>
      </div>

      {/* RECOMENDADOS: se reserva su posicion para que el footer no salte al cargar. */}
      <section className="pt-24 lg:pt-32">
        <Skeleton className="h-10 w-64 rounded-none bg-black/8" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-none bg-black/8" />
              <Skeleton className="h-4 w-4/5 rounded-none bg-black/8" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export { ProductCardSkeleton, ProductDetailSkeleton };
export default ProductDetailSkeleton;
