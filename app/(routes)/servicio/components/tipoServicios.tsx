"use client";
import Image from "next/image";

const TipoServicios = () => {
  return (
    <section className="px-8 sm:px-4 py-16">
      {/* Título */}
      <h2 className="text-center  text-4xl sm:text-5xl font-black mb-10">
        SERVICIOS
      </h2>

      {/* Contenedor general */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-8
        max-w-5xl
        mx-auto
    ">

        {/* --- SERVICIO 1 --- */}
        <div className="rounded-2xl overflow-hidden bg-[#f2f2f2] shadow-none flex flex-col  md:h-[540px] md:w-[470px]">
          <div className="p-7 sm:p-9">
            <h3 
            className="
            text-2xl 
            sm:text-4xl
            font-black
            mb-4
            
            ">
              SOLUCIONES PARA TU NEGOCIO
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-8">
              Desde llaveros, macetas y organizadores, hasta piezas totalmente
              personalizadas. Adaptadas a tus necesidades y a la identidad de
              tu marca.
            </p>
          </div>
          <div className="w-full h-[220px] sm:h-[260px] md:h-[280px] lg:h-[300px]">
            <Image
              src="/imagen1.png"
              alt="Soluciones para tu negocio"
              width={600}
              height={400}
              className="w-full h-full object-cover rounded-t-none rounded-b-2xl"
            />
          </div>
        </div>

        {/* --- SERVICIO 2 --- */}
        <div className="rounded-2xl overflow-hidden bg-[#f2f2f2] shadow-none md:h-[540px] md:w-[470px]">
          <div className="p-7 sm:p-9">
            <h3 className="
            text-2xl 
            sm:text-4xl
            font-black 
            mb-4">
              IMPRESIÓN 3D A PEDIDO
            </h3>
            <p className="
            text-gray-600 
            text-sm 
            sm:text-base
            mb-8">
              ¿Te gustaría tener una figura de acción o el arma icónica de tu
              personaje favorito? Con nuestra impresión 3D, lo hacemos
              realidad.
            </p>
          </div>
          <div className="w-full h-[220px] sm:h-[260px] md:h-[280px] lg:h-[300px]">
            <Image
              src="/imagen2.png"
              alt="Impresión 3D a pedido"
              width={600}
              height={400}
              className="w-full h-full object-cover rounded-t-0 rounded-b-2xl"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default TipoServicios;
