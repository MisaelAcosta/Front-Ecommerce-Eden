"use client";

import Image from "next/image";
import type { PrintColorMode, PrintQuality } from "@/types/print-quote";
import {
  cotizaTextRegularFont,
  cotizaTitleFont,
  cotizaTextBoldFont,
  cotizaTextLightFont,
} from "./cotiza-fonts";

// ---- Tipos base del selector de color ----
type ColorOption = {
  id: string;
  label: string;
  hex: string;
};

// ---- Props del paso 3 ----
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

// ---- Clase base compartida por las tarjetas del paso 3 ----
const cardBaseClassName = [
  "relative",
  "overflow-hidden",
  "rounded-[10px]",
  "border",
  "border-white/8",
  "bg-[#050505]",
  "p-4",
  "text-left",
  "shadow-[0_24px_60px_rgba(0,0,0,0.28)]",
].join(" ");

// ---- Icono de apoyo para la tarjeta de calidad estandar ----
const StandardQualityIcon = () => (
  <div className="absolute right-3 top-3 opacity-95 sm:right-4 sm:top-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="44"
      viewBox="0 0 256 256"
      fill="none"
      aria-hidden="true"
      className="sm:h-[52px] sm:w-[52px]"
    >
      <path
        d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z"
        fill="rgb(222, 222, 222)"
      />
    </svg>
  </div>
);

// ---- Icono de apoyo para la tarjeta de calidad optimizada ----
const OptimizedQualityIcon = () => (
  <div className="absolute right-3 top-3 opacity-95 sm:right-4 sm:top-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="44"
      viewBox="0 0 256 256"
      fill="none"
      aria-hidden="true"
      className="sm:h-[52px] sm:w-[52px]"
    >
      <path
        d="M 64 128 C 64 163.346 92.654 192 128 192 L 128 256 C 57.308 256 0 198.692 0 128 Z M 192 128 C 192 163.346 220.654 192 256 192 L 256 256 C 185.308 256 128 198.692 128 128 Z M 64 0 C 64 35.346 92.654 64 128 64 L 128 128 C 57.308 128 0 70.692 0 0 Z M 192 0 C 192 35.346 220.654 64 256 64 L 256 128 C 185.308 128 128 70.692 128 0 Z"
        fill="rgb(222, 222, 222)"
      />
    </svg>
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
    // ---- Seccion principal del paso 3 ----
    <section
      className={[
        "border-b",
        "border-white/10",
        "bg-[#161616]",
        "px-4",
        "py-16",
        "text-white",
        "sm:px-8",
        "lg:px-12",
        "lg:py-25",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto",
          "grid",
          "w-full",
          "max-w-[1350px]",
          "gap-10",
          "lg:grid-cols-[0.78fr_1.22fr]",
          "lg:gap-14",
        ].join(" ")}
      >
        {/* ---- Columna editorial izquierda: paso, titulo y descripcion ---- */}
        <div>
          <p
            className={[
              cotizaTextBoldFont.className,
              "max-w-[220px]",
              "text-base",
              "uppercase",
              "tracking-[0.35em]",
              "text-white/70",
              "sm:max-w-none",
              "lg:text-2xl",
            ].join(" ")}
          >
            Paso 03
          </p>

          <h2
            className={[
              cotizaTitleFont.className,
              "mt-3",
              "max-w-xl",
              "pt-5",
              "text-[2.3rem]",
              "uppercase",
              "leading-[1.05]",
              "text-white",
              "sm:text-5xl",
              "sm:leading-[1.18]",
              "lg:pt-10",
              "lg:text-6xl",
              "lg:leading-[1.20]",
            ].join(" ")}
          >
            Selecciona la calidad y color
          </h2>

          <p
            className={[
              cotizaTextLightFont.className,
              "mt-8",
              "max-w-lg",
              "text-sm",
              "leading-6",
              "text-white/58",
              "sm:text-base",
              "sm:mt-10",
              "lg:mt-55",
              "lg:px-5",
            ].join(" ")}
          >
            Personaliza el acabado de tu pieza seleccionando calidad y
            configuracion de color.
          </p>
        </div>

        {/* ---- Columna interactiva derecha: selector y tarjetas ---- */}
        <div>
          {/* ---- Selector visual de colores disponibles ---- */}
          <div className="mb-5 flex flex-wrap items-center gap-2 sm:gap-3">
            {colorOptions.map((color) => {
              // Determina si este color corresponde al estado actualmente activo.
              const selected = color.id === selectedColor;

              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => onColorChange(color.id)}
                  className={[
                    "h-6",
                    "w-6",
                    "rounded-[2px]",
                    "border",
                    "transition-all",
                    "duration-200",
                    "hover:scale-110",
                    "sm:h-6",
                    "sm:w-6",
                    selected
                      ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.18)]"
                      : "border-white/12",
                  ].join(" ")}
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Color ${color.label}`}
                  aria-pressed={selected}
                />
              );
            })}
          </div>

          {/* ---- Grilla principal con tarjetas de color y calidad ---- */}
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {/* ---- Tarjeta de color unico disponible ---- */}
            <button
              type="button"
              onClick={() => onColorModeChange("single")}
              className={[
                cardBaseClassName,
                "min-h-[300px]",
                "rounded-[2px]",
                "p-4",
                "transition-transform",
                "duration-300",
                "hover:-translate-y-1",
                "sm:min-h-85",
                "sm:p-6",
                colorMode === "single"
                  ? "ring-1 ring-white/30"
                  : "border-white/12",
              ].join(" ")}
              aria-pressed={colorMode === "single"}
            >
              {/* Titulo principal de la tarjeta activa para impresion a un color. */}
              <p
                className={[
                  cotizaTextBoldFont.className,
                  "absolute",
                  "top-5",
                  "text-xl",
                  "uppercase",
                  "tracking-[0.08em]",
                  "text-white",
                  "sm:top-10",
                  "sm:text-2xl",
                ].join(" ")}
              >
                Un color
              </p>

              {/* Texto de apoyo que explica el comportamiento del modo activo. */}
              <p
                className={[
                  cotizaTextLightFont.className,
                  "absolute",
                  "bottom-5",
                  "left-4",
                  "max-w-44",
                  "text-[11px]",
                  "uppercase",
                  "leading-4",
                  "tracking-[0.08em]",
                  "text-white/90",
                  "sm:bottom-8",
                  "sm:max-w-55",
                  "sm:text-sm",
                ].join(" ")}
              >
                Elige uno de nuestros colores disponibles. Toda la impresion se
                realizara en el color seleccionado.
              </p>

              {/* Imagen de referencia visual asociada al modo de un solo color. */}
              <div
                className={[
                  "absolute",
                  "-bottom-6",
                  "-right-18",
                  "z-0",
                  "h-[280px]",
                  "w-[280px]",
                  "sm:-bottom-10",
                  "sm:-right-2",
                  "sm:-bottom-50",
                  "sm:h-[430px]",
                  "sm:w-[430px]",
                ].join(" ")}
              >
                <Image
                  src="/cotiza/uncolor.png"
                  alt="Vista referencial de impresion a un color"
                  fill
                  className="object-contain object-bottom-right scale-[1.02] sm:scale-[1.15]"
                />
              </div>
            </button>

            {/* ---- Tarjeta de impresion multicolor deshabilitada ---- */}
            <div
              className={[
                cardBaseClassName,
                "min-h-[300px]",
                "border-dashed",
                "border-white/40",
                "bg-[#080808]",
                "opacity-80",
                "sm:min-h-60",
              ].join(" ")}
            >
              {/* Cabecera con nombre de la opcion y estado actual. */}
              <div className="flex items-start justify-between gap-2 sm:gap-3 sm:pt-7">
                <p
                  className={[
                    cotizaTextBoldFont.className,
                    "max-w-[140px]",
                    "text-base",
                    "uppercase",
                    "leading-[0.9]",
                    "tracking-[0.08em]",
                    "text-white",
                    "sm:max-w-[180px]",
                    "sm:text-lg",
                  ].join(" ")}
                >
                  Multi color (AMS)
                </p>

                <span
                  className={[
                    cotizaTextRegularFont.className,
                    "rounded-full",
                    "border",
                    "border-white/12",
                    "bg-white/6",
                    "px-2",
                    "py-1",
                    "text-[8px]",
                    "uppercase",
                    "tracking-[0.22em]",
                    "text-white/70",
                    "sm:px-3",
                  ].join(" ")}
                >
                  No disponible
                </span>
              </div>

              {/* Texto explicativo del flujo AMS reservado para una etapa futura. */}
              <p
                className={[
                  cotizaTextRegularFont.className,
                  "mt-8",
                  "max-w-[160px]",
                  "text-[11px]",
                  "uppercase",
                  "leading-4",
                  "tracking-[0.08em]",
                  "text-white/50",
                  "sm:mt-12",
                  "sm:max-w-56",
                  "sm:text-sm",
                ].join(" ")}
              >
                Impresion multicolor mediante sistema AMS. Anade una referencia
                para definir los colores.
              </p>

              {/* Campo visible pero inactivo para mantener documentado el flujo futuro. */}
              <input
                value={referenceLink}
                onChange={(event) => onReferenceLinkChange(event.target.value)}
                placeholder="https://referencia-colores.com/tu-imagen"
                disabled
                className={[
                  "mt-5",
                  "h-12",
                  "w-full",
                  "rounded-md",
                  "border",
                  "border-white/10",
                  "bg-white/10",
                  "px-4",
                  "text-sm",
                  "text-white/45",
                  "outline-none",
                  "disabled:cursor-not-allowed",
                  "sm:w-[70%]",
                  "sm:mt-20",
                  "sm:w-[50%]",
                ].join(" ")}
              />

              {/* Imagen de referencia visual asociada al modo multicolor. */}
              <div
                className={[
                  "absolute",
                  "-bottom-2",
                  "right-0",
                  "z-0",
                  "h-[220px]",
                  "w-[145px]",
                  "sm:-right-2",
                  "sm:-right-2",
                  "sm:-bottom-5",
                  "sm:h-[430px]",
                  "sm:w-[180px]",
                ].join(" ")}
              >
                <Image
                  src="/cotiza/multicolor.png"
                  alt="Vista referencial de impresion multicolor"
                  fill
                  className="object-contain object-bottom-right scale-[1.02] sm:scale-[1.15]"
                />
              </div>
            </div>

            {/* ---- Tarjeta de calidad estandar disponible ---- */}
            <button
              type="button"
              onClick={() => onQualityChange("standard")}
              className={[
                cardBaseClassName,
                "min-h-40",
                "p-4",
                "transition-transform",
                "duration-300",
                "hover:-translate-y-1",
                "sm:p-4",
                quality === "standard"
                  ? "ring-1 ring-white/20"
                  : "border-white/12",
              ].join(" ")}
              aria-pressed={quality === "standard"}
            >
              {/* Nombre visible de la configuracion activa de calidad. */}
              <p
                className={[
                  cotizaTextBoldFont.className,
                  "max-w-[150px]",
                  "pr-12",
                  "text-base",
                  "uppercase",
                  "tracking-[0.08em]",
                  "text-white",
                  "sm:max-w-none",
                  "sm:pr-14",
                  "sm:text-lg",
                ].join(" ")}
              >
                Calidad estandar
              </p>

              {/* Resumen tecnico corto para explicar el acabado disponible hoy. */}
              <p
                className={[
                  cotizaTextLightFont.className,
                  "mt-4",
                  "max-w-[190px]",
                  "text-[11px]",
                  "uppercase",
                  "leading-4",
                  "tracking-[0.08em]",
                  "text-white/90",
                  "sm:mt-6",
                  "sm:max-w-62.5",
                  "sm:text-sm",
                ].join(" ")}
              >
                Boquilla 0.4 mm y capa 0.2 mm para un acabado equilibrado.
              </p>

              {/* Icono decorativo que refuerza visualmente la calidad estandar. */}
              <StandardQualityIcon />
            </button>

            {/* ---- Tarjeta de calidad optimizada no disponible ---- */}
            <div
              className={[
                cardBaseClassName,
                "min-h-40",
                "p-4",
                "border-dashed",
                "border-white/40",
                "bg-[#080808]",
                "opacity-80",
                "sm:p-4",
              ].join(" ")}
            >
              {/* Nombre de la calidad reservada para una implementacion futura. */}
              <p
                className={[
                  cotizaTextBoldFont.className,
                  "max-w-[150px]",
                  "pr-12",
                  "text-base",
                  "uppercase",
                  "tracking-[0.08em]",
                  "text-white",
                  "sm:max-w-55",
                  "sm:pr-14",
                  "sm:text-lg",
                ].join(" ")}
              >
                Calidad optimizada
              </p>

              {/* Resumen tecnico de la variante futura para dejar claro su objetivo. */}
              <p
                className={[
                  cotizaTextLightFont.className,
                  "mt-4",
                  "max-w-[190px]",
                  "text-[11px]",
                  "uppercase",
                  "leading-4",
                  "tracking-[0.08em]",
                  "text-white/50",
                  "sm:mt-6",
                  "sm:max-w-62.5",
                  "sm:text-sm",
                ].join(" ")}
              >
                Boquilla 0.6 mm y capa 0.3 mm para impresiones mas rapidas.
              </p>

              {/* Icono decorativo que diferencia la calidad optimizada. */}
              <OptimizedQualityIcon />
            </div>
          </div>

          {/* ---- Mensaje auxiliar cuando aun no existe una cotizacion lista ---- */}
          {!quoteReady && (
            <p
              className={[
                cotizaTextRegularFont.className,
                "mt-5",
                "text-sm",
                "text-white/45",
              ].join(" ")}
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
