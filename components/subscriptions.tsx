import Image from "next/image";
import localFont from "next/font/local";
import { SubscriptionForm } from "@/components/subscription-form";
import { khInterferenceRegularFont } from "@/app/(routes)/cart/components/cart-fonts";

const khInterferenceLight = localFont({
  src: "./fonts/KHInterferenceTRIAL-Light.otf",
});

export default function Subscriptions() {
  return (
    /* ================================================================
       SUSCRIPCIONES: CONTENEDOR EXTERNO
       `max-w-[1350px]` alinea esta banda con las demas secciones de Inicio.
       Ajustar `px` cambia solo los margenes laterales fuera de la imagen.
       ================================================================ */
    <section className="mx-auto max-w-[1350px] px-3 py-10 lg:px-8 2xl:px-0">
      {/* ==============================================================
          SUSCRIPCIONES: IMAGEN DE FONDO
          `aspect-[3.7/1]` conserva la proporcion de suscripcion_gmail.png
          en escritorio. En movil, `min-h-[360px]` reserva aire vertical
          para que el titulo, la descripcion y el formulario no se encimen.
         ============================================================== */}
      <div
        className="
          relative min-h-[460px] overflow-hidden bg-[#1B2C1C]
          sm:min-h-[330px]
          lg:min-h-0 lg:aspect-[3.3/1]
        "
      >
        {/*
          IMAGEN MOVIL: version vertical de la escena. Se usa antes de `lg`
          para mostrar el fantasma completo y mantener espacio oscuro al centro.
        */}
        <Image
          src="/movil.png"
          alt=""
          fill
          sizes="(max-width: 1023px) 100vw, 0px"
          className="object-cover object-center  lg:hidden"
        />

        {/*
          IMAGEN ESCRITORIO: conserva la composicion panoramica original.
          `lg:block` la activa desde 1024px en adelante.
        */}
        <Image
          src="/suscripcion_gmail.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 1350px, 0px"
          className="hidden object-cover object-center  lg:block"
        />

        {/* CAPA DE CONTRASTE: `bg-black/30` oscurece la imagen sin ocultarla. */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/30" />

        {/* ============================================================
            DESCRIPCION: ESQUINA SUPERIOR DERECHA
            `right-5/top-5` mueve este texto dentro de la imagen.
            `max-w` evita que invada el titulo central en pantallas pequenas.
           ============================================================ */}
        <p
          className={`
            ${khInterferenceLight.className}
            absolute right-5 top-5 z-10 max-w-[310px]
            text-right text-[14px] uppercase leading-[1.15]
             text-[#ADFE00]
            sm:max-w-[260px] sm:text-xs
            lg:right-7 lg:top-6
          `}
        >
          RECIBE OFERTAS EXCLUSIVAS, DESCUENTOS ESPECIALES Y ENTERATE ANTES
          QUE NADIE DE NUESTRAS NUEVAS COLECCIONES.
        </p>

        {/* ============================================================
            CONTENIDO CENTRAL: TITULO Y FORMULARIO
            Este grupo esta centrado sobre la imagen. `gap-4` controla la
            separacion entre [SUSCRIBETE] y el rectangulo para el correo.
           ============================================================ */}
        <div
          className="
            absolute inset-0 z-10 flex flex-col items-center justify-center
            px-5 pt-12
            lg:pt-0
          "
        >
          {/* TITULO CENTRAL: cambiar `text-4xl` ajusta su tamano en movil. */}
          <h2
            className={`
              ${khInterferenceRegularFont.className}
              text-center text-4xl uppercase leading-none text-[#ADFE00]
              sm:text-5xl
            `}
          >
            [SUSCRIBETE]
          </h2>

          {/* FORMULARIO: conserva el envio a /api/subscriptions y Strapi. */}
          <div className="mt-4 w-full max-w-[390px]">
            <SubscriptionForm variant="home" />
          </div>
        </div>
      </div>
    </section>
  );
}
