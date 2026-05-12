"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";

// ===== # Smooth scroll | Tipos y props =====
// ---- Props del wrapper reutilizable de suavizado de scroll ----
type SmoothScrollProps = {
  children: ReactNode;
};

// ===== # Smooth scroll | Configuracion compartida =====
// ---- Opciones base para mantener un desplazamiento consistente entre paginas ----
export const defaultLenisOptions = {
  lerp: 0.08,
  duration: 1.2,
  smoothWheel: true,
  syncTouch: false,
};

// ===== # Smooth scroll | Componente reutilizable =====
// ---- Wrapper de pagina para activar Lenis en secciones completas ----
const SmoothScroll = ({ children }: SmoothScrollProps) => {
  return (
    <ReactLenis root options={defaultLenisOptions}>
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
