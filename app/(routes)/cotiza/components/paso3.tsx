"use client";

import Image from "next/image";
import type { PrintColorMode, PrintQuality } from "@/types/print-quote";
import {
  cotizaTextRegularFont,
  cotizaTitleFont,
  cotizaTextBoldFont,
} from "./cotiza-fonts";

type ColorOption = {
  id: string;
  label: string;
  hex: string;
};

type Paso3Props = {
  colorOptions: readonly ColorOption[];
  colorMode: PrintColorMode;
  selectedColor: string;
  quality: PrintQuality;
  referenceLink: string;
  quoteReady: boolean;
  onColorModeChange: (value: PrintColorMode) => void;
  onColorChange: (value: string) => void;
  onQualityChange: (value: PrintQuality) => void;
  onReferenceLinkChange: (value: string) => void;
};

const cardBaseClassName =
  "relative overflow-hidden rounded-[18px] border border-white/8 bg-[#050505] p-4 text-left shadow-[0_24px_60px_rgba(0,0,0,0.28)]";

const DecorativeMarks = () => (
  <div className="absolute right-4 top-4 grid grid-cols-2 gap-1 opacity-95">
    {[0, 1, 2, 3].map((item) => (
      <span
        key={item}
        className="h-4 w-4 rounded-[4px] bg-white"
        style={{
          clipPath:
            item % 2 === 0
              ? "polygon(0 0, 100% 0, 100% 100%)"
              : "polygon(0 0, 100% 0, 0 100%)",
        }}
      />
    ))}
  </div>
);

const Paso3 = ({
  colorOptions,
  colorMode,
  selectedColor,
  quality,
  referenceLink,
  quoteReady,
  onColorModeChange,
  onColorChange,
  onQualityChange,
  onReferenceLinkChange,
}: Paso3Props) => {
  return (
    <section className="border-b border-white/10 bg-[#161616] px-4 py-16 text-white sm:px-8 lg:px-12">
      <div className="mx-auto grid w-full max-w-[1350px] gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
        <div className="flex min-h-full flex-col">
          <p
            className={`${cotizaTextBoldFont.className} text-sm uppercase tracking-[0.35em] text-white/70 lg:text-xl`}
          >
            Paso 3
          </p>

          <h2
            className={`${cotizaTitleFont.className} mt-5 max-w-[420px] text-4xl uppercase leading-[0.88] text-white sm:text-5xl lg:mt-8 lg:text-6xl`}
          >
            Selecciona la calidad y color
          </h2>

          <p
            className={`${cotizaTextRegularFont.className} mt-auto max-w-[320px] pt-12 text-sm uppercase leading-6 tracking-[0.05em] text-white/58 sm:text-base`}
          >
            Personaliza el acabado de tu pieza seleccionando calidad y
            configuracion de color.
          </p>
        </div>

        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            {colorOptions.map((color) => {
              const selected = color.id === selectedColor;

              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => onColorChange(color.id)}
                  className={`h-6 w-6 rounded-[4px] border transition-all duration-200 hover:scale-110 ${
                    selected
                      ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.18)]"
                      : "border-white/12"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Color ${color.label}`}
                  aria-pressed={selected}
                />
              );
            })}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => onColorModeChange("single")}
              className={`${cardBaseClassName} min-h-[240px] transition-transform duration-300 hover:-translate-y-1 ${
                colorMode === "single"
                  ? "ring-1 ring-white/20"
                  : "border-white/12"
              }`}
              aria-pressed={colorMode === "single"}
            >
              <p
                className={`${cotizaTextBoldFont.className} relative z-10 text-lg uppercase tracking-[0.08em] text-white`}
              >
                Un color
              </p>

              <p
                className={`${cotizaTextRegularFont.className} absolute bottom-4 left-4 max-w-[220px] text-[10px] uppercase leading-4 tracking-[0.08em] text-white/60`}
              >
                Elige uno de nuestros colores disponibles para fabricar tu
                modelo utilizando la configuracion seleccionada.
              </p>

              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/60 to-transparent" />

              <div className="absolute bottom-0 right-2 h-[170px] w-[165px]">
                <Image
                  src="/servicios/servicio1.png"
                  alt="Vista referencial de impresion a un color"
                  fill
                  className="object-contain object-bottom grayscale"
                />
              </div>
            </button>

            <div
              className={`${cardBaseClassName} min-h-[240px] border-dashed border-white/10 bg-[#080808] opacity-80`}
            >
              <div className="flex items-start justify-between gap-3">
                <p
                  className={`${cotizaTextBoldFont.className} max-w-[180px] text-lg uppercase leading-[0.9] tracking-[0.08em] text-white`}
                >
                  Multi color (AMS)
                </p>

                <span
                  className={`${cotizaTextBoldFont.className} rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/70`}
                >
                  No disponible
                </span>
              </div>

              <p
                className={`${cotizaTextRegularFont.className} mt-12 max-w-[225px] text-[10px] uppercase leading-4 tracking-[0.08em] text-white/50`}
              >
                Impresion multicolor mediante sistema AMS. En la etapa actual se
                mantiene visible solo como referencia para una futura
                distribucion de colores.
              </p>

              <input
                value={referenceLink}
                onChange={(event) => onReferenceLinkChange(event.target.value)}
                placeholder="https://referencia-colores.com/tu-imagen"
                disabled
                className="mt-5 h-12 w-[70%] rounded-md border border-white/10 bg-white/10 px-4 text-sm text-white/45 outline-none disabled:cursor-not-allowed"
              />

              <div className="absolute bottom-0 right-2 h-[160px] w-[140px] opacity-75">
                <Image
                  src="/servicios/img2.png"
                  alt="Vista referencial de impresion multicolor"
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => onQualityChange("standard")}
              className={`${cardBaseClassName} min-h-[160px] transition-transform duration-300 hover:-translate-y-1 ${
                quality === "standard"
                  ? "ring-1 ring-white/20"
                  : "border-white/12"
              }`}
              aria-pressed={quality === "standard"}
            >
              <p
                className={`${cotizaTextBoldFont.className} text-lg uppercase tracking-[0.08em] text-white`}
              >
                Calidad estandar
              </p>

              <p
                className={`${cotizaTextRegularFont.className} mt-6 max-w-[250px] text-[10px] uppercase leading-4 tracking-[0.08em] text-white/55`}
              >
                Corresponde a la configuracion activa de impresion. Es la base
                disponible hoy y entrega un buen equilibrio entre detalle y
                tiempo de fabricacion.
              </p>

              <DecorativeMarks />
            </button>

            <div
              className={`${cardBaseClassName} min-h-[160px] border-dashed border-white/10 bg-[#080808] opacity-80`}
            >
              <p
                className={`${cotizaTextBoldFont.className} max-w-[220px] text-lg uppercase tracking-[0.08em] text-white`}
              >
                Calidad optimizada
              </p>

              <p
                className={`${cotizaTextRegularFont.className} mt-6 max-w-[250px] text-[10px] uppercase leading-4 tracking-[0.08em] text-white/50`}
              >
                Esta configuracion todavia no esta disponible. El bloque queda
                visible para integrar una variante futura con mayor detalle o
                parametros premium.
              </p>

              <DecorativeMarks />
            </div>
          </div>

          {!quoteReady && (
            <p
              className={`${cotizaTextRegularFont.className} mt-5 text-sm text-white/45`}
            >
              Sube un archivo primero para continuar con una cotizacion real.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Paso3;
