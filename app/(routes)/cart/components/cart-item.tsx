"use client"

import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatPrice";
import { cn } from "@/lib/utils";
import { ProductType } from "@/types/product";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItemProps {
    product: ProductType
}

const CartItem = ({ product }: CartItemProps) => {
    const router = useRouter();
    const { removeItem } = useCart();

    console.log("🟢 PRODUCT EN EL CARRITO:", product);

    const imageUrl = product.images?.[0]?.url
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.images[0].url}`
        : "/no-image.png";

    return (
        <li className="flex py-6 border-b">
            {/* Ruta del producto */}
            <div onClick={() => router.push(`/product/${product.slug}`)}>
                {/* Imagen del producto */}
                <img
                    src={imageUrl}
                    alt={product.productName || "Product"}
                    className="w-24 h-24 overflow-hidden rounded-md sm:w-auto sm:h-32"
                />
            </div>
            {/* Nombres y precio*/}
            <div className="flex justify-between flex-1 px-6">
                {/* Nombres 1 */}
                <h2
                className="text-lg font-bold"
                >{product.productName}</h2>
                {/* Nombres 2 */}
                <h3
                className="text-lg font-bold"
                >{product.productName2}</h3>
                {/*precio*/}
                <p>{formatPrice(product.price)}</p>
                 
                <div>
                    <button className={cn("rounded-full flex items-center justify-center bg-white border cursor-pointer p-1")}>
                        <X
                        size={20}
                        onClick={() => removeItem(product.id)}
                        ></X>
                    </button>
                </div>
            </div>
        </li>
    );
};

export default CartItem;

