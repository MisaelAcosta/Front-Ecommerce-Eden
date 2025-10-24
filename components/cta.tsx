"use client"

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * Local lightweight Input component to replace missing "@/components/ui/input".
 * It forwards all standard input props and preserves className for styling.
 */
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

function Input({ className = "", ...props }: InputProps) {
  return <input {...props} className={className} />;
}

export default function Cta() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [msg, setMsg] = useState<string>("");

  // Solo visual por ahora
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    // Simula validación visual
    const ok = /^\S+@\S+\.\S+$/.test(email);
    setTimeout(() => {
      if (!ok) { setState("error"); setMsg("Ingresá un correo válido."); return; }
      setState("success"); setMsg("¡Listo! Te avisaremos de ofertas y lanzamientos.");
    }, 600);
  }

  return (
    <Card className="border max-w-6xl mx-5 lg:mx-auto px-6 sm:px-8 lg:px-9 border-black rounded-2xl ">
      <CardContent className="p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          {/* Texto */}
          <div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
              Registrate y recibí <span className="whitespace-nowrap">ofertas exclusivas</span>!
            </h2>
            <p className="mt-5 text-neutral-600 dark:text-neutral-300">
              Accedé antes que nadie a descuentos y lanzamientos.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full">
            <label htmlFor="newsletter-email" className="sr-only">
              Correo electrónico
            </label>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative w-full md:w-[420px]">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
                <Input
                  id="newsletter-email"
                  type="email"
                  placeholder="Ingresá acá tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 rounded-xl"
                  aria-invalid={state === "error"}
                />
              </div>

              <Button
                type="submit"
                className="h-13 lg:w-50 rounded-xl px-5 cursor-pointer"
                disabled={state === "loading"}
              >
                {state === "loading" ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" /> Registrando…
                  </span>
                ) : (
                  "Registrar"
                )}
              </Button>
            </div>

            {/* Mensajes visuales */}
            <div className="mt-2 min-h-[1.25rem]" aria-live="polite" aria-atomic="true">
              {state === "success" && (
                <p className="text-sm text-emerald-600 inline-flex items-center gap-1">
                  <CheckCircle2 className="size-4" /> {msg}
                </p>
              )}
              {state === "error" && (
                <p className="text-sm text-red-600 inline-flex items-center gap-1">
                  <AlertCircle className="size-4" /> {msg}
                </p>
              )}
            </div>

            <p className="mt-1 text-xs text-neutral-500">
              Sin spam. Podés darte de baja cuando quieras.
            </p>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}