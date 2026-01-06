"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Step02State = {
  useAccount: boolean;
  name: string;
  email: string;
  rutBody: string;
  rutDv: string;
  phoneRest: string;
  
};

type Step03State = {
  useAccount: boolean;
  region: string | null;
  comuna: string | null;
  calle: string;
  numero: string;
  depto: string;
  nota: string;
  shippingCost: number;
};

type CartWizardState = {
  step02: Step02State;
  step03: Step03State;

  setStep02: (patch: Partial<Step02State>) => void;
  setStep03: (patch: Partial<Step03State>) => void;

  resetWizard: () => void;
};

const initialState = {
  step02: {
    useAccount: false,
    name: "",
    email: "",
    rutBody: "",
    rutDv: "",
    phoneRest: "",
  },
  step03: {
    useAccount: false,
    region: null,
    comuna: null,
    calle: "",
    numero: "",
    depto: "",
    nota: "",
    // ✅ NUEVO
    shippingCost: 0,
  },
};

export const useCartWizard = create(
  persist<CartWizardState>(
    (set) => ({
      ...initialState,

      setStep02: (patch) =>
        set((s) => ({
          step02: { ...s.step02, ...patch },
        })),

      setStep03: (patch) =>
        set((s) => ({
          step03: { ...s.step03, ...patch },
        })),

      resetWizard: () => set(initialState),
    }),
    { name: "eden-cart-wizard" }
  )
);
