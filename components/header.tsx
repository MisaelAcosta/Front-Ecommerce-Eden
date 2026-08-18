"use client";

import Block1 from "@/components/block1";

const Header = () => {
  return (
    <section className="w-full bg-white px-0 py-6 pt-0 lg:pt-0 md:px-0">
      <div className="mx-auto w-full max-w-[920px] lg:max-w-[1905px]">
        <div className="
        h-[700px]
        sm:h-[760px]
        lg:h-[720px]
        xl:h-[820px]
        2xl:h-[925px]
        overflow-hidden rounded-none 
        bg-gray-300">
          <Block1 />
        </div>
      </div>
    </section>
  );
};

export default Header;

