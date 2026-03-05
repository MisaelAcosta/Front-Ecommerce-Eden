"use client";

const PoliticasPrivacidad = () => {
  return (
    <section className="w-full bg-zinc-200/70 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-4xl">
        <article className="rounded-md bg-white p-6 sm:p-10 shadow-sm">
          <header className="text-sm text-zinc-500">
            <p>Eden 3D</p>
            <p>Políticas de privacidad</p>
          </header>

          <div className="mt-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900">
              Política de Privacidad
            </h1>
            <p className="mt-3 text-sm text-zinc-500">
              Última actualización: {new Date().getFullYear()}
            </p>
          </div>

          <div className="mt-8 space-y-5 text-[15px] leading-7 text-zinc-700">
            <p>
              En Eden 3D valoramos tu privacidad. Esta política explica qué
              información recopilamos, cómo la usamos y cuáles son tus derechos
              al usar nuestro sitio web y realizar compras.
            </p>

            <h2 className="pt-2 text-base font-semibold text-zinc-900">
              1. Datos que recopilamos
            </h2>
            <p>
              Podemos recopilar datos como nombre, correo electrónico, teléfono,
              dirección de envío, región/comuna y detalles necesarios para
              procesar tu pedido. También podemos recopilar información técnica
              básica (por ejemplo, navegador o dispositivo) para mejorar la
              experiencia del sitio.
            </p>

            <h2 className="pt-2 text-base font-semibold text-zinc-900">
              2. Uso de la información
            </h2>
            <p>
              Usamos tus datos para: (a) gestionar compras y envíos, (b) contactarte
              por tu pedido o soporte, (c) mejorar el sitio y (d) cumplir
              obligaciones legales cuando corresponda.
            </p>

            <h2 className="pt-2 text-base font-semibold text-zinc-900">
              3. Pagos y seguridad
            </h2>
            <p>
              Los pagos se procesan mediante proveedores externos (por ejemplo,
              Flow). Nosotros no almacenamos datos sensibles de tu tarjeta. La
              información de pago se gestiona en los sistemas del proveedor.
            </p>

            <h2 className="pt-2 text-base font-semibold text-zinc-900">
              4. Compartir datos
            </h2>
            <p>
              Solo compartimos la información necesaria para completar el
              servicio (por ejemplo, empresas de envío o pasarela de pago). No
              vendemos tus datos.
            </p>

            <h2 className="pt-2 text-base font-semibold text-zinc-900">
              5. Tus derechos
            </h2>
            <p>
              Puedes solicitar acceso, corrección o eliminación de tus datos
              escribiéndonos. También puedes pedir que actualicemos tu
              información de contacto.
            </p>

            <h2 className="pt-2 text-base font-semibold text-zinc-900">
              6. Contacto
            </h2>
            <p>
              Si tienes dudas sobre esta política, contáctanos por correo a{" "}
              <span className="font-medium text-zinc-900">
                EdenCorres@gmail.com
              </span>
              .
            </p>
          </div>

          <footer className="mt-10">
            <p className="text-sm text-zinc-500">Atentamente,</p>
            <p className="mt-2 font-medium text-zinc-900">Eden 3D</p>
          </footer>
        </article>
      </div>
    </section>
  );
};

export default PoliticasPrivacidad;
