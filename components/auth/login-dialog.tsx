// components/auth/login-dialog.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { RecoverForm } from "./recover-form";

interface LoginDialogProps {
  children: React.ReactNode;
}

export function LoginDialog({ children }: LoginDialogProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");

  const handleOpenChange = (open: boolean) => {
    // Cuando se cierra el modal, volvemos al login por defecto
    if (!open) setMode("login");
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="border-0 bg-transparent p-0 max-w-none shadow-none sm:max-w-md">
        <div className="flex h-screen w-screen items-center justify-center  p-4 sm:h-auto sm:w-full ">
          {mode === "login" ? (
            <LoginForm onSwitchToRegister={() => setMode("register")} onSwitchToForgot={() => setMode("forgot")} />
          ) : mode === "register" ? (
            <RegisterForm onSwitchToLogin={() => setMode("login")} />
          ) : (
            <RecoverForm onSwitchToLogin={() => setMode("login")} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

