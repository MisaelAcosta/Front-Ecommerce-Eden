"use client";

import { useActionState, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { registerUserAction } from "@/components/data/actions/auth-actions";
import { type RegisterState } from "@/components/data/actions/auth-state";
import {
  AuthCard,
  authInputClassName,
  authLinkClassName,
  authPrimaryButtonClassName,
} from "./auth-card";

type RegisterFormProps = {
  onSwitchToLogin: () => void;
};

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [state, formAction, isPending] = useActionState<
    RegisterState,
    FormData
  >(registerUserAction, { message: "", ok: false });

  const safeState: RegisterState = state ?? { message: "", ok: false };

  useEffect(() => {
    if (safeState.ok) {
      const t = setTimeout(() => {
        onSwitchToLogin();
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [safeState.ok, onSwitchToLogin]);

  return (
    <AuthCard title="REGISTRATE">
      <form action={formAction}>
        <div className="space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="CORREO"
            className={authInputClassName}
          />

          <PasswordInput
            id="password"
            name="password"
            placeholder="CONTRASEÑA"
            visible={showPassword}
            onToggle={() => setShowPassword((value) => !value)}
          />

          <PasswordInput
            id="confirm_password"
            name="confirm_password"
            placeholder="CONFIRMA CONTRASEÑA"
            visible={showConfirm}
            onToggle={() => setShowConfirm((value) => !value)}
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
          className={`mt-4 w-full ${authPrimaryButtonClassName}`}
          disabled={isPending}
        >
          {isPending ? "REGISTRANDO..." : "CONTINUAR"}
        </Button>
      </form>

      <p className="mt-5 max-w-[300px] text-[12px] uppercase leading-snug text-white/70">
        CREA TU CUENTA PARA COMPRAR MAS RAPIDO, VER TUS PEDIDOS Y GUARDAR TUS
        DATOS DE ENVIO.
      </p>

      <button
        type="button"
        className={`mt-4 ${authLinkClassName}`}
        onClick={onSwitchToLogin}
      >
        YA TENGO CUENTA
      </button>
    </AuthCard>
  );
}

type PasswordInputProps = {
  id: string;
  name: string;
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
};

function PasswordInput({
  id,
  name,
  placeholder,
  visible,
  onToggle,
}: PasswordInputProps) {
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        className={`${authInputClassName} pr-12`}
      />
      <button
        type="button"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white"
        onClick={onToggle}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        <span className="sr-only">
          {visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        </span>
      </button>
    </div>
  );
}
