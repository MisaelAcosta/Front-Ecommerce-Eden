// lib/flow/sign.ts
import { createHmac } from "node:crypto";

export function flowSign(params: Record<string, string | number>, secretKey: string) {
  // Flow: ordenar keys y concatenar "key + value" (sin separadores)
  const keys = Object.keys(params).sort();
  let toSign = "";
  for (const k of keys) {
    toSign += k + String(params[k]);
  }
  return createHmac("sha256", secretKey).update(toSign).digest("hex");
}
