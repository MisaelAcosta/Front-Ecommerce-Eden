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

const footerLinks = [
  { label: "POLITICAS DE PRIVACIDAD", href: "/explora" },
  { label: "TERMINOS Y CONDICIONES", href: "/explora" },
  { label: "SOBRE NOSOTROS", href: "/explora" },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden border-t border-white/20 bg-[#111111] text-white">
      <div className="w-full px-9 pb-10 pt-10 sm:px-29 lg:px-44 ">
        {/* Contenido superior */}
        <div
          className="grid grid-cols-2 gap-x-8 gap-y-11
          lg:grid-cols-[minmax(330px,1fr)_155px_90px]
          lg:items-start lg:gap-x-40 lg:pb-10"
        >
          <section
            className="col-span-2 max-w-[320px] lg:col-span-1"
            aria-label="Suscripción"
          >
            <p
              className={`${khInterferenceLight.className}
              text-[11px] leading-[1.05] text-white sm:text-base`}
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
              mb-4 text-base text-white/55`}
            >
              EXPLORA
            </h2>

            <ul
              className={`${khInterferenceLight.className}
              space-y-3 text-base leading-[1.15]`}
            >
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    className="transition-opacity hover:opacity-60"
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
              mb-4 text-base text-white/55`}
            >
              CONTÁCTANOS
            </h2>

            <ul
              className={`${khInterferenceLight.className}
              space-y-4 text-base leading-none`}
            >
              <li>
                <a
                  className="transition-opacity hover:opacity-60"
                  href="mailto:EdenCorreos@gmail.com"
                >
                  EMAIL
                </a>
              </li>

              <li>
                <a
                  className="transition-opacity hover:opacity-60"
                  href="tel:+56931107284"
                >
                  WHATSAPP
                </a>
              </li>

              <li>
                <a
                  className="transition-opacity hover:opacity-60"
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
            text-[clamp(2.5rem,8vw,10rem)]
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
