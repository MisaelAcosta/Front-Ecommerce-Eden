"use client"
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
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <Menu className="w-6 h-6" />
                )}
            </button>
            
            {/* Overlay de fondo */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/95 z-40 flex items-center justify-center"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="text-center space-y-8 px-8" onClick={(e) => e.stopPropagation()}>
                        {/* Header del menú */}
                        <div className="mb-12">
                            <h2 className="text-white text-3xl font-light mb-2">Eden</h2>
                            <p className="text-gray-400 text-sm">Navegación</p>
                        </div>
                        
                        {/* Enlaces del menú */}
                        <div className="space-y-6">
                            <Link 
                                href="/Products" 
                                className="block text-white text-2xl font-light hover:text-gray-300 transition-all duration-300 transform hover:translate-x-2"
                                onClick={() => setIsOpen(false)}
                            >
                                Productos
                            </Link>
                            <Link 
                                href="/Services" 
                                className="block text-white text-2xl font-light hover:text-gray-300 transition-all duration-300 transform hover:translate-x-2"
                                onClick={() => setIsOpen(false)}
                            >
                                Servicios
                            </Link>
                            <Link 
                                href="/About" 
                                className="block text-white text-2xl font-light hover:text-gray-300 transition-all duration-300 transform hover:translate-x-2"
                                onClick={() => setIsOpen(false)}
                            >
                                Quienes somos?
                            </Link>
                        </div>
                        
                        {/* Footer del menú */}
                        <div className="mt-16 pt-8 border-t border-gray-800">
                            <p className="text-gray-500 text-sm">2024</p>
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