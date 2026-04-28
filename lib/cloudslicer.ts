import type { PrintDimensions } from "@/types/print-quote";

const CLOUDSLICER_API_BASE = "https://api.cloudslicer3d.com/v1";

type NumberLike = number | string | null | undefined;

type QuoteSummary = {
  quoteId: string | null;
  basePrice: number | null;
  currency: string | null;
  materialLabel: string | null;
  printTimeSeconds: number | null;
  estimatedWeightGrams: number | null;
};

type CloudSlicerConfig = {
  token: string;
  printerId: string;
  filamentId: string;
  quoteConfigId: string | null;
  printerDimensions: PrintDimensions;
};

function toNumber(value: NumberLike) {
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number(value)
      : Number.NaN;

  return Number.isFinite(numeric) ? numeric : null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readNested(source: unknown, path: string[]) {
  let current = source;

  for (const segment of path) {
    const record = asRecord(current);

    if (!record || !(segment in record)) {
      return null;
    }

    current = record[segment];
  }

  return current ?? null;
}

function findNumberByPaths(source: unknown, paths: string[][]) {
  for (const path of paths) {
    const value = readNested(source, path);
    const parsed = toNumber(value as NumberLike);

    if (parsed !== null) {
      return parsed;
    }
  }

  return null;
}

function findStringByPaths(source: unknown, paths: string[][]) {
  for (const path of paths) {
    const value = readNested(source, path);

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

function parseDimensions(source: unknown): PrintDimensions | null {
  const x = findNumberByPaths(source, [
    ["model_dimensions", "x"],
    ["dimensions", "x"],
  ]);
  const y = findNumberByPaths(source, [
    ["model_dimensions", "y"],
    ["dimensions", "y"],
  ]);
  const z = findNumberByPaths(source, [
    ["model_dimensions", "z"],
    ["dimensions", "z"],
  ]);

  if (x === null || y === null || z === null) {
    return null;
  }

  return { x, y, z };
}

export function getCloudSlicerConfig(): CloudSlicerConfig {
  const token = process.env.CLOUDSLICER_API_TOKEN?.trim();
  const printerId = process.env.CLOUDSLICER_PRINTER_ID?.trim();
  const filamentId = process.env.CLOUDSLICER_FILAMENT_ID?.trim();

  if (!token) {
    throw new Error("Falta CLOUDSLICER_API_TOKEN en el entorno.");
  }

  if (!printerId) {
    throw new Error("Falta CLOUDSLICER_PRINTER_ID en el entorno.");
  }

  if (!filamentId) {
    throw new Error("Falta CLOUDSLICER_FILAMENT_ID en el entorno.");
  }

  return {
    token,
    printerId,
    filamentId,
    quoteConfigId: process.env.CLOUDSLICER_QUOTE_CONFIG_ID?.trim() || null,
    printerDimensions: {
      x: toNumber(process.env.CLOUDSLICER_PRINTER_X) ?? 210,
      y: toNumber(process.env.CLOUDSLICER_PRINTER_Y) ?? 210,
      z: toNumber(process.env.CLOUDSLICER_PRINTER_Z) ?? 250,
    },
  };
}

export async function cloudSlicerFetch<T>(
  path: string,
  config: CloudSlicerConfig,
  init?: RequestInit
) {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${config.token}`);

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${CLOUDSLICER_API_BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const text = await response.text();
  const data = text
    ? (JSON.parse(text) as T | { detail?: string; message?: string })
    : null;

  if (!response.ok) {
    const record = asRecord(data);
    const message =
      (record?.detail as string | undefined) ||
      (record?.message as string | undefined) ||
      `CloudSlicer respondió con ${response.status}.`;

    throw new Error(message);
  }

  return data as T;
}

export function parsePrintability(source: unknown) {
  return {
    fitsPrinter:
      typeof readNested(source, ["fits_printer"]) === "boolean"
        ? (readNested(source, ["fits_printer"]) as boolean)
        : null,
    dimensions: parseDimensions(source),
  };
}

export function parseQuoteSummary(source: unknown): QuoteSummary {
  return {
    quoteId:
      findStringByPaths(source, [["quote_id"], ["quoteId"], ["id"]]) ?? null,
    basePrice: findNumberByPaths(source, [
      ["price_total"],
      ["total_price"],
      ["quote_total"],
      ["total_cost"],
      ["cost"],
      ["price"],
      ["total"],
    ]),
    currency:
      findStringByPaths(source, [["currency"], ["quote_config", "currency"]]) ??
      null,
    materialLabel:
      findStringByPaths(source, [
        ["filament_name"],
        ["material_name"],
        ["filament_type"],
        ["material"],
      ]) ?? null,
    printTimeSeconds: findNumberByPaths(source, [
      ["print_time_seconds"],
      ["estimated_print_time_seconds"],
      ["print_time"],
      ["estimated_print_time"],
      ["time_seconds"],
    ]),
    estimatedWeightGrams: findNumberByPaths(source, [
      ["filament_used_g"],
      ["filament_weight_g"],
      ["material_used_g"],
      ["weight_grams"],
    ]),
  };
}
