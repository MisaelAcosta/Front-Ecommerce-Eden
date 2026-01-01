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
    <section className="w-full border border-black/40 pt-0 sm:pt-0">
      {/* HERO CON FONDO */}
      <div
        className="relative overflow-hidden border-b border-black/40 
        min-h-[110px] sm:min-h-[30px] md:min-h-[480px] md:min-w-[320px]"
      >
        {/* FONDO */}
        <div className="absolute inset-0 -z-10 bg-black">
          <Image
            src="/banner.png"
            alt="Fondo servicio impresión 3D"
            fill
            priority
            unoptimized
            className="
              object-cover
              md:object-contain
              md:object-[50%_35%]
              lg:object-[50%_25%]
            "
          />
          <div className="absolute inset-0" />
        </div>

        {/* CONTENIDO HERO */}
        <div className="px-6 sm:px-10 py-16 pt-36 sm:py-20 sm:pt-43 text-white">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <h1 className="font-black mb-8 sm:mb-20 tracking-tight leading-[0.95] text-[44px] sm:text-[64px] md:text-[78px]">
              SERVICIO DE
              <br />
              IMPRESIÓN 3D
            </h1>

            <nav className="flex sm:flex-col gap-6 sm:pr-10 md:gap-8 md:pt-3 text-sm">
              <Link
                href="#como-trabajamos"
                className="hover:underline underline-offset-4"
              >
                Cómo trabajamos
              </Link>
              <Link href="#galeria" className="hover:underline underline-offset-4">
                Galería
              </Link>
              <Link
                href="#contacto"
                className="hover:underline underline-offset-4"
              >
                Contacto
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* 2 BLOQUES */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left card */}
        <button
          type="button"
          onClick={() => toggle("pedidos")}
          data-open={active === "pedidos"}
          className="
            group relative w-full text-left
            md:border-t-0 md:border-r border-black/40
            min-h-[275px] sm:min-h-[490px]
            bg-transparent transition-colors duration-300
            hover:bg-black data-[open=true]:hover:bg-transparent
            overflow-hidden
          "
        >
          <div className="relative h-full cursor-pointer w-full">
            {/* CLOSED STATE */}
            <div
              className={`
                h-full px-6 sm:px-10 py-8 flex flex-col
                transition-all duration-500 ease-out
                ${
                  active === "pedidos"
                    ? "opacity-0 blur-sm scale-[0.98]"
                    : "opacity-100 blur-0 scale-100"
                }
              `}
            >
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

            {/* OPEN STATE */}
            <div
              className={`
                absolute inset-0
                transition-all duration-500 ease-out
                ${
                  active === "pedidos"
                    ? "opacity-100 blur-0 translate-y-0"
                    : "opacity-0 blur-sm translate-y-2 pointer-events-none"
                }
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
          </div>
        </button>

        {/* Right card */}
        <button
          type="button"
          onClick={() => toggle("negocio")}
          data-open={active === "negocio"}
          className="
            group relative w-full border-t  sm:border-none text-left
            border-black/40
            min-h-[275px] sm:min-h-[490px]
            bg-transparent transition-colors duration-300
            hover:bg-black data-[open=true]:hover:bg-transparent
            overflow-hidden
          "
        >
          <div className="relative h-full cursor-pointer w-full">
            {/* CLOSED STATE */}
            <div
              className={`
                h-full px-6 sm:px-10 py-4 border-t sm:py-8 flex flex-col
                transition-all duration-500 ease-out
                ${
                  active === "negocio"
                    ? "opacity-0 blur-sm scale-[0.98]"
                    : "opacity-100 blur-0 scale-100"
                }
              `}
            >
              <div className="flex-1 flex items-center sm:justify-center">
                <p
                  className="
                    text-sm text-black/70 
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

            {/* OPEN STATE */}
            <div
              className={`
                absolute inset-0
                transition-all duration-500 ease-out
                ${
                  active === "negocio"
                    ? "opacity-100 blur-0 translate-y-0"
                    : "opacity-0 blur-sm translate-y-2 pointer-events-none"
                }
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
                <div className="max-w-[560px] text-white">
                  <p className="text-xs sm:text-base font-medium mb-2">
                    Ideal para:
                  </p>
                  <ul className="text-xs sm:text-base list-disc pl-5 space-y-1 opacity-95">
                    <li>Optimización de procesos industriales</li>
                    <li>Desarrollo de productos personalizados para tu negocio</li>
                    <li>Prototipado rápido y fabricación bajo demanda</li>
                  </ul>

                  <p className="text-xs sm:text-base mt-4 opacity-90">
                    Te ayudamos a optimizar procesos y crear soluciones que
                    realmente funcionen.
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


