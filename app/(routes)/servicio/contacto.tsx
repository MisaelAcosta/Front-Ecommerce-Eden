"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const Contacto = () => {
  const [openMail, setOpenMail] = useState(false);

  const handleGmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);

    const nombre = String(data.get("Nombre") || "");
    const correo = String(data.get("Correo") || "");
    const mensaje = String(data.get("Mensaje") || "");

    const subject = encodeURIComponent(`Contacto Eden 3D - ${nombre}`);
    const body = encodeURIComponent(
      `Nombre: ${nombre}\nCorreo: ${correo}\n\nMensaje:\n${mensaje}`
    );

    // ✅ Abre Gmail con "Redactar" y todo prellenado
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=eden.estudio1@gmail.com&su=${subject}&body=${body}`,
      "_blank",
      "noopener,noreferrer"
    );

    form.reset();
    setOpenMail(false);
  };

  return (
    <section id="contacto" className="w-full pt-10 sm:px-15">
      {/* FONDO CON IMAGEN */}
      <div
        className="
          relative w-full overflow-hidden
          sm:rounded-[18px]
          px-20 sm:px-12 py-20 sm:py-30
          text-black
          bg-white
        "
      >
        {/* overlay extra por si acaso */}
        <div className="absolute inset-0 bg-white pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* TITULO */}
          <h2 className="text-center text-5xl sm:text-6xl font-black tracking-tight mb-14">
            CONTACTO.
          </h2>

          {/* LISTA */}
          <div className="sm:space-y-15 space-y-9">
            {/* WHATSAPP */}
            <a
              href="https://wa.me/56912345678?text=Hola%20Eden%203D%2C%20quiero%20cotizar%20una%20impresi%C3%B3n"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border-b border-black/20 pb-6 group"
            >
              <div className="flex items-center gap-6">
                <span className="text-black/40">(01)</span>
                <span className="text-2xl sm:text-3xl">WhatsApp</span>
              </div>
              <ArrowRight className="opacity-60 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* INSTAGRAM */}
            <a
              href="https://www.instagram.com/eden.3d_/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border-b border-black/20 pb-6 group"
            >
              <div className="flex items-center gap-6">
                <span className="text-black/40">(02)</span>
                <span className="text-2xl sm:text-3xl">Instagram</span>
              </div>
              <ArrowRight className="opacity-60 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* GMAIL */}
            <div className="border-b border-black/20 pb-6">
              <button
                type="button"
                onClick={() => setOpenMail(!openMail)}
                className="w-full flex items-center justify-between group"
              >
                <div className="flex items-center gap-6">
                  <span className="text-black/40">(03)</span>
                  <span className="text-2xl sm:text-3xl">Gmail</span>
                </div>
                <ArrowRight
                  className={`opacity-60 transition-transform ${
                    openMail ? "rotate-90" : "group-hover:translate-x-1"
                  }`}
                />
              </button>

              {/* FORMULARIO DESPLEGABLE (GMAIL COMPOSE) */}
              {openMail && (
                <form
                  onSubmit={handleGmailSubmit}
                  className="mt-8 grid gap-4 max-w-xl"
                >
                  <input
                    type="text"
                    name="Nombre"
                    placeholder="Tu nombre"
                    required
                    className="bg-black/10 border border-black/20 px-4 py-3 rounded-md text-black placeholder:text-black/50 outline-none"
                  />

                  <input
                    type="email"
                    name="Correo"
                    placeholder="Tu correo"
                    required
                    className="bg-black/10 border border-black/20 px-4 py-3 rounded-md text-black placeholder:text-black/50 outline-none"
                  />

                  <textarea
                    name="Mensaje"
                    placeholder="Escribe tu mensaje"
                    rows={4}
                    required
                    className="bg-black/10 border border-black/20 px-4 py-3 rounded-md text-black placeholder:text-black/50 outline-none resize-none"
                  />

                  <button
                    type="submit"
                    className="mt-2 w-fit px-6 py-3 rounded-md bg-black text-white font-medium cursor-pointer hover:bg-black/90  hover:text transition"
                  >
                    Abrir Gmail
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;

