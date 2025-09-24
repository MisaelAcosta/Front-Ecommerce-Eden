"use client"
import { ResponseType } from "@/types/response"
import { useGetCategoryProduct } from "@/api/getCategoryProduct"
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import FiltersControlsCategory from "./components/filters-controls-category";


export default function Page() {
    const params = useParams()
    const {categorySlug} = params
    console.log(categorySlug)

    const {result, loading}: ResponseType = useGetCategoryProduct(categorySlug)
    console.log(result)
    const router = useRouter()

    console.log(result)

    return (
        <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
            {result !== null && !loading && (
                <h1 className="text-3xl font-medium">
                    Productos {result[0].category.categoryName}
                </h1>
            )}
            <Separator/>
            <div className="sm:flex sm:justify-between">
                <FiltersControlsCategory/>
            </div>
        </div>
    )
}