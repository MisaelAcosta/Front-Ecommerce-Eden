"use client";

import Image from "next/image";
import { cotizaTitleFont } from "./cotiza-fonts";

const heroImages = [
  {
    src: "/utils/img2.png",
    alt: "Referencia de impresión 3D uno",
    className:
      "left-4 top-6 h-28 w-20 sm:left-10 sm:top-8 sm:h-40 sm:w-28 lg:left-12 lg:top-10 lg:h-56 lg:w-40",
  },
  {
    src: "/utils/img1.png",
    alt: "Referencia de impresión 3D dos",
    className:
      "left-[38%] top-0 h-36 w-24 -translate-x-1/2 sm:h-48 sm:w-32 lg:h-64 lg:w-44",
  },
  {
    src: "/utils/img3.png",
    alt: "Referencia de impresión 3D tres",
    className:
      "right-2 top-5 h-24 w-24 sm:right-8 sm:top-8 sm:h-36 sm:w-36 lg:right-10 lg:top-10 lg:h-52 lg:w-52",
  },
  {
    src: "/utils/img4.png",
    alt: "Referencia de impresión 3D cuatro",
    className:
      "left-10 bottom-4 h-28 w-20 sm:left-20 sm:bottom-8 sm:h-40 sm:w-28 lg:left-16 lg:bottom-10 lg:h-52 lg:w-38",
  },
  {
    src: "/utils/img5.jpg",
    alt: "Referencia de impresión 3D cinco",
    className:
      "right-2 bottom-4 h-20 w-28 sm:right-10 sm:bottom-8 sm:h-28 sm:w-40 lg:right-16 lg:bottom-12 lg:h-36 lg:w-52",
  },
];

const HeaderCotiza = () => {
  return (
    <section className="relative overflow-hidden border-b border-black/10
     bg-white pt-24">
      {/* Retícula suave para acercarse al look editorial de la referencia. */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

    <div className="relative mx-auto flex min-h-[570px] w-full 
      max-w-[1350px] 
      flex-col justify-between px-4 pb-7 sm:px-8 

      #Tamaños para pantallas grandes, ajustando altura mínima y padding horizontal
      lg:min-h-30 lg:px-12">
        {/* Collage principal con rutas reemplazables */}
        <div className="relative h-[390px] w-full sm:h-[500px] lg:h-[600px]">
          {heroImages.map((image) => (
            <div key={image.src} className={`absolute ${image.className}`}>
              <div className="relative h-full w-full overflow-hidden border
               border-black/10 bg-white p-1 ">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}

          <div className="absolute inset-x-0 top-[38%] 
          mx-auto max-w-[320px] text-center sm:top-[40%] 
          sm:max-w-[440px] lg:max-w-[500px]">
            <h1
              className={`${cotizaTitleFont.className} text-4xl 
              uppercase leading-[3rem] sm:leading-[5rem] tracking-tight sm:text-6xl lg:text-7xl`}
            >
              Que imprimimos
              <br />
              hoy?
            </h1>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeaderCotiza;
