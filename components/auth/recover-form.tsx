// components/auth/recover-form.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

type RecoverFormProps = {
  onSwitchToLogin: () => void;
};

export function RecoverForm({ onSwitchToLogin }: RecoverFormProps) {
  return (
    <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-lg sm:p-10">
       {/* X */}
      <DialogClose asChild>
        <button
          className="
            absolute right-5 top-4
            cursor-pointer
            inline-flex items-center justify-center
            rounded-full p-1.5
            text-black
            border border-neutral-300
            hover:bg-black hover:text-white
          "
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Cerrar</span>
        </button>
      </DialogClose>

      {/* Título */}
      <h1 className="mb-2 mt-4 text-center text-3xl font-black tracking-tight sm:text-4xl">
        RECUPERA
      </h1>

      {/* Subtítulo */}
      <p className="mb-8 text-center text-sm text-neutral-500">
        Ingresa tu correo para recuperar tu contraseña
      </p>

      {/* Input correo */}
      <Input
        type="email"
        placeholder="Correo"
        className="h-11 rounded-xl bg-neutral-100 text-sm placeholder:text-neutral-400"
      />

      {/* Botón enviar */}
      <Button className="mt-6 h-11 w-full rounded-xl bg-black text-sm font-semibold tracking-wide text-white hover:bg-black/90">
        ENVIAR
      </Button>

      {/* Texto inferior */}
      <p className="mt-8 text-center text-[11px] leading-relaxed text-neutral-500">
        Te enviaremos un código de recuperación
        <br />
        con el que podrás actualizar tu contraseña.
      </p>

      {/* Volver a login */}
      <div className="mt-4 text-center text-[11px] text-neutral-500">
        <button
          type="button"
          className="font-medium hover:underline"
          onClick={onSwitchToLogin}
        >
          Volver a iniciar sesión
        </button>
      </div>
    </div>
  );
}
