"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProfileMenu } from "./profile-menu";
import { ProfileOrdersView } from "./profile-orders-view";
import { ProfileInfoForm } from "./profile-info-form";
import type { CurrentUser, ProfileData, ProfileView } from "./profile-types";

type ProfileSheetProps = {
  user: CurrentUser;
  profile?: ProfileData | null;
  onLogout?: () => void;
  children?: React.ReactNode;
};

export function ProfileSheet({
  user,
  profile,
  onLogout,
  children,
}: ProfileSheetProps) {
  // ESTADO DE NAVEGACION INTERNA
  // Decide que vista se muestra dentro del mismo panel lateral: menu, pedidos o info.
  const [view, setView] = useState<ProfileView>("menu");
  const router = useRouter();

  // ACCION VOLVER
  // La usan Info y Pedidos para regresar a la portada del perfil sin cerrar el Sheet.
  const handleBackToMenu = () => setView("menu");

  // ACCION CERRAR SESION
  // Cierra la cookie de autenticacion, actualiza el icono de navegacion y refresca la pagina.
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        toast.error("No se pudo cerrar sesion", {
          description: "Intentalo nuevamente en un momento.",
        });
        return;
      }

      toast.success("Sesion cerrada", {
        description: "Te esperamos de vuelta en Eden.",
      });

      onLogout?.();
      router.refresh();
    } catch (err) {
      console.error("Error al cerrar sesion:", err);
      toast.error("No se pudo cerrar sesion", {
        description: "Revisa tu conexion e intentalo otra vez.",
      });
    }
  };

  return (
    // CONTENEDOR SHEET
    // Al cerrar el panel, siempre reinicia en el menu para no abrir directamente una vista anterior.
    <Sheet
      onOpenChange={(open) => {
        if (!open) setView("menu");
      }}
    >
      {/* DISPARADOR DEL PERFIL: normalmente es el icono del usuario del navbar. */}
      <SheetTrigger asChild>
        {children ? (
          children
        ) : (
          <button
            className="
              hidden cursor-pointer rounded-2xl border border-black px-4 py-1
              font-bold transition duration-200 ease-in-out hover:bg-[#1B2C1C]
               hover:text-white
              md:flex
            "
          >
            Perfil
          </button>
        )}
      </SheetTrigger>

      {/* PANEL LATERAL: ancho total en movil y 380px desde tablet/escritorio. */}
      <SheetContent
        side="right"
        className="w-full border-l-0 bg-[#1B2C1C] p-0 
        text-white sm:w-[380px]"
      >
        {/* VISTA 01: portada con enlaces a Pedidos e Info. */}
        {view === "menu" && (
          <ProfileMenu
            user={user}
            onChangeView={setView}
            onLogout={handleLogout}
          />
        )}

        {/* VISTA 02: historial y estado de las compras del usuario. */}
        {view === "compras" && (
          <ProfileOrdersView onBack={handleBackToMenu} />
        )}

        {/* VISTA 03: formulario de datos personales y direccion de despacho. */}
        {view === "info" && (
          <ProfileInfoForm
            onBack={handleBackToMenu}
            userId={user.id}
            initialProfile={profile}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
