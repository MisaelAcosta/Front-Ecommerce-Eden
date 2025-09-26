"use client"
import { Separator } from "@/components/ui/separator";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ItemsMenuMobile = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 z-50 relative"
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-black" />
                ) : (
                    <Menu className="w-6 h-6" />
                )}
            </button>
            
            {/* Overlay de fondo */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-white/100 z-40 flex items-center justify-center"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="text-center w-full space-y-8 px-8" onClick={(e) => e.stopPropagation()}>
                        {/* Header del menú */}
                        <div className="mb-32">
                            <h2 className="text-black text-6xl font-black mb-2">Eden</h2>
                            <p className="text-gray-400 text-sm">Navegación</p>
                        </div>
                        
                        {/* Enlaces del menú */}
                        <div className="space-y-13">
                            <Separator className="w-full my-1 bg-gray-800"></Separator>
                            <Link 
                                href="/Products" 
                                className="block text-black text-3xl font-semibold hover:text-gray-300  transform hover:translate-x-2"
                                onClick={() => setIsOpen(false)}
                            >
                                Productos
                            </Link>
                            <Separator className="w-full my-1 bg-gray-800"></Separator>

                            <Link 
                                href="/Services" 
                                className="block text-black text-3xl font-semibold  hover:text-gray-300 transition-all duration-300 transform hover:translate-x-2"
                                onClick={() => setIsOpen(false)}
                            >
                                Servicios
                            </Link>
                            <Separator className="w-full my-1 bg-gray-800"></Separator>

                            <Link 
                                href="/About" 
                                className="block text-black text-3xl font-semibold  hover:text-gray-300 transition-all duration-300 transform hover:translate-x-2"
                                onClick={() => setIsOpen(false)}
                            >
                                Perfil
                            </Link>
                            <Separator className="w-full my-1 bg-gray-800"></Separator>

                        </div>
                        
                        {/* Footer del menú */}
                        <div className="mt-16 pt-8  block  border-gray-800">
                            <p className="text-gray-500 text-sm">Instagram</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ItemsMenuMobile;




/*import { Menu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";

const ItemsMenuMobile = () => {
    return (
        <Popover>
            <PopoverTrigger>
                <Menu></Menu>
            </PopoverTrigger>
            <PopoverContent>
                <Link href="/Products" className="block">Productos</Link>
                <Link href="/Products"className="block">Servicios</Link>
                <Link href="/Products"className="block">Quienes somos?</Link>
            </PopoverContent>
        </Popover>
    );
};

export default ItemsMenuMobile;*/