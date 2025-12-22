"use client";

import Image from "next/image";

const ModoTrabajo = () => {
  return (
    <section
      id="como-trabajamos"
      className="w-full bg-[#F1F1F1] border border-black/40"
    >
      {/* BANNER */}
      <div className="relative w-full border-b border-black/40 overflow-hidden h-[240px] sm:h-[320px] md:h-[380px]">
        <Image
          src="/banner-como-trabajamos.jpg" // 👈 pon tu imagen en /public y cambia el nombre si quieres
          alt="Banner como trabajamos"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay opcional para que el texto se lea mejor */}
        <div className="absolute inset-0 bg-black/15" />

        {/* Texto centrado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-white font-black tracking-tight text-5xl sm:text-6xl md:text-7xl">
            EDEN
          </h2>
        </div>
      </div>

      {/* PASO A PASO (3 tarjetas) */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* 01 */}
        <div className="relative min-h-[260px] sm:min-h-[320px] bg-[#F1F1F1] border-b md:border-b-0 md:border-r border-black/40 px-6 sm:px-10 py-10">
          <div className="absolute top-6 right-6 text-black font-semibold">
            01
          </div>

          <h3 className="mt-24 text-lg sm:text-xl font-semibold tracking-wide">
            ASESORIA
          </h3>

          <p className="mt-4 text-sm sm:text-base text-black/60 max-w-[340px] leading-relaxed">
            Nos contactamos definimos requerimientos, buscamos modelos existentes o
            realizamos modelado 3D, y acordamos materiales y tipo de acabado.
          </p>
        </div>

        {/* 02 */}
        <div className="relative min-h-[260px] sm:min-h-[320px] bg-[#F1F1F1] border-b md:border-b-0 md:border-r border-black/40 px-6 sm:px-10 py-10">
          <div className="absolute top-6 right-6 text-black font-semibold">
            02
          </div>

          <h3 className="mt-24 text-lg sm:text-xl font-semibold tracking-wide">
            PRODUCCION
          </h3>

          <p className="mt-4 text-sm sm:text-base text-black/60 max-w-[380px] leading-relaxed">
            Iniciamos el proceso de impresión. Durante el trabajo entregamos
            avances para que veas el progreso y validemos que todo vaya según lo
            esperado.
          </p>
        </div>

        {/* 03 */}
        <div className="relative min-h-[260px] sm:min-h-[320px] bg-[#F1F1F1] px-6 sm:px-10 py-10">
          <div className="absolute top-6 right-6 text-black font-semibold">
            03
          </div>

          <h3 className="mt-24 text-lg sm:text-xl font-semibold tracking-wide">
            ENTREGA
          </h3>

          <p className="mt-4 text-sm sm:text-base text-black/60 max-w-[380px] leading-relaxed">
            Realizamos los ajustes finales y el postprocesado si corresponde. Una
            vez listo, coordinamos la entrega de tu pedido.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ModoTrabajo;
