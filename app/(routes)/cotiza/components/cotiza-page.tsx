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
  filamentCost: number | null;
  electricityCost: number | null;
  electricityCostPerKwh: number | null;
  printerPowerWatts: number | null;
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
  { id: "rojo", label: "Rojo", hex: "#ef233c" },
  { id: "rosado", label: "Rosado", hex: "#ff6fb1" },
  { id: "amarillo", label: "Amarillo", hex: "#facc15" },
  { id: "verde", label: "Verde", hex: "#22c55e" },
  { id: "azul", label: "Azul", hex: "#2563eb" },
  { id: "morado", label: "Morado", hex: "#7c3aed" },
  { id: "negro", label: "Negro", hex: "#111111" },
] as const;

const POST_PROCESS_LABELS: Record<PrintPostProcess, string> = {
  none: "Sin post procesado",
  basic: "Basico",
  advanced: "Avanzado",
};

const QUALITY_LABELS: Record<PrintQuality, string> = {
  standard: "Calidad estandar",
};

const MIN_SCALE_PERCENT = 20;
const MAX_SCALE_PERCENT = 300;

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 KB";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function sanitizeCloudSlicerFileName(fileName: string) {
  const trimmed = fileName.trim();
  const dotIndex = trimmed.lastIndexOf(".");
  const rawBaseName = dotIndex > 0 ? trimmed.slice(0, dotIndex) : trimmed;
  const rawExtension = dotIndex > 0 ? trimmed.slice(dotIndex + 1) : "stl";
  const extension = rawExtension.toLowerCase().replace(/[^a-z0-9]/g, "");
  const baseName =
    rawBaseName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^[_ .-]+|[_ .-]+$/g, "") || "modelo";

  return `${baseName}.${extension || "stl"}`;
}

function clampScalePercent(value: number) {
  if (!Number.isFinite(value)) {
    return 100;
  }

  return Math.min(MAX_SCALE_PERCENT, Math.max(MIN_SCALE_PERCENT, value));
}

function getModelMarkupMultiplier(rawPrintCost: number) {
  if (rawPrintCost <= 3000) {
    return 4;
  }

  if (rawPrintCost <= 10000) {
    return 3;
  }

  return 3;
}

function getModelPrice(rawPrintCost: number) {
  if (!Number.isFinite(rawPrintCost) || rawPrintCost <= 0) {
    return 0;
  }

  return Math.round(rawPrintCost * getModelMarkupMultiplier(rawPrintCost));
}

function scaleAsciiStl(text: string, scale: number) {
  return text.replace(
    /(vertex\s+)([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)(\s+)([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)(\s+)([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/g,
    (_match, prefix, x, spaceA, y, spaceB, z) =>
      `${prefix}${Number(x) * scale}${spaceA}${Number(y) * scale}${spaceB}${
        Number(z) * scale
      }`
  );
}

function scaleBinaryStl(buffer: ArrayBuffer, scale: number) {
  const output = buffer.slice(0);
  const view = new DataView(output);
  const triangleCount = view.getUint32(80, true);
  const expectedLength = 84 + triangleCount * 50;

  if (expectedLength !== output.byteLength) {
    return null;
  }

  for (let triangle = 0; triangle < triangleCount; triangle += 1) {
    const triangleOffset = 84 + triangle * 50;

    for (let vertex = 0; vertex < 3; vertex += 1) {
      const vertexOffset = triangleOffset + 12 + vertex * 12;

      for (let axis = 0; axis < 3; axis += 1) {
        const valueOffset = vertexOffset + axis * 4;
        view.setFloat32(
          valueOffset,
          view.getFloat32(valueOffset, true) * scale,
          true
        );
      }
    }
  }

  return output;
}

async function createScaledPrintFile(file: File, scalePercent: number) {
  const scale = scalePercent / 100;

  if (scalePercent === 100) {
    return file;
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (extension === "obj") {
    const text = await file.text();
    const scaledText = text.replace(
      /^(v\s+)([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)(\s+)([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)(\s+)([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)(.*)$/gm,
      (_match, prefix, x, spaceA, y, spaceB, z, rest) =>
        `${prefix}${Number(x) * scale}${spaceA}${Number(y) * scale}${spaceB}${
          Number(z) * scale
        }${rest}`
    );

    return new File([scaledText], file.name, {
      type: file.type || "text/plain",
    });
  }

  if (extension === "stl") {
    const buffer = await file.arrayBuffer();
    const binary = scaleBinaryStl(buffer, scale);

    if (binary) {
      return new File([binary], file.name, {
        type: file.type || "model/stl",
      });
    }

    const text = new TextDecoder().decode(buffer);

    return new File([scaleAsciiStl(text, scale)], file.name, {
      type: file.type || "model/stl",
    });
  }

  throw new Error(
    "Por ahora el cambio de escala automatico esta disponible para archivos .stl y .obj."
  );
}

export default function CotizaPage() {
  const { navigateWithTransition } = useNavigationTransition();
  const { addItem } = useCart();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scalePercent, setScalePercent] = useState(100);
  const [quotedScalePercent, setQuotedScalePercent] = useState<number | null>(
    null
  );
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [selectedColor, setSelectedColor] = useState<
    (typeof COLOR_OPTIONS)[number]["id"]
  >("blanco");
  const [colorMode, setColorMode] = useState<PrintColorMode>("single");
  const [referenceLink, setReferenceLink] = useState("");
  const [postProcessReferenceLink, setPostProcessReferenceLink] = useState("");
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
  const modelPrice = quote ? getModelPrice(quote.basePrice) : 0;
  const totalPrice = modelPrice + postProcessPrice;
  const attachedLinksCount = [referenceLink, postProcessReferenceLink].filter(
    (link) => link.trim().length > 0
  ).length;
  const canCheckout =
    uploadStatus === "ready" &&
    !!quote &&
    quotedScalePercent === scalePercent &&
    quote.basePrice > 0 &&
    quote.fitsPrinter !== false;

  const openPicker = () => {
    fileInputRef.current?.click();
  };

  const uploadAndQuoteFile = async (file: File, scale: number) => {
    setFileName(file.name);
    setFileSize(file.size);
    setUploadError(null);
    setQuote(null);
    setQuotedScalePercent(null);
    setUploadStatus("uploading");

    try {
      const fileForCloudSlicer = await createScaledPrintFile(file, scale);
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
      formData.append(
        "file",
        fileForCloudSlicer,
        sanitizeCloudSlicerFileName(fileForCloudSlicer.name)
      );

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
            "CloudSlicer rechazo la subida del archivo."
        );
      }

      const cloudFileId =
        publicUploadJson.file_id || String(publicUploadJson.id ?? "").trim();

      if (!cloudFileId) {
        throw new Error("CloudSlicer no devolvio file_id despues de la subida.");
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
          quoteJson?.error ?? "No se pudo generar la cotizacion del archivo."
        );
      }

      setQuote(quoteJson.quote);
      setQuotedScalePercent(scale);
      setUploadStatus("ready");
    } catch (error: unknown) {
      setUploadStatus("error");
      setQuote(null);
      setQuotedScalePercent(null);
      setUploadError(
        error instanceof Error ? error.message : "Ocurrio un error inesperado."
      );
    }
  };

  const handleScaleChange = (value: number) => {
    setScalePercent(clampScalePercent(value));
  };

  const handleRequote = async () => {
    if (!selectedFile) {
      return;
    }

    await uploadAndQuoteFile(selectedFile, scalePercent);
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
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);

    try {
      await uploadAndQuoteFile(file, scalePercent);
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
      addItem({
        kind: "print-quote",
        productId: 0,
        productSlug: "cotiza",
        variantId: -1,
        variantName: `Imprime - ${quote.fileName ?? fileName}`,
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
          postProcessReferenceLink: postProcessReferenceLink.trim() || null,
          postProcessPrice,
          scalePercent,
          basePrice: quote.basePrice,
          modelPrice,
          filamentCost: quote.filamentCost,
          electricityCost: quote.electricityCost,
          electricityCostPerKwh: quote.electricityCostPerKwh,
          printerPowerWatts: quote.printerPowerWatts,
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
            modelFile={selectedFile}
            quote={quote}
            uploadStatus={uploadStatus}
            uploadError={uploadError}
            scalePercent={scalePercent}
            quoteScalePercent={quotedScalePercent}
            canRequote={!!selectedFile && quotedScalePercent !== scalePercent}
            onFileChange={handleFileChange}
            onOpenPicker={openPicker}
            onScaleChange={handleScaleChange}
            onRequote={handleRequote}
          />
        </ScrollReveal>

        <ScrollReveal>
          <Paso3
            colorOptions={COLOR_OPTIONS}
            colorMode={colorMode}
            selectedColor={selectedColor}
            quality={quality}
            referenceLink={referenceLink}
            quoteReady={uploadStatus === "ready" && quotedScalePercent === scalePercent}
            onColorModeChange={setColorMode}
            onColorChange={handleColorChange}
            onQualityChange={setQuality}
            onReferenceLinkChange={setReferenceLink}
          />
        </ScrollReveal>

        <ScrollReveal>
          <Paso4
            postProcess={postProcess}
            referenceLink={postProcessReferenceLink}
            onPostProcessChange={setPostProcess}
            onReferenceLinkChange={setPostProcessReferenceLink}
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
            modelPrice={modelPrice}
            totalPrice={totalPrice}
            printTimeSeconds={quote?.printTimeSeconds ?? null}
            dimensions={quote?.dimensions ?? null}
            attachedLinksCount={attachedLinksCount}
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
