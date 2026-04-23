"use client";

import localFont from "next/font/local";

const maratypeFont = localFont({
  src: "../../../../components/fonts/Maratype.otf",
  display: "swap",
});

const khInterferenceLightFont = localFont({
  src: "../../../../components/fonts/KHInterferenceTRIAL-Light.otf",
  weight: "300",
  style: "normal",
  display: "swap",
});

const khInterferenceRegularFont = localFont({
  src: "../../../../components/fonts/KHInterferenceTRIAL-Regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
});

const pasos = [
  {
    numero: "01",
    titulo: "ASESORÍA",
    descripcion:
      "Nos contactamos, definimos requerimientos, buscamos modelos existentes o realizamos modelado 3D, y acordamos materiales y tipo de acabado.",
  },
  {
    numero: "02",
    titulo: "PRODUCCIÓN",
    descripcion:
      "Iniciamos el proceso de impresión. Durante el trabajo entregamos avances para que veas el progreso y validar que todo vaya según lo esperado.",
  },
  {
    numero: "03",
    titulo: "ENTREGA",
    descripcion:
      "Realizamos los ajustes finales y el postprocesado si corresponde. Una vez listo, coordinamos la entrega de tu pedido.",
  },
];

const ModoTrabajo = () => {
  return (
    <section className="w-full bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
          <h2
            className={`${maratypeFont.className} max-w-[360px] text-left text-[2.8rem] leading-[0.88] text-black sm:text-[4.5rem] lg:text-[5.5rem]`}
          >
            CÓMO
            <br />
            TRABAJAMOS?
          </h2>

          <p
            className={`${khInterferenceLightFont.className} max-w-[280px] pt-1 text-left text-[0.72rem] uppercase leading-[1.15] text-black/70 sm:text-[0.82rem] lg:pt-5`}
          >
            Te acompañamos paso a paso, desde la asesoría inicial hasta la
            entrega, cuidando cada detalle del resultado final.
          </p>
        </div>

        <div className="mt-8 bg-[#ececec] px-5 py-6 sm:mt-10 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          {pasos.map((paso, index) => (
            <div key={paso.numero}>
              <article className="grid gap-4 py-6 sm:gap-6 sm:py-8 lg:grid-cols-[160px_minmax(0,1fr)] lg:items-start lg:gap-10 lg:py-10">
                <div className="flex justify-start lg:justify-center">
                  <span
                    className={`${maratypeFont.className} text-[4.8rem] leading-none tracking-[-0.02em] text-white sm:text-[6.4rem] lg:text-[7.7rem]`}
                  >
                    {paso.numero}
                  </span>
                </div>

                <div className="max-w-[410px] pt-1">
                  <h3
                    className={`${khInterferenceRegularFont.className} text-[1.05rem] uppercase leading-none tracking-[0.02em] text-black sm:text-[1.18rem]`}
                  >
                    {paso.titulo}
                  </h3>

                  <p
                    className={`${khInterferenceLightFont.className} mt-3 text-[0.72rem] uppercase leading-[1.15] text-black/70 sm:text-[0.8rem]`}
                  >
                    {paso.descripcion}
                  </p>
                </div>
              </article>

              {index < pasos.length - 1 && (
                <div className="h-px w-full bg-black/20" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModoTrabajo;
