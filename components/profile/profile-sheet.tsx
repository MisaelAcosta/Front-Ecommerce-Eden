// components/profile/profile-sheet.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import { CurrentUser, ProfileView } from "./profile-types";
import { ProfileMenu } from "./profile-menu";
import { ProfileOrdersView } from "./profile-orders-view";
import { ProfileInfoForm } from "./profile-info-form";

type ProfileSheetProps = {
  user: CurrentUser;
};

export function ProfileSheet({ user }: ProfileSheetProps) {
  const [view, setView] = useState<ProfileView>("menu");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      router.refresh();
    }
  };

  const handleBackToMenu = () => setView("menu");

  return (
    <Sheet
      onOpenChange={(open) => {
        if (!open) setView("menu");
      }}
    >
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

      <SheetContent side="right" className="w-full sm:w-[380px] p-0">
        {view === "menu" && (
          <ProfileMenu onChangeView={setView} onLogout={handleLogout} />
        )}

        {view === "compras" && (
          <ProfileOrdersView onBack={handleBackToMenu} />
        )}

        {view === "info" && (
          <ProfileInfoForm onBack={handleBackToMenu} userId={user.id} />
        )}
      </SheetContent>
    </Sheet>
  );
}



