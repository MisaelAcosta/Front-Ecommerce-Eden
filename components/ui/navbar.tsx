"use client"
import { Heart, LucideShoppingCart, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import MenuList from "../menu-list";
import ItemsMenuMobile from "../items-menu-mobile";
import ToggleTheme from "../toggle-theme";


const Navbar = () => {
  const router = useRouter()  
  return (
    <div className="border-b flex items-center justify-between p-4 mx-auto cursor-pointer sm:max-w-4x1 md:m1ax-w-6x">
        <h1 className="text-3x1 mx-35 " onClick={() => router.push("/")}>Eden
            <span className="font-bold ">3D</span>
        </h1>
        <div className="item-center justify-between hidden md:flex">
            <MenuList></MenuList>
        </div>
        <div className="flex sm:hidden">
            <ItemsMenuMobile></ItemsMenuMobile>
        </div>
        <div className="flex items-center justify-between gap-2 sm:gap-7 ">
            <ShoppingCart strokeWidth="1" className="cursor-pointer" onClick={() => router.push("/cart")}></ShoppingCart>
            <Heart  strokeWidth="1" className="cursor-pointer" onClick={() => router.push("/loved-products")}></Heart>
            <User strokeWidth="1" className="cursor-pointer" onClick={() => router.push("/user")}></User>

            <ToggleTheme></ToggleTheme>
        </div>
    </div>
    );
}
export default Navbar;