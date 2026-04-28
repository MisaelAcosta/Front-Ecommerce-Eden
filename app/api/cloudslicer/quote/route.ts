import { NextResponse } from "next/server";
import {
  cloudSlicerFetch,
  getCloudSlicerConfig,
  parsePrintability,
  parseQuoteSummary,
} from "@/lib/cloudslicer";

type QuoteRequestBody = {
  fileId?: string;
  fileName?: string;
};

type QuotePayload = {
  printer_id: string;
  filament_id: string;
  quote_config_id?: string;
};

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuoteRequestBody;
    const fileId = String(body.fileId ?? "").trim();

    if (!fileId) {
      return NextResponse.json(
        { ok: false, error: "Falta fileId para cotizar." },
        { status: 400 }
      );
    }

    const config = getCloudSlicerConfig();

    // Primero validamos si el archivo cabe en la impresora configurada.
    const printabilityRaw = await cloudSlicerFetch<Record<string, unknown>>(
      `/printability/${fileId}`,
      config,
      {
        method: "POST",
        body: JSON.stringify(config.printerDimensions),
      }
    );

    const printability = parsePrintability(printabilityRaw);

    if (printability.fitsPrinter === false) {
      return NextResponse.json({
        ok: true,
        quote: {
          fileId,
          quoteId: null,
          currency: "CLP",
          basePrice: 0,
          materialLabel: "PLA",
          printTimeSeconds: null,
          estimatedWeightGrams: null,
          fitsPrinter: false,
          dimensions: printability.dimensions,
          printerId: config.printerId,
          filamentId: config.filamentId,
          fileName: body.fileName ?? null,
          notes: [
            "El modelo excede el volumen de impresión configurado en CloudSlicer.",
          ],
        },
      });
    }

    // Luego generamos la cotización real con la configuración de impresora/filamento.
    const quotePayload: QuotePayload = {
      printer_id: config.printerId,
      filament_id: config.filamentId,
    };

    if (config.quoteConfigId) {
      quotePayload.quote_config_id = config.quoteConfigId;
    }

    const createdQuoteRaw = await cloudSlicerFetch<Record<string, unknown>>(
      `/quote/${fileId}`,
      config,
      {
        method: "POST",
        body: JSON.stringify(quotePayload),
      }
    );

    let parsedQuote = parseQuoteSummary(createdQuoteRaw);
    let finalQuoteRaw = createdQuoteRaw;

    // Si CloudSlicer devuelve solo quote_id, consultamos el registro hasta poder leer el precio.
    if (parsedQuote.quoteId && parsedQuote.basePrice === null) {
      for (let attempt = 0; attempt < 8; attempt += 1) {
        await delay(900);

        finalQuoteRaw = await cloudSlicerFetch<Record<string, unknown>>(
          `/quote/${parsedQuote.quoteId}`,
          config,
          { method: "GET" }
        );

        parsedQuote = parseQuoteSummary(finalQuoteRaw);

        if (parsedQuote.basePrice !== null) {
          break;
        }
      }
    }

    if (parsedQuote.basePrice === null) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "CloudSlicer respondió, pero no pude identificar el precio final de la cotización.",
          debug: {
            quoteId: parsedQuote.quoteId,
          },
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      quote: {
        fileId,
        quoteId: parsedQuote.quoteId,
        currency: parsedQuote.currency ?? "CLP",
        basePrice: Math.round(parsedQuote.basePrice),
        materialLabel: parsedQuote.materialLabel ?? "PLA",
        printTimeSeconds: parsedQuote.printTimeSeconds,
        estimatedWeightGrams: parsedQuote.estimatedWeightGrams,
        fitsPrinter: printability.fitsPrinter,
        dimensions: printability.dimensions,
        printerId: config.printerId,
        filamentId: config.filamentId,
        fileName: body.fileName ?? null,
        notes:
          finalQuoteRaw === createdQuoteRaw
            ? []
            : ["Cotización obtenida desde el registro final de CloudSlicer."],
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "No se pudo cotizar el archivo.";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
