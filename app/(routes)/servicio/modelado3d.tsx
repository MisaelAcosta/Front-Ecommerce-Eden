"use client";

const VIDEO_3D = "/video3d.mp4";

const Modelodo3D = () => {
  return (
    <section className="w-full bg-white border-t border-black/30">
      {/* -------- CONTENEDOR PRINCIPAL -------- */}
      <div className="  pt-28 sm:pt-40  sm:px-0 py-12 ">
        {/* -------- GRID: VIDEO IZQUIERDA / TEXTO DERECHA -------- */}
        <div className="grid grid-cols-1 md:grid-cols-2  items-center">
          
          {/* -------- VIDEO (CUADRO NEGRO) -------- */}
          <div className="w-full">
            <div className="relative w-full  aspect-31/25 
             sm:aspect-35/22  
             sm:ml-15
             bg-black overflow-hidden">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={VIDEO_3D}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
          </div>

          {/* -------- TEXTO DESCRIPTIVO -------- */}
          <div className="max-w-520px ">
            <p className="text-black/80 
            mt-15
            px-5 
            sm:px-20 sm:ml-20 sm:text-xl sm:mt-30 
            text-sm 
            font-light
            leading-relaxed
            sm:leading-[1.3]">
              <span className="font-bold mr-1">
              Ofrecemos modelado 3D
            </span>
              personalizado para desarrollar piezas únicas y funcionales.
              Diseñamos modelos desde cero o realizamos ajustes sobre diseños existentes,
              siempre considerando su uso final y proceso de impresión.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Modelodo3D;