"use client";

import { formatPrice } from "@/lib/formatPrice";
import {
  cotizaTextRegularFont,
  cotizaTitleFont,
  cotizaTextBoldFont,
} from "./cotiza-fonts";

type ResumenPedidoProps = {
  fileName: string;
  materialLabel: string;
  selectedColorLabel: string;
  qualityLabel: string;
  postProcessLabel: string;
  postProcessPrice: number;
  canCheckout: boolean;
  addingToCart: boolean;
  fitsPrinter: boolean | null;
  uploadStatus: "idle" | "uploading" | "pricing" | "ready" | "error";
  uploadError: string | null;
  notes: string[];
  onCheckout: () => void;
};

const ResumenPedido = ({
  fileName,
  materialLabel,
  selectedColorLabel,
  qualityLabel,
  postProcessLabel,
  postProcessPrice,
  canCheckout,
  addingToCart,
  fitsPrinter,
  uploadStatus,
  uploadError,
  notes,
  onCheckout,
}: ResumenPedidoProps) => {
  return (
    <section className="bg-[#0d0d0d] px-4 py-16 lg:py-25
    text-white 
    sm:px-8 lg:px-12">
      <div className="mx-auto w-full 
      max-w-[1350px]">
        <p
          className={`${cotizaTextRegularFont.className} 
          text-base lg:text-2xl uppercase tracking-[0.35em] text-white/65`}
        >
          Resumen de pedido
        </p>
        <h2
          className={`${cotizaTitleFont.className} 
          mt-3 lg:pt-10 pt-5
          text-5xl uppercase leading-[0.9] sm:text-5xl lg:text-6xl`}
        >
          Imprime
        </h2>

        <div className="grid gap-12 lg:gap-68 
        lg:grid-cols-[1fr_480px] lg:items-end mt-10 
            lg:mt-15 ">
          {/* Resumen de la cotización en formato compacto tipo editorial. */}
          <div className="rounded-[22px] border 
          border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2 
            lg:grid-cols-3">
              <div>
                <p
                  className={`${cotizaTextRegularFont.className} text-[11px] uppercase tracking-[0.3em] text-white/45`}
                >
                  Modelo 3D
                </p>
                <p className={`${cotizaTextBoldFont.className} mt-2 text-sm`}>
                  {fileName || "Pendiente"}
                </p>
              </div>

              <div>
                <p
                  className={`${cotizaTextRegularFont.className} text-[11px] uppercase tracking-[0.3em] text-white/45`}
                >
                  Filamento
                </p>
                <p className={`${cotizaTextBoldFont.className} mt-2 text-sm`}>
                  {materialLabel}
                </p>
              </div>

              <div>
                <p
                  className={`${cotizaTextRegularFont.className} text-[11px] uppercase tracking-[0.3em] text-white/45`}
                >
                  Color
                </p>
                <p className={`${cotizaTextBoldFont.className} mt-2 text-sm`}>
                  {selectedColorLabel}
                </p>
              </div>

              <div>
                <p
                  className={`${cotizaTextRegularFont.className} text-[11px] uppercase tracking-[0.3em] text-white/45`}
                >
                  Calidad
                </p>
                <p className={`${cotizaTextBoldFont.className} mt-2 text-sm`}>
                  {qualityLabel}
                </p>
              </div>

              <div>
                <p
                  className={`${cotizaTextRegularFont.className} text-[11px] uppercase tracking-[0.3em] text-white/45`}
                >
                  Post procesado
                </p>
                <p className={`${cotizaTextBoldFont.className} mt-2 text-sm`}>
                  {postProcessLabel}
                </p>
              </div>

              <div>
                <p
                  className={`${cotizaTextRegularFont.className} text-[11px] uppercase tracking-[0.3em] text-white/45`}
                >
                  Extra
                </p>
                <p className={`${cotizaTextBoldFont.className} mt-2 text-sm`}>
                  {postProcessPrice > 0
                    ? formatPrice(postProcessPrice)
                    : "Sin extra"}
                </p>
              </div>
            </div>

            {fitsPrinter === false && (
              <p
                className={`${cotizaTextRegularFont.className} mt-5 
                text-sm text-[#ff8d8d]`}
              >
                El modelo no cabe en la impresora configurada, así que no se
                puede enviar al carrito.
              </p>
            )}

            {uploadError && (
              <p
                className={`${cotizaTextRegularFont.className} mt-5 text-sm text-[#ff8d8d]`}
              >
                {uploadError}
              </p>
            )}

            {notes.length > 0 && (
              <div className="mt-5 space-y-2">
                {notes.map((note) => (
                  <p
                    key={note}
                    className={`${cotizaTextRegularFont.className} text-sm text-white/60`}
                  >
                    {note}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* CTA final: agrega la cotización al carrito y deriva al checkout actual. */}
          <div className="rounded-[28px] border
           border-white/10 bg-white/5 p-5">
            <button
              type="button"
              onClick={onCheckout}
              disabled={!canCheckout || addingToCart}
              className={`${cotizaTextBoldFont.className} w-full rounded-full bg-[#ff2a17] px-5 py-4 text-xs uppercase tracking-[0.32em] text-black transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-45`}
            >
              {addingToCart ? "Agregando..." : "Imprimir"}
            </button>


            {uploadStatus !== "ready" && (
              <p
                className={`${cotizaTextRegularFont.className} mt-4 text-sm text-white/45`}
              >
                Primero necesitas subir el archivo y esperar la cotización.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumenPedido;
