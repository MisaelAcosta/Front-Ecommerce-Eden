// lib/shipping.ts
export type ShippingQuote = {
  cost: number; // CLP
  label: string; // texto para UI
};

/**
 * Heurística simple (MVP):
 * - RM: 2990 fijo
 * - Norte: 4990
 * - Centro: 6990
 * - Sur: 7990
 *
 * Puedes ajustar estos valores cuando quieras.
 */
const NORTH = new Set([
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
]);

const CENTER = new Set([
  "Valparaíso",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
]);

const SOUTH = new Set([
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
]);

const normalize = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const isRM = (region: string) => {
  const r = normalize(region);
  return r.includes("metropolitana") || r === "rm";
};

export function getShippingCost(
  region: string | null,
  _comuna?: string | null
): ShippingQuote {
  if (!region) return { cost: 0, label: "—" };

  if (isRM(region)) return { cost: 2990, label: "RM (tarifa fija)" };

  const regionNorm = normalize(region);

  const inSet = (set: Set<string>) =>
    [...set].some((x) => normalize(x) === regionNorm);

  if (inSet(NORTH)) return { cost: 4990, label: "Región norte" };
  if (inSet(CENTER)) return { cost: 6990, label: "Región centro" };
  if (inSet(SOUTH)) return { cost: 7990, label: "Región sur" };

  return { cost: 6990, label: "Región (tarifa estándar)" };
}
