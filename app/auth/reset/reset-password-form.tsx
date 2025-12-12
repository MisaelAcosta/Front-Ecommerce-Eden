// app/auth/reset/reset-password-form.tsx
"use client";

import { useActionState, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
  resetPasswordAction,
  type ResetPasswordState,
} from "@/components/data/actions/password-reset-actions";

const initialState: ResetPasswordState = { ok: false, message: null };

export default function ResetPasswordForm({ code }: { code: string }) {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const [state, formAction, isPending] = useActionState<
    ResetPasswordState,
    FormData
  >(resetPasswordAction, initialState);

  const safeState = state ?? initialState;

  // Si se completó OK, te mando al home en unos seg (opcional)
  useEffect(() => {
    if (safeState.ok) {
      const t = setTimeout(() => {
        window.location.href = "/";
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [safeState.ok]);

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 ">
      <h1 className="text-center text-3xl font-black tracking-tight">
        NUEVA CONTRASEÑA
      </h1>

      <p className="mt-2 text-center text-sm text-neutral-500">
        Crea una nueva contraseña para tu cuenta.
      </p>

      {!code && (
        <p className="mt-6 text-center text-xs text-red-600">
          Código inválido o faltante. Vuelve a solicitar el correo de recuperación.
        </p>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        {/* code oculto */}
        <input type="hidden" name="code" value={code} />

        <div className="relative">
          <Input
            name="password"
            type={show1 ? "text" : "password"}
            placeholder="Nueva contraseña"
            className="h-11 rounded-xl bg-neutral-100 pr-10 text-sm placeholder:text-neutral-400"
            disabled={!code}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
            onClick={() => setShow1((v) => !v)}
            disabled={!code}
          >
            {show1 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="relative">
          <Input
            name="passwordConfirmation"
            type={show2 ? "text" : "password"}
            placeholder="Confirmar contraseña"
            className="h-11 rounded-xl bg-neutral-100 pr-10 text-sm placeholder:text-neutral-400"
            disabled={!code}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
            onClick={() => setShow2((v) => !v)}
            disabled={!code}
          >
            {show2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {safeState.message && (
          <p
            className={`text-center text-[11px] ${
              safeState.ok ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {safeState.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={!code || isPending}
          className="h-11 w-full rounded-xl bg-black text-sm font-semibold tracking-wide text-white hover:bg-black/90"
        >
          {isPending ? "Guardando..." : "ACTUALIZAR CONTRASEÑA"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[11px] text-neutral-500">
        Si el enlace expiró, vuelve a solicitar una recuperación desde “Olvidé mi contraseña”.
      </p>
    </div>
  );
}
