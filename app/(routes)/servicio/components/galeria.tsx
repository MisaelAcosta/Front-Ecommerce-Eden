"use client";

import Image from "next/image";
import localFont from "next/font/local";

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
    title: "ORGANIZADOR\nMODULAR",
    src: "/arma.png",
    alt: "Organizador modular naranja",
  },
  {
    title: "ORGANIZADOR\nMODULAR",
    src: "/dispensador.png",
    alt: "Organizador modular para café",
  },
  {
    title: "ORGANIZADOR\nMODULAR",
    src: "/soporte.png",
    alt: "Organizador modular impreso en 3D",
  },
  {
    title: "ORGANIZADOR\nMODULAR",
    src: "/arma.png",
    alt: "Organizador modular en exhibición",
  },
];

const Galeria = () => {
  return (
    <section id="galeria" className="w-full bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-start gap-8 lg:grid-cols-[150px_minmax(0,1fr)] lg:gap-10">
          <div className="lg:sticky lg:top-24">
            <h2
              className={`${maratypeFont.className} text-left text-[2.8rem] leading-[0.88] text-black sm:text-[4.5rem] lg:text-[4.8rem]`}
            >
              GALERIA
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
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
                    className={`${khInterferenceRegularFont.className} whitespace-pre-line text-right text-[0.82rem] leading-[0.9] tracking-[0.02em] text-white sm:text-[0.92rem]`}
                  >
                    {item.title}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Galeria;
