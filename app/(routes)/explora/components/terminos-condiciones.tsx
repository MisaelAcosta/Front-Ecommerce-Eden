"use client";

const TerminosCondiciones = () => {
  return (
    <section className="w-full bg-zinc-200/70 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-4xl">
        <article className="rounded-md bg-white p-6 sm:p-10 shadow-sm">
          <header className="text-sm text-zinc-500">
            <p>Eden 3D</p>
            <p>Términos y Condiciones</p>
          </header>

          <div className="mt-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900">
              Términos y Condiciones de Uso y Compra
            </h1>
            <p className="mt-3 text-sm text-zinc-500">
              Última actualización: {new Date().getFullYear()}
            </p>
          </div>

          <div className="mt-8 space-y-6 text-[15px] leading-7 text-zinc-700">
            
            <p>
              Bienvenido a Eden 3D. Al acceder y utilizar nuestro sitio web,
              así como al realizar una compra, aceptas los siguientes términos
              y condiciones. Te recomendamos leerlos cuidadosamente antes de
              efectuar cualquier pedido.
            </p>

            <div>
              <h2 className="font-semibold text-zinc-900">
                1. Sobre nuestros productos
              </h2>
              <p>
                Eden 3D comercializa productos fabricados mediante impresión
                3D. Debido a la naturaleza del proceso, pueden existir leves
                variaciones estéticas, marcas de capa o pequeñas diferencias
                respecto a imágenes referenciales. Estas no se consideran
                defectos, sino características propias del proceso de fabricación.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-zinc-900">
                2. Productos personalizados
              </h2>
              <p>
                Los productos personalizados o fabricados a pedido no cuentan
                con derecho a retracto, salvo que presenten fallas de fabricación.
                Una vez iniciado el proceso de impresión, el pedido no podrá
                ser cancelado.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-zinc-900">
                3. Precios y pagos
              </h2>
              <p>
                Todos los precios están expresados en pesos chilenos (CLP).
                Los pagos se procesan mediante pasarelas externas seguras,
                como Flow. Eden 3D no almacena información bancaria ni datos
                sensibles de tarjetas.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-zinc-900">
                4. Envíos
              </h2>
              <p>
                Los tiempos de producción pueden variar dependiendo del
                producto. Una vez despachado el pedido, el plazo de entrega
                dependerá de la empresa de transporte seleccionada. Eden 3D
                no se hace responsable por retrasos atribuibles a la empresa
                de envío.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-zinc-900">
                5. Cambios y devoluciones
              </h2>
              <p>
                Si el producto presenta una falla estructural o error de
                fabricación, el cliente deberá informarlo dentro de los
                primeros 3 días desde la recepción. Se evaluará el caso y,
                de corresponder, se ofrecerá reposición o solución.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-zinc-900">
                6. Propiedad intelectual
              </h2>
              <p>
                Los diseños, imágenes y contenidos publicados en este sitio
                pertenecen a Eden 3D o a sus respectivos titulares. No está
                permitido su uso, reproducción o comercialización sin
                autorización expresa.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-zinc-900">
                7. Limitación de responsabilidad
              </h2>
              <p>
                Eden 3D no será responsable por el uso indebido de los
                productos adquiridos. Algunos artículos son decorativos y
                no están destinados a uso funcional o de impacto.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-zinc-900">
                8. Modificaciones
              </h2>
              <p>
                Nos reservamos el derecho de actualizar o modificar estos
                términos en cualquier momento. Las modificaciones entrarán
                en vigencia desde su publicación en el sitio web.
              </p>
            </div>

          </div>

          <footer className="mt-12">
            <p className="text-sm text-zinc-500">
              Si tienes dudas sobre estos términos, puedes escribirnos a:
            </p>
            <p className="mt-2 font-medium text-zinc-900">
              EdenCorres@gmail.com
            </p>
          </footer>
        </article>
      </div>
    </section>
  );
};

export default TerminosCondiciones;