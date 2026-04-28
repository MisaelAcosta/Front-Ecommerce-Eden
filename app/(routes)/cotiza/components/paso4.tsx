"use client";

import Image from "next/image";
import type { PrintPostProcess } from "@/types/print-quote";
import { formatPrice } from "@/lib/formatPrice";
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
    id: "none" as const,
    title: "No",
    description: "La pieza se entrega con el acabado directo de impresión.",
    image: "/servicios/img1.jpg",
    price: 0,
  },
  {
    id: "basic" as const,
    title: "Básico",
    description:
      "Incluye limpieza superficial y ajustes simples de presentación.",
    image: "/servicios/img3.png",
    price: 5000,
  },
  {
    id: "advanced" as const,
    title: "Avanzado",
    description:
      "Pensado para piezas más exigentes, con terminación extra y preparación visual.",
    image: "/servicios/img4.jpg",
    price: 15000,
  },
];

const Paso4 = ({ postProcess, onPostProcessChange }: Paso4Props) => {
  return (
    <section className="border-b border-black/10 bg-white px-4 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto grid w-full max-w-[1400px] gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Introducción del último paso opcional. */}
        <div>
          <p
            className={`${cotizaTextRegularFont.className} text-xs uppercase tracking-[0.35em] text-black/45`}
          >
            Paso 04
          </p>
          <h2
            className={`${cotizaTitleFont.className} mt-3 text-4xl uppercase leading-[0.9] sm:text-5xl lg:text-6xl`}
          >
            Selecciona post procesado
          </h2>
          <p
            className={`${cotizaTextRegularFont.className} mt-5 max-w-lg text-sm leading-6 text-black/70 sm:text-base`}
          >
            Este paso es opcional y suma un extra fijo sobre el precio base de
            CloudSlicer. Si no lo necesitas, puedes dejar la pieza tal como sale
            de impresión.
          </p>
        </div>

        {/* Tarjetas de selección con el extra reflejado directamente. */}
        <div className="grid gap-4 md:grid-cols-3">
          {options.map((option) => {
            const selected = option.id === postProcess;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onPostProcessChange(option.id)}
                className={`overflow-hidden rounded-[28px] border text-left transition-transform duration-300 hover:-translate-y-1 ${
                  selected
                    ? "border-black bg-[#f5f2ea]"
                    : "border-black/10 bg-white"
                }`}
              >
                <div className="relative h-48">
                  <Image
                    src={option.image}
                    alt={`Referencia ${option.title}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={`${cotizaTextBoldFont.className} text-xs uppercase tracking-[0.25em]`}
                    >
                      {option.title}
                    </p>
                    <span
                      className={`${cotizaTextBoldFont.className} text-xs uppercase tracking-[0.2em]`}
                    >
                      {option.price > 0
                        ? `+ ${formatPrice(option.price)}`
                        : "Incluido"}
                    </span>
                  </div>
                  <p
                    className={`${cotizaTextRegularFont.className} mt-3 text-sm leading-6 text-black/70`}
                  >
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Paso4;
