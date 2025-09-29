"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import {Instagram } from "lucide-react";

const inter = Inter({
  weight: ["400", "900"],
  subsets: ["latin"],
});

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-10 bg-[#111111]">
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-8 md:px-10 py-5 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Texto grande */}
          <div className="md:col-span-2 lg:col-span-2">
            {/* 📱 MÓVIL */}
            <h1
              className={`${inter.className} text-white font-black md:border-r-1 tracking-tight 
              text-4xl leading-tight 
              /* 💻 DESKTOP */ lg:text-7xl lg:leading-[1.15] `}
            >
              EL FUTURO <br />
              ESTÁ <br />
              IMPRESO
            </h1>
          </div>

          {/* Columna redes */}
          <div className="col-span-1 ">
            <h3 className="font-semibold mb-3 text-base text-white md:text-lg">Síguenos</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://www.instagram.com/eden.3d_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex items-center gap-2 hover:underline transition-colors"
                > 
                  <span className="flex items-center gap-2 bg-gray-100 hover:bg-red-500 px-3 py-2 rounded-full text-sm font-medium transition-colors">
                    <Instagram className="w-4 h-4 " /> @eden_3d_
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna explorar */}
          <div className="col-span-1 ">
            <h3 className="font-semibold mb-3 text-base text-white md:text-lg">Explora</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white hover:underline transition-colors "
                >
                  Políticas de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white hover:underline transition-colors"
                >
                  Perfil
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white hover:underline transition-colors"
                >
                  Sobre nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna contacto */}
          <div className="col-span-1 text-white">
            <h3 className="font-semibold mb-3 text-base md:text-lg">Contáctanos</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:EdenCorreos@gmail.com"
                  className="text-gray-400 hover:text-white  hover:underline transition-colors  break-all"
                >
                  EdenCorreos@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+931107284"
                  className="text-gray-400 hover:text-white hover:underline transition-colors"
                >
                  +93 110 7284
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Parte inferior */}
      <div className="border-gray-200">
        <div className="max-w-2xl ml-auto px-10 pt-0 md:pt-0 md:px-25 py-2">
          <div className="flex sm:flex-row items-center justify-between text-xs md:text-sm text-gray-500 gap-2">
            <p>© 2025 Eden.</p>
            <p>Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
