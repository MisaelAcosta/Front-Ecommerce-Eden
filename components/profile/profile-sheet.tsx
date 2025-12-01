"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export type CurrentUser = {
  id: number;
  username: string;
  email: string;
};

type ProfileSheetProps = {
  user: CurrentUser;
};

export function ProfileSheet({ user }: ProfileSheetProps) {
  return (
    <Sheet>
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

      <SheetContent side="right" className="w-full sm:w-[380px]">
        <SheetHeader>
          <SheetTitle>Tu perfil</SheetTitle>
          <SheetDescription>
            Más adelante aquí vamos a poner tu dirección y otros datos.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 text-sm">
          <div>
            <p className="font-semibold">Usuario</p>
            <p className="text-neutral-600 break-words">{user.username}</p>
          </div>
          <div>
            <p className="font-semibold">Correo</p>
            <p className="text-neutral-600 break-words">{user.email}</p>
          </div>

          <div className="border-t border-neutral-200 pt-6">
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={() => {
                alert("Luego aquí hacemos Cerrar sesión 🤝");
              }}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

