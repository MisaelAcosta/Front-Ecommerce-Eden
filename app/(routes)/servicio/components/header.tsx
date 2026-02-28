"use client";

import Image from "next/image";
import { useState } from "react";
import localFont from "next/font/local";



// -------- TIPOGRAFÍA (OPCIÓN B: FONT LOCAL) --------
// 1) Coloca tu archivo en: /public/fonts/servicio/Servicio.ttf
// 2) Si el nombre o formato cambia, ajusta el src.
const servicioLocal = localFont({
  src: "./fonts/SCHABO-XCondensed.otf",
  display: "auto",
});



// -------- CONFIG: CAMBIA AQUÍ PARA PROBAR --------
const USAR_FONT_LOCAL = false;
// -----------------------------------------------

type ActiveCard = "pedidos" | "negocio" | null;

const Header = () => {
  const [active, setActive] = useState<ActiveCard>(null);

  const toggle = (key: Exclude<ActiveCard, null>) => {
    setActive((prev) => (prev === key ? null : key));
  };

  

  return (
    <section className="w-full">
      {/* -------- HERO (IMAGEN SUPERIOR) -------- */}
      <div className="relative w-full h-[55vh] sm:h-[220px] md:h-[530px] overflow-hidden bg-black">
        <Image
          src="/headerser.jpg"
          alt="Servicio impresión 3D"
          fill
          priority
          className="object-cover object-center"
        />

        {/* (Opcional) leve sombra arriba para que se sienta más pro */}
        <div className="" />
      </div>
    
      {/* -------- BLOQUE BLANCO (TÍTULO + TEXTO) -------- */}
      <div className="w-full bg-white border-b border-black/20 ">

        <div className=" max-w-7xl py-8 sm:pt-15  sm:pb-25">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10
           md:gap-0 items-start ">
            {/* -------- TÍTULO GRANDE “SERVICIO” -------- */}
            <h1
              className={`
                ${servicioLocal.className}
                text-[#FF0000]
                leading-[0.85]
                items-left
                ml-3
                sm:ml-15
                items-start
                text-[18vh] sm:text-[190px] md:text-[190px] 
                font-condensed lg:text-[380px]
              `}
              style={{
                fontFamily: servicioLocal.style.fontFamily, // fuerza la font de next/font
                transform: "scaleY(1.05)",
                transformOrigin: "left top",
              }}
            >
              SERVICIO
            </h1>

            {/* -------- SUBTÍTULO -------- */}
            <p className="
              mt-2
              text-black
              text-base sm:text-sm md:text-xl
              tracking-[2 em]
              ml-3
              pt-33
              sm:ml-15
              uppercase sm:pt-70  lg:pt-75
              absolute 
              sm:absolute  
            ">
              EN IMPRESION Y MODELADO 3D
            </p>

            {/* -------- TEXTO DESCRIPTIVO A LA DERECHA -------- */}
            <div className="md:pt-45">
              <p className="text-black/65 sm:absolute
                sm:pl-90  text-sm font-light sm:text-xl
                sm:pr-30 
                sm:px-0
                pt-18
                py-10
                sm:py-0
                sm:pt-0
                px-12
                ">
                Diseñamos y fabricamos piezas personalizadas en impresión 3D, uniendo funcionalidad y diseño. Trabajamos desde la idea inicial hasta la producción final, 
                adaptando cada pieza a su uso, material y acabado.
              </p>
            </div>
          </div>
        </div>
      </div>





      {/* -------- 2 BLOQUES (PEDIDOS / NEGOCIO) -------- */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* -------- BLOQUE 01: PEDIDOS PERSONALIZADOS -------- */}
        <button
          type="button"
          onClick={() => toggle("pedidos")}
          data-open={active === "pedidos"}
          className="
            group relative w-full text-left
            md:border-r border-black/20
            min-h-[40vh] md:min-h-[52vh]
            bg-white transition-colors duration-300
            hover:bg-black data-[open=true]:hover:bg-white
            overflow-hidden
          "
        >
          <div className="relative h-full w-full">
            {/* -------- ESTADO CERRADO -------- */}
            <div
              className={`
                h-full px-6 sm:px-10 py-8 flex flex-col
                transition-all duration-500 ease-out
                ${active === "pedidos" ? "opacity-0 blur-sm scale-[0.98]" : "opacity-100 blur-0 scale-100"}
              `}
            >
              <div className="flex-1 flex items-center sm:justify-center">
                <p
                  className="
                    text-sm sm:text-base lg:text-lg 2xl:text-xl sm:text-center
                      text-black/60 group-hover:text-white/80
                      transition-colors duration-300 font-light
                    max-w-130
                  "
                >
                  Diseñamos e imprimimos piezas únicas inspiradas en videojuegos, anime y series,
                  adaptadas a tu idea, estilo y necesidad.
                </p>
              </div>

              <div className="flex items-end justify-between gap-6">
                <h3 className="text-base sm:text-xl font-semibold leading-tight text-black group-hover:text-white transition-colors duration-300">
                  PEDIDOS
                  <br />
                  PERSONALIZADOS
                </h3>

                <span className="text-xs sm:text-sm text-black/50 group-hover:text-white/70 transition-colors duration-300">
                  Saber más
                </span>
              </div>
            </div>

            {/* -------- ESTADO ABIERTO -------- */}
            <div
              className={`
                absolute inset-0
                transition-all duration-500 ease-out
                ${active === "pedidos" ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-sm translate-y-2 pointer-events-none"}
              `}
            >
              <Image
                src="/pedidos.jpg"
                alt="Pedidos personalizados"
                fill
                className="object-cover"
                priority
              />

              <div className="absolute inset-0 bg-black/35" />

              <div className="absolute inset-0 px-6 sm:px-10 py-8 flex flex-col justify-end">
                <div className="max-w-130 text-white">
                  <p className="text-xs sm:text-base font-light sm:font-medium mb-2">
                    Ideal para fans de videojuegos, anime y series; también para regalos, piezas coleccionables,
                    miniaturas y decoración.
                  </p>

                  <p className="text-xs sm:text-base mt-2 font-light sm:font-medium">
                    Cada pedido se hace a medida: ajustamos tamaño, material y acabado según tu idea.
                  </p>

                  <span className="inline-block mt-6 text-xs sm:text-sm opacity-80 underline underline-offset-4">
                    Click para volver
                  </span>
                </div>
              </div>
            </div>
          </div>
        </button>

        {/* -------- BLOQUE 02: SOLUCIONES PARA TU NEGOCIO -------- */}
        <button
          type="button"
          onClick={() => toggle("negocio")}
          data-open={active === "negocio"}
          className="
            group relative w-full text-left
            border-t
             md:border-t-0 border-black/20
            min-h-[40vh] md:min-h-[52vh]
            bg-white transition-colors duration-300
            hover:bg-black data-[open=true]:hover:bg-white
            overflow-hidden
          "
        >
          <div className="relative h-full w-full">
            {/* -------- ESTADO CERRADO -------- */}
            <div
              className={`
                h-full px-6 sm:px-10 py-8 flex flex-col
                transition-all duration-500 ease-out
                ${active === "negocio" ? "opacity-0 blur-sm scale-[0.98]" : "opacity-100 blur-0 scale-100"}
              `}
            >
              <div className="flex-1 flex items-center sm:justify-center">
                <p
                  className="
                    text-black/60 group-hover:text-white/80
                    transition-colors duration-300
                    text-sm sm:text-base font-light lg:text-lg 2xl:text-xl sm:text-center
                    max-w-130
                  "
                >
                  Desarrollamos soluciones en impresión 3D para resolver problemas reales, optimizar procesos
                  y adaptarnos a las necesidades de tu negocio.
                </p>
              </div>

              <div className="flex items-end justify-between gap-6">
                <h3 className="text-base sm:text-xl font-semibold leading-tight text-black group-hover:text-white transition-colors duration-300">
                  SOLUCIONES PARA
                  <br />
                  TU NEGOCIO
                </h3>

                <span className="text-xs sm:text-sm text-black/50 group-hover:text-white/70 transition-colors duration-300">
                  Saber más
                </span>
              </div>
            </div>

            {/* -------- ESTADO ABIERTO -------- */}
            <div
              className={`
                absolute inset-0
                transition-all duration-500 ease-out
                ${active === "negocio" ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-sm translate-y-2 pointer-events-none"}
              `}
            >
              <Image
                src="/ss.jfif"
                alt="Soluciones para tu negocio"
                fill
                className="object-cover"
                priority
              />

              <div className="absolute inset-0 bg-black/35" />

              <div className="absolute inset-0 px-6 sm:px-10 py-8 flex flex-col justify-end">
                <div className="max-w-130 text-white">
                  <p className="text-xs sm:text-base font-medium mb-2">
                    La impresión 3D permite crear soluciones a medida cuando lo estándar no alcanza.
                  </p>

                  <p className="text-xs sm:text-base mt-2 opacity-90">
                    Analizamos tu problema y desarrollamos una pieza funcional que se adapte exactamente a tu uso.
                  </p>

                  <span className="inline-block mt-6 text-xs sm:text-sm opacity-80 underline underline-offset-4">
                    Click para volver
                  </span>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>
    </section>
  );
};

export default Header;



