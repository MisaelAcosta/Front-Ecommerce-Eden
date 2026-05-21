"use client";

import { useMemo, useRef, useState } from "react";
import HeaderCotiza from "./headerCotiza";
import Paso1 from "./paso1";
import Paso2 from "./paso2";
import Paso3 from "./paso3";
import Paso4 from "./paso4";
import ResumenPedido from "./resumenPedido";
import ScrollReveal from "@/components/animation_page/scroll-reveal";
import SmoothScroll from "@/components/animation_page/smooth-scroll";
import { useCart } from "@/hooks/use-cart";
import type {
  PrintColorMode,
  PrintPostProcess,
  PrintQuality,
} from "@/types/print-quote";
import { useNavigationTransition } from "@/components/navigation-transition-provider";

type QuoteResult = {
  fileId: string;
  fileName: string | null;
  quoteId: string | null;
  currency: string;
  basePrice: number;
  materialLabel: string;
  printTimeSeconds: number | null;
  estimatedWeightGrams: number | null;
  fitsPrinter: boolean | null;
  dimensions: {
    x: number;
    y: number;
    z: number;
  } | null;
  printerId: string | null;
  filamentId: string | null;
  notes: string[];
};

type UploadStatus = "idle" | "uploading" | "pricing" | "ready" | "error";

const POST_PROCESS_PRICES: Record<PrintPostProcess, number> = {
  none: 0,
  basic: 5000,
  advanced: 15000,
};

const COLOR_OPTIONS = [
  { id: "blanco", label: "Blanco", hex: "#f6f6f6" },
  { id: "gris", label: "Gris", hex: "#909090" },
  { id: "naranjo", label: "Naranjo", hex: "#ff6900" },
  { id: "amarillo", label: "Amarillo", hex: "#facc15" },
  { id: "verde", label: "Verde", hex: "#22c55e" },
  { id: "azul", label: "Azul", hex: "#2563eb" },
  { id: "morado", label: "Morado", hex: "#7c3aed" },
  { id: "negro", label: "Negro", hex: "#111111" },
] as const;

const POST_PROCESS_LABELS: Record<PrintPostProcess, string> = {
  none: "Sin post procesado",
  basic: "Básico",
  advanced: "Avanzado",
};

const QUALITY_LABELS: Record<PrintQuality, string> = {
  standard: "Calidad estándar",
};

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 KB";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CotizaPage() {
  const { navigateWithTransition } = useNavigationTransition();
  const { addItem } = useCart();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [selectedColor, setSelectedColor] = useState<
    (typeof COLOR_OPTIONS)[number]["id"]
  >("blanco");
  const [colorMode, setColorMode] = useState<PrintColorMode>("single");
  const [referenceLink, setReferenceLink] = useState("");
  const [quality, setQuality] = useState<PrintQuality>("standard");
  const [postProcess, setPostProcess] = useState<PrintPostProcess>("none");
  const [addingToCart, setAddingToCart] = useState(false);

  const handleColorChange = (value: string) => {
    if (COLOR_OPTIONS.some((option) => option.id === value)) {
      setSelectedColor(value as (typeof COLOR_OPTIONS)[number]["id"]);
    }
  };

  const selectedColorOption = useMemo(
    () =>
      COLOR_OPTIONS.find((option) => option.id === selectedColor) ??
      COLOR_OPTIONS[0],
    [selectedColor]
  );

  const postProcessPrice = POST_PROCESS_PRICES[postProcess];
  const totalPrice = (quote?.basePrice ?? 0) + postProcessPrice;
  const canCheckout =
    uploadStatus === "ready" &&
    !!quote &&
    quote.basePrice > 0 &&
    quote.fitsPrinter !== false;

  const openPicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

    if (!["stl", "3mf", "obj"].includes(extension)) {
      setUploadStatus("error");
      setUploadError("Solo se permiten archivos .stl, .3mf o .obj.");
      setQuote(null);
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    setUploadError(null);
    setQuote(null);
    setUploadStatus("uploading");

    try {
      // Pedimos el upload_id a nuestro backend antes de subir desde el navegador.
      const uploadIdRes = await fetch("/api/cloudslicer/upload-id", {
        method: "GET",
        cache: "no-store",
      });

      const uploadIdJson = (await uploadIdRes.json()) as {
        ok?: boolean;
        uploadId?: string;
        error?: string;
      };

      if (!uploadIdRes.ok || !uploadIdJson?.ok || !uploadIdJson.uploadId) {
        throw new Error(
          uploadIdJson?.error ?? "No pude iniciar la subida del archivo."
        );
      }

      const formData = new FormData();
      formData.append("file", file);

      // La subida pública es browser-compatible según la documentación de CloudSlicer.
      const publicUploadRes = await fetch(
        `https://api.cloudslicer3d.com/v1/file/public/${uploadIdJson.uploadId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const publicUploadJson = (await publicUploadRes.json()) as {
        file_id?: string;
        id?: string;
        message?: string;
        detail?: string;
      };

      if (!publicUploadRes.ok) {
        throw new Error(
          publicUploadJson?.detail ||
            publicUploadJson?.message ||
            "CloudSlicer rechazó la subida del archivo."
        );
      }

      const cloudFileId =
        publicUploadJson.file_id || String(publicUploadJson.id ?? "").trim();

      if (!cloudFileId) {
        throw new Error("CloudSlicer no devolvió file_id después de la subida.");
      }

      setUploadStatus("pricing");

      const quoteRes = await fetch("/api/cloudslicer/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId: cloudFileId,
          fileName: file.name,
        }),
      });

      const quoteJson = (await quoteRes.json()) as {
        ok?: boolean;
        error?: string;
        quote?: QuoteResult;
      };

      if (!quoteRes.ok || !quoteJson?.ok || !quoteJson.quote) {
        throw new Error(
          quoteJson?.error ?? "No se pudo generar la cotización del archivo."
        );
      }

      setQuote(quoteJson.quote);
      setUploadStatus("ready");
    } catch (error: unknown) {
      setUploadStatus("error");
      setQuote(null);
      setUploadError(
        error instanceof Error ? error.message : "Ocurrió un error inesperado."
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleCheckout = async () => {
    if (!quote || !canCheckout) {
      return;
    }

    setAddingToCart(true);

    try {
      // Guardamos la cotización como una línea especial para no mezclarla con variantes de catálogo.
      addItem({
        kind: "print-quote",
        productId: 0,
        productSlug: "cotiza",
        variantId: -1,
        variantName: `Imprime · ${quote.fileName ?? fileName}`,
        imageUrl: "/servicios/servicio1.png",
        sku: null,
        unitPrice: totalPrice,
        qty: 1,
        printQuote: {
          fileName: quote.fileName ?? fileName,
          fileId: quote.fileId,
          quoteId: quote.quoteId,
          printerId: quote.printerId,
          filamentId: quote.filamentId,
          materialLabel: quote.materialLabel,
          quality,
          qualityLabel: QUALITY_LABELS[quality],
          selectedColor: selectedColorOption.label,
          colorMode,
          referenceLink: referenceLink.trim() || null,
          postProcess,
          postProcessLabel: POST_PROCESS_LABELS[postProcess],
          postProcessPrice,
          basePrice: quote.basePrice,
          totalPrice,
          fitsPrinter: quote.fitsPrinter,
          dimensions: quote.dimensions,
          printTimeSeconds: quote.printTimeSeconds,
          estimatedWeightGrams: quote.estimatedWeightGrams,
          notes: quote.notes,
        },
      });

      navigateWithTransition("/cart");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <SmoothScroll>
      <main className="bg-[#ece9e1] text-black">
        <ScrollReveal>
          <HeaderCotiza />
        </ScrollReveal>

        <ScrollReveal>
          <Paso1 />
        </ScrollReveal>

        <ScrollReveal>
          <Paso2
            fileInputRef={fileInputRef}
            fileName={fileName}
            fileSizeLabel={formatFileSize(fileSize)}
            quote={quote}
            uploadStatus={uploadStatus}
            uploadError={uploadError}
            onFileChange={handleFileChange}
            onOpenPicker={openPicker}
          />
        </ScrollReveal>

        <ScrollReveal>
          <Paso3
            colorOptions={COLOR_OPTIONS}
            colorMode={colorMode}
            selectedColor={selectedColor}
            quality={quality}
            referenceLink={referenceLink}
            quoteReady={uploadStatus === "ready"}
            onColorModeChange={setColorMode}
            onColorChange={setSelectedColor}
            onQualityChange={setQuality}
            onReferenceLinkChange={setReferenceLink}
          />
        </ScrollReveal>

        <ScrollReveal>
          <Paso4
            postProcess={postProcess}
            onPostProcessChange={setPostProcess}
          />
        </ScrollReveal>

        <ScrollReveal>
          <ResumenPedido
            fileName={quote?.fileName ?? fileName}
            materialLabel={quote?.materialLabel ?? "PLA"}
            selectedColorLabel={selectedColorOption.label}
            qualityLabel={QUALITY_LABELS[quality]}
            postProcessLabel={POST_PROCESS_LABELS[postProcess]}
            postProcessPrice={postProcessPrice}
            basePrice={quote?.basePrice ?? 0}
            totalPrice={totalPrice}
            canCheckout={canCheckout}
            addingToCart={addingToCart}
            fitsPrinter={quote?.fitsPrinter ?? null}
            uploadStatus={uploadStatus}
            uploadError={uploadError}
            notes={quote?.notes ?? []}
            onCheckout={handleCheckout}
          />
        </ScrollReveal>
      </main>
    </SmoothScroll>
  );
}
