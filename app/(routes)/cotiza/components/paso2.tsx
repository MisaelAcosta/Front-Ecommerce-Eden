"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const Paso2 = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleOpenFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
  };

  return (
  <section className="relative h-full w-full overflow-hidden bg-white">
  <div className="mx-auto grid h-full w-full max-w-[1400px] grid-cols-1 items-start gap-10 px-5 pt-20 md:px-10 md:pt-24 lg:grid-cols-2 lg:gap-14 lg:px-16 lg:pt-28">
    <div className="flex flex-col justify-start">
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-4">
              <h2 className="max-w-[700px] text-[2rem] font-black uppercase leading-[0.95] tracking-tight text-black md:text-[3rem] lg:text-[3.7rem]">
                CARGA TU ARCHIVO
              </h2>

              <p className="text-[1.5rem] font-extrabold uppercase tracking-tight text-[#4a4a4a] md:text-[2rem]">
                Paso 2
              </p>
            </div>

            <div className="space-y-3">
              <p className="max-w-[260px] text-[1.05rem] leading-[1.1] text-[#8a8a8a] md:text-[1.3rem]">
                Sube archivos .stl, .3mf y .obj y más.
              </p>

              {fileName && (
                <div className="max-w-[320px] rounded-md bg-[#f5f5f5] px-3 py-2 text-[13px] text-black shadow-sm">
                  <span className="font-semibold">Archivo:</span> {fileName}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative h-[240px] w-full max-w-[640px] overflow-hidden rounded-[24px] bg-black md:h-[300px] lg:h-[360px]">
            <Image
              src="/gif-upload-preview.gif"
              alt="Vista previa de subida de archivo"
              fill
              priority
              className="object-cover"
              unoptimized
            />

            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={handleOpenFilePicker}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-medium text-black shadow-md transition hover:scale-[1.02]"
              >
                Sube tu archivo
                <span aria-hidden="true">↑</span>
              </button>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".stl,.3mf,.obj"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Paso2;