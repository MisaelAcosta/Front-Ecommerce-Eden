export type PrintColorMode = "single" | "multi";

export type PrintQuality = "standard";

export type PrintPostProcess = "none" | "basic" | "advanced";

export type PrintDimensions = {
  x: number;
  y: number;
  z: number;
};

export type PrintQuoteSnapshot = {
  fileName: string;
  fileId: string;
  quoteId: string | null;
  printerId: string | null;
  filamentId: string | null;
  materialLabel: string;
  quality: PrintQuality;
  qualityLabel: string;
  selectedColor: string;
  colorMode: PrintColorMode;
  referenceLink: string | null;
  postProcess: PrintPostProcess;
  postProcessLabel: string;
  postProcessPrice: number;
  scalePercent: number;
  basePrice: number;
  filamentCost: number | null;
  electricityCost: number | null;
  electricityCostPerKwh: number | null;
  printerPowerWatts: number | null;
  totalPrice: number;
  fitsPrinter: boolean | null;
  dimensions: PrintDimensions | null;
  printTimeSeconds: number | null;
  estimatedWeightGrams: number | null;
  notes: string[];
};
