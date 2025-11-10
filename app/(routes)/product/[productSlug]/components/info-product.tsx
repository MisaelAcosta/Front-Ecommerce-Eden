'use client'

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatPrice";
import { ProductType } from "@/types/product";
import { Heart } from "lucide-react";


export type InfoProductProps = {
        product: ProductType

}

const InfoProduct = (props: InfoProductProps) => {
    const {product} = props;
    const {addItem} = useCart();
    



    return(
        <div>
            <div className="justify-between mb-3 sm:flex">
                
                    <h1 className="text-2xl">
                        {product.productName}
                    </h1>

                    <h2 className="text-2xl">
                        {product.productName2}
                    </h2>

                    <div className="flex item-center justify-bertween gap-3">
                        <p className="px-2 py-1 text-base font-extrabold">
                            {formatPrice(product.price)}
                        </p>
                    </div>

                    <Separator/>

                    <div>
                        
                        <div>
                         <h1 className="font-black text-2xl">Descripcion</h1>
                         <p>{product.description}</p>   
                        </div>

                        <div>
                         <h1 className="font-black text-2xl">Especificaciones</h1>
                         <p>{product.specs}</p>   
                        </div>
                        
                    </div>

                    <Separator/>

                    <div className="flex items-center gap-5">
                        <Button
                         className="cursor-pointer "
                         onClick={() => addItem(product)}
                         >
                            Comprar
                        </Button>

                        <button className="border-2">
                            <Heart 
                            width={38} 
                            strokeWidth={1} 
                            className="transition duration-300 cursor-pointer hover:fill-black"
                            onClick={() => console.log("Add to loved product")}
                            >

                            </Heart>
                        </button>
                    </div>


            </div>
        </div>
    );

}
export default InfoProduct;