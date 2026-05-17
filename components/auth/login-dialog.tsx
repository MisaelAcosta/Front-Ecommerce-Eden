"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    if (!open) setMode("login");
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="border-0 bg-transparent p-0 shadow-none sm:max-w-none"
      >
        <div className="relative flex min-h-dvh w-screen items-center justify-center px-5 py-10">
          <div className="relative w-full max-w-[540px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.985 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                {mode === "login" ? (
                  <LoginForm
                    onSwitchToRegister={() => setMode("register")}
                    onSwitchToForgot={() => setMode("forgot")}
                  />
                ) : mode === "register" ? (
                  <RegisterForm onSwitchToLogin={() => setMode("login")} />
                ) : (
                  <RecoverForm onSwitchToLogin={() => setMode("login")} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
