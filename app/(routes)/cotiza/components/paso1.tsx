"use client";

import Image from "next/image";
import { cotizaTextBoldFont, cotizaTextRegularFont, cotizaTitleFont } from "./cotiza-fonts";

const Paso1 = () => {
  return (
    <section className="border-b border-black/10 bg-[#F3F3F3] 
    px-4 py-16 lg:py-25 sm:px-8 lg:px-12">
      <div className="mx-auto grid w-full max-w-[1400px] gap-8 
      lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        {/* Columna editorial con el texto guía del paso. */}
        <div>
          <p
            className={`${cotizaTextBoldFont.className} text-base 
            uppercase tracking-[0.35em] lg:text-2xl text-black/65`}
          >
            Paso 01
          </p>
          <h2
            className={`${cotizaTitleFont.className} mt-3 max-w-xl 
            text-4xl uppercase  leading-[1.30] 
            lg:leading-[1.20] sm:text-5xl lg:text-6xl
            lg:pt-10 pt-5`}
          >
            Principales paginas de modelos 3D
          </h2>
          <p
            className={`${cotizaTextRegularFont.className} mt-10 
            lg:mt-15
            max-w-lg text-sm leading-6 text-black/70 
            sm:text-base`}
          >
            Antes de cotizar, recomendamos descargar tu archivo desde
            plataformas reconocidas. El flujo ideal es simple: buscar, descargar
            el STL y volver aquí para cargarlo.
          </p>
        </div>

        {/* Tarjetas externas con logos reales ya presentes en public/cotiza. */}
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="https://makerworld.com/es?from=bambulab.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-[28px]  bg-white p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative h-30 lg:h-50 w-full">
              <Image
                src="/cotiza/makeword.png"
                alt="MakerWorld"
                fill
                className="object-contain"
              />
            </div>
          </a>

          <a
            href="https://cults3d.com/es"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-[28px] 
             bg-white p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative h-30 lg:h-50 w-full">
              <Image
                src="/cotiza/culst.png"
                alt="Cults"
                fill
                className="object-contain"
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Paso1;
