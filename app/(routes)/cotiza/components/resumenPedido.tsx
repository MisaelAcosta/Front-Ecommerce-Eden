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
  basePrice: number;
  totalPrice: number;
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
  basePrice,
  totalPrice, 
  canCheckout,
  addingToCart,
  fitsPrinter,
  uploadStatus,
  uploadError,
  notes,
  onCheckout,
}: ResumenPedidoProps) => {
  return (
    <section className="bg-[#0d0d0d] px-4 py-12 text-white sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1400px]">
        <p
          className={`${cotizaTextRegularFont.className} text-xs 
          uppercase tracking-[0.35em] text-white/45`}
        >
          Resumen de pedido
        </p>
        <h2
          className={`${cotizaTitleFont.className} mt-3 text-4xl uppercase leading-[0.9] sm:text-5xl`}
        >
          Imprime
        </h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px] lg:items-end">
          {/* Resumen de la cotización en formato compacto tipo editorial. */}
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

            <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
              <div>
                <p
                  className={`${cotizaTextRegularFont.className} text-[11px] uppercase tracking-[0.3em] text-white/45`}
                >
                  Base CloudSlicer
                </p>
                <p className={`${cotizaTextBoldFont.className} mt-2 text-lg`}>
                  {basePrice > 0 ? formatPrice(basePrice) : "Pendiente"}
                </p>
              </div>

              <div>
                <p
                  className={`${cotizaTextRegularFont.className} text-[11px] uppercase tracking-[0.3em] text-white/45`}
                >
                  Total
                </p>
                <p
                  className={`${cotizaTextBoldFont.className} mt-2 text-2xl text-[#ff3b30]`}
                >
                  {totalPrice > 0 ? formatPrice(totalPrice) : "Pendiente"}
                </p>
              </div>
            </div>

            {fitsPrinter === false && (
              <p
                className={`${cotizaTextRegularFont.className} mt-5 text-sm text-[#ff8d8d]`}
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
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <button
              type="button"
              onClick={onCheckout}
              disabled={!canCheckout || addingToCart}
              className={`${cotizaTextBoldFont.className} w-full rounded-full bg-[#ff2a17] px-5 py-4 text-xs uppercase tracking-[0.32em] text-black transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-45`}
            >
              {addingToCart ? "Agregando..." : "Imprimir"}
            </button>

            <p
              className={`${cotizaTextRegularFont.className} mt-4 text-sm leading-6 text-white/65`}
            >
              Este botón agrega la cotización al carrito actual y te lleva al
              checkout existente del ecommerce.
            </p>

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
