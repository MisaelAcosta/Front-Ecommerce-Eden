"use client";

import { useState, type RefObject } from "react";
import Image from "next/image";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ModelViewer } from "./model-viewer";
import {
  cotizaTextRegularFont,
  cotizaTitleFont,
  cotizaTextBoldFont,
  cotizaTextLightFont,
} from "./cotiza-fonts";

type Paso2Props = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  fileName: string;
  fileSizeLabel: string;
  uploadStatus: "idle" | "uploading" | "pricing" | "ready" | "error";
  uploadError: string | null;
  modelFile: File | null;
  quote: {
    basePrice: number;
    filamentCost: number | null;
    electricityCost: number | null;
    materialLabel: string;
    printTimeSeconds: number | null;
    estimatedWeightGrams: number | null;
    dimensions: {
      x: number;
      y: number;
      z: number;
    } | null;
    fitsPrinter: boolean | null;
  } | null;
  onOpenPicker: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  scalePercent: number;
  quoteScalePercent: number | null;
  canRequote: boolean;
  onScaleChange: (value: number) => void;
  onRequote: () => void;
};

function formatPrintTime(seconds: number | null) {
  if (!seconds || seconds <= 0) {
    return "En calculo";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours <= 0) {
    return `${minutes} min`;
  }

  return `${hours} h ${minutes} min`;
}

function formatCm(mm: number) {
  return (mm / 10).toFixed(1);
}

function scaleDimensions(
  dimensions: Paso2Props["quote"] extends infer Quote
    ? Quote extends { dimensions: infer Dimensions }
      ? Dimensions
      : never
    : never,
  fromScalePercent: number | null,
  toScalePercent: number
) {
  if (!dimensions || !fromScalePercent || fromScalePercent <= 0) {
    return dimensions;
  }

  const scaleFactor = toScalePercent / fromScalePercent;

  return {
    x: dimensions.x * scaleFactor,
    y: dimensions.y * scaleFactor,
    z: dimensions.z * scaleFactor,
  };
}

const uploadProgressByStatus = {
  idle: 0,
  uploading: 38,
  pricing: 76,
  ready: 100,
  error: 100,
} satisfies Record<Paso2Props["uploadStatus"], number>;

const uploadProgressLabel = {
  idle: "0%",
  uploading: "38%",
  pricing: "76%",
  ready: "100%",
  error: "Error",
} satisfies Record<Paso2Props["uploadStatus"], string>;

const progressSegments = Array.from({ length: 32 }, (_, index) => index);
const scaleMarkers = Array.from({ length: 24 }, (_, index) => index);
const scaleMinimum = 20;
const scaleMaximum = 300;
const scaleStep = 5;

const Paso2 = ({
  fileInputRef,
  fileName,
  fileSizeLabel,
  uploadStatus,
  uploadError,
  modelFile,
  quote,
  onOpenPicker,
  onFileChange,
  scalePercent,
  quoteScalePercent,
  canRequote,
  onScaleChange,
  onRequote,
}: Paso2Props) => {
  // DESPLEGABLE MOVIL: evita mostrar todos los datos tecnicos hasta que el cliente los solicite.
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
  const uploadProgress = uploadProgressByStatus[uploadStatus];
  const isProcessing = uploadStatus === "uploading" || uploadStatus === "pricing";
  const scaleNeedsUpdate = quoteScalePercent !== null && quoteScalePercent !== scalePercent;
  const showModelViewer = Boolean(modelFile && quote && quoteScalePercent === scalePercent);
  const filledSegments = Math.round((uploadProgress / 100) * progressSegments.length);
  const displayDimensions = scaleDimensions(
    quote?.dimensions ?? null,
    quoteScalePercent,
    scalePercent
  );
  const scaleMarkerPosition = Math.min(
    100,
    Math.max(
      0,
      ((scalePercent - scaleMinimum) / (scaleMaximum - scaleMinimum)) * 100
    )
  );
  const updateScaleBy = (amount: number) => {
    const nextScale = Math.min(
      scaleMaximum,
      Math.max(scaleMinimum, scalePercent + amount)
    );

    onScaleChange(nextScale);
  };

  return (
    <section className=" lg:border-l lg:border-black/10 bg-white px-4 py-16 sm:px-8 lg:px-12 lg:py-25">
      <div className="mx-auto grid w-full max-w-[1350px] gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div>
          <p
            className={`${cotizaTextBoldFont.className} text-base uppercase 
            tracking-[0.35em] text-black/65 lg:text-2xl`}
          >
            Paso 02
          </p>
          <h2
            className={`${cotizaTitleFont.className} mt-3 max-w-xl pt-5 text-4xl uppercase leading-[1.30] sm:text-5xl lg:pt-10 lg:text-6xl lg:leading-[1.20]`}
          >
            Carga tu archivo
          </h2>
          <p
            className={`${cotizaTextRegularFont.className} mt-10 
            max-w-lg text-[13px] leading-5 lg:leading-6 text-black/70 sm:text-base lg:mt-15`}
          >
            Sube tu modelo 3D, revisa la vista previa y ajusta su tamaño antes
            de recalcular. Las medidas se muestran en centimetros.
          </p>

          <div
            className={`${cotizaTextRegularFont.className} mt-6 bg-[#e4e4e4] p-4 text-xs leading-6 text-black/70 lg:w-100 lg:text-sm`}
          >
            Formatos admitidos: <span className="font-semibold">.stl</span>,{" "}
            <span className="font-semibold">.3mf</span> y{" "}
            <span className="font-semibold">.obj</span>.
            <br />
          </div>
        </div>

        {/* PANEL DE COTIZACION: el visor ocupa la mayor parte del bloque. */}
        <div className="border border-black/10 bg-[#111111] p-1 text-white">
          {/* VISTA 3D: el ancho extra del panel se asigna desde la grilla exterior. */}
          <div className="relative overflow-hidden bg-[#bfbfbf]">
            <div className="relative h-[360px] sm:h-[400px] lg:h-[430px]">
              {showModelViewer && modelFile ? (
                <ModelViewer file={modelFile} scalePercent={scalePercent} />
              ) : (
                <div className="absolute inset-0 bg-[#080808]">
                  <Image
                    src="/nuevo.png"
                    alt="Portada animada para cargar modelo 3D"
                    fill
                    unoptimized
                    className="scale-[1.04] lg:scale-[1.09]
                     object-cover blur-[1px] lg:blur-[0.7px]"
                  />
                  <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]" />
                  <p
                    className={`${cotizaTextRegularFont.className} 
                    pointer-events-none absolute left-4 top-4 text-[13px] uppercase tracking-[0.08em] text-white/80`}
                  >
                    Vista 3D
                  </p>
                  <p
                    className={`${cotizaTextRegularFont.className} 
                    pointer-events-none absolute right-4 top-4 text-[13px] uppercase tracking-[0.08em] text-white/80`}
                  >
                    Arrastra para rotar
                  </p>
                </div>
              )}

              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  showModelViewer ? "pointer-events-none opacity-0" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={onOpenPicker}
                  className={`${cotizaTextBoldFont.className} bg-[#1B2C1C] 
                  px-5 py-3 text-xs uppercase tracking-[0.22em] 
                  text-[#ADFE00] shadow-sm cursor-pointer
                   `}
                >
                  Sube tu archivo
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".stl,.3mf,.obj"
              className="hidden"
              onChange={onFileChange}
            />
          </div>

          {/* CONTROL MOVIL: abre o cierra resultado, escala, estado y progreso. */}
          <button
            type="button"
            title={isMobileDetailsOpen ? "Ocultar detalles" : "Ver detalles"}
            aria-label={isMobileDetailsOpen ? "Ocultar detalles" : "Ver detalles"}
            aria-expanded={isMobileDetailsOpen}
            onClick={() => setIsMobileDetailsOpen((isOpen) => !isOpen)}
            className="flex h-12 w-full items-center justify-center border-t border-white/20 text-white transition-colors hover:text-[#C0FF01] lg:hidden"
          >
            <ChevronDown
              size={20}
              strokeWidth={1.8}
              className={`transition-transform duration-300 ${
                isMobileDetailsOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* DATOS DE COTIZACION: siempre visibles en escritorio y desplegables en movil. */}
          <div
            className={`overflow-hidden ${
              isMobileDetailsOpen ? "block" : "hidden"
            } lg:block`}
          >
            {/* FILA SUPERIOR: ESCALA / RESULTADO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 ">
              {/* ESCALA Y MEDIDAS */}
              <div className="order-2 min-w-0 px-3 py-5 sm:px-5 lg:order-none lg:px-6">
                <div className="flex items-baseline gap-2">
                  <p
                    className={`${cotizaTextLightFont.className} text-[13px] uppercase tracking-[0.08em] text-white`}
                  >
                    Escala
                  </p>
                  <p
                    className={`${cotizaTextLightFont.className} text-[13px] text-[#C0FF01]`}
                  >
                    {scalePercent}%
                  </p>
                </div>

                {/* MEDIDAS ACTUALES: quedan bajo la escala para mostrar el efecto del cambio. */}
                {displayDimensions ? (
                  <p
                    className={`${cotizaTextLightFont.className} mt-2 
                    text-[11px] leading-4 text-white/70 sm:text-[13px]`}
                  >
                    {formatCm(displayDimensions.x)} x {formatCm(displayDimensions.y)} x{" "}
                    {formatCm(displayDimensions.z)} cm
                  </p>
                ) : (
                  <p
                    className={`${cotizaTextLightFont.className} mt-2 
                    text-[13px] leading-4 text-white/45`}
                  >
                    Medidas 
                  </p>
                )}

                <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                  {/* REGLA DE ESCALA */}
                  <div className="min-w-0">
                   

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        title="Reducir escala"
                        aria-label="Reducir escala"
                        disabled={isProcessing || scalePercent <= scaleMinimum}
                        onClick={() => updateScaleBy(-scaleStep)}
                        className="grid size-6 shrink-0 place-items-center text-white/70 transition-colors hover:text-[#C0FF01] disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <ChevronLeft size={15} strokeWidth={2} />
                      </button>

                      <div className="relative h-10 min-w-0 flex-1">
                        {/*
                          Las marcas anteriores al indicador verde se muestran
                          altas y claras. Las siguientes se muestran más bajas
                          y oscuras. La última siempre queda alta para marcar
                          el límite máximo del control.
                        */}
                        <div className="pointer-events-none absolute inset-x-1 top-1/2 flex -translate-y-1/2 items-center justify-between">
                          {scaleMarkers.map((marker) => {
                            const markerPosition =
                              (marker / (scaleMarkers.length - 1)) * 100;
                            const isReached =
                              markerPosition <= scaleMarkerPosition;
                            const isLastMarker =
                              marker === scaleMarkers.length - 1;

                            return (
                              <span
                                key={marker}
                                className={`w-[2px] transition-[height,background-color] duration-150 sm:w-[3px] ${
                                  isReached
                                    ? "h-8 bg-white/95"
                                    : isLastMarker
                                      ? "h-8 bg-white/25"
                                      : "h-5 bg-white/20"
                                }`}
                              />
                            );
                          })}
                        </div>

                        {/* Indicador de la escala seleccionada. */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute top-1/2 z-10 h-10 w-[3px] -translate-x-1/2 -translate-y-1/2 bg-[#C0FF01] transition-[left] duration-150"
                          style={{ left: `${scaleMarkerPosition}%` }}
                        />

                        {/* El input es invisible, pero recibe el clic y el arrastre. */}
                        <input
                          type="range"
                          min={scaleMinimum}
                          max={scaleMaximum}
                          step={scaleStep}
                          value={scalePercent}
                          disabled={isProcessing}
                          onChange={(event) =>
                            onScaleChange(Number(event.target.value))
                          }
                          aria-label="Escala del modelo"
                          className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0 disabled:cursor-not-allowed"
                        />
                      </div>

                      <button
                        type="button"
                        title="Aumentar escala"
                        aria-label="Aumentar escala"
                        disabled={isProcessing || scalePercent >= scaleMaximum}
                        onClick={() => updateScaleBy(scaleStep)}
                        className="grid size-6 shrink-0 place-items-center text-white/70 transition-colors hover:text-[#C0FF01] disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <ChevronRight size={15} strokeWidth={2} />
                      </button>
                    </div>
                  </div>

                  {/* MEDIDAS: quedan dentro del mismo bloque, sin una línea adicional. */}
                  <div className="justify-self-start lg:min-w-[105px]">
                    <button
                      type="button"
                      onClick={onRequote}
                      disabled={!canRequote || isProcessing}
                      className={`${cotizaTextLightFont.className} mt-2 border border-white/45 px-2 py-1.5 text-[11px] uppercase tracking-[0.08em] text-white transition-colors hover:border-[#C0FF01] hover:text-[#C0FF01] disabled:cursor-not-allowed disabled:opacity-40 sm:px-3`}
                    >
                      Recalcular
                    </button>
                  </div>
                </div>

                {scaleNeedsUpdate && (
                  <p
                    className={`${cotizaTextLightFont.className} mt-3 text-[10px] leading-4 text-[#ffd18a]`}
                  >
                    Cambiaste la escala. Recalcula para actualizar costo, peso y
                    tiempo.
                  </p>
                )}
              </div>

              {/* RESULTADO */}
              <div className="order-1 min-w-0 border-b lg:border-l border-white/20 px-3 py-5 sm:px-5 lg:order-none lg:px-6">
                <p
                  className={`${cotizaTextLightFont.className} text-[11px] uppercase tracking-[0.08em] text-white`}
                >
                  Resultado
                </p>

                {quote ? (
                  <div className="mt-2 space-y-1">
                    <p
                      className={`${cotizaTextLightFont.className} text-[10px] uppercase leading-4 text-white/55 sm:text-xs`}
                    >
                      Material: {quote.materialLabel}
                    </p>
                    <p
                      className={`${cotizaTextLightFont.className} text-[10px] uppercase leading-4 text-white/55 sm:text-xs`}
                    >
                      Tiempo: {formatPrintTime(quote.printTimeSeconds)}
                    </p>
                    {/*
                      MEDIDAS COTIZADAS: usan quote.dimensions, no la medida
                      provisional de escala. Solo cambian al recalcular.
                    */}
                    {quote.dimensions && (
                      <p
                        className={`${cotizaTextLightFont.className} text-[10px] uppercase leading-4 text-white/55 sm:text-xs`}
                      >
                        Medidas: {formatCm(quote.dimensions.x)} x {" "}
                        {formatCm(quote.dimensions.y)} x {" "}
                        {formatCm(quote.dimensions.z)} cm
                      </p>
                    )}
                    {quote.fitsPrinter === false && (
                      <p
                        className={`${cotizaTextLightFont.className} text-[10px] uppercase leading-4 text-[#ff8d8d] sm:text-xs`}
                      >
                        El modelo no cabe en la impresora configurada.
                      </p>
                    )}
                  </div>
                ) : (
                  <p
                    className={`${cotizaTextLightFont.className} mt-2 max-w-[260px] text-[11px] uppercase leading-4 text-white/55 sm:text-[13px]    `}
                  >
                    La cotizacion aparecera aqui apenas termine la laminacion.
                  </p>
                )}
              </div>
            </div>

            {/* FILA INFERIOR: PROGRESO / ESTADO. Esta fila crea la única línea horizontal. */}
            <div className="grid grid-cols-1 lg:grid-cols-2  lg:border-t lg:border-white/20">
           
              {/* PROGRESO */}
              <div className="order-2 min-w-0 px-3 py-5 sm:px-5 lg:order-none lg:px-6">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <p
                    className={`${cotizaTextLightFont.className} text-[13px] uppercase tracking-[0.08em] text-white`}
                  >
                    Progreso
                  </p>
                  <p
                    className={`${cotizaTextRegularFont.className} text-[13px] uppercase text-white/45`}
                  >
                    {uploadProgressLabel[uploadStatus]}
                  </p>
                </div>

                <div className="grid grid-cols-[repeat(32,minmax(0,1fr))] gap-[2px]">
                  {progressSegments.map((segment) => {
                    const isFilled = segment < filledSegments;

                    return (
                      <span
                        key={segment}
                        className={`h-4 transition-colors duration-300 sm:h-5 ${
                          uploadStatus === "error" && isFilled
                            ? "bg-[#ff6b6b]"
                            : isFilled
                              ? "bg-[#C0FF01]"
                              : "bg-white/16"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* ESTADO */}
              <div className="order-1 min-w-0 border-t border-white/20 px-3 py-5 sm:px-5 lg:border-l lg:px-6">
                <p
                  className={`${cotizaTextLightFont.className} text-[13px] uppercase tracking-[0.08em] text-white`}
                >
                  Estado
                </p>
                <p
                  className={`${cotizaTextRegularFont.className} mt-1 text-[13px] uppercase leading-4 text-white/55 sm:text-[13px]    `}
                >
                  {uploadStatus === "idle" &&
                    "Selecciona un archivo para iniciar."}
                  {uploadStatus === "uploading" &&
                    "Estamos subiendo tu modelo 3D."}
                  {uploadStatus === "pricing" &&
                    "Archivo cargado. Laminando."}
                  {uploadStatus === "ready" &&
                    "Listo. Ya puedes revisar y seguir avanzando."}
                  {uploadStatus === "error" &&
                    "La cotizacion se detuvo. Intenta nuevamente."}
                </p>

                {fileName && (
                  <p
                    className={`${cotizaTextLightFont.className} mt-2 break-all text-[13px] uppercase leading-4 text-[#C0FF01] sm:text-[13px  ]    `}
                  >
                    {fileName} {fileSizeLabel && `- ${fileSizeLabel}`}
                  </p>
                )}

                {uploadError && (
                  <p
                    className={`${cotizaTextLightFont.className} mt-2 text-[13px] leading-4 text-[#ff8d8d] lg:text-[13px]    `}
                  >
                    {uploadError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Paso2;
