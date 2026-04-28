"use client";

import Image from "next/image";
import { cotizaTextRegularFont, cotizaTitleFont } from "./cotiza-fonts";

const Paso1 = () => {
  return (
    <section className="border-b border-black/10 bg-[#ebe8df] px-4 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto grid w-full max-w-[1400px] gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        {/* Columna editorial con el texto guía del paso. */}
        <div>
          <p
            className={`${cotizaTextRegularFont.className} text-xs uppercase tracking-[0.35em] text-black/45`}
          >
            Paso 01
          </p>
          <h2
            className={`${cotizaTitleFont.className} mt-3 max-w-xl text-4xl uppercase leading-[0.9] sm:text-5xl lg:text-6xl`}
          >
            Principales paginas de modelos 3D
          </h2>
          <p
            className={`${cotizaTextRegularFont.className} mt-5 max-w-lg text-sm leading-6 text-black/70 sm:text-base`}
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
            className="group rounded-[28px] border border-black/10 bg-white p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative h-16 w-full">
              <Image
                src="/cotiza/makeword.png"
                alt="MakerWorld"
                fill
                className="object-contain"
              />
            </div>
            <p
              className={`${cotizaTextRegularFont.className} mt-5 text-sm leading-6 text-black/65`}
            >
              Ideal para figuras, piezas utilitarias y modelos listos para
              impresión.
            </p>
          </a>

          <a
            href="https://cults3d.com/es"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-[28px] border border-black/10 bg-white p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative h-16 w-full">
              <Image
                src="/cotiza/culst.png"
                alt="Cults"
                fill
                className="object-contain"
              />
            </div>
            <p
              className={`${cotizaTextRegularFont.className} mt-5 text-sm leading-6 text-black/65`}
            >
              Muy útil para props, miniaturas y archivos de diseñadores
              independientes.
            </p>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Paso1;
