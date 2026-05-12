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

const ProductDetailSkeleton = () => {
  return (
    <div
      className="mx-auto grid w-full max-w-6xl gap-8 pt-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-14 md:pt-0"
      aria-hidden="true"
    >
      <div>
        <Skeleton className="aspect-4/5 w-full rounded-none bg-black/8 sm:aspect-5/6" />
        <div className="mt-3 flex justify-center gap-2">
          <Skeleton className="h-2 w-2 rounded-full bg-black/12" />
          <Skeleton className="h-2 w-2 rounded-full bg-black/8" />
          <Skeleton className="h-2 w-2 rounded-full bg-black/8" />
        </div>
      </div>

      <div className="space-y-6 px-5 md:px-0 md:pl-16">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-8 w-4/5 rounded-none bg-black/8" />
            <Skeleton className="h-6 w-1/2 rounded-none bg-black/8" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-7 w-28 rounded-full bg-black/8" />
            <Skeleton className="h-7 w-24 rounded-none bg-black/8" />
          </div>
        </div>

        <Skeleton className="h-px w-full rounded-none bg-black/10" />

        <div className="space-y-3">
          <Skeleton className="h-6 w-40 rounded-none bg-black/8" />
          <Skeleton className="h-4 w-full rounded-none bg-black/8" />
          <Skeleton className="h-4 w-11/12 rounded-none bg-black/8" />
          <Skeleton className="h-4 w-3/4 rounded-none bg-black/8" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-6 w-48 rounded-none bg-black/8" />
          <Skeleton className="h-4 w-full rounded-none bg-black/8" />
          <Skeleton className="h-4 w-2/3 rounded-none bg-black/8" />
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-lg bg-black/8" />
          <Skeleton className="h-10 w-44 rounded-md bg-black/8" />
          <Skeleton className="h-10 w-10 rounded-lg bg-black/8" />
        </div>
      </div>
    </div>
  );
};

export { ProductCardSkeleton, ProductDetailSkeleton };
export default ProductDetailSkeleton;
