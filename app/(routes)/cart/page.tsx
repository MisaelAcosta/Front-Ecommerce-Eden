'use client'

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/formatPrice"
import CartItem from "./components/cart-item"


export default function Page() {
    const {items} = useCart()

    const prices = items.map((item) => item.price) 
    const totalPrice = prices.reduce((a, b) => a + b, 0)


    return(
        <div className="max-w-6xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
            <h1 className="mb-5 text-3xl font-black">
                Cart Page
            </h1>
            {/* Productos */}
            <div className="grid sm:rid-=cols-2 sm:gap-5">
                <div>
                   {items.length === 0 && (
                    <p>no hay productos en el carrito </p>
                )}

                <ul>
                    {items.map((item) => (
                        <CartItem key={item.id} item={item} />
                        ))}
                </ul>
                </div>

               <div className="max-w-xl">
                <div className="p-6 rounded-b-lg bg-slate-100">
                    {/* Titulo */}
                    <p className="mb-3 text-lg font-black">Order Summary</p>

                    <Separator/>

                     {/* Precio total */}
                    <div className="flex justify-between gap-5 my-4">
                        <p>Order total</p>
                        <p>{formatPrice(totalPrice)}</p>
                    </div>

                    {/* Boton comprar */}
                    <div className="flex items-center justify-between w-full mt-3">
                        <Button 
                        className="w-full cursor-pointer"
                        onClick={()=>console.log('buy')}>
                            Comprar
                        </Button>
                    </div>
                </div>

               </div>

            </div>
        </div>
    ) 
}




