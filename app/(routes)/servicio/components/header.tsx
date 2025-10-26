"use client";
import Image from "next/image";
import { ArrowDown, Box } from "lucide-react";

const Header = () => {
  return (
    <section className="p-4"> 
      {/* wrapper Fondo negro */}
      <div
        className="
          w-full
          min-h-[500px]         /* alto mínimo como la maqueta mobile */
          sm:min-h-[700px]         /* alto mínimo como la maqueta desktop */
          rounded-xl             /* esquinas redondeadas */
          border border-white/80 /* borde blanco */
          bg-black               /* fondo negro */
          flex flex-col items-center justify-center /*alineacion de los contenidos*/
          overflow-hidden
          md:py-30
        "
      >
        {/* Cubo izquierdo */}
        <Box
          strokeWidth={0.1}  // 👈 hace la línea más delgada
          className="
            absolute
            left-4 top-1/2 -translate-y-1/2 /*Posicionamiento*/
            w-46 h-46 /*Mobil*/
            md:w-138 md:h-118 /*pc y tablets*/
            text-white
          "
        />

        {/* Cubo derecho */}
        <Box
          strokeWidth={0.1}  // 👈 hace la línea más delgada
          className="
            absolute
            right-2 top-1/3 -translate-y-1/2 /*Posicionamiento movil*/
            md:right-2 md:top-1/3 -translate-y-1/2  /*Posicionamiento pc y tablets*/
            w-46 h-46   /*Mobil*/
            md:w-138 md:h-118 /*pc y tablets*/
            text-white
          "
        />
        {/*Imagen del texto*/}
        
        <Image
          src="/SOLUCIONES.png" // 
          alt="Soluciones que toman forma"
          width={900}             // ajuste de imagen
          height={400}
          className="object-contain
            w-[70%]          /* ocupa 90% del ancho disponible en móvil */
            sm:w-[80%]       /* un poco más chico en tablets */
            md:w-[70%]       /* aún más controlado en desktop */
            lg:w-[60%]
            -mt-4            /* sube un poquito */
            transition-all "
        />
        {/* Texto debajo */}
        <p
          className="
            text-center
            text-bold
            text-gray-400
            text-xs/6
            sm:text-xl
            max-w-[700px]
            mt-4 sm:mt-6
            leading-relaxed
            transition-all
          "
        >
          Servicio de impresión 3D personalizado para particulares y empresas.
          Diseñamos, fabricamos y damos vida a tus ideas.
        </p>

        {/* Botón “Saber más” */}
        <button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          className="
            mt-8 sm:mt-10
            flex items-center gap-2
            px-6 py-3
            border border-white/70
            text-white
            rounded-full
            hover:bg-white hover:text-black
            transition-all duration-300
            text-sm sm:text-base
          "
        >
          desliza para ver más ;)
          <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
        
    </section>
    
  );
};

export default Header;
