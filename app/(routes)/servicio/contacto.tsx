"use client";

import { Mail, Instagram, MessageCircle, ArrowRight } from "lucide-react";

const Contacto = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12">
      {/* Título */}
      <h2 className="text-3xl md:text-4xl text-center font-black tracking-tight text-center mb-10">
        CONTACTANOS
      </h2>

      {/* Grid principal */}
      <div className="grid gap-8 md:grid-cols-2 items-start">
        {/* LADO IZQUIERDO: preview (gif / video / imagen) */}
        <div className="w-full rounded-xl overflow-hidden  bg-neutral-100 aspect-[4/4] flex items-center justify-center">
          {/* ACA METES TU VIDEO/GIF */}
          {/* Ejemplo con imagen temporal: */}
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            {/* reemplaza este src cuando tengas tu clip */}
            <source src="/contact-preview.mp4" type="video/mp4" />
          </video>
        </div>

        {/* LADO DERECHO: links de contacto */}
        <div className="flex flex-col gap-4">
          {/* Correo */}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=acostamisael166@gmail.com&su=Consulta%20desde%20la%20tienda%20Eden%203D&body=Hola%20Eden%203D,%20quería%20hacer%20una%20consulta%20sobre..."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full rounded-xl bg-neutral-100 px-4 py-5 hover:bg-neutral-200 transition-colors "
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border  bg-black">
                <Mail
                strokeWidth={2} 
                className="h-5 w-5 text-white" />
              </span>
              <div className="flex flex-col">
                <span className="font-semibold text-lg leading-none">
                  Correo
                </span>
                <span className="text-sm text-neutral-600 leading-none">
                  Edenbusiness@gmail.com
                </span>
              </div>
            </div>

            <ArrowRight className="h-5 w-5 shrink-0" />
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/eden.3d_"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full rounded-xl  bg-neutral-100 px-4 py-5 hover:bg-neutral-200 transition-colors "
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center bg-black rounded-lg border bg-black">
                <Instagram
                strokeWidth={2} 
                className="h-5 w-5 text-white" />
              </span>
              <div className="flex flex-col text-black">
                <span className="font-semibold text-lg leading-none">
                  Instagram
                </span>
                <span className="text-sm text-neutral-600 leading-none">
                  @eden.3d_
                </span>
              </div>
            </div>

            <ArrowRight className="h-5 w-5 shrink-0" />
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/56912345678?text=Hola%20vengo%20de%20la%20tienda%20👋"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full rounded-xl   bg-neutral-100 px-4 py-5 hover:bg-neutral-200 transition-colors "
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border  bg-black">
                <MessageCircle 
                strokeWidth={2}
                className="h-5 w-5 text-white" />
              </span>
              <div className="flex flex-col">
                <span className="font-semibold text-lg leading-none">
                  WhatsApp
                </span>
                <span className="text-sm text-neutral-600 leading-none">
                  +56 9 1234 5678
                </span>
              </div>
            </div>

            <ArrowRight className="h-5 w-5 shrink-0" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
