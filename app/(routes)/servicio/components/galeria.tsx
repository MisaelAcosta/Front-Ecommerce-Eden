"use client";

import Image from "next/image";

const Galeria = () => {
  const items = [
    {
      title: "Malorian Overture Cyberpunk 2077",
      src: "/arma.png", // 👈 public/galeria/malorian.jpg
    },
    {
      title: "Dispensador de capsulas",
      src: "/dispensador.png", // 👈 public/galeria/dispensador.jpg
    },
    {
      title: "Organizador \nmodular",
      src: "/soporte.png", // 👈 public/galeria/organizador.jpg
    },

    
  ];

  return (
    <section
      id="galeria"
      className="w-full  bg-white "
    >
      {/* TITULO */}
      

      {/* GRID */}
      <div className="px-2 sm:mt-20 mt-20 sm:px-10 py-12 sm:py-18">
        {/* Texto arriba */}
        <div className="mb-12 sm:mb-18 ">
          <h1 className="text-3xl text-center sm:text-4xl font-black mb-4">
          GALERIA
          </h1>
          <p className="text-black/80 text-center text-sm sm:text-base leading-relaxed">
          Aquí puedes ver parte de nuestro trabajo y cómo transformamos 
          ideas en piezas reales.
          </p>
        </div>
        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-14">
          {items.map((it, idx) => (
            <div key={idx} className="w-full">
              <div className="relative w-full aspect-square overflow-hidden group">
                
                {/* Imagen */}
                <Image
                  src={it.src}
                  alt={it.title.replace("\n", " ")}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Degradado inferior */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                {/* Texto encima */}
                <div className="absolute bottom-6 left-16 sm:left-0 px-15 sm:px-17 z-10">
                  <p className="
                    text-white
                    text-xl sm:text-2xl
                    font-black
                    text-right
                    sm:ml-15
                    
                    
                  ">
                    {it.title}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Galeria;
