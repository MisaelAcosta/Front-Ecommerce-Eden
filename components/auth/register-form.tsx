// components/auth/register-form.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { X, Eye, EyeOff } from "lucide-react";
import { registerUserAction } from "@/components/data/actions/auth-actions";

type RegisterFormProps = {
  onSwitchToLogin: () => void;
};

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-lg sm:p-10">
      <form action={registerUserAction}>
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
        <h1 className="mb-8 text-center text-3xl font-black tracking-tight sm:text-4xl">
          REGISTRO
        </h1>

        {/* Correo */}
        <div className="space-y-3">
          <Input
            id="email"
            name="email" // 👈 clave para el server action
            type="email"
            placeholder="Correo"
            className="h-11 rounded-xl bg-neutral-100 text-sm placeholder:text-neutral-400"
          />

          {/* Contraseña */}
          <div className="relative">
            <Input
              id="password"
              name="password" // 👈
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              className="h-11 rounded-xl bg-neutral-100 text-sm placeholder:text-neutral-400 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Confirmar contraseña */}
          <div className="relative">
            <Input
              id="confirm_password"
              name="confirm_password" // 👈 este nombre lee el server action
              type={showConfirm ? "text" : "password"}
              placeholder="Confirmar Contraseña"
              className="h-11 rounded-xl bg-neutral-100 text-sm placeholder:text-neutral-400 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
              onClick={() => setShowConfirm((v) => !v)}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Botón REGISTRAR */}
        <Button
          type="submit"
          className="mt-6 h-11 w-full rounded-xl bg-black text-sm font-semibold tracking-wide text-white hover:bg-black/90"
        >
          REGISTRAR
        </Button>

        {/* Texto inferior */}
        <p className="mt-6 text-center text-[11px] leading-relaxed text-neutral-500">
          Crea tu cuenta para comprar más rápido,
          <br />
          ver tus pedidos y guardar tus datos de envío.
        </p>

        {/* Volver a login */}
        <div className="mt-4 text-center text-[11px] text-neutral-500">
          <button
            type="button"
            className="font-medium hover:underline"
            onClick={onSwitchToLogin}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </form>
    </div>
  );
}

