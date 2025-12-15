// components/auth/login-form.tsx
"use client";

import { useActionState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  loginUserAction,
} from "@/components/data/actions/auth-actions";
import {
  initialLoginState,
  type LoginState,
} from "@/components/data/actions/auth-state";
type LoginFormProps = {
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
};

export function LoginForm({
  onSwitchToRegister,
  onSwitchToForgot,
}: LoginFormProps) {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginUserAction,
    initialLoginState
  );

  const safeState: LoginState = state ?? initialLoginState;

  // Cuando el login sea OK → recargamos la página para que Navbar lea /api/auth/me
  useEffect(() => {
    if (safeState.ok) {
      const t = setTimeout(() => {
        // recarga completa → Navbar monta de nuevo y ve que ya hay jwt
        window.location.reload();
      }, 800); // un pelín de delay para ver el mensaje si quieres
      return () => clearTimeout(t);
    }
  }, [safeState.ok]);


  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1338";

  return (
    <div className="relative w-full max-w-md rounded-3xl bg-white p-8 sm:p-10">
      {/* X de cierre */}
      <DialogClose asChild>
        <button
          className="
            absolute right-5 top-4 sm:right-8 sm:top-8
            inline-flex cursor-pointer items-center justify-center
            rounded-full border border-neutral-300 p-1.5
            text-black
            hover:bg-black hover:text-white
          "
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Cerrar</span>
        </button>
      </DialogClose>

      {/* Icono peace */}
      <div className="mb-6 flex justify-center">
        <Image
          src="/icons/login1.png"
          alt="Login icon"
          width={256}
          height={136}
          className=""
        />
      </div>

      {/* Título */}
      <h1 className="mb-8 text-center text-4xl font-black tracking-tight sm:text-5xl">
        BIENVENIDO
      </h1>

      {/* FORM login */}
      <form action={formAction}>
        {/* Inputs principales */}
        <div className="space-y-3">
          <Input
            type="email"
            placeholder="Correo"
            className="h-11 rounded-xl bg-neutral-100 text-sm placeholder:text-neutral-400"
            id="identifier"
            name="identifier" // 👈 Strapi login usa 'identifier'
          />
          <Input
            type="password"
            placeholder="Contraseña"
            className="h-11 rounded-xl bg-neutral-100 text-sm placeholder:text-neutral-400"
            id="password"
            name="password"
          />
        </div>

        {/* Mensaje de estado (error / éxito) */}
        {safeState.message && (
          <p
            className={`mt-4 text-center text-[11px] ${
              safeState.ok ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {safeState.message}
          </p>
        )}

        {/* Botón INICIAR */}
        <Button
          type="submit"
          className="mt-6 h-11 w-full cursor-pointer rounded-xl bg-black text-sm font-semibold tracking-wide text-white hover:bg-black/90"
          disabled={isPending}
        >
          {isPending ? "Iniciando..." : "INICIAR"}
        </Button>
      </form>

      {/* Google */}
      <Button
        type="button"
        variant="outline"
        className="mt-3 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white text-sm font-medium"
        onClick={() => {
        window.location.href = `${STRAPI_URL}/api/connect/google`;
       }}
      >
        <Image src="/icons/google.png" alt="Google" width={18} height={18} />
        <span>Continuar con Google</span>
      </Button>

      {/* Links inferiores */}
      <div className="mt-6 flex items-center justify-between text-[11px] text-neutral-500">
        <button
          type="button"
          className="hover:underline"
          onClick={onSwitchToRegister}
        >
          Registrarse
        </button>

        <button
          type="button"
          className="hover:underline"
          onClick={onSwitchToForgot}
        >
          Olvidé mi contraseña :(
        </button>
      </div>
    </div>
  );
}



