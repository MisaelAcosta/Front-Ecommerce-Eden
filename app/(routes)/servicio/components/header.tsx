"use client";

import Image from "next/image";
import { useState } from "react";
import localFont from "next/font/local";

// Tipografias locales del header de servicio.
const maratypeFont = localFont({
  src: "../../../../components/fonts/Maratype.otf",
  display: "swap",
});

const khInterferenceLightFont = localFont({
  src: "../../../../components/fonts/KHInterferenceTRIAL-Light.otf",
  weight: "300",
  style: "normal",
  display: "swap",
});

const khInterferenceRegularFont = localFont({
  src: "../../../../components/fonts/KHInterferenceTRIAL-Regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
});

const khInterferenceBoldFont = localFont({
  src: "../../../../components/fonts/KHInterferenceTRIAL-Bold.otf",
  weight: "700",
  style: "normal",
  display: "swap",
});

type ActiveCard = "pedidos" | "negocio" | null;

// Reemplaza este nombre cuando subas la imagen final a public/servicios.
const HERO_IMAGE_SRC = "/servicios/hero-servicio.jpg";
const HERO_IMAGE_FALLBACK = "/headerser.jpg";

const Header = () => {
  const [active, setActive] = useState<ActiveCard>(null);
  const [heroImageSrc, setHeroImageSrc] = useState(HERO_IMAGE_SRC);

  const toggle = (key: Exclude<ActiveCard, null>) => {
    setActive((prev) => (prev === key ? null : key));
  };

  return (
    <section className="w-full bg-white">
      {/* Bloque superior: titulo, subtitulo, descripcion e imagen principal. */}
      <div className="mx-auto max-w-[1220px] px-4 pt-28 pb-8 sm:px-6 sm:pt-32 lg:px-10 lg:pb-10">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
          <div>
            <h1
              className={`${maratypeFont.className} text-left text-[3.55rem] leading-[0.9] text-black sm:text-[6.2rem] lg:text-[7.4rem]`}
            >
              EDEN ESTUDIO
            </h1>

            <p
              className={`${khInterferenceBoldFont.className} mt-2 text-left text-[0.92rem] uppercase leading-none tracking-wide text-black sm:text-[1.1rem] lg:text-[1.35rem]`}
            >
              SERVICIO DE IMPRESIÓN Y MODELADO 3D
            </p>
          </div>

          <p
            className={`${khInterferenceLightFont.className} max-w-[300px] pt-2 text-left text-[0.72rem] uppercase leading-[1.15] text-black/70 sm:text-[0.82rem] lg:pt-5`}
          >
            Diseñamos y fabricamos piezas personalizadas mediante impresión 3D,
            combinando funcionalidad y diseño para proyectos reales. Trabajamos
            desde la idea inicial hasta la producción final, adaptando cada
            pieza a su uso, material y acabado.
          </p>
        </div>

        <div className="relative mt-6 overflow-hidden border border-black/10 bg-neutral-100 sm:mt-8">
          <div className="relative aspect-[16/10] w-full sm:aspect-[16/8.2]">
            <Image
              src={heroImageSrc}
              alt="Servicio de impresión y modelado 3D"
              fill
              priority
              className="object-cover object-center"
              onError={() => {
                if (heroImageSrc !== HERO_IMAGE_FALLBACK) {
                  setHeroImageSrc(HERO_IMAGE_FALLBACK);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Bloques interactivos de servicio. */}
      <div className="mx-auto grid max-w-[1220px] grid-cols-1 border-t border-black/20 md:grid-cols-2">
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
                <p
                  className={`${khInterferenceLightFont.className}
                    text-sm sm:text-base lg:text-lg 2xl:text-xl sm:text-center
                    text-black/60 group-hover:text-white/80
                    transition-colors duration-300
                    max-w-130 uppercase leading-[1.08]
                  `}
                >
                  Diseñamos e imprimimos piezas únicas inspiradas en
                  videojuegos, anime y series, adaptadas a tu idea, estilo y
                  necesidad.
                </p>
              </div>

              <div className="flex items-end justify-between gap-6">
                <h3
                  className={`${khInterferenceRegularFont.className} text-base sm:text-xl leading-tight text-black group-hover:text-white transition-colors duration-300 uppercase`}
                >
                  PEDIDOS
                  <br />
                  PERSONALIZADOS
                </h3>

                <span
                  className={`${khInterferenceLightFont.className} text-xs sm:text-sm text-black/50 group-hover:text-white/70 transition-colors duration-300 uppercase`}
                >
                  SABER MAS
                </span>
              </div>
            </div>

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
                <div className="max-w-130 text-white">
                  <p
                  className={`${khInterferenceLightFont.className} text-xs sm:text-base mb-2 uppercase leading-[1.08]`}
                >
                  Ideal para fans de videojuegos, anime y series; también
                  para regalos, piezas coleccionables, miniaturas y
                  decoración.
                </p>

                  <p
                  className={`${khInterferenceLightFont.className} text-xs sm:text-base mt-2 uppercase leading-[1.08]`}
                >
                  Cada pedido se hace a medida: ajustamos tamaño, material y
                  acabado según tu idea.
                </p>

                  <span
                    className={`${khInterferenceLightFont.className} inline-block mt-6 text-xs sm:text-sm opacity-80 underline underline-offset-4 uppercase`}
                  >
                    CLICK PARA VOLVER
                  </span>
                </div>
              </div>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => toggle("negocio")}
          data-open={active === "negocio"}
          className="
            group relative w-full text-left
            border-t md:border-t-0 border-black/20
            min-h-[40vh] md:min-h-[52vh]
            bg-white transition-colors duration-300
            hover:bg-black data-[open=true]:hover:bg-white
            overflow-hidden
          "
        >
          <div className="relative h-full w-full">
            <div
              className={`
                h-full px-6 sm:px-10 py-8 flex flex-col
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
                  className={`${khInterferenceLightFont.className}
                    text-black/60 group-hover:text-white/80
                    transition-colors duration-300
                    text-sm sm:text-base lg:text-lg 2xl:text-xl sm:text-center
                    max-w-130 uppercase leading-[1.08]
                  `}
                >
                  Desarrollamos soluciones en impresión 3D para resolver
                  problemas reales, optimizar procesos y adaptarnos a las
                  necesidades de tu negocio.
                </p>
              </div>

              <div className="flex items-end justify-between gap-6">
                <h3
                  className={`${khInterferenceRegularFont.className} text-base sm:text-xl leading-tight text-black group-hover:text-white transition-colors duration-300 uppercase`}
                >
                  SOLUCIONES PARA
                  <br />
                  TU NEGOCIO
                </h3>

                <span
                  className={`${khInterferenceLightFont.className} text-xs sm:text-sm text-black/50 group-hover:text-white/70 transition-colors duration-300 uppercase`}
                >
                  SABER MAS
                </span>
              </div>
            </div>

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
                <div className="max-w-130 text-white">
                  <p
                  className={`${khInterferenceLightFont.className} text-xs sm:text-base mb-2 uppercase leading-[1.08]`}
                >
                    La impresión 3D permite crear soluciones a medida cuando lo
                    estándar no alcanza.
                  </p>

                  <p
                    className={`${khInterferenceLightFont.className} text-xs sm:text-base mt-2 uppercase leading-[1.08]`}
                  >
                    Analizamos tu problema y desarrollamos una pieza funcional
                    que se adapte exactamente a tu uso.
                  </p>

                  <span
                    className={`${khInterferenceLightFont.className} inline-block mt-6 text-xs sm:text-sm opacity-80 underline underline-offset-4 uppercase`}
                  >
                    CLICK PARA VOLVER
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
