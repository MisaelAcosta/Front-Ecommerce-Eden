"use client";

import { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUserAction } from "@/components/data/actions/auth-actions";
import {
  initialLoginState,
  type LoginState,
} from "@/components/data/actions/auth-state";
import {
  AuthCard,
  authInputClassName,
  authLinkClassName,
  authPrimaryButtonClassName,
} from "./auth-card";

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

  useEffect(() => {
    if (safeState.ok) {
      const t = setTimeout(() => {
        window.localStorage.setItem("eden-auth-event", "login");
        window.location.reload();
      }, 800);
      return () => clearTimeout(t);
    }
  }, [safeState.ok]);

  return (
    <AuthCard title="BIENVENIDO">
      <form action={formAction}>
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="CORREO"
            className={authInputClassName}
            id="identifier"
            name="identifier"
          />
          <Input
            type="password"
            placeholder="CONTRASEÑA"
            className={authInputClassName}
            id="password"
            name="password"
          />
        </div>

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
          className={`mt-4 w-full cursor-pointer ${authPrimaryButtonClassName}`}
          disabled={isPending}
        >
          {isPending ? "INICIANDO..." : "INICIAR"}
        </Button>
      </form>

      <div className="mt-12 flex items-center justify-between gap-4">
        <button
          type="button"
          className={authLinkClassName}
          onClick={onSwitchToRegister}
        >
          REGISTRARSE
        </button>

        <button
          type="button"
          className={authLinkClassName}
          onClick={onSwitchToForgot}
        >
          OLVIDE MI CONTRASEÑA :(
        </button>
      </div>
    </AuthCard>
  );
}
