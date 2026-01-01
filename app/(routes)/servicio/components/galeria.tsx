"use client";

import Image from "next/image";

const Galeria = () => {
  const items = [
    {
      title: "Malorian Overture de\nCyberpunk 2077",
      src: "/arma.png", // 👈 public/galeria/malorian.jpg
    },
    {
      title: "Dispensador de capsulas",
      src: "/dispensador.png", // 👈 public/galeria/dispensador.jpg
    },
    {
      title: "Organizador modular",
      src: "/soporte.png", // 👈 public/galeria/organizador.jpg
    },
  ];

  return (
    <section
      id="galeria"
      className="w-full border-t border-black/40 bg-[#F1F1F1] "
    >
      {/* TITULO */}
      

      {/* GRID */}
      <div className="px-6 sm:px-10 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
          {items.map((it, idx) => (
            <div key={idx} className="w-full">
              {/* Imagen cuadrada */}
              <div className="relative w-full aspect-square bg-black/5 overflow-hidden">
                <Image
                  src={it.src}
                  alt={it.title.replace("\n", " ")}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Texto abajo */}
              <p className="mt-4 text-sm sm:text-base text-black/85 whitespace-pre-line">
                {it.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Galeria;
