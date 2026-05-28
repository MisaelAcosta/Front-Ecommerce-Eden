"use client";

import type { RefObject } from "react";
import Image from "next/image";
import { ModelViewer } from "./model-viewer";
import {
  cotizaTextRegularFont,
  cotizaTitleFont,
  cotizaTextBoldFont,
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

  return (
    <section className="border-b border-black/10 bg-white px-4 py-16 sm:px-8 lg:px-12 lg:py-25">
      <div className="mx-auto grid w-full max-w-[1350px] gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <p
            className={`${cotizaTextBoldFont.className} text-base uppercase tracking-[0.35em] text-black/65 lg:text-2xl`}
          >
            Paso 02
          </p>
          <h2
            className={`${cotizaTitleFont.className} mt-3 max-w-xl pt-5 text-4xl uppercase leading-[1.30] sm:text-5xl lg:pt-10 lg:text-6xl lg:leading-[1.20]`}
          >
            Carga tu archivo
          </h2>
          <p
            className={`${cotizaTextRegularFont.className} mt-10 max-w-lg text-sm leading-6 text-black/70 sm:text-base lg:mt-15`}
          >
            Sube tu modelo 3D, revisa la vista previa y ajusta su tamano antes
            de recalcular. Las medidas se muestran en centimetros como ancho x
            alto x profundidad.
          </p>

          <div
            className={`${cotizaTextRegularFont.className} mt-6 rounded-[14px] bg-[#e4e4e4] p-4 text-xs leading-6 text-black/70 lg:w-100 lg:text-sm`}
          >
            Formatos admitidos: <span className="font-semibold">.stl</span>,{" "}
            <span className="font-semibold">.3mf</span> y{" "}
            <span className="font-semibold">.obj</span>.
            <br />
            
          </div>
        </div>

        <div className="rounded-[18px] border border-black/10 bg-[#111111] p-4 text-white shadow-[0_16px_40px_rgba(0,0,0,0.16)]">
          <div className="relative overflow-hidden rounded-[14px] bg-[#bfbfbf]">
            <div className="relative h-[260px] sm:h-[295px]">
              {showModelViewer && modelFile ? (
                <ModelViewer file={modelFile} scalePercent={scalePercent} />
              ) : (
                <div className="absolute inset-0 bg-[#bfbfbf]">
                  <Image
                    src="/cotiza/portada_paso2_lenta.gif"
                    alt="Portada animada para cargar modelo 3D"
                    fill
                    unoptimized
                    className="scale-[1.04] object-cover blur-[1.5px]"
                  />
                  <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]" />
                  <p
                    className={`${cotizaTextRegularFont.className} pointer-events-none absolute left-4 top-4 text-[10px] uppercase tracking-[0.08em] text-white/80`}
                  >
                    Vista 3D
                  </p>
                  <p
                    className={`${cotizaTextRegularFont.className} pointer-events-none absolute right-4 top-4 text-[10px] uppercase tracking-[0.08em] text-white/80`}
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
                  className={`${cotizaTextBoldFont.className} rounded-full bg-white px-5 py-3 text-xs uppercase tracking-[0.22em] text-black shadow-sm transition-transform duration-300 hover:scale-[1.03]`}
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

          <div className="grid gap-8 px-4 py-8 sm:grid-cols-2 sm:px-5">
            <div>
              <p
                className={`${cotizaTextBoldFont.className} text-[11px] uppercase tracking-[0.08em] text-white`}
              >
                Escala
              </p>
              <p className={`${cotizaTextBoldFont.className} mt-1 text-xs text-white`}>
                {scalePercent}%
              </p>

              <div className="mt-3 max-w-[220px]">
                <div
                  className={`${cotizaTextRegularFont.className} mb-1 flex items-center justify-between px-1 text-[8px] text-white/45`}
                >
                  <span>20%</span>
                  <span>100%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/55">v</span>
                  <input
                    type="range"
                    min={20}
                    max={300}
                    step={5}
                    value={scalePercent}
                    disabled={isProcessing}
                    onChange={(event) => onScaleChange(Number(event.target.value))}
                    className="h-1 flex-1 accent-white"
                  />
                  <span className="text-xs text-white/55">^</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onRequote}
                disabled={!canRequote || isProcessing}
                className={`${cotizaTextBoldFont.className} mt-3 rounded-full border border-white/45 px-4 py-2 text-[10px] uppercase tracking-[0.08em] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40`}
              >
                Recalcular
              </button>

              {scaleNeedsUpdate && (
                <p
                  className={`${cotizaTextRegularFont.className} mt-3 max-w-[260px] text-[11px] leading-4 text-[#ffd18a]`}
                >
                  Cambiaste la escala. Recalcula para actualizar medidas.
                </p>
              )}
            </div>

            <div>
              <p
                className={`${cotizaTextBoldFont.className} text-[11px] uppercase tracking-[0.08em] text-white`}
              >
                Resultado
              </p>
              {quote ? (
                <div className="mt-2 space-y-1">
                  <p className={`${cotizaTextRegularFont.className} text-xs uppercase text-white/55`}>
                    Material: {quote.materialLabel}
                  </p>
                  <p className={`${cotizaTextRegularFont.className} text-xs uppercase text-white/55`}>
                    Tiempo: {formatPrintTime(quote.printTimeSeconds)}
                  </p>
                  {displayDimensions && (
                    <p className={`${cotizaTextRegularFont.className} text-xs uppercase text-white/55`}>
                      Medidas (ancho x alto x prof.): {formatCm(displayDimensions.x)} x{" "}
                      {formatCm(displayDimensions.y)} x{" "}
                      {formatCm(displayDimensions.z)} cm
                    </p>
                  )}
                  {scaleNeedsUpdate && displayDimensions && (
                    <p className={`${cotizaTextRegularFont.className} text-[10px] uppercase leading-4 text-[#ffd18a]`}>
                      Vista previa segun la escala actual.
                    </p>
                  )}
                  {quote.fitsPrinter === false && (
                    <p className={`${cotizaTextRegularFont.className} text-xs uppercase text-[#ff8d8d]`}>
                      El modelo no cabe en la impresora configurada.
                    </p>
                  )}
                </div>
              ) : (
                <p
                  className={`${cotizaTextRegularFont.className} mt-2 max-w-[260px] text-xs uppercase leading-4 text-white/55`}
                >
                  La cotizacion aparecera aqui apenas termine la laminacion.
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-6 px-4 pb-5 sm:grid-cols-[1fr_0.95fr] sm:px-5">
            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <p
                  className={`${cotizaTextBoldFont.className} text-[11px] uppercase tracking-[0.08em] text-white`}
                >
                  Progreso
                </p>
                <p
                  className={`${cotizaTextRegularFont.className} text-[10px] uppercase text-white/45`}
                >
                  {uploadProgressLabel[uploadStatus]}
                </p>
              </div>

              <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-[3px] sm:grid-cols-[repeat(32,minmax(0,1fr))]">
                {progressSegments.map((segment) => {
                  const isFilled = segment < filledSegments;

                  return (
                    <span
                      key={segment}
                      className={`h-5 transition-colors duration-300 ${
                        uploadStatus === "error" && isFilled
                          ? "bg-[#ff6b6b]"
                          : isFilled
                            ? "bg-white"
                            : "bg-white/16"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <p
                className={`${cotizaTextBoldFont.className} text-[11px] uppercase tracking-[0.08em] text-white`}
              >
                Estado
              </p>
              <p
                className={`${cotizaTextRegularFont.className} mt-1 text-xs uppercase leading-4 text-white/55`}
              >
                {uploadStatus === "idle" && "Selecciona un archivo para iniciar."}
                {uploadStatus === "uploading" && "Estamos subiendo tu modelo 3D."}
                {uploadStatus === "pricing" && "Archivo cargado. Laminando."}
                {uploadStatus === "ready" &&
                  "Listo. Ya puedes revisar y seguir avanzando."}
                {uploadStatus === "error" &&
                  "La cotizacion se detuvo. Intenta nuevamente."}
              </p>
              {fileName && (
                <p className={`${cotizaTextBoldFont.className} mt-2 text-xs uppercase text-white/85`}>
                  {fileName} {fileSizeLabel && `- ${fileSizeLabel}`}
                </p>
              )}
              {uploadError && (
                <p className={`${cotizaTextRegularFont.className} mt-2 text-xs text-[#ff8d8d]`}>
                  {uploadError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Paso2;
