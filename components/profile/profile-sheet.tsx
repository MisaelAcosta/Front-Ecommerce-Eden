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
  const [view, setView] = useState<ProfileView>("menu");
  const router = useRouter();

  const handleBackToMenu = () => setView("menu");

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
    <Sheet
      onOpenChange={(open) => {
        if (!open) setView("menu");
      }}
    >
      <SheetTrigger asChild>
        {children ? (
          children
        ) : (
          <button className="hidden cursor-pointer rounded-2xl border border-black px-4 py-1 font-bold transition duration-200 ease-in-out hover:bg-black hover:text-white md:flex">
            Perfil
          </button>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="w-full p-0 sm:w-[380px]">
        {view === "menu" && (
          <ProfileMenu onChangeView={setView} onLogout={handleLogout} />
        )}

        {view === "compras" && (
          <ProfileOrdersView onBack={handleBackToMenu} />
        )}

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
