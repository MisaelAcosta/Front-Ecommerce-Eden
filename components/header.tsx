"use client";

import Block1 from "@/components/bloque-1";
import Block2 from "@/components/bloque-2";
import Block3 from "@/components/bloque-3";

const Header = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Ajusta h-[...] si quieres otra altura. Esto garantiza que el grid tenga un alto fijo
          y que Block1 (col-span-2 row-span-2) coincida en altura con Block2+Block3. */}
      <div className="grid grid-cols-3 grid-rows-2 gap-6 h-[680px]">
        <div className="col-span-2 row-span-2 h-full">
          <Block1 />
        </div>

        <div className="h-full">
          <Block2 />
        </div>

        <div className="h-full">
          <Block3 />
        </div>
      </div>
    </section>
  );
};

export default Header;
