"use client";

const ModoTrabajo = () => {
  return (
    <section className="p-4">
      {/* Wrapper fondo negro */}
      <div
        className="
          w-full
          sm:max-w-7xl  /* ajusta este valor: 4xl, 5xl, 6xl, etc */
          mx-auto     /* centra horizontalmente */
          rounded-xl
          border border-white/80
          bg-black
          text-white
          overflow-hidden
          px-6 
          py-10 sm:py-19 
          flex flex-col gap-8
          sm:flex-row sm:justify-between sm:items-start
          sm:min-h-[320px]

        "
      >
        {/* Columna izquierda: titulo grande */}
        <div className="sm:w-1/3">
          <h2 className="text-white sm:ml-30 font-black leading-tight uppercase">
            <span className="block text-3xl sm:text-5xl">
              ¿COMO
            </span>
            <span className="text-3xl sm:text-5xl">
              TRABAJAMOS?
            </span>
          </h2>
          <p className="
          md:ml-30
          py-4
          text-sm
          font-regular
          text-[#b4b4b4]
          text-left
          md:text-lg
          ">
            En Eden 3D transformamos tus ideas en piezas reales.
            <br/>
            Te acompañamos en cada paso desde la charla inicial
            hasta la impresión final 
            <br/>
            para que el resultado sea justo como lo imaginaste.</p>
        </div>
        

        {/* Columna derecha: pasos */}
        <div className="sm:w-2/3 flex flex-col  
        gap-8 sm:gap-10 
        text-left md:ml-50 justify-between">
          {/* Paso 1 */}
          <div>
            <h3 className="font-extrabold uppercase text-2xl  md:text-4xl tracking-tight flex items-start gap-2">
              <span>01|</span>
              <span>ASESORIA</span>
            </h3>
            <p className="text-[#b4b4b4] font-regular
            text-sm md:text-lg
            leading-snug mt-1 max-w-[38ch]">
              Charlamos contigo para entender tus ideas, necesidades y el
              propósito de tu impresión.
            </p>
          </div>

          {/* Paso 2 */}
          <div>
            <h3 className="font-extrabold uppercase text-2xl md:text-4xl tracking-tight flex items-start gap-2">
              <span>02|</span>
              <span>EXPLORACION</span>
            </h3>
            <p className="text-[#b4b4b4] font-regular
            text-sm md:text-lg 
            mt-1 max-w-[55ch]">
              Buscamos o desarrollamos el modelo 3D ideal: ya sea encontrando un
              STL o diseñando uno desde cero.
            </p>
          </div>

          {/* Paso 3 */}
          <div>
            <h3 className="font-extrabold uppercase text-2xl md:text-4xl tracking-tight flex items-start gap-2">
              <span>03|</span>
              <span>SOLUCION</span>
            </h3>
            <p className="text-[#b4b4b4] font-regular 
            text-sm md:text-lg
            mt-1 max-w-[55ch]">
              Adaptamos y optimizamos el modelo para cumplir tus
              requerimientos, materiales y dimensiones.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModoTrabajo;
