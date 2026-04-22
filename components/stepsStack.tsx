"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ReactLenis } from "lenis/react";

import HeaderCotiza from "@/app/(routes)/cotiza/components/headerCotiza";
import Paso1 from "@/app/(routes)/cotiza/components/paso1";
import Paso2 from "@/app/(routes)/cotiza/components/paso2";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const StepsStack = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const steps = gsap.utils.toArray<HTMLElement>(".step-section");
        const intro = document.querySelector(".cotiza-intro");
        const outro = document.querySelector(".cotiza-outro");

        if (!steps.length || !intro || !outro) return;

        ScrollTrigger.create({
          trigger: steps[0],
          start: "top top",
          endTrigger: steps[steps.length - 1],
          end: "top 30%",
          pin: intro,
          pinSpacing: false,
        });

        steps.forEach((step, index) => {
          const isLast = index === steps.length - 1;
          const inner = step.querySelector(".step-inner");

          if (!isLast) {
            ScrollTrigger.create({
              trigger: step,
              start: "top 35%",
              endTrigger: outro,
              end: "top 65%",
              pin: true,
              pinSpacing: false,
            });

            if (inner) {
              gsap.to(inner, {
                y: `-${(steps.length - index) * 6}vh`,
                ease: "none",
                scrollTrigger: {
                  trigger: step,
                  start: "top 35%",
                  endTrigger: outro,
                  end: "top 65%",
                  scrub: 1.1,
                },
              });
            }
          }
        });

        ScrollTrigger.refresh();
      });

      mm.add("(max-width: 767px)", () => {
        const intro = document.querySelector(".cotiza-intro");

        if (!intro) return;

        // En móvil solo fijamos el header un poco, o incluso puedes quitar esto también.
        ScrollTrigger.create({
          trigger: intro,
          start: "top top",
          end: "bottom top",
          pin: false,
        });

        // opcional: animación suave de entrada
        gsap.utils.toArray<HTMLElement>(".step-inner").forEach((inner) => {
          gsap.fromTo(
            inner,
            { opacity: 0.95, y: 20 },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: inner,
                start: "top 85%",
                end: "top 60%",
                scrub: 0.8,
              },
            }
          );
        });

        ScrollTrigger.refresh();
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      <div ref={containerRef} className="relative bg-white">
        <section className="cotiza-intro relative h-screen overflow-hidden">
          <div className="h-full">
            <HeaderCotiza />
          </div>
        </section>

        <section className="step-section relative overflow-hidden md:h-screen">
          <div className="step-inner relative h-full">
            <Paso1 />
          </div>
        </section>

        <section className="step-section relative overflow-hidden md:h-screen">
          <div className="step-inner relative h-full">
            <Paso2 />
          </div>
        </section>

        <section className="cotiza-outro h-[20vh] md:h-[30vh]" />
      </div>
    </ReactLenis>
  );
};

export default StepsStack;