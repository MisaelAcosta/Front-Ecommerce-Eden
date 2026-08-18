"use client";

import { formatPrice } from "@/lib/formatPrice";
import {
  cotizaTextRegularFont,
  cotizaTitleFont,
  cotizaTextBoldFont,
  cotizaTextLightFont,
} from "./cotiza-fonts";

type ResumenPedidoProps = {
  fileName: string;
  materialLabel: string;
  selectedColorLabel: string;
  qualityLabel: string;
  postProcessLabel: string;
  postProcessPrice: number;
  modelPrice: number;
  totalPrice: number;
  printTimeSeconds: number | null;
  dimensions: {
    x: number;
    y: number;
    z: number;
  } | null;
  attachedLinksCount: number;
  canCheckout: boolean;
  addingToCart: boolean;
  fitsPrinter: boolean | null;
  uploadStatus: "idle" | "uploading" | "pricing" | "ready" | "error";
  uploadError: string | null;
  notes: string[];
  onCheckout: () => void;
};

function formatPrintTime(seconds: number | null) {
  if (!seconds || seconds <= 0) {
    return "Pendiente";
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

const ResumenPedido = ({
  fileName,
  materialLabel,
  selectedColorLabel,
  qualityLabel,
  postProcessLabel,
  postProcessPrice,
  modelPrice,
  totalPrice,
  printTimeSeconds,
  dimensions,
  attachedLinksCount,
  canCheckout,
  addingToCart,
  fitsPrinter,
  uploadStatus,
  uploadError,
  notes,
  onCheckout,
}: ResumenPedidoProps) => {
  const summaryRows = [
    ["Material", materialLabel || "Pendiente"],
    ["Tiempo", formatPrintTime(printTimeSeconds)],
    [
      "Medidas",
      dimensions
        ? `${formatCm(dimensions.x)} x ${formatCm(dimensions.y)} x ${formatCm(
            dimensions.z
          )} cm`
        : "Pendiente",
    ],
    ["Modelo", modelPrice > 0 ? formatPrice(modelPrice) : "Pendiente"],
    ["Color", selectedColorLabel || "Pendiente"],
    ["Calidad", qualityLabel || "Pendiente"],
    ["Post procesado", postProcessPrice > 0 ? postProcessLabel : "No"],
    ["Enlaces adjuntados", String(attachedLinksCount)],
    ["Total", totalPrice > 0 ? formatPrice(totalPrice) : "Pendiente"],
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[#050505] 
    px-4 py-16 text-white sm:px-8 lg:px-12 lg:py-32 xl:py-44 2xl:py-60">
      <div className="absolute inset-0 z-0 bg-[#050505]" />
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)
          `,
          backgroundPosition: "center -10px",
          backgroundSize: "220px 220px",
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0.82))",
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-[390px] w-full max-w-[1350px] gap-10 xl:grid-cols-[0.8fr_1.45fr_0.85fr] xl:items-center">
        <h2
          className={`${cotizaTitleFont.className} 
          text-4xl uppercase leading-[1.30] 
            lg:leading-[1.20] sm:text-5xl lg:text-6xl
            lg:pt-10 pt-5`}
        >
          Resumen de pedido
        </h2>

        <div className="max-w-[560px]">
          <p
            className={`${cotizaTextRegularFont.className} mb-3 text-lg uppercase tracking-[0.04em] text-white/50`}
          >
            Resumen
          </p>

          <div className="space-y-1">
            {summaryRows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[minmax(145px,0.9fr)_minmax(130px,1fr)] gap-4"
              >
                <p
                  className={`${cotizaTextRegularFont.className} text-base uppercase leading-5 tracking-[0.04em] text-white sm:text-lg`}
                >
                  {label}
                </p>
                <p
                  className={`${cotizaTextLightFont.className} text-right text-base uppercase leading-5 tracking-[0.04em] text-white/62 sm:text-lg`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {fitsPrinter === false && (
            <p
              className={`${cotizaTextRegularFont.className} mt-5 text-sm uppercase leading-5 text-[#ff8d8d]`}
            >
              El modelo no cabe en la impresora configurada.
            </p>
          )}

          {uploadError && (
            <p
              className={`${cotizaTextRegularFont.className} mt-5 text-sm uppercase leading-5 text-[#ff8d8d]`}
            >
              {uploadError}
            </p>
          )}

          {notes.length > 0 && (
            <div className="mt-5 space-y-2">
              {notes.map((note) => (
                <p
                  key={note}
                  className={`${cotizaTextRegularFont.className} text-sm uppercase leading-5 text-white/50`}
                >
                  {note}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* ACCION SIN COTIZACION: centrada en movil y alineada al borde derecho en escritorio. */}
        <div className="flex flex-col items-center gap-5 xl:items-end">
       
          <button
            type="button"
            onClick={onCheckout}
            disabled={!canCheckout || addingToCart}
            className={`${cotizaTextRegularFont.className} w-full max-w-[170px]
             bg-[#1B2C1C] px-5 py-4   text-center text-xl uppercase 
             tracking-[0.04em] text-[#ADFE00] transition-opacity cursor-pointer duration-300 
             disabled:cursor-not-allowed disabled:opacity-45`}
          >
            {addingToCart ? "..." : "Imprimir"}
          </button>

          {uploadStatus !== "ready" && (
            <p
              className={`${cotizaTextLightFont.className} max-w-[240px] text-center text-[13px] uppercase leading-4 text-white/45 xl:text-right xl:text-[14px]`}
            >
              Primero necesitas subir el archivo y esperar la cotizacion.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResumenPedido;
