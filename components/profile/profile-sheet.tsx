// components/profile/profile-sheet.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import { ChevronRight, ChevronLeft } from "lucide-react";

import { ProfileMenu } from "./profile-menu";
import { ProfileOrdersView } from "./profile-orders-view";
import { ProfileInfoForm } from "./profile-info-form";
import type {
  CurrentUser,
  ProfileView,
  ProfileData,
} from "./profile-types";

type ProfileSheetProps = {
  user: CurrentUser;
  profile?: ProfileData | null;
  onLogout?: () => void; // 👈 IMPORTANTE
};

export function ProfileSheet({ user, profile, onLogout }: ProfileSheetProps) {
  const [view, setView] = useState<ProfileView>("menu");
  const router = useRouter();

  const handleBackToMenu = () => setView("menu");

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      // avisamos al Navbar que ya no hay usuario
      onLogout?.();
      // por si tienes otros datos server-side
      router.refresh();
    }
  };

  return (
    <Sheet
      onOpenChange={(open) => {
        if (!open) setView("menu");
      }}
    >
      {/* Botón PERFIL en navbar */}
      <SheetTrigger asChild>
        <button
          className="
            hidden
            md:flex
            cursor-pointer
            rounded-2xl
            border
            border-black
            px-4
            py-1
            font-bold
            hover:bg-black
            hover:text-white
            transition
            duration-200
            ease-in-out
          "
        >
          Perfil
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full p-0 sm:w-[380px]">
        {view === "menu" && (
          <ProfileMenu
            onChangeView={setView}
            onLogout={handleLogout} // 👈 usamos nuestra función
          />
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

