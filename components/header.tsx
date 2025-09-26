
"use client";

import Block1 from "@/components/bloque-1";
import Block2 from "@/components/bloque-2";
import Block3 from "@/components/bloque-3";

const Header = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      <div
        className="
          grid grid-cols-1 gap-4 sm:gap-6
          md:grid-cols-3 md:grid-rows-2 md:gap-6
          md:h-[690px]
        "
      >
        {/* Bloque grande (carrusel). En mobile ocupa todo el ancho, sin altura fija */}
        <div className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden min-h-[520px] sm:min-h-[380px] md:min-h-0 md:h-full">
          <Block1 />
        </div>

        {/* Botón/rectángulo 1 */}
        <div className="rounded-2xl overflow-hidden h-60 md:h-auto">
          <Block2 />
        </div>

        {/* Botón/rectángulo 2 */}
        <div className="rounded-2xl overflow-hidden h-60 md:h-full">
          <Block3 />
        </div>
      </div>
    </section>
  );
};

export default Header;
