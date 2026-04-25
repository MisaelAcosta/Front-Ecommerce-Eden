"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { motion } from "motion/react";
import { fadeUp, revealViewport } from "./scrollReveal";

const maratypeFont = localFont({
  src: "../../../../components/fonts/Maratype.otf",
  display: "swap",
});

const khInterferenceRegularFont = localFont({
  src: "../../../../components/fonts/KHInterferenceTRIAL-Regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
});

const items = [
  {
    title: "Kaws\n",
    src: "/servicios/img1.jpg",
    alt: "",
  },
  {
    title: "ORGANIZADOR\nMODULAR",
    src: "/servicios/img2.png",
    alt: "Organizador modular para café",
  },
  {
    title: "ROCKY\n",
    src: "/servicios/img3.png",
    alt: "Organizador modular impreso en 3D",
  },
  {
    title: "BOTELLA\nMINECRAFT",
    src: "/servicios/img4.jpg",
    alt: "Organizador modular en exhibición",
  },
];

const Galeria = () => {
  return (
    <section id="galeria" className="w-full bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1350px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10">
          <div>
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              custom={0}
              className={`${maratypeFont.className} text-left 
              text-[4rem] leading-[0.88]
               text-black sm:text-[4.5rem] 
               lg:text-8xl`}
            >
              GALERIA
            </motion.h2>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            custom={0.12}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
          >
            {items.map((item, index) => (
              <article
                key={`${item.src}-${index}`}
                className="group relative aspect-square overflow-hidden bg-neutral-200"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                <div className="absolute right-3 bottom-3 z-10">
                  <p
                    className={`${khInterferenceRegularFont.className} 
                    whitespace-pre-line text-right text-[0.82rem] 
                    leading-[0.9] tracking-[0.02em] text-white 
                    sm:text-[1.45rem]`}
                  >
                    {item.title}
                  </p>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Galeria;
