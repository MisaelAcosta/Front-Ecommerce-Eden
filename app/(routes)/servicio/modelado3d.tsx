"use client";

import localFont from "next/font/local";
import { motion } from "motion/react";
import { fadeUp, revealViewport } from "./components/scrollReveal";

const VIDEO_3D = "/servicios/video3d.mp4";

const maratypeFont = localFont({
  src: "../../../components/fonts/Maratype.otf",
  display: "swap",
});

const khInterferenceLightFont = localFont({
  src: "../../../components/fonts/KHInterferenceTRIAL-Light.otf",
  weight: "300",
  style: "normal",
  display: "swap",
});

const Modelodo3D = () => {
  return (
    <section className="w-full bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-start gap-6 lg:grid-cols-[0.66fr_0.34fr] lg:gap-8">
          {/* Bloque visual de modelado 3D. */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            custom={0}
            className="w-full"
          >
            <div className="relative aspect-[31/25] w-full overflow-hidden bg-black sm:aspect-[35/22]">
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
          </motion.div>

          {/* Texto descriptivo de la sección. */}
          <div className="flex flex-col gap-4 pt-1">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              custom={0.12}
              className={`${maratypeFont.className} text-left text-[2.3rem] leading-[0.92] text-black sm:text-[3.4rem] lg:text-[4rem]`}
            >
              MODELADO 3D
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              custom={0.18}
              className={`${khInterferenceLightFont.className} 
              max-w-[300px] lg:max-w-[600px] text-left text-[0.72rem] 
              uppercase leading-[1.15] text-black/70 
              sm:text-[0.82rem] lg:text-lg`}
            >
              Ofrecemos modelado 3D personalizado para desarrollar piezas
              únicas y funcionales. Diseñamos modelos desde cero o realizamos
              ajustes sobre diseños existentes, siempre considerando su uso
              final y el proceso de impresión.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Modelodo3D;
