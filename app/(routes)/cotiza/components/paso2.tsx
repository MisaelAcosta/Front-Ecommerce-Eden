"use client";

import type { RefObject } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/formatPrice";
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
  quote: {
    basePrice: number;
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
};

function formatPrintTime(seconds: number | null) {
  if (!seconds || seconds <= 0) {
    return "En cálculo";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours <= 0) {
    return `${minutes} min`;
  }

  return `${hours} h ${minutes} min`;
}

const Paso2 = ({
  fileInputRef,
  fileName,
  fileSizeLabel,
  uploadStatus,
  uploadError,
  quote,
  onOpenPicker,
  onFileChange,
}: Paso2Props) => {
  return (
    <section className="border-b border-black/10 bg-white 
    px-4 py-16 lg:py-25 sm:px-8 lg:px-12">
      <div className="mx-auto grid w-full max-w-[1400px] gap-8 
      lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        {/* Lado izquierdo con instrucciones del paso. */}
        <div>
          <p
            className={`${cotizaTextBoldFont.className} text-base lg:text-2xl
            uppercase tracking-[0.35em] text-black/65`}
          >
            Paso 02
          </p>
          <h2
            className={`${cotizaTitleFont.className} mt-3 lg:pt-10 pt-5 text-4xl 
            uppercase leading-[0.9] sm:text-5xl lg:text-6xl`}
          >
            Carga tu archivo
          </h2>
          <p
            className={`${cotizaTextRegularFont.className} mt-10 lg:mt-15
            max-w-lg text-sm leading-6 text-black/70 sm:text-base`}
          >
            Sube tu STL y dejamos que CloudSlicer haga la laminación. El
            sistema primero carga el archivo y luego consulta el precio sobre la
            configuración de impresión que tengas definida.
          </p>


          <div
            className={`${cotizaTextRegularFont.className} mt-6 
            rounded-[14px]  
            bg-[#e4e4e4] p-4 text-xs lg:text-sm leading-6 text-black/70 lg:w-100`}
          >
            Formatos admitidos: <span className="font-semibold">.stl</span>,{" "}
            <span className="font-semibold">.3mf</span> y{" "}
            <span className="font-semibold">.obj</span>.
          </div>
        </div>


        {/* Lado derecho con caja de subida y feedback de CloudSlicer. */}
        <div className="rounded-[22px] border border-black/10 
        bg-[#111111] p-3 text-white">
          <div className="relative overflow-hidden rounded-[26px]">
            <div className="relative h-[250px] sm:h-[320px]">
              <Image
                src="/servicios/img4.jpg"
                alt="Vista referencial para subir archivos 3D"
                fill
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),rgba(0,0,0,0.72)_60%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={onOpenPicker}
                  className={`${cotizaTextBoldFont.className} rounded-full bg-white px-5 py-3 text-xs uppercase tracking-[0.28em] text-black transition-transform duration-300 hover:scale-[1.03]`}
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

          <div className="grid gap-4 px-2 py-5 sm:grid-cols-2">
            <div>
              <p
                className={`${cotizaTextRegularFont.className} text-[11px] uppercase tracking-[0.3em] text-white/55`}
              >
                Estado
              </p>
              <p className={`${cotizaTextBoldFont.className} mt-2 text-sm`}>
                {uploadStatus === "idle" && "Esperando archivo"}
                {uploadStatus === "uploading" && "Subiendo a CloudSlicer"}
                {uploadStatus === "pricing" && "Laminando y cotizando"}
                {uploadStatus === "ready" && "Cotización lista"}
                {uploadStatus === "error" && "No se pudo cotizar"}
              </p>
              {fileName && (
                <p
                  className={`${cotizaTextRegularFont.className} mt-3 text-sm text-white/70`}
                >
                  {fileName} · {fileSizeLabel}
                </p>
              )}
              {uploadError && (
                <p
                  className={`${cotizaTextRegularFont.className} mt-3 text-sm text-[#ff8d8d]`}
                >
                  {uploadError}
                </p>
              )}
            </div>

            <div>
              <p
                className={`${cotizaTextRegularFont.className} text-[11px] uppercase tracking-[0.3em] text-white/55`}
              >
                Resultado
              </p>
              {quote ? (
                <div className="mt-2 space-y-2">
                  <p className={`${cotizaTextBoldFont.className} text-base`}>
                    {formatPrice(quote.basePrice)}
                  </p>
                  <p
                    className={`${cotizaTextRegularFont.className} text-sm text-white/70`}
                  >
                    Material: {quote.materialLabel}
                  </p>
                  <p
                    className={`${cotizaTextRegularFont.className} text-sm text-white/70`}
                  >
                    Tiempo estimado: {formatPrintTime(quote.printTimeSeconds)}
                  </p>
                  {quote.estimatedWeightGrams !== null && (
                    <p
                      className={`${cotizaTextRegularFont.className} text-sm text-white/70`}
                    >
                      Material usado: {Math.round(quote.estimatedWeightGrams)} g
                    </p>
                  )}
                  {quote.dimensions && (
                    <p
                      className={`${cotizaTextRegularFont.className} text-sm text-white/70`}
                    >
                      Volumen: {quote.dimensions.x.toFixed(1)} ×{" "}
                      {quote.dimensions.y.toFixed(1)} ×{" "}
                      {quote.dimensions.z.toFixed(1)} mm
                    </p>
                  )}
                  {quote.fitsPrinter === false && (
                    <p
                      className={`${cotizaTextRegularFont.className} text-sm text-[#ff8d8d]`}
                    >
                      El modelo no cabe en la impresora configurada.
                    </p>
                  )}
                </div>
              ) : (
                <p
                  className={`${cotizaTextRegularFont.className} mt-2 text-sm text-white/70`}
                >
                  La cotización aparecerá aquí apenas termine la laminación.
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
