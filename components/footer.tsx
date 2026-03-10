"use client";

import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({
  weight: ["400", "900"],
  subsets: ["latin"],
});

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-10 bg-[#111111]">
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-8 md:px-10 py-5 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-12">
          {/* Texto grande */}
          <div className="md:col-span-2 lg:col-span-2">
            <h1
              className={`${inter.className} text-white sm:text-start text-center font-black md:border-r tracking-tight text-5xl leading-10 lg:text-7xl lg:leading-[0.9]`}
            >
              EL FUTURO <br />
              ESTÁ <br />
              IMPRESO
            </h1>
          </div>

          {/* Columna explorar */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-3 sm:text-start text-center text-base text-white md:text-lg">
              Explora
            </h3>
            <ul className="space-y-3 text-center sm:text-start">
              <li>
                <Link
                  href="/explora"
                  className="text-gray-400 hover:text-white hover:underline transition-colors"
                >
                  Políticas de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/explora"
                  className="text-gray-400 hover:text-white hover:underline transition-colors"
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/explora"
                  className="text-gray-400 hover:text-white hover:underline transition-colors"
                >
                  Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna contacto */}
          <div className="col-span-1 text-white text-center sm:text-start">
            <h3 className="font-semibold mb-3 text-base md:text-lg">
              Contáctanos
            </h3>
            <ul className="space-y-3 text-center sm:text-start">
              <li>
                <a
                  href="mailto:EdenCorreos@gmail.com"
                  className="text-gray-400 hover:text-white hover:underline transition-colors break-all"
                >
                  Gmail
                </a>
              </li>
              <li>
                <a
                  href="tel:+931107284"
                  className="text-gray-400 hover:text-white hover:underline transition-colors"
                >
                  whatsapp
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/eden.3d_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white hover:underline transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Parte inferior */}
      <div className="border-gray-200">
        <div className="max-w-2xl ml-auto px-10 md:px-25 py-2">
          <div className="flex sm:flex-row items-center justify-between text-xs md:text-sm text-gray-500 gap-2">
            <p>© 2026 Eden.</p>
            <p>Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </footer>
  );
}