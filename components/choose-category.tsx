"use client"
import { useGetCategories } from "@/api/getProducts";
import Link from "next/link";
import { ResponseType } from "@/types/response";
import { CategoryType } from "@/types/category";

const ChooseCategory = () => {
  const { result, loading }: ResponseType = useGetCategories();
  console.log(result);

  return (
    <div className="max-w-6xl mx-auto sm:py-16 sm:px-24">
      <h3 className="px-6 pb-4 text-3xl sm:pb-8">Categorías Populares</h3>

      <div className="grid gap-5 sm:grid-cols-3">
        {!loading && result && result.length > 0 && (
          result.map((category: CategoryType) => {
            const slug = category.slug;
            const name = category.categoryName;
            const mainImageUrl = category.mainImage?.url;

            return (
              <Link
                key={category.id}
                href={`/category/${slug}`}
                className="relative max-w-xs mx-auto overflow-hidden bg-no-repeat bg-cover rounded-lg"
              >
                {mainImageUrl && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${mainImageUrl}`}
                    alt={name}
                    className="max-w-[270px] transition duration-300 ease-in-out rounded-lg hover:scale-110"
                    />
                )}
                <p className="absolute w-full py-2 text-lg font-bold text-center text-white bottom-5 backdrop-blur-lg ">
                    {category.categoryName}
                </p>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChooseCategory;


/*"use client"
import { useGetCategories } from "@/api/getProducts";
import Link from "next/link";
import { ResponseType } from "@/types/response";
import { CategoryType } from "@/types/category";


const ChooseCategory = () => {
    const { result, loading }:  ResponseType = useGetCategories();
    console.log(result);

    return (
        <div className="max-w-6xl mx-auto sm:py-16 sm:px-24">
            <h3 className="px-6 pb-4 text-3xl sm:pb-8">Categorias Populares</h3>

            <div className="grid gap-5 sm:grid-cols-3">
                {!loading && result === undefined &&(
                    result.map((category: CategoryType) => (  
                        <Link key={category.id} href={`/category/${category.attributes.slug}`} className="relative max-w-xs mx-auto overflow-hidden bg-no-repeat bg-cover rounded-lg">
                            <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${category.attributes.mainImage.data}`} 
                                 alt={category.attributes.name} 
                                 className="max-w-[270px] transition duration-300 ease-in-out rounded-lg hover:sacle-110"/> 
                        </Link>
                    ))
                )}

            </div>
        </div>

    );
}
export default ChooseCategory; */