"use client"
import { Heart, LucideShoppingCart, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import MenuList from "../menu-list";
import ItemsMenuMobile from "../items-menu-mobile";
import ToggleTheme from "../toggle-theme";


const Navbar = () => {
  const router = useRouter()  
  return (
    <div className="cursor-pointer border-b flex items-center justify-between p-5 w-full">
         {/*Logo*/}
         <div className="
        MÓVIL (0-639px): centrado 
        mx-5 flex items-center gap-4
        
        TABLET (768px+): margen específico + más gap 
        md:mx-25 md:gap-8
        
        DESKTOP (1024px+): mantiene configuración tablet 
        lg:mx-35 ">

        <h1 className="
        MÓVIL: texto mediano 
          font-black text-3xl cursor-pointer
          
        TABLET: texto más grande 
          md:text-3xl
          
        DESKTOP: texto máximo 
          lg:text-4xl
        " onClick={() => router.push("/")}>
          Eden
        </h1>

        <div className="hidden md:flex">
            <MenuList></MenuList>
        </div>

        </div>
        

        {/* Sección derecha: Iconos */}
        <div className="
        MÓVIL: gap pequeño 
        flex items-center gap-6
        
        TABLET: gap más grande + margen 
        md:gap-4 md:mx-35">
            <ShoppingCart
                 strokeWidth="1" 
                className="cursor-pointer " onClick={() => router.push("/cart")}></ShoppingCart>
            <Heart  
                strokeWidth="1" 
                className="cursor-pointer" onClick={() => router.push("/loved-products")}></Heart>
            <User 
                strokeWidth="1" 
                className="cursor-pointer
            MÓVIL: oculto
            hidden 
            TABLET: visible como flex 
            md:flex" onClick={() => router.push("/user")}></User>

            <ToggleTheme></ToggleTheme>


            {/* Menu móvil */}
        <div className="flex sm:hidden">
            <ItemsMenuMobile></ItemsMenuMobile>
        </div>
        </div>
    </div>
    );
}
export default Navbar;