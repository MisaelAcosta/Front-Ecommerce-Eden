"use client";

import { ChevronRight } from "lucide-react";
import {
  khInterferenceBoldFont,
  khInterferenceLightFont,
  khInterferenceRegularFont,
} from "@/app/(routes)/cart/components/cart-fonts";
import type { CurrentUser, ProfileView } from "./profile-types";

type ProfileMenuProps = {
  user: CurrentUser;
  onChangeView: (view: ProfileView) => void;
  onLogout: () => void;
};

export function ProfileMenu({
  user,
  onChangeView,
  onLogout,
}: ProfileMenuProps) {
  return (
    <div className="flex h-full flex-col bg-[#fafafa] text-black">
      <header className="border-b border-black px-6 pb-6 pt-16">
        <p
          className={`${khInterferenceLightFont.className} text-[11px] uppercase leading-none text-black/60`}
        >
          Mi cuenta
        </p>
        <h1
          className={`${khInterferenceBoldFont.className} mt-3 text-[36px] uppercase leading-[0.9]`}
        >
          Perfil
        </h1>
        <p
          className={`${khInterferenceRegularFont.className} mt-5 truncate text-[13px] uppercase text-black/70`}
          title={user.email}
        >
          {user.email}
        </p>
      </header>

      <nav className="border-b border-black">
        <button
          type="button"
          onClick={() => onChangeView("compras")}
          className="group flex w-full items-center justify-between gap-5 border-b border-black px-6 py-7 text-left transition-colors hover:bg-[#ADFE00]"
        >
          <div className="min-w-0">
            <p
              className={`${khInterferenceLightFont.className} text-[10px] uppercase text-black/55`}
            >
              01
            </p>
            <h2
              className={`${khInterferenceBoldFont.className} mt-2 text-[30px] uppercase leading-none`}
            >
              Pedidos
            </h2>
            <p
              className={`${khInterferenceLightFont.className} mt-3 max-w-[235px] text-[12px] leading-[1.2] text-black/70`}
            >
              Revisa tus pedidos recientes y el resumen de cada compra.
            </p>
          </div>
          <ChevronRight
            className="size-6 shrink-0 transition-transform group-hover:translate-x-1"
            strokeWidth={1.8}
          />
        </button>

        <button
          type="button"
          onClick={() => onChangeView("info")}
          className="group flex w-full items-center justify-between gap-5 px-6 py-7 text-left transition-colors hover:bg-[#ADFE00]"
        >
          <div className="min-w-0">
            <p
              className={`${khInterferenceLightFont.className} text-[10px] uppercase text-black/55`}
            >
              02
            </p>
            <h2
              className={`${khInterferenceBoldFont.className} mt-2 text-[30px] uppercase leading-none`}
            >
              Info
            </h2>
            <p
              className={`${khInterferenceLightFont.className} mt-3 max-w-[235px] text-[12px] leading-[1.2] text-black/70`}
            >
              Completa tu informacion personal y realiza tus compras mas rapido.
            </p>
          </div>
          <ChevronRight
            className="size-6 shrink-0 transition-transform group-hover:translate-x-1"
            strokeWidth={1.8}
          />
        </button>
      </nav>

      <footer className="mt-auto border-t border-black px-6 py-6">
        <button
          type="button"
          onClick={onLogout}
          className={`${khInterferenceRegularFont.className} w-full border border-black px-4 py-3 text-left text-[12px] uppercase transition-colors hover:bg-black hover:text-white`}
        >
          Cerrar sesion
        </button>
      </footer>
    </div>
  );
}
