"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";

type SmoothScrollProps = {
  children: ReactNode;
};

const defaultLenisOptions = {
  lerp: 0.08,
  duration: 1.2,
  smoothWheel: true,
  syncTouch: false,
};

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  return (
    <ReactLenis root options={defaultLenisOptions}>
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
