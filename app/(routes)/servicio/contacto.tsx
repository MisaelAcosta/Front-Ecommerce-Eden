"use client";

import localFont from "next/font/local";
import { ArrowRight } from "lucide-react";

const maratypeFont = localFont({
  src: "../../../components/fonts/Maratype.otf",
  display: "swap",
});

const khInterferenceLightFont = localFont({
  src: "../../../components/fonts/KHInterferenceTRIAL-Light.otf",
  weight: "300",
  style: "normal",
  display: "swap",
});

const khInterferenceRegularFont = localFont({
  src: "../../../components/fonts/KHInterferenceTRIAL-Regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
});

const links = [
  {
    number: "(01)",
    label: "WHATSAPP",
    href: "https://wa.me/56912345678?text=Hola%20Eden%20Estudio%2C%20quiero%20cotizar%20un%20proyecto",
  },
  {
    number: "(02)",
    label: "INSTAGRAM",
    href: "https://www.instagram.com/eden.3d_/",
  },
  {
    number: "(03)",
    label: "GMAIL",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=eden.estudio1@gmail.com&su=Contacto%20Eden%20Estudio",
  },
];

const Contacto = () => {
  return (
    <section id="contacto" className="w-full bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-start gap-8 md:grid-cols-[170px_1px_minmax(0,1fr)] md:gap-10 lg:grid-cols-[200px_1px_minmax(0,1fr)] lg:gap-12">
          <div>
            <h2
              className={`${maratypeFont.className} text-left text-[2.8rem] leading-[0.88] text-black sm:text-[4.5rem] lg:text-[4.8rem]`}
            >
              CONTACTO
            </h2>
          </div>

          <div className="hidden h-full min-h-[130px] bg-black/15 md:block" />

          <div className="space-y-1 pt-1">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[54px_minmax(0,1fr)_22px] items-center gap-4 py-4 text-black sm:grid-cols-[64px_minmax(0,1fr)_26px] sm:py-5"
              >
                <span
                  className={`${khInterferenceLightFont.className} text-[0.68rem] leading-none tracking-[0.04em] text-black/45 sm:text-[0.74rem]`}
                >
                  {link.number}
                </span>

                <span
                  className={`${khInterferenceRegularFont.className} text-[1rem] leading-none tracking-[0.03em] text-black sm:text-[1.15rem]`}
                >
                  {link.label}
                </span>

                <ArrowRight
                  strokeWidth={1.5}
                  className="h-4 w-4 justify-self-end text-black transition-transform duration-300 group-hover:translate-x-1 sm:h-[18px] sm:w-[18px]"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
