"use client";

import Image from "next/image";
import { motion } from "motion/react";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const Paso1 = () => {
  return (
    <section className="relative h-full w-full overflow-hidden bg-[#e9e9e9]">
  <div className="mx-auto flex h-full w-full max-w-[1400px] items-start px-5 pt-20 md:px-10 md:pt-24 lg:px-16 lg:pt-28">
    <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
      <div className="flex flex-col justify-start lg:col-span-7">
            <div className="space-y-8 md:space-y-10">
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                custom={0}
                className="max-w-[700px] text-[2rem] font-black uppercase leading-[0.95] tracking-tight text-black md:text-[3rem] lg:text-[3.7rem]"
              >
                Principales páginas de modelos 3D
              </motion.h2>

              {/* Descripción mobile */}
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                custom={0.15}
                className="max-w-[420px] text-[1.05rem] leading-[1.08] text-[#4d4d4d] sm:hidden md:text-[1.3rem]"
              >
                Busca, descarga importa y imprime. Explora miles de modelos,
                descárgalos fácilmente y conviértelos en piezas reales con
                impresión 3D.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={0.1}
                className="space-y-4 md:space-y-5"
              >
                <h3 className="text-[1.5rem] font-extrabold uppercase tracking-tight text-[#4a4a4a] md:text-[2rem]">
                  Paso 1
                </h3>

                <p className="max-w-[340px] text-[1.05rem] leading-[1.1] text-[#8a8a8a] md:text-[1.3rem]">
                  Busca el modelo que desees en estas 2 principales páginas de
                  archivos STL.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Columna derecha */}
           <div className="flex flex-col justify-start gap-8 lg:col-span-5">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              custom={0.15}
              className="hidden max-w-[420px] text-[1.05rem] leading-[1.08] text-[#4d4d4d] sm:block md:text-[1.3rem] lg:ml-auto"
            >
              Busca, descarga importa y imprime. Explora miles de modelos,
              descárgalos fácilmente y conviértelos en piezas reales con
              impresión 3D.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={0.25}
              className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2"
            >
              <a
                href="https://makerworld.com/es?from=bambulab.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex min-h-[150px] items-center justify-center rounded-[22px] bg-[#f3f3f3] px-0 py-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-md md:min-h-[170px]"
              >
                <div className="relative h-[62px] w-[280px] md:h-[114px] md:w-[390px]">
                  <Image
                    src="/makeword.png"
                    alt="MakerWorld"
                    fill
                    className="object-contain"
                  />
                </div>
              </a>

              <a
                href="https://cults3d.com/es"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex min-h-[150px] items-center justify-center rounded-[22px] bg-[#f3f3f3] px-0 py-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-md md:min-h-[170px]"
              >
                <div className="relative h-[62px] w-[280px] md:h-[114px] md:w-[390px]">
                  <Image
                    src="/culst.png"
                    alt="Cults"
                    fill
                    className="object-contain"
                  />
                </div>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Paso1;
