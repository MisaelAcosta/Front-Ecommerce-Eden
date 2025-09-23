"use client"
import { useGetCategories } from "@/api/getProducts";
import Link from "next/link";
import { ResponseType } from "@/types/response";


const ChooseCategory = () => {
    const { result, loading }:  ResponseType = useGetCategories();
    console.log(result);

    return (
        <div className="max-w-6xl mx-auto sm:py-16 sm:px-24">
            <h3 className="px-6 pb-4 text-3xl sm:pb-8">Categorias Populares</h3>
        </div>

    );
}
export default ChooseCategory;