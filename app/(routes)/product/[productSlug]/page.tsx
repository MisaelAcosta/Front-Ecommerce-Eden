"use client"
import { useGetProductBySlug } from "@/api/getProductBySlug";
import { ResponseType } from "@/types/response";
import { useParams } from "next/navigation"
import SkeletonProdutc from "./components/skeleton-product";
import CarouselProduct from "./components/carousel-product";
import InfoProduct from "./components/info-product";


export default function page() {
    const params = useParams()
    const { productSlug } = params;

    const {result} : ResponseType = useGetProductBySlug(productSlug as string)
    console.log(result)

    if(result == null) {
       return <SkeletonProdutc/>
    }


    return (
        <div className="max-w-6xl py-4 mx-auto sm:py-32 sm:px-24 ">
            <div className="grid sm:grid-cols-2">
                <div>
                    <CarouselProduct images={result[0].images}></CarouselProduct>
                </div>

                <div className="sm:px-12">
                    <InfoProduct product={result[0]}/>
                </div>
            </div>
        </div>
    )
}