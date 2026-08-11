"use client";

import Image from "next/image";
import Typewriter from "@/components/fancy/text/typewriter";
import {
  cotizaTextBoldFont,
  cotizaTextLightFont,
  cotizaTextRegularFont,
} from "./cotiza-fonts";

const HERO_TITLE_OPTIONS = [
  "IMPRIMIMOS\nHOY?",
  "IMPRIMIMOS\nHOY?",
];

const HeaderCotiza = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#050505]
     text-white">
      <div className="absolute inset-0 z-0 bg-[#050505]" />
      <div
        className="absolute inset-0 z-0 opacity-200"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)
          `,
          backgroundPosition: "center -10px",
          backgroundSize: "220px 220px",
        }}
      />
      <div
        className="absolute inset-0 z-0 opacity-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 0 0, transparent 0 18px, rgba(0,0,0,0.36) 19px 100%)",
          backgroundPosition: "center -10px",
          backgroundSize: "220px 220px",
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, rgba(255,255,255,0.04), transparent 34%),
            linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(0,0,0,0.72))
          `,
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[700px] w-full 
      max-w-[1680px] flex-col justify-between px-6 pb-12 pt-28 sm:px-10 
      lg:min-h-[980px] lg:px-28 lg:pb-24 lg:pt-40">
        <p
          className={`${cotizaTextLightFont.className} text-sm uppercase 
          tracking-[0.08em] text-white/85 sm:text-xl`}
        >
          IMPRIME EN SOLO 4 PASOS
        </p>

        <div className="absolute left-1/2 top-[52%] z-10 aspect-[0.8] w-[70vw]
         max-w-[430px] -translate-x-1/2 -translate-y-1/2 sm:w-[48vw] 
         lg:max-w-[540px]">
          
          <div className="absolute inset-0 bg-black/22 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/18" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 
        top-[52%] z-20 -translate-y-1/2 px-4 text-center">
          <h1
            className={`${cotizaTextRegularFont.className} mx-auto max-w-[800px] 
            text-[clamp(3.2rem,6vw,6.5rem)] uppercase leading-[0.86] 
            tracking-[0] text-[#ADFE00]`}
          >
            <span>{"¿QUE "}</span>
            <Typewriter
              text={HERO_TITLE_OPTIONS}
              speed={230}
              waitTime={2500}
              deleteSpeed={120}
              cursorChar="_"
              cursorClassName="ml-2 align-baseline"
              className="text-[#ADFE00] "
            />
          </h1>
        </div>

        <p
          className={`${cotizaTextLightFont.className} max-w-[360px] 
          text-sm uppercase leading-relaxed tracking-[0.06em] 
          text-white/85 sm:text-xl lg:mt-auto`}
        >
          IMPRIME TUS MODELOS 3D DE FORMA RAPIDA, PERSONALIZADA Y CON
          COTIZACION INSTANTANEA EN POCOS PASOS.
        </p>
      </div>
    </section>
  );
};

export default HeaderCotiza;
