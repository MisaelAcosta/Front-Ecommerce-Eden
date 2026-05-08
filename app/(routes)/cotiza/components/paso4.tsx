"use client";

import Image from "next/image";
import type { PrintPostProcess } from "@/types/print-quote";
import {
  cotizaTextRegularFont,
  cotizaTitleFont,
  cotizaTextBoldFont,
} from "./cotiza-fonts";

type Paso4Props = {
  postProcess: PrintPostProcess;
  onPostProcessChange: (value: PrintPostProcess) => void;
};

const options = [
  {
    id: "basic" as const,
    title: "Básico",
    description:
      "Acabado simple de hasta 2 colores con efecto desgastado (brocha seca). Perfecto para dar carácter a la pieza sin procesos adicionales como pulido o barnizado.",
    image: "/servicios/img3.png",
  },
  {
    id: "advanced" as const,
    title: "Avanzado",
    description:
      "Trabajo completo de acabado con múltiples colores, masillado, lijado, pulido y barnizado. Ideal para lograr piezas con apariencia profesional y terminación premium.",
    image: "/servicios/img4.jpg",
  },
];

const Paso4 = ({ postProcess, onPostProcessChange }: Paso4Props) => {
  const hasPostProcess = postProcess !== "none";

  return (
    <section className="border-b border-black/10 bg-white px-4 py-16 lg:py-25 sm:px-8 lg:px-12">
      <div className="mx-auto grid w-full max-w-[1350px] gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        {/* Columna izquierda */}
        <div>
          <p
            className={`${cotizaTextBoldFont.className} text-base lg:text-2xl uppercase tracking-[0.35em] text-black/65`}
          >
            Paso 04
          </p>

          <h2
            className={`${cotizaTitleFont.className} mt-3 lg:pt-10 pt-5 text-4xl uppercase leading-[0.9] sm:text-5xl lg:text-6xl`}
          >
            Selecciona post procesado
          </h2>

          <p
            className={`${cotizaTextRegularFont.className} mt-10 lg:mt-15 max-w-lg text-sm leading-6 text-black/70 sm:text-base`}
          >
            Este paso es opcional y suma un extra fijo sobre el precio base de
            CloudSlicer. Si no lo necesitas, puedes dejar la pieza tal como sale
            de impresión.
          </p>

          {/* Input referencia */}
          <p
            className={`${cotizaTextRegularFont.className} mt-10 max-w-[260px] text-sm leading-6 text-black/45 sm:text-base`}
          >
            Adjunta el link de la imagen o video referencial.
          </p>

          <div className="mt-3 h-12 max-w-[390px] rounded-md bg-black/5" />
        </div>

        {/* Columna derecha */}
        <div>
          <div className="mb-10 flex flex-col items-start gap-4 sm:mb-16 sm:flex-row sm:items-center sm:justify-end sm:gap-8">
        <p
          className={`${cotizaTextBoldFont.className} max-w-[230px] text-sm uppercase leading-5 tracking-[0.12em]`}
        >
          Tu modelo requiere post procesado?
        </p>

          <div className="flex w-full max-w-[280px] overflow-hidden rounded-full border-[3px] border-black bg-black sm:w-auto">
            <button
              type="button"
              onClick={() =>
                onPostProcessChange(postProcess === "none" ? "basic" : postProcess)
              }
              className={`${cotizaTextBoldFont.className} flex-1 rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em] transition-colors sm:px-10 ${
                hasPostProcess ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              Si
            </button>

            <button
              type="button"
              onClick={() => onPostProcessChange("none")}
              className={`${cotizaTextBoldFont.className} flex-1 rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em] transition-colors sm:px-10 ${
                !hasPostProcess ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              No
            </button>
          </div>
        </div>

          <div className="grid gap-10 md:grid-cols-2">
            {options.map((option) => {
              const selected = option.id === postProcess;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onPostProcessChange(option.id)}
                  className={`group relative h-[545px] overflow-hidden rounded-md text-left transition-transform duration-300 hover:-translate-y-1 ${
                    selected ? "ring-4 ring-black" : ""
                  }`}
                >
                  <Image
                    src={option.image}
                    alt={`Referencia ${option.title}`}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-black/20" />

                  <div className="absolute left-4 top-5 right-4 flex items-start justify-between">
                    <p
                      className={`${cotizaTextBoldFont.className} text-2xl uppercase tracking-[0.05em] text-white`}
                    >
                      {option.title}
                    </p>

                    <span
                      className={`${cotizaTextBoldFont.className} flex h-7 w-7 items-center justify-center bg-black text-xl leading-none text-white`}
                    >
                      +
                    </span>
                  </div>

                  <p
                    className={`${cotizaTextBoldFont.className} absolute bottom-6 left-6 right-6 text-center text-sm uppercase leading-4 tracking-[0.05em] text-white`}
                  >
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Paso4;
