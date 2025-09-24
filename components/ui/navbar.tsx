"use client"
import { Heart, LucideShoppingCart, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import MenuList from "../menu-list";
import ItemsMenuMobile from "../items-menu-mobile";
import ToggleTheme from "../toggle-theme";


const Navbar = () => {
  const router = useRouter()  
  return (
    <div className="cursor-pointer border-b flex items-center justify-between p-4 w-full">
         {/* Sección izquierda: Logo + Menu */}
        <div className="flex items-center gap-8 mx-35">
            <h1 className="font-black text-3xl cursor-pointer"
             onClick={() => router.push("/")}>Eden</h1>

        <div className="hidden md:flex">
            <MenuList></MenuList>
        </div>

        </div>
        {/* Menu móvil */}
        <div className="flex sm:hidden">
            <ItemsMenuMobile></ItemsMenuMobile>
        </div>
        {/* Sección derecha: Iconos */}
        <div className=" flex items-center gap-4 mx-35">
            <ShoppingCart
                 strokeWidth="1" 
                className="cursor-pointer " onClick={() => router.push("/cart")}></ShoppingCart>
            <Heart  
                strokeWidth="1" 
                className="cursor-pointer" onClick={() => router.push("/loved-products")}></Heart>
            <User 
                strokeWidth="1" 
                className="hidden md:flex cursor-pointer" onClick={() => router.push("/user")}></User>

            <ToggleTheme></ToggleTheme>
        </div>
    </div>
    );
}
export default Navbar;