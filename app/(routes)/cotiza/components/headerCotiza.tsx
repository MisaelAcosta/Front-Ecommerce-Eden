"use client";

import Image from "next/image";
import Floating, {
  FloatingElement,
} from "@/components/fancy/image/parallax-floating.tsx";

const HeaderCotiza = () => {
  return (
    <section className="relative h-full w-full overflow-hidden bg-[#d9d9d9]">
      {/* Wrapper general del header */}
      <div className="relative h-full min-h-screen w-full">
        {/* Fondo escritorio */}
        <Image
          src="/bgcotiza3.png"
          alt="Fondo cotiza escritorio"
          fill
          priority
          className="hidden object-cover object-center md:block"
        />

        {/* Fondo móvil */}
        <Image
          src="/bgcotiza33.png"
          alt="Fondo cotiza móvil"
          fill
          priority
          className="block object-cover object-center md:hidden"
        />

        {/* Capa contenido */}
        <div className="absolute inset-0 z-10">
          <Floating sensitivity={-0.4} easingFactor={0.06}>
            {/* ========================= DESKTOP ========================= */}
            <div className="relative hidden h-full w-full md:block">
              {/* Imagen superior izquierda */}
              <FloatingElement depth={1.2} className="left-[13%] top-[11%]">
                <div className="relative h-[190px] w-[150px] lg:h-[330px] lg:w-[180px]">
                  <Image
                    src="/utils/img2.png"
                    alt="Figura 3D 1"
                    fill
                    className="pointer-events-none object-contain select-none"
                  />
                </div>
              </FloatingElement>

              {/* Imagen superior centro */}
              <FloatingElement
                depth={1.8}
                className="left-1/2 top-[3%] -translate-x-1/2"
              >
                <div className="relative h-[250px] w-[170px] lg:h-[310px] lg:w-[210px]">
                  <Image
                    src="/utils/img1.png"
                    alt="Figura 3D 2"
                    fill
                    className="pointer-events-none object-contain select-none"
                  />
                </div>
              </FloatingElement>

              {/* Imagen superior derecha */}
              <FloatingElement depth={1.4} className="right-[11%] top-[8%]">
                <div className="relative h-[170px] w-[170px] lg:h-[410px] lg:w-[210px]">
                  <Image
                    src="/utils/img3.png"
                    alt="Figura 3D 3"
                    fill
                    className="pointer-events-none object-contain select-none"
                  />
                </div>
              </FloatingElement>

              {/* Imagen inferior izquierda */}
              <FloatingElement depth={2.1} className="left-[15%] bottom-[3%]">
                <div className="relative h-[220px] w-[180px] lg:h-[440px] lg:w-[220px]">
                  <Image
                    src="/utils/img4.png"
                    alt="Figura 3D 4"
                    fill
                    className="pointer-events-none object-contain select-none"
                  />
                </div>
              </FloatingElement>

              {/* Imagen inferior derecha */}
              <FloatingElement depth={1.6} className="right-[17%] bottom-[8%]">
                <div className="relative h-[140px] w-[220px] lg:h-[190px] lg:w-[300px]">
                  <Image
                    src="/utils/img5.jpg"
                    alt="Figura 3D 5"
                    fill
                    className="pointer-events-none object-contain select-none"
                  />
                </div>
              </FloatingElement>

              {/* Título escritorio */}
              <div className="absolute inset-0 flex items-start justify-center px-6 pt-[36vh] lg:pt-[38vh]">
                <div className="max-w-[700px] text-center">
                  <h1 className="text-[42px] font-black uppercase leading-[0.92] tracking-tight text-black lg:text-[66px]">
                    ¿Qué imprimimos
                    <br />
                    hoy?
                  </h1>
                </div>
              </div>
            </div>

            {/* ========================= MOBILE ========================= */}
            <div className="relative block h-full w-full md:hidden">
              {/* Imagen móvil arriba izquierda */}
              <FloatingElement depth={1.3} className="left-[4%] top-[10%]">
                <div className="relative h-[195px] w-[105px]">
                  <Image
                    src="/utils/img1.png"
                    alt=""
                    fill
                    className="pointer-events-none object-cover select-none"
                  />
                </div>
              </FloatingElement>

              {/* Imagen móvil arriba centro */}
              <FloatingElement
                depth={1.6}
                className="left-1/2 top-[12%] -translate-x-1/2"
              >
                <div className="relative h-[158px] w-[102px]">
                  <Image
                    src="/utils/img2.png"
                    alt=""
                    fill
                    className="pointer-events-none object-cover select-none"
                  />
                </div>
              </FloatingElement>

              {/* Imagen móvil arriba derecha */}
              <FloatingElement depth={1.3} className="right-[4%] top-[11%]">
                <div className="relative h-[145px] w-[117px]">
                  <Image
                    src="/utils/img3.png"
                    alt=""
                    fill
                    className="pointer-events-none object-cover select-none"
                  />
                </div>
              </FloatingElement>

              {/* Imagen móvil abajo izquierda */}
              <FloatingElement depth={1.9} className="left-[9%] bottom-[7%]">
                <div className="relative h-[200px] w-[120px]">
                  <Image
                    src="/utils/img4.png"
                    alt=""
                    fill
                    className="pointer-events-none object-cover select-none"
                  />
                </div>
              </FloatingElement>

              {/* Imagen móvil abajo derecha */}
              <FloatingElement depth={1.5} className="right-[10%] bottom-[11%]">
                <div className="relative h-[132px] w-[190px]">
                  <Image
                    src="/utils/img5.jpg"
                    alt=""
                    fill
                    className="pointer-events-none object-cover select-none"
                  />
                </div>
              </FloatingElement>

              {/* Título móvil */}
              <div className="absolute inset-0 flex items-start justify-center px-4 pt-[40vh]">
                <div className="max-w-[290px] text-center">
                  <h1 className="text-[38px] font-black uppercase leading-[0.92] tracking-tight text-black">
                    ¿Qué imprimimos hoy?
                  </h1>
                </div>
              </div>
            </div>
          </Floating>
        </div>
      </div>
    </section>
  );
};

export default HeaderCotiza;
