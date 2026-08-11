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
    // CONTENEDOR GENERAL DEL MENU
    // Fondo negro, texto blanco y altura completa para empujar el cierre de sesion al final.
    <div className="flex h-full flex-col bg-black text-white">
      {/* CABECERA: identifica la seccion y muestra el correo de la cuenta abierta. */}
      <header className="border-b border-white/20 px-6 pb-6 pt-16">
        <p
          className={`${khInterferenceLightFont.className} text-[11px] uppercase leading-none text-white/60`}
        >
          Mi cuenta
        </p>
        <h1
          className={`${khInterferenceBoldFont.className} mt-3 text-[36px] uppercase leading-[0.9]`}
        >
          Perfil
        </h1>
        <p
          className={`${khInterferenceRegularFont.className} mt-5 truncate text-[13px] uppercase text-white/70`}
          title={user.email}
        >
          {user.email}
        </p>
      </header>

      {/* NAVEGACION PRINCIPAL: cada boton cambia la vista interna sin cerrar el Sheet. */}
      <nav className="border-b border-white/20">
        {/* ACCESO 01 - PEDIDOS: abre el historial de compras y seguimiento. */}
        <button
          type="button"
          onClick={() => onChangeView("compras")}
          className="
            group flex w-full items-center justify-between gap-5
            border-b border-white/20 px-6 py-7 text-left
            transition-colors hover:bg-[#c7c7c7] hover:text-black
          "
        >
          <div className="min-w-0">
            
            <h2
              className={`${khInterferenceBoldFont.className} mt-2 text-[30px] uppercase leading-none`}
            >
              Pedidos
            </h2>
            <p
              className={`${khInterferenceLightFont.className} mt-3 max-w-[235px] text-[12px] leading-[1.2] text-white/70 group-hover:text-black/70`}
            >
              Revisa tus pedidos recientes y el resumen de cada compra.
            </p>
          </div>
          <ChevronRight
            className="
              size-6 shrink-0 transition-transform
              group-hover:translate-x-1
            "
            strokeWidth={1.8}
          />
        </button>

        {/* ACCESO 02 - INFO: abre los datos que el checkout utiliza para autocompletar. */}
        <button
          type="button"
          onClick={() => onChangeView("info")}
          className="
            group flex w-full items-center justify-between gap-5 px-6 py-7
            text-left transition-colors hover:bg-[#c7c7c7] hover:text-black
          "
        >
          <div className="min-w-0">
            
            <h2
              className={`${khInterferenceBoldFont.className} mt-2 text-[30px] uppercase leading-none`}
            >
              Info
            </h2>
            <p
              className={`${khInterferenceLightFont.className} mt-3 
              max-w-[235px] text-[12px] leading-[1.2] text-white/70
               group-hover:text-black/70`}
            >
              Completa tu informacion personal y realiza tus compras mas rapido.
            </p>
          </div>
          <ChevronRight
            className="
              size-6 shrink-0 transition-transform
              group-hover:translate-x-1
            "
            strokeWidth={1.8}
          />
        </button>
      </nav>

      {/* PIE DEL MENU: accion separada y visualmente secundaria para cerrar sesion. */}
      <footer className="mt-auto border-t border-white/20 px-6 py-6">
        <button
          type="button"
          onClick={onLogout}
          className={`${khInterferenceRegularFont.className}
            w-full border border-white/40 px-4 py-3 text-left
            text-[12px] uppercase transition-colors hover:bg-white
             hover:text-black`}
        >
          Cerrar sesion
        </button>
      </footer>
    </div>
  );
}
