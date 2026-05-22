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
  pricing_config: {
    currency: string;
    cost_per_hour: number;
    cost_per_gram: number;
    base_price: number;
    printer_watts: number;
    cost_per_kwh: number;
  };
};

const FILAMENT_KG_PRICE_CLP = 12000;
const FILAMENT_GRAM_PRICE_CLP = FILAMENT_KG_PRICE_CLP / 1000;
const PRINTER_POWER_WATTS = 350;
const ELECTRICITY_COST_PER_KWH_CLP = 172.755;

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

function calculateFallbackPrice(estimatedWeightGrams: number | null) {
  if (estimatedWeightGrams === null) {
    return null;
  }

  return Math.round(estimatedWeightGrams * FILAMENT_GRAM_PRICE_CLP);
}

function calculateElectricityCost(printTimeSeconds: number | null) {
  if (printTimeSeconds === null) {
    return null;
  }

  const printTimeHours = printTimeSeconds / 3600;
  const consumedKwh = (PRINTER_POWER_WATTS / 1000) * printTimeHours;

  return Math.round(consumedKwh * ELECTRICITY_COST_PER_KWH_CLP);
}

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
            "El modelo excede el volumen de impresion configurado en CloudSlicer.",
          ],
        },
      });
    }

    const quotePayload: QuotePayload = {
      printer_id: config.printerId,
      filament_id: config.filamentId,
      pricing_config: {
        currency: "CLP",
        cost_per_hour: 0,
        cost_per_gram: FILAMENT_GRAM_PRICE_CLP,
        base_price: 0,
        printer_watts: PRINTER_POWER_WATTS,
        cost_per_kwh: ELECTRICITY_COST_PER_KWH_CLP,
      },
    };

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

    if (
      parsedQuote.quoteId &&
      parsedQuote.basePrice === null &&
      parsedQuote.estimatedWeightGrams === null
    ) {
      for (let attempt = 0; attempt < 8; attempt += 1) {
        await delay(900);

        finalQuoteRaw = await cloudSlicerFetch<Record<string, unknown>>(
          `/quote/${parsedQuote.quoteId}`,
          config,
          { method: "GET" }
        );

        parsedQuote = parseQuoteSummary(finalQuoteRaw);

        if (parsedQuote.status === "failed") {
          throw new Error(
            parsedQuote.errorMessage ?? "CloudSlicer no pudo laminar el archivo."
          );
        }

        if (
          parsedQuote.basePrice !== null ||
          parsedQuote.estimatedWeightGrams !== null
        ) {
          break;
        }
      }
    }

    const basePrice =
      parsedQuote.basePrice ??
      (calculateFallbackPrice(parsedQuote.estimatedWeightGrams) ?? 0) +
        (calculateElectricityCost(parsedQuote.printTimeSeconds) ?? 0);

    if (!Number.isFinite(basePrice) || basePrice <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "CloudSlicer respondio, pero no pude identificar precio ni gramos de filamento.",
          debug: {
            quoteId: parsedQuote.quoteId,
            status: parsedQuote.status,
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
        basePrice: Math.round(basePrice),
        filamentCost:
          parsedQuote.filamentCost ??
          calculateFallbackPrice(parsedQuote.estimatedWeightGrams),
        electricityCost:
          parsedQuote.electricityCost ??
          calculateElectricityCost(parsedQuote.printTimeSeconds),
        electricityCostPerKwh: ELECTRICITY_COST_PER_KWH_CLP,
        printerPowerWatts: PRINTER_POWER_WATTS,
        materialLabel: parsedQuote.materialLabel ?? "PLA",
        printTimeSeconds: parsedQuote.printTimeSeconds,
        estimatedWeightGrams: parsedQuote.estimatedWeightGrams,
        fitsPrinter: printability.fitsPrinter,
        dimensions: printability.dimensions,
        printerId: config.printerId,
        filamentId: config.filamentId,
        fileName: body.fileName ?? null,
        notes:
          parsedQuote.basePrice === null
            ? [
                "Precio calculado localmente con el peso de filamento entregado por CloudSlicer.",
              ]
            : finalQuoteRaw === createdQuoteRaw
            ? []
            : ["Cotizacion obtenida desde el registro final de CloudSlicer."],
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "No se pudo cotizar el archivo.";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
