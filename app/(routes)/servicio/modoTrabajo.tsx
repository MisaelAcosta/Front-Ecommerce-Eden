"use client";

import Image from "next/image";

const ModoTrabajo = () => {
  return (
    <section
      id="como-trabajamos"
      className="w-full bg-[#ffffff] "
    >
      {/* BANNER */}
      <div className="relative  w-full 
       boverflow-hidden h-[40vh] sm:h-[50vh] 2xl:h-[60vh]"> 
        

        {/* Overlay opcional para que el texto se lea mejor */}
        <div className="bg-white" />

        {/* Texto centrado */}
        <div className="absolute inset-0 flex flex-col  items-center justify-center">
          <h2 className="text-black font-black tracking-tight text-3xl sm:text-5xl ">
            COMO TRABAJAMOS?
          </h2>
          <p className="text-black/90 px-20 text-center 
           pt-2 sm:pt-3 text-sm font-light sm:text-xl tracking-wide">
          <span className="font-bold">
            Te acompañamos paso a paso
          </span>
          , desde la asesoría inicial hasta la entrega,
          <br />
          cuidando cada detalle del resultado final.
        </p>

        </div>
      </div>

      {/* PASO A PASO (3 tarjetas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 sm:px-20">
       {/* 01 */}
          <div className="relative min-h-[28vh] sm:min-h-[20vh]  bg-black/15
            py-10 overflow-hidden ">

            {/* -------- NUMERO -------- */}
            <div className="absolute inset-0 flex items-center justify-center
              text-[120px] sm:text-[180px] font-black
              sm:ml-35 sm:mb-15 sm:
              ml-60 mb-20
              text-white z-0 pointer-events-none">
              01
            </div>

            {/* -------- CONTENIDO ENCIMA -------- */}
            <div className="relative z-10 ml-10 sm:ml-17">

              <h3 className="mt-10 
              sm:mt-20 sm:text-xl
              text-xl font-black">
                ASESORIA
              </h3>

              <p className="mt-4 text-sm sm:text-base text-black
                max-w-[340px] leading-relaxed">
                Nos contactamos, definimos requerimientos, buscamos modelos existentes
                o realizamos modelado 3D, y acordamos materiales y tipo de acabado.
              </p>

            </div>
          </div>


        {/* 02 */}
        <div className="relative min-h-[28vh] sm:min-h-[30vh] bg-black
        border-hidden md:border-b-0 md:border-r border-black/40 px-6 sm:px-10 py-10">
          <div className="absolute inset-0 flex items-center justify-center
              text-[120px] sm:text-[180px] font-black
              sm:ml-35 sm:mb-15 sm:
              ml-60 mb-20
              text-white/30 z-0 pointer-events-none">
            02
          </div>

          

           {/* -------- CONTENIDO ENCIMA -------- */}
            <div className="relative z-10 ml-6 sm:ml-6">

              <h3 className="mt-10 
              text-white
              sm:mt-20 sm:text-xl
              text-xl font-black">
                PRODUCCION
              </h3>

              <p className="mt-4 
                text-sm sm:text-base text-white
                max-w-[340px] leading-relaxed">
                Iniciamos el proceso de impresión. Durante el trabajo entregamos
                avances para que veas el progreso y validemos que todo vaya según lo
                esperado.
              </p>

            </div>
        </div>

        {/* 03 */}
        <div className="relative min-h-[28vh] sm:min-h-[30vh] bg-black/5
        px-6 sm:px-10 py-10 ">
          <div className="absolute inset-0 flex items-center justify-center
              text-[120px] sm:text-[180px] font-black
              sm:ml-35 sm:mb-15 sm:
              ml-60 mb-20
              text-red-600 z-0 pointer-events-none ">
            03
          </div>

         {/* -------- CONTENIDO ENCIMA -------- */}
            <div className="relative z-10 ml-6 sm:ml-6">

              <h3 className="mt-10 
              text-black
              sm:mt-20 sm:text-xl
              text-xl font-black">
                ENTREGA
              </h3>

              <p className="mt-4 
                text-sm sm:text-base text-black
                max-w-[340px] leading-relaxed">
                Realizamos los ajustes finales y el postprocesado si corresponde. Una
                vez listo, coordinamos la entrega de tu pedido.

              </p>

            </div>  
        </div>
      </div>
    </section>
  );
};

export default ModoTrabajo;
