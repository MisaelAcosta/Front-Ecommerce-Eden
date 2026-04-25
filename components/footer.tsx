"use client";

import localFont from "next/font/local";
import Link from "next/link";

const maratype = localFont({
  src: "./fonts/Maratype.otf",
});

const khInterferenceBold = localFont({
  src: "./fonts/KHInterferenceTRIAL-Bold.otf",
});

const khInterferenceLight = localFont({
  src: "./fonts/KHInterferenceTRIAL-Light.otf",
});

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 bg-[#111111]">
      <div className="mx-auto max-w-7xl px-8 py-5 md:px-10 md:py-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          <div className="md:col-span-2 lg:col-span-2">
            <h1
              className={`${maratype.className} text-center 
              text-6xl leading-17 tracking-tight 
              text-white sm:text-start md:border-r 
              lg:text-8xl lg:leading-[1.10]`}
            >
              EL FUTURO <br />
              ESTA <br />
              IMPRESO
            </h1>
          </div>

          <div className="col-span-1">
            <h3
              className={`${khInterferenceBold.className} mb-3 
              text-center text-lg text-white sm:text-start 
              md:text-2xl`}
            >
              Explora
            </h3>
            <ul
              className={`${khInterferenceLight.className} 
              space-y-3 text-center sm:text-start`}
            >
              <li>
                <Link
                  href="/explora"
                  className="text-gray-400 transition-colors
                   hover:text-white hover:underline"
                >
                  Politicas de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/explora"
                  className="text-gray-400 transition-colors hover:text-white hover:underline"
                >
                  Terminos y Condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/explora"
                  className="text-gray-400 transition-colors hover:text-white hover:underline"
                >
                  Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

          <div
            className={`${khInterferenceLight.className} col-span-1 text-center text-white sm:text-start`}
          >
            <h3 className={`${khInterferenceBold.className} mb-3 
            text-lg md:text-2xl`}>
              Contactanos
            </h3>
            <ul className="space-y-3 text-center sm:text-start">
              <li>
                <a
                  href="mailto:EdenCorreos@gmail.com"
                  className="break-all text-gray-400 transition-colors hover:text-white hover:underline"
                >
                  Gmail
                </a>
              </li>
              <li>
                <a
                  href="tel:+931107284"
                  className="text-gray-400 transition-colors hover:text-white hover:underline"
                >
                  whatsapp
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/eden.3d_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white hover:underline"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-gray-200">
        <div className="ml-auto max-w-2xl px-10 py-2 md:px-25">
          <div
            className={`${khInterferenceLight.className} flex items-center justify-between gap-2 text-xs text-gray-500 md:text-sm sm:flex-row`}
          >
            <p>&copy; 2026 Eden.</p>
            <p>Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
