"use client";

import { Separator } from "@/components/ui/separator";
import { Menu, X, Instagram } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";



const overlayVariants = (originPx: string) => ({
  initial: { clipPath: `circle(0px at ${originPx})` },
  animate: {
    // 150vmax asegura cubrir la pantalla sin importar el origen
    clipPath: `circle(150vmax at ${originPx})`,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    clipPath: `circle(0px at ${originPx})`,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
});

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export default function ItemsMenuMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const [originPx, setOriginPx] = useState("100% 0%"); // fallback
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // Calcula el centro del botón en px para usarlo como origen del clip-path
  const computeOrigin = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    setOriginPx(`${x}px ${y}px`);
  };

  useEffect(() => {
    computeOrigin();
  }, []);

  useEffect(() => {
  if (!isOpen) return;
  computeOrigin();
  const onResize = () => computeOrigin();
  window.addEventListener("resize", onResize);
  return () => {
    window.removeEventListener("resize", onResize);
  };
}, [isOpen]);

  useEffect(() => {
  if (isOpen) {
    document.documentElement.style.overflow = "hidden"; // bloquea scroll
    document.body.style.overscrollBehavior = "contain"; // evita bounce en iOS
  } else {
    document.documentElement.style.overflow = "";
    document.body.style.overscrollBehavior = "";
  }
  return () => {
    document.documentElement.style.overflow = "";
    document.body.style.overscrollBehavior = "";
  };
}, [isOpen]);

  return (
    <>
      {/* Botón en la posición que quieras */}
      <button
        ref={btnRef}
        onClick={() => setIsOpen(v => !v)}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
        className="gap-3 p-2.5 rounded-md border border-black-600 bg-white text-black shadow-none z-50"
      >
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 90 : 0, scale: isOpen ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-4 h-4" />}
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 bg-white"
            variants={overlayVariants(originPx)}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="relative h-full w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="text-center w-full space-y-8 px-8"
                variants={listVariants}
                initial="hidden"
                animate="show"
              >
                <motion.div className="mb-28" variants={itemVariants}>
                  <h2 className="text-black text-6xl font-black mb-2">Eden</h2>
                  <p className="text-gray-400 text-sm">Navegación</p>
                </motion.div>

                <motion.div className="space-y-8">

                  <motion.div variants={itemVariants}>
                    <Link href="/products" className="block text-black text-3xl font-semibold hover:text-gray-300 transform hover:translate-x-2" onClick={() => setIsOpen(false)}>
                      Productos
                    </Link>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Link href="/servicio" className="block text-black text-3xl font-semibold hover:text-gray-300 transform hover:translate-x-2" onClick={() => setIsOpen(false)}>
                      Servicios
                    </Link>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Link href="/about" className="block text-black text-3xl font-semibold hover:text-gray-300 transform hover:translate-x-2" onClick={() => setIsOpen(false)}>
                      Perfil
                    </Link>
                  </motion.div>

                </motion.div>

                <motion.div className="mt-16 pt-8 flex items-center justify-center" variants={itemVariants}>
                  <Link
                    href="https://instagram.com/tuusuario"
                    target="_blank"
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm hover:bg-gray-200 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}






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