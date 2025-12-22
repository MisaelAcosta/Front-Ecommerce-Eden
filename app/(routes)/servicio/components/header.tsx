"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type ActiveCard = "pedidos" | "negocio" | null;

const Header = () => {
  const [active, setActive] = useState<ActiveCard>(null);

  const toggle = (key: Exclude<ActiveCard, null>) => {
    setActive((prev) => (prev === key ? null : key));
  };

  return (
    <section className="w-full bg-[#F1F1F1] border pt-20 sm:pt-25 border-black/40">
      {/* HERO + SUBNAV (solo de esta página) */}
      <div className="px-6 sm:px-10 py-16 sm:py-20 border-b border-black/40">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* TITULO */}
          <h1 className="font-black mb-8 sm:mb-20 tracking-tight leading-[0.95] text-[44px] sm:text-[64px] md:text-[78px]">
            SERVICIO DE
            <br />
            IMPRESION 3D
          </h1>

          {/* SUBNAV: Desktop a la derecha / Mobile abajo */}
          <nav className="flex sm:flex-col gap-6 sm:pr-10 md:gap-8 md:pt-3 text-sm">
            <Link href="#como-trabajamos" className="hover:underline underline-offset-4">
              Como trabajamos
            </Link>
            <Link href="#galeria" className="hover:underline underline-offset-4">
              Galeria
            </Link>
            <Link href="#contacto" className="hover:underline underline-offset-4">
              Contacto
            </Link>
          </nav>
        </div>
      </div>

      {/* 2 BLOQUES */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left card */}
        <button
          type="button"
          onClick={() => toggle("pedidos")}
          className="
            group relative w-full text-left
            border-t md:border-t-0 md:border-r border-black/40
            min-h-[275px] sm:min-h-[490px]
            bg-transparent transition-colors duration-300
            hover:bg-black
            overflow-hidden
          "
        >
          {/* OPEN STATE (imagen + texto) */}
          {active === "pedidos" ? (
            <div className="relative h-full w-full">
              <Image
                src="/pedidos.jpg" // <- cambia por tu imagen
                alt="Pedidos personalizados"
                fill
                className="object-cover"
                priority
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-black/35" />

              {/* contenido */}
              <div className="absolute inset-0 px-6 sm:px-10 py-8 flex flex-col justify-end">
                <div className="max-w-[520px] text-white">
                  <p className="text-sm sm:text-base font-medium mb-2">
                    Ideal para:
                  </p>

                  <ul className="text-sm sm:text-base list-disc pl-5 space-y-1 opacity-95">
                    <li>Fans de videojuegos, anime y series</li>
                    <li>Regalos personalizados y coleccionables</li>
                    <li>Miniaturas, props y objetos decorativos</li>
                  </ul>

                  <p className="text-sm sm:text-base mt-4 opacity-90">
                    Cada pedido se ajusta en tamaño, material y acabado según tu
                    necesidad.
                  </p>

                  <span className="inline-block mt-6 text-xs sm:text-sm opacity-80 underline underline-offset-4">
                    Click para volver
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* CLOSED STATE (tu diseño actual) */
            <div className="h-full px-6 sm:px-10 py-8 flex flex-col">
              {/* TEXTO CENTRADO VERTICAL */}
              <div className="flex-1 flex items-center sm:justify-center">
                <p className="text-sm sm:text-base text-black/70 group-hover:text-white/80 transition-colors duration-300 max-w-[420px] sm:text-center">
                  Diseñamos e imprimimos piezas únicas inspiradas en videojuegos,
                  anime y series, adaptadas a tu idea, estilo y necesidad.
                </p>
              </div>

              <div className="flex items-end justify-between gap-6">
                <h3 className="text-xl sm:text-2xl font-semibold leading-tight text-black group-hover:text-white transition-colors duration-300">
                  PEDIDOS
                  <br />
                  PERZONALISADOS
                </h3>

                <span className="text-xs sm:text-sm text-black/60 group-hover:text-white/70 transition-colors duration-300">
                  Saber mas
                </span>
              </div>
            </div>
          )}
        </button>

        {/* Right card */}
        <button
          type="button"
          onClick={() => toggle("negocio")}
          className="
            group relative w-full text-left
          border-black/40
            min-h-[275px] sm:min-h-[490px]
            bg-transparent transition-colors duration-300
            hover:bg-black
            overflow-hidden
          "
        >
          {/* OPEN STATE (imagen + texto) */}
          {active === "negocio" ? (
            <div className="relative h-full w-full">
              <Image
                src="/images/servicio/negocio.jpg" // <- cambia por tu imagen
                alt="Soluciones para tu negocio"
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/35" />

              <div className="absolute inset-0 px-6 sm:px-10 py-8 flex flex-col justify-end">
                <div className="max-w-[560px] text-white">
                  <p className="text-sm sm:text-base font-medium mb-2">
                    Ideal para:
                  </p>

                  <ul className="text-sm sm:text-base list-disc pl-5 space-y-1 opacity-95">
                    <li>Soportes, piezas a medida y prototipos</li>
                    <li>Reemplazo de componentes y mejoras</li>
                    <li>Producción corta para tu marca</li>
                  </ul>

                  <p className="text-sm sm:text-base mt-4 opacity-90">
                    Te ayudamos a optimizar procesos y crear soluciones que
                    realmente funcionen.
                  </p>

                  <span className="inline-block mt-6 text-xs sm:text-sm opacity-80 underline underline-offset-4">
                    Click para volver
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* CLOSED STATE (tu diseño actual) */
            <div className="h-full px-6 sm:px-10 py-4 border-t sm:py-8 flex flex-col">
              {/* TEXTO CENTRADO VERTICAL */}
              <div className="flex-1 flex items-center sm:justify-center">
                <p
                  className="
                    text-sm text-[#747474] font-medium 
                    group-hover:text-white/80 transition-colors duration-300
                    max-w-[420px] sm:text-center sm:text-base
                  "
                >
                  Desarrollamos soluciones en impresión 3D pensadas para resolver
                  problemas reales, optimizar procesos y adaptarse a las
                  necesidades de tu negocio.
                </p>
              </div>

              <div className="flex items-end justify-between gap-6">
                <h3 className="text-xl sm:text-2xl font-semibold leading-tight text-black group-hover:text-white transition-colors duration-300">
                  SOLUCIONES PARA
                  <br />
                  TU NEGOCIO
                </h3>

                <span className="text-xs sm:text-sm text-black/60 group-hover:text-white/70 transition-colors duration-300">
                  Saber mas
                </span>
              </div>
            </div>
          )}
        </button>
      </div>
    </section>
  );
};

export default Header;

