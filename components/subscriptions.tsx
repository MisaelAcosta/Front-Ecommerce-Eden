import Image from "next/image";
import localFont from "next/font/local";
import { SubscriptionForm } from "@/components/subscription-form";
import { khInterferenceRegularFont } from "@/app/(routes)/cart/components/cart-fonts";

const khInterferenceLight = localFont({
  src: "./fonts/KHInterferenceTRIAL-Light.otf",
});

export default function Subscriptions() {
  return (
    // Banda de suscripcion de la pagina Inicio. El fondo negro ocupa todo el ancho
    // de la ventana; el contenido interno se limita a 1350px para alinearse con
    // las demas secciones de la pagina principal.
    <section className="py-10  max-w-[1350px] lg:px-0 px-3  mx-auto text-white">
      <div className="bg-black  mx-auto max-w-[1350px] overflow-hidden">
        {/*
          Contenedor visual principal.
          - min-h controla la altura del bloque: 270px en movil, 290px en tablet
            y 195px en escritorio.
          - px/py controla el espacio interno alrededor del contenido.
          - overflow-hidden recorta la rana cuando sale intencionalmente por el borde.
          Si quieres un bloque mas alto o bajo, este es el lugar a modificar.
        */}
        <div className="relative min-h-[270px] overflow-hidden border-y
         border-white/10 px-5 py-25 pt-10 sm:min-h-[290px] 
         sm:px-8 lg:min-h-[300px] lg:px-0 lg:py-10">
          {/*
            Reticula de fondo. No tiene contenido: solo dibuja lineas horizontales
            y verticales cada 64px x 52px. Baja "opacity" para hacerla mas sutil
            o cambia background-size para modificar el tamano de los cuadrados.
          */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-70
             bg-[linear-gradient(to_right,rgb(51,51,51)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.11)_1px,transparent_1px)]
             [background-size:132px_74px]"
          />

          {/*
            Imagen decorativa izquierda. left y w controlan posicion y tamano de
            frog.png en cada breakpoint; z-10 la deja sobre la reticula, pero bajo
            el texto/formulario (z-20). Cambia estas clases si necesitas reencuadrarla.
          */}
          <Image
            src="/frog.png"
            alt=""
            width={400}
            height={444}
            priority={false}
            className="pointer-events-none absolute bottom-[-35px]  
            lg:bottom-[-22px] 
            left-[-38px] z-10 w-[450px] max-w-none 
            sm:left-[-12px] sm:w-[230px] lg:left-[-15px] 
            lg:w-[300px]"
          />

          {/*
            Columna de contenido. El margen izquierdo reserva espacio para la rana:
            38%/34% en pantallas angostas y 300px en escritorio. max-w evita que
            texto y formulario se vuelvan demasiado anchos en monitores grandes.
          */}
         <div
              className="relative z-20 mx-auto
              flex min-h-[350px] w-full max-w-[300px] 
              flex-col items-center justify-center
              sm:min-h-[230px]
              lg:mx-0 lg:ml-[300px] lg:min-h-[195px]
              lg:items-start lg:max-w-[500px]"
            >
            {/* Etiqueta principal. Su padding y color verde definen el rotulo SUSCRIBETE. */}
            <h2 className={`${khInterferenceRegularFont.className} w-fit
             bg-transparent pr-21 lg:bg-black px-3 
             py-1 text-4xl lg:pl-42 lg:text-5xl uppercase text-[#adff00]`}>
              Suscribete
            </h2>

            {/*
              En movil el texto y formulario quedan en columna. Desde sm pasan a
              dos columnas: la primera para descripcion y la segunda para el input.
              Ajusta grid-template-columns para cambiar la proporcion entre ambos.
            */}
            <div className="mt-8 grid w-full bg-transparent lg:bg-black  max-w-[500px] gap-4
            sm:items-center sm:gap-7
            lg:mt-7 lg:ml-[170px]"
            >


              <p
                className={`${khInterferenceLight.className}
                w-full border border-white/20 bg-black/60 lg:bg-black
                px-4 py-5
                text-[10px] leading-[1.35] text-white/75
                sm:px-5 sm:py-6 sm:text-lg`}
              >
                RECIBE OFERTAS EXCLUSIVAS, DESCUENTOS ESPECIALES Y 
                ENTERATE ANTES QUE NADIE DE NUESTRAS NUEVAS COLECCIONES.
              </p>
              {/* Formulario funcional: envia el correo a /api/subscriptions y este a Strapi. */}
              <SubscriptionForm variant="home" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
