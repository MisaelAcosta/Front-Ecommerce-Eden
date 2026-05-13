"use client";

import Block1 from "@/components/block1";

const Header = () => {
  return (
    <section className="w-full bg-white px-4 py-6 pt-24 lg:pt-4 md:px-8">
      <div className="mx-auto w-full max-w-[920px] lg:max-w-[1990px]">
        <div className="
        h-[750px] 
        overflow-hidden rounded-xl 
        bg-gray-300
        md:h-[925px]">
          <Block1 />
        </div>
      </div>
    </section>
  );
};

export default Header;

