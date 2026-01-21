"use client";

import Image from "next/image";

const HeaderCotiza = () => {
  return (
    <section className="relative w-full">
      {/* Header wrapper */}
      <div className="relative w-full h-[280px] 
      sm:h-[460px] lg:h-[520px] xl:h-[820px]">
        {/* Fondo (rayas) */}
        <Image
          src="/bgcotiza.png"
          alt="Fondo Cotiza"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Capa de contenido */}
        <div className="inset-0 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* COTIZA (DETRÁS de la máquina) */}
          <h1
            className="
              absolute left-0 top-8 
              sm:top-22
              sm:pl-20
              z-10
              font-black leading-none tracking-tight
              text-red-600
              text-[44px] sm:text-[156px] 
            "
          >
            COTIZA
          </h1>

          {/* MÁQUINA (ENCIMA de COTIZA) */}
          <div
            className="
              absolute left-1/2 
              -translate-x-1/2
              z-20
              w-[260px] sm:w-[680px] 
              h-[340px] sm:h-[980px] 
            "
          >
            <Image
              src="/bambu.png" // ← ruta
              alt="Impresora 3D"
              fill
              priority
              className="object-contain"
            />
          </div>

          {/* EN / SEGUNDOS (ENCIMA de todo) */}
          <div className="absolute bottom-5 
          right-0 
          text-left z-30 
          ">
            <div
              className="
                font-black leading-none tracking-tight
                text-red-600
                text-[28px] sm:text-[156px] 
              "
            >
              EN
            </div>
            <div
              className="
                sm:pl-0 -mt-1 sm:-mt-6
                sm:pr-15
                font-black leading-none tracking-tight
                text-red-600
                text-[44px] sm:text-[156px] 
              "
            >
              SEGUNDOS
            </div>
          </div>

          {/* Texto descriptivo */}
          <p
            className="
              absolute bottom-10 left-0
              z-30
              max-w-[240px] sm:max-w-[400px]
              text-[10px] sm:text-sm
              leading-snug
              text-black/60
              sm:pl-15
            "
          >
            Cotiza tu impresión 3D al instante. Obtén un precio estimado según tu
            modelo, material y nivel de calidad.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeaderCotiza;

