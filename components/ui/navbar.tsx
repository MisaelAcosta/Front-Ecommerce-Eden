"use client"
import { Heart, LucideShoppingCart, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import MenuList from "../menu-list";
import ItemsMenuMobile from "../items-menu-mobile";
import ToggleTheme from "../toggle-theme";


const Navbar = () => {
  const router = useRouter()  
  return (
    <div className=" flex items-center justify-between p-8 pb-1 w-full">
         {/*Logo*/}
         <div className="
        MÓVIL (0-639px): centrado 
        mx-3 flex items-center gap-4
        
        TABLET (768px+): margen específico + más gap 
        md:mx-25 md:gap-8
        
        DESKTOP (1024px+): mantiene configuración tablet 
        lg:mx-5 ">

        <h1 className="
        MÓVIL: texto mediano 
          font-black text-3xl cursor-pointer
          
        TABLET: texto más grande 
          md:text-3xl
          
        DESKTOP: texto máximo 
          lg:text-5xl
        " onClick={() => router.push("/")}>
          Eden
        </h1>

        <div className="hidden md:flex ">
            <MenuList></MenuList>
        </div>

        </div>
        

        {/* Sección derecha: Iconos */}
        <div className="
        MÓVIL: gap pequeño 
        flex items-center gap-6 mx-2
        
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

            <div className="hidden md:flex">
              <ToggleTheme />

            </div>


            {/* Menu móvil */}
        <div className="flex sm:hidden  ">
            <ItemsMenuMobile></ItemsMenuMobile>
        </div>
        </div>
    </div>
    );
}
export default Navbar;