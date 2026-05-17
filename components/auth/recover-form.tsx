"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  forgotPasswordAction,
  type ForgotState,
} from "@/components/data/actions/password-actions";
import {
  AuthCard,
  authInputClassName,
  authLinkClassName,
  authPrimaryButtonClassName,
} from "./auth-card";

type RecoverFormProps = {
  onSwitchToLogin: () => void;
};

const initialForgotState: ForgotState = {
  ok: false,
  message: null,
};

export function RecoverForm({ onSwitchToLogin }: RecoverFormProps) {
  const [state, formAction, isPending] = useActionState<ForgotState, FormData>(
    forgotPasswordAction,
    initialForgotState
  );

  const safeState = state ?? initialForgotState;

  return (
    <AuthCard compact>
      <div className="mt-4 sm:mt-8">
        <p className="mb-5 max-w-[330px] text-[16px] uppercase leading-tight text-white/80">
          INGRESA TU CORREO PARA RECUPERAR TU CONTRASEÑA
        </p>

        <form action={formAction}>
          <Input
            name="email"
            type="email"
            placeholder="CORREO"
            className={authInputClassName}
          />

          {safeState.message && (
            <p
              className={`mt-4 text-center text-[12px] uppercase ${
                safeState.ok ? "text-emerald-300" : "text-red-300"
              }`}
            >
              {safeState.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className={`mt-4 w-full ${authPrimaryButtonClassName}`}
          >
            {isPending ? "ENVIANDO..." : "CONTINUAR"}
          </Button>
        </form>
      </div>

      <p className="mt-16 max-w-[360px] text-[16px] uppercase leading-tight text-white/80">
        TE ENVIAREMOS UN CODIGO DE RECUPERACION CON EL QUE PODRAS ACTUALIZAR TU
        CONTRASEÑA
      </p>

      <button
        type="button"
        className={`mt-5 ${authLinkClassName}`}
        onClick={onSwitchToLogin}
      >
        VOLVER A INICIAR SESION
      </button>
    </AuthCard>
  );
}
