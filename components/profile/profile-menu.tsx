"use client";

import { ChevronRight } from "lucide-react";
import { ProfileView } from "./profile-types";

type ProfileMenuProps = {
  onChangeView: (view: ProfileView) => void;
  onLogout: () => void;
};

export function ProfileMenu({ onChangeView, onLogout }: ProfileMenuProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="divide-y border-t border-neutral-200">
        <button
          type="button"
          onClick={() => onChangeView("compras")}
          className="flex w-full items-center justify-between px-6 py-8 text-left"
        >
          <div>
            <h2 className="text-3xl font-black tracking-tight">COMPRAS</h2>
            <p className="mt-2 max-w-xs text-xs text-neutral-600">
              Revisa el historial completo de tus pedidos y su estado en un solo lugar.
            </p>
          </div>
          <ChevronRight className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => onChangeView("info")}
          className="flex w-full items-center justify-between px-6 py-8 text-left"
        >
          <div>
            <h2 className="text-3xl font-black tracking-tight">INFO</h2>
            <p className="mt-2 max-w-xs text-xs text-neutral-600">
              Completa tu información personal y realiza tus compras más rápido.
            </p>
          </div>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-auto border-t border-neutral-200 px-6 py-4">
        <button
          type="button"
          onClick={onLogout}
          className="text-xs font-medium text-red-600 hover:underline"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
