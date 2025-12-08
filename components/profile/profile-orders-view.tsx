"use client";

import { ChevronLeft } from "lucide-react";

type ProfileOrdersViewProps = {
  onBack: () => void;
};

export function ProfileOrdersView({ onBack }: ProfileOrdersViewProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-full p-1 hover:bg-neutral-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-black tracking-tight">COMPRAS</h2>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center text-sm text-neutral-500">
        <p>Aún no tienes historial de compras.</p>
        <p className="mt-1">Cuando realices tu primera compra, aparecerá aquí 🛒</p>
      </div>
    </div>
  );
}
