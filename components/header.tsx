"use client";

import Block1 from "@/components/block1";

const Header = () => {
  return (
    <section className="w-full bg-white px-2 py-6 pt-3 lg:pt-0 md:px-0">
      <div className="mx-auto w-full max-w-[920px] lg:max-w-[1905px]">
        <div className="
        h-[770px] 
        overflow-hidden rounded-xl lg:rounded-none
        bg-gray-300
        md:h-[925px]">
          <Block1 />
        </div>
      </div>
    </section>
  );
};

export default Header;

