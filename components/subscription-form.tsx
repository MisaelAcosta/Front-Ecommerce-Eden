"use client";

import { FormEvent, useState } from "react";
import localFont from "next/font/local";
import { SendHorizontal } from "lucide-react";

const khInterferenceRegular = localFont({
  src: "./fonts/KHInterferenceTRIAL-Regular.otf",
});

const khInterferenceLight = localFont({
  src: "./fonts/KHInterferenceTRIAL-Light.otf",
});

type SubscriptionFormProps = {
  variant: "home" | "footer";
};

export function SubscriptionForm({ variant }: SubscriptionFormProps) {
  // Cada instancia mantiene su propio correo, mensaje de respuesta y estado de envio.
  // Esto permite usar el mismo componente en Inicio y Footer sin que se mezclen datos.
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFooter = variant === "footer";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // Evita que el navegador recargue la pagina al enviar el formulario.
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      // Esta ruta interna valida el correo y usa el token privado del servidor para
      // crear la Suscripcion en Strapi. El navegador nunca recibe dicho token.
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "No se pudo registrar el correo.");
      }

      // Strapi no crea duplicados: la API devuelve duplicate si el email ya existe.
      // En ambos casos mostramos una respuesta clara y limpiamos el campo.
      setMessage(
        result.duplicate
          ? "ESTE CORREO YA ESTA SUSCRITO."
          : "LISTO. TE AVISAREMOS DE LAS PROXIMAS OFERTAS."
      );
      setEmail("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message.toUpperCase()
          : "NO PUDIMOS REGISTRAR TU CORREO."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // variant define solo la apariencia. "home" usa el rectangulo blanco de la
    // seccion nueva; "footer" conserva la linea inferior sobre fondo oscuro.
    <form
      className={isFooter ? "mt-8 border-b border-white" : "w-full max-w-[390px]"}
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor={`subscription-email-${variant}`}>
        Email
      </label>
      {/*
        Contenedor del input y boton. En Inicio h-10 cambia la altura del rectangulo
        blanco; en Footer no tiene caja, usa gap y el borde del formulario padre.
      */}
      <div className={`flex items-center ${isFooter ? "gap-3" : "h-10 bg-white text-black"}`}>
        <input
          id={`subscription-email-${variant}`}
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="EMAIL"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          // En Inicio h-full/padding define el tamano del area escribible. En Footer
          // pb-3 alinea el texto con su borde inferior. El input ocupa todo el espacio
          // restante gracias a flex-1.
          className={`${khInterferenceLight.className} min-w-0 flex-1 bg-transparent text-xs uppercase outline-none ${
            isFooter
              ? "pb-3 text-white placeholder:text-white/55"
              : "h-full px-3 text-black placeholder:text-black/40"
          }`}
        />
        <button
        type="submit"
        disabled={isSubmitting}
        className={`${khInterferenceRegular.className}
          flex shrink-0 cursor-pointer items-center justify-center
          text-xs uppercase transition-opacity
          hover:opacity-80
          disabled:cursor-not-allowed disabled:opacity-45
          ${
            isFooter
              ? "pb-3 text-white"
              : "h-full w-11 border-l border-black/20 bg-[#ADFE00] text-black"
          }`}
        aria-label="Suscribirme"
      >
        {isSubmitting ? (
          "..."
        ) : isFooter ? (
          "OK"
        ) : (
          <SendHorizontal className="h-4 w-4" strokeWidth={1.5} />
        )}
      </button>
      </div>
      {/* Mensaje accesible para exito, duplicado o error de la solicitud. */}
      <p
        aria-live="polite"
        className={`${khInterferenceLight.className} min-h-5 pt-2 text-[10px] uppercase ${
          message.includes("NO PUDIMOS") || message.includes("VALIDO")
            ? "text-red-300"
            : "text-[#adff00]"
        }`}
      >
        {message}
      </p>
    </form>
  );
}
