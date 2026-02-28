"use client";

import Block1 from "@/components/block1";


const Header = () => {
  return (
    <section
      className="
        w-full
        max-w-9xl
        lg:mx-0
        px-0
        pb-8 md:pb-8
        bg-white
      "
    >
      <div
        className="
          grid
          grid-cols-1
          gap-0
          md:grid-cols-1
          md:grid-rows-2
          md:gap-0
          md:h-[975px]
          w-full
        "
      >
        {/* Bloque grande */}
        <div
          className="
            md:col-span-2 md:row-span-2 h-full overflow-hidden
            
            min-h-[520px] sm:min-h-[380px]
            md:min-h-0 md:h-full
          "
        >
          <Block1 />
        </div>

        
      </div>
    </section>
  );
};

export default Header;

