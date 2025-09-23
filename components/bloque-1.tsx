"use client";

import { useEffect, useRef, useState } from "react";

const Block1 = () => {
  const slides = [
    { id: 1, title: "The simple Bottle Water" },
    { id: 2, title: "New Season Collection" },
    { id: 3, title: "Limited Edition Bottle" },
  ];

  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // autoplay
  useEffect(() => {
    startAuto();
    return () => stopAuto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAuto = () => {
    stopAuto();
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3500);
  };

  const stopAuto = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const prev = () => {
    stopAuto();
    setIndex((i) => (i - 1 + slides.length) % slides.length);
    startAuto();
  };

  const next = () => {
    stopAuto();
    setIndex((i) => (i + 1) % slides.length);
    startAuto();
  };

  return (
    <div className="w-full h-full bg-[#0f1724] text-white rounded-2xl relative overflow-hidden">
      {/* Slides wrapper */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="min-w-full flex items-center justify-center px-8"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-center">
              {slide.title}
            </h1>
          </div>
        ))}
      </div>

      {/* Prev / Next (inside tarjeta) */}
      <button
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 md:p-3 rounded-full shadow-md backdrop-blur"
      >
        {/* Chevron left */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 md:p-3 rounded-full shadow-md backdrop-blur"
      >
        {/* Chevron right */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators (dots) — dentro de la tarjeta */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => {
              stopAuto();
              setIndex(i);
              startAuto();
            }}
            aria-label={`Ir al slide ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index ? "bg-white scale-110" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Block1;
