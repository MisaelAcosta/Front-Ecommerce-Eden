"use client";

import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

export const stepItem = [
  {
    title: "COMPRA",
    description:
      "Agrega al carrito, ingresa tus datos y paga en segundos. Proceso rápido y protegido.",
    iconSrc: "/icons/compra.png",
    iconSize: 64,
  },
  {
    title: "TE AVISAMOS",
    description: "Despachamos tu pedido y te enviamos el número de seguimiento.",
    iconSrc: "/icons/paloma.png",
    iconSize: 84,
  },
  {
    title: "DISFRUTA",
    description: "Recibe tu producto sin complicaciones. Garantía total.",
    iconSrc: "/icons/recibir.png",
    iconSize: 64,
  },
];

const Step = () => {
  return (
    <section className="w-full bg-white py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-0">
        {/* ✅ MOBILE: CAROUSEL */}
        <div className="sm:hidden">
          <Carousel
            className="w-full"
            plugins={[ 
              Autoplay({
                delay: 3000,
              }),
            ]}
          >
            <CarouselContent>
              {stepItem.map((s) => (
                <CarouselItem key={s.title} className="px-2">
                  <div className="text-center flex flex-col items-center">
                    <img
                      src={s.iconSrc}
                      alt={s.title}
                      style={{ width: s.iconSize, height: s.iconSize }}
                      className="object-contain"
                      loading="lazy"
                    />

                    <h4 className="mt-5 text-black font-extrabold text-2xl tracking-tight">
                      {s.title}
                    </h4>

                    <p className="mt-4 max-w-[260px] text-black/70 text-sm leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* ✅ DESKTOP: GRID */}
        <div className="hidden sm:grid grid-cols-3 gap-10 sm:gap-8 items-start">
          {stepItem.map((s, idx) => (
            <div key={s.title} className="relative text-center">
              <div className="flex flex-col items-center">
                <img
                  src={s.iconSrc}
                  alt={s.title}
                  style={{ width: s.iconSize, height: s.iconSize }}
                  className="object-contain"
                  loading="lazy"
                />

                <h4 className="mt-5 text-black font-extrabold text-2xl tracking-tight">
                  {s.title}
                </h4>

                <p className="mt-4 max-w-[260px] text-black/70 text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>

              {/* Línea entre pasos (solo desktop) */}
              {idx !== stepItem.length - 1 && (
                <div
                  className="
                    hidden sm:block
                    absolute top-[30px] -right-4
                    w-8 text-black/60
                    text-3xl font-light
                  "
                  aria-hidden="true"
                >
                  —
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Step;
