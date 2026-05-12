"use client";

import type { ElementType, ReactNode } from "react";
import { motion } from "motion/react";

// ===== # Scroll reveal | Tipos y props =====
// ---- Elementos HTML habituales que pueden recibir la animacion ----
type RevealElement =
  | "div"
  | "section"
  | "article"
  | "header"
  | "footer"
  | "aside"
  | "h1"
  | "h2"
  | "h3"
  | "p"
  | "span"
  | "ul"
  | "li";

// ---- Props del componente reutilizable de aparicion en scroll ----
type ScrollRevealProps = {
  as?: RevealElement;
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
  once?: boolean;
};

// ===== # Scroll reveal | Configuracion compartida =====
// ---- Variante base para contenido que sube suavemente al entrar en pantalla ----
export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

// ---- Viewport por defecto para activar la animacion una sola vez ----
export const revealViewport = {
  once: true,
  amount: 0.2,
};

// ===== # Scroll reveal | Componente reutilizable =====
// ---- Wrapper para animar letras, textos, bloques visuales y contenido editorial ----
const ScrollReveal = ({
  as = "div",
  children,
  className,
  delay = 0,
  amount = revealViewport.amount,
  once = revealViewport.once,
}: ScrollRevealProps) => {
  const MotionTag = motion[as] as ElementType;

  return (
    <MotionTag
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      custom={delay}
      className={className}
    >
      {children}
    </MotionTag>
  );
};

export default ScrollReveal;
