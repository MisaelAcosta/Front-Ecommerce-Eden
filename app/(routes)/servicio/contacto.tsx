"use client";

import { useState } from "react";
import { Mail, Instagram, MessageCircle, ArrowRight } from "lucide-react";

const Contacto = () => {
  const [openMail, setOpenMail] = useState(false);

  return (
    <section
      id="contacto"
      className="w-full border border-black/40"
    >
      {/* FONDO CON IMAGEN */}
      <div
        className="
          relative w-full overflow-hidden
          rounded-[18px]
          px-6 sm:px-12 py-14 sm:py-20
          text-white
        "
        style={{
          backgroundImage: "url('/contacto-bg.jpg')", // 👈 TU IMAGEN EXPORTADA
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay extra por si acaso */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* TITULO */}
          <h2 className="text-center text-4xl sm:text-5xl font-black tracking-tight mb-14">
            CONTACTO.
          </h2>

          {/* LISTA */}
          <div className="space-y-6">
            {/* WHATSAPP */}
            <a
              href="https://wa.me/XXXXXXXXXX" // 👈 reemplaza con tu número
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border-b border-white/20 pb-6 group"
            >
              <div className="flex items-center gap-6">
                <span className="text-white/40">(01)</span>
                <span className="text-lg sm:text-xl">WhatsApp</span>
              </div>
              <ArrowRight className="opacity-60 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* INSTAGRAM */}
            <a
              href="https://instagram.com/TU_USUARIO" // 👈 reemplaza
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border-b border-white/20 pb-6 group"
            >
              <div className="flex items-center gap-6">
                <span className="text-white/40">(02)</span>
                <span className="text-lg sm:text-xl">Instagram</span>
              </div>
              <ArrowRight className="opacity-60 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* GMAIL */}
            <div className="border-b border-white/20 pb-6">
              <button
                type="button"
                onClick={() => setOpenMail(!openMail)}
                className="w-full flex items-center justify-between group"
              >
                <div className="flex items-center gap-6">
                  <span className="text-white/40">(03)</span>
                  <span className="text-lg sm:text-xl">Gmail</span>
                </div>
                <ArrowRight
                  className={`opacity-60 transition-transform ${
                    openMail ? "rotate-90" : "group-hover:translate-x-1"
                  }`}
                />
              </button>

              {/* FORMULARIO DESPLEGABLE */}
              {openMail && (
                <form
                  action="mailto:tucorreo@gmail.com" // 👈 reemplaza
                  method="POST"
                  encType="text/plain"
                  className="mt-8 grid gap-4 max-w-xl"
                >
                  <input
                    type="text"
                    name="Nombre"
                    placeholder="Tu nombre"
                    required
                    className="bg-white/10 border border-white/20 px-4 py-3 rounded-md text-white placeholder:text-white/50 outline-none"
                  />

                  <input
                    type="email"
                    name="Correo"
                    placeholder="Tu correo"
                    required
                    className="bg-white/10 border border-white/20 px-4 py-3 rounded-md text-white placeholder:text-white/50 outline-none"
                  />

                  <textarea
                    name="Mensaje"
                    placeholder="Escribe tu mensaje"
                    rows={4}
                    required
                    className="bg-white/10 border border-white/20 px-4 py-3 rounded-md text-white placeholder:text-white/50 outline-none resize-none"
                  />

                  <button
                    type="submit"
                    className="mt-2 w-fit px-6 py-3 rounded-md bg-white text-black font-medium hover:bg-white/90 transition"
                  >
                    Enviar correo
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
