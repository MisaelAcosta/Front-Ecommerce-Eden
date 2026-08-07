"use client";

import localFont from "next/font/local";
import Link from "next/link";
import { SubscriptionForm } from "@/components/subscription-form";

const maratype = localFont({
  src: "./fonts/Maratype.otf",
});

const khInterferenceBold = localFont({
  src: "./fonts/KHInterferenceTRIAL-Bold.otf",
});

const khInterferenceLight = localFont({
  src: "./fonts/KHInterferenceTRIAL-Light.otf",
});

const exploreLinks = [
  { label: "CATALOGO", href: "/category/todos-los-productos" },
  { label: "SERVICIOS", href: "/servicio" },
  { label: "IMPRIME", href: "/cotiza" },
  { label: "SOBRE NOSOTROS", href: "/explora#sobre-nosotros" },
];

const categoryLinks = [
  { label: "LIBROS", href: "/category/libros" },
  { label: "SOPORTES", href: "/category/soporte" },
  { label: "GEEK", href: "/category/geek" },
];

const policyLinks = [
  { label: "POLITICAS DE PRIVACIDAD", href: "/explora#politicas-privacidad" },
  { label: "TERMINOS Y CONDICIONES", href: "/explora#terminos-condiciones" },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden border-t border-white/20
     bg-[#111111] text-white">
      <div className="w-full px-9 pb-10 pt-10 sm:px-29 lg:px-44 ">
        {/* Contenido superior */}
        <div
          className="grid grid-cols-2 gap-x-8 gap-y-11
          lg:grid-cols-[minmax(280px,1fr)_150px_190px_130px]
          lg:items-start lg:gap-x-12 lg:pb-10"
        >
          <section
            className="col-span-2 max-w-[320px] lg:col-span-1"
            aria-label="Suscripción"
          >
            <p
              className={`${khInterferenceLight.className}
              text-[13px] leading-[1.05] text-white sm:text-base`}
            >
              SUSCRÍBETE Y RECIBE OFERTAS
              <br />
              EXCLUSIVAS
            </p>

            <SubscriptionForm variant="footer" />
          </section>

          <nav aria-label="Explora">
            <h2
              className={`${khInterferenceLight.className}
              mb-4 text-[14px] lg:text-base text-white/55`}
            >
              EXPLORA
            </h2>

            <ul
              className={`${khInterferenceLight.className}
              space-y-3 text-base leading-[1.15]`}
            >
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    className="transition-opacity hover:opacity-60 text-[14px] lg:text-base"
                    href={link.href}
                  >
                    {link.label}
                  </Link>

                  {link.label === "CATALOGO" && (
                    <ul className="mt-2 space-y-2 border-l border-white/20 pl-3 text-[11px] text-white/60 lg:text-xs">
                      {categoryLinks.map((category) => (
                        <li key={category.label}>
                          <Link
                            className="transition-colors hover:text-[#ADFE00]"
                            href={category.href}
                          >
                            {category.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Politicas">
            <h2
              className={`${khInterferenceLight.className}
              mb-4 text-[14px] text-white/55 lg:text-base`}
            >
              POLITICAS
            </h2>

            <ul
              className={`${khInterferenceLight.className}
              space-y-3 text-base leading-[1.15]`}
            >
              {policyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    className="text-[14px] transition-opacity hover:opacity-60 lg:text-base"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <address className="not-italic" aria-label="Contáctanos">
            <h2
              className={`${khInterferenceLight.className}
              mb-4 text-[14px] lg:text-base text-white/55`}
            >
              CONTÁCTANOS
            </h2>

            <ul
              className={`${khInterferenceLight.className}
              space-y-4 text-base leading-none`}
            >
              <li>
                <a
                  className="transition-opacity hover:opacity-60 text-[14px] lg:text-base"
                  href="mailto:EdenCorreos@gmail.com"
                >
                  EMAIL
                </a>
              </li>

              <li>
                <a
                  className="transition-opacity hover:opacity-60 text-[14px] lg:text-base"
                  href="tel:+56931107284"
                >
                  WHATSAPP
                </a>
              </li>

              <li>
                <a
                  className="transition-opacity hover:opacity-60 text-[14px] lg:text-base"
                  href="https://www.instagram.com/eden.3d_/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  INSTAGRAM
                </a>
              </li>
            </ul>
          </address>
        </div>

        {/* Texto gigante inferior */}
        <div className="relative mt-16">
          <p
            className={`${khInterferenceLight.className}
            absolute right-0 top-[-22px] lg:top-[-55px] 
            text-[10px] leading-none  text-[#ADFE00]/45
            sm:text-[11px] lg:text-base `}
          >
            &copy; 2026 EDEN. TODOS LOS DERECHOS RESERVADOS
          </p>

          <h1
            className={`${maratype.className}
            whitespace-nowrap text-center
            text-4xl
            lg:text-[clamp(4rem,10.5vw,12rem)]
            leading-[0.7]
            tracking-normal
            text-[#ADFE00]`}
          >
            EL FUTURO ESTA IMPRESO
          </h1>
        </div>
      </div>
    </footer>
  );
}
