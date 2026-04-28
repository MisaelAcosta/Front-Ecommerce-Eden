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
    <section className="border-b border-black/10 bg-[#F3F3F3] px-4 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto grid w-full max-w-[1400px] 
      gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Texto descriptivo del paso. */}
        <div>
          <p
            className={`${cotizaTextBoldFont.className} text-base lg:text-2xl
            uppercase tracking-[0.35em] text-black/65`}
          >
            Paso 03
          </p>
          <h2
            className={`${cotizaTitleFont.className} mt-3 lg:pt-10 pt-5
            text-4xl 
            uppercase leading-[0.9] sm:text-5xl lg:text-6xl`}
          >
            Selecciona la calidad y color
          </h2>
          <p
            className={`${cotizaTextRegularFont.className} mt-10 lg:mt-15
            max-w-lg text-sm leading-6 text-black/70 sm:text-base`}
          >
            La cotización actual trabaja con una única configuración de calidad
            estándar. También dejamos visible el flujo multicolor, pero marcado
            como no disponible por el momento.
          </p>
        </div>

        {/* Panel derecho con selección visual de color y calidad. */}
        <div className="rounded-[22px] border border-black/10 bg-white p-5">
          <div className="flex flex-wrap items-center gap-3">
            {colorOptions.map((color) => {
              const selected = color.id === selectedColor;

              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => onColorChange(color.id)}
                  className={`h-9 w-9 rounded-md 
                    border transition-transform duration-200 
                    hover:scale-105 cursor-pointer ${
                    selected
                      ? "border-black ]"
                      : "border-black/10"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Color ${color.label}`}
                />
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => onColorModeChange("single")}
              className={`rounded-[24px] border p-4 cursor-pointer text-left ${
                colorMode === "single"
                  ? "border-black bg-[#dadada]"
                  : "border-black/10"
              }`}
            >
              <p
                className={`${cotizaTextBoldFont.className} text-xs uppercase tracking-[0.25em]`}
              >
                Un color
              </p>
              <div className="relative mt-4 h-48 overflow-hidden rounded-[18px] border border-black/10">
                <Image
                  src="/servicios/servicio1.png"
                  alt="Vista referencial de impresión a un color"
                  fill
                  className="object-cover"
                />
              </div>
              <p
                className={`${cotizaTextRegularFont.className} mt-3 text-sm leading-6 text-black/70`}
              >
                Disponible ahora y listo para sumarse al precio base de la
                laminación.
              </p>
            </button>

            <div className="rounded-[24px] border border-dashed border-black/15 bg-black/[0.03] p-4 opacity-65">
              <p
                className={`${cotizaTextBoldFont.className} text-xs uppercase tracking-[0.25em]`}
              >
                Multicolor
              </p>
              <div className="relative mt-4 h-48 overflow-hidden rounded-[18px] border border-black/10">
                <Image
                  src="/servicios/img2.png"
                  alt="Vista referencial de impresión multicolor"
                  fill
                  className="object-cover"
                />
              </div>
              <p
                className={`${cotizaTextRegularFont.className} mt-3 text-sm leading-6 text-black/70`}
              >
                No disponible por el momento. Cuando habilites esta opción, ya
                queda preparado el campo para enlazar una referencia visual.
              </p>
              <input
                value={referenceLink}
                onChange={(event) => onReferenceLinkChange(event.target.value)}
                placeholder="https://referencia-colores.com/tu-imagen"
                disabled
                className="mt-3 h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black/60 outline-none disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => onQualityChange("standard")}
              className={`rounded-[22px] border p-4 text-left ${
                quality === "standard"
                  ? "border-black bg-[#f5f2ea]"
                  : "border-black/10"
              }`}
            >
              <p
                className={`${cotizaTextBoldFont.className} text-xs uppercase tracking-[0.25em]`}
              >
                Calidad estándar
              </p>
              <p
                className={`${cotizaTextRegularFont.className} mt-3 text-sm leading-6 text-black/70`}
              >
                Corresponde a la configuración actual que tienes activa en
                CloudSlicer.
              </p>
            </button>

            <div className="rounded-[22px] border border-dashed border-black/15 bg-black/[0.03] p-4 opacity-65">
              <p
                className={`${cotizaTextBoldFont.className} text-xs uppercase tracking-[0.25em]`}
              >
                Calidad rápida
              </p>
              <p
                className={`${cotizaTextRegularFont.className} mt-3 text-sm leading-6 text-black/70`}
              >
                No disponible por el momento. Este espacio queda listo para
                futuras configuraciones pagadas de impresora.
              </p>
            </div>
          </div>

          {!quoteReady && (
            <p
              className={`${cotizaTextRegularFont.className} mt-5 text-sm text-black/55`}
            >
              Sube un archivo primero para continuar con una cotización real.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Paso3;
