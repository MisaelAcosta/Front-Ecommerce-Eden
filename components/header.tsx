
"use client";

import Block1 from "@/components/block1";
import Block2 from "@/components/block2";

const Header = () => {
  return (
    <section className="w-full max-w-9xl lg:mx-0 px-4 sm:px-10 py-8 md:py-12">
      <div
        className="
          grid grid-cols-1 gap-1 sm:gap-1
          md:grid-cols-3 md:grid-rows-2 md:gap-5
          md:h-[745px] 
          md:w-full
          md:p-none
        "
      >
        {/* Bloque grande (carrusel). En mobile ocupa todo el ancho, sin altura fija */}
        <div className="md:col-span-2 md:row-span-2 rounded-lg overflow-hidden min-h-[520px] sm:min-h-[380px] md:min-h-0 md:h-full">
          <Block1 />
        </div>

        {/* Botón/rectángulo 1 */}
        <div className="rounded-2xl overflow-hidden  md:h-186">
          <Block2 />
        </div>

      </div>
    </section>
  );
};

export default Header;
