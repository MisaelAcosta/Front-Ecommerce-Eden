"use client"
import { useGetCategoryProduct } from "@/api/getCategoryProduct";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ResponseType } from "@/types/response";
import FiltersControlsCategory from "./filters-controls-category";


export default function Page() {
  const params = useParams();
  const router = useRouter();

  // puede ser string | string[], pasalo tal cual al hook
  const { categorySlug } = params as { categorySlug: string | string[] };

  const { result, loading }: ResponseType = useGetCategoryProduct(categorySlug);

  // Título seguro (cae al slug si no hay data)
  const title =
    result?.[0]?.attributes?.category?.data?.attributes?.categoryName ??
    (Array.isArray(categorySlug) ? categorySlug[0] : categorySlug);

  return (
    <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
      {!loading && (
        <h1 className="text-3xl font-medium">Productos {title}</h1>
      )}
      <Separator />
      <div className="sm:flex sm:justify-between">
         <FiltersControlsCategory/> 
      </div>
    </div>
    
  );
}
