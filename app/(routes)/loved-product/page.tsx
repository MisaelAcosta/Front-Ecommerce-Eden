"use client";

import SmoothScroll from "@/components/animation_page/smooth-scroll";
import ScrollReveal from "@/components/animation_page/scroll-reveal";
import LovedGrid from "./components/loved-grid";

const Page = () => {
  return (
    <SmoothScroll>
      <main className="mx-auto w-full max-w-[1350px] px-4 pb-20 pt-28 sm:px-6 sm:pt-36 lg:px-0">
        <ScrollReveal>
          <LovedGrid />
        </ScrollReveal>
      </main>
    </SmoothScroll>
  );
};

export default Page;
