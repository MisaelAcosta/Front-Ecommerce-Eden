import { CircleCheckBig, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";
import {
  khInterferenceLightFont,
  khInterferenceRegularFont,
  maratypeFont,
} from "@/app/(routes)/cart/components/cart-fonts";

export default function ConfirmPage() {
  return (
    <main className="bg-[#ece9e1] px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
      <section className="mx-auto grid w-full max-w-[1080px] overflow-hidden border border-black bg-white lg:grid-cols-[0.82fr_1.18fr]">
        {/* ESTADO VISUAL: identifica inmediatamente que el registro termino bien. */}
        <div className="flex min-h-[250px] flex-col justify-between bg-[#1B2C1C] p-7 text-[#C0FF01] sm:p-10">
          <CircleCheckBig size={44} strokeWidth={1.5} aria-hidden="true" />
          <div className="mt-14 lg:mt-24">
            <p className={`${khInterferenceLightFont.className} text-xs uppercase tracking-[0.2em]`}>
              Registro completado
            </p>
            <h1 className={`${maratypeFont.className} mt-4 text-5xl uppercase leading-[0.85] sm:text-6xl`}>
              Bienvenido a Eden
            </h1>
          </div>
        </div>

        {/* ACCIONES: permite entrar a la cuenta o volver a la tienda sin pasos extra. */}
        <div className="flex min-h-[250px] flex-col justify-between p-7 sm:p-10 lg:p-14">
          <div>
            <p className={`${khInterferenceRegularFont.className} text-xs uppercase tracking-[0.16em] text-black/55`}>
              Cuenta verificada
            </p>
            <h2 className={`${khInterferenceRegularFont.className} mt-5 text-2xl uppercase leading-[1.1] sm:text-3xl`}>
              Tu cuenta fue confirmada correctamente.
            </h2>
            <p className={`${khInterferenceLightFont.className} mt-5 max-w-md text-sm uppercase leading-5 text-black/65`}>
              Ya puedes iniciar sesión, guardar tus pedidos y cotizar tus modelos 3D.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/category/todos-los-productos"
              className={`${khInterferenceRegularFont.className} inline-flex min-h-11 items-center justify-center gap-2 bg-[#ADFE00] px-5 text-xs uppercase text-black transition-colors hover:bg-[#1B2C1C] hover:text-[#ADFE00]`}
            >
              <Home size={15} strokeWidth={1.8} />
              Ir al inicio
            </Link>
            <Link
              href="/"
              className={`${khInterferenceRegularFont.className} inline-flex min-h-11 items-center justify-center gap-2 border border-black px-5 text-xs uppercase text-black transition-colors hover:border-[#1B2C1C] hover:bg-[#1B2C1C] hover:text-[#ADFE00]`}
            >
              <ShoppingBag size={15} strokeWidth={1.8} />
              Explorar catálogo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
