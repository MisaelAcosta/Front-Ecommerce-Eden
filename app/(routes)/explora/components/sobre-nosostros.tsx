"use client";

const SobreNosotros = () => {
  return (
    <section className="w-full  bg-zinc-200/70 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-4xl mt-17 sm:mt-10">
        <article className="rounded-md bg-white p-6 sm:p-10 shadow-sm">
          <header className="text-sm text-zinc-500">
            <p>Eden 3D</p>
            <p>Sobre nosotros</p>
          </header>

          <div className="mt-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900">
              El futuro está impreso
            </h1>
          </div>

          <div className="mt-8 space-y-6 text-[15px] leading-7 text-zinc-700">
            
            <p>
              En Eden 3D diseñamos y fabricamos productos mediante impresión
              3D, combinando creatividad, funcionalidad y detalle. Creemos que
              cada pieza puede ser más que un objeto: puede representar una
              idea, una pasión o una identidad.
            </p>

            <p>
              Trabajamos con tecnología de fabricación aditiva para crear
              artículos decorativos, organizadores, soportes, figuras y
              productos personalizados. Cada pieza es producida con precisión,
              utilizando materiales de calidad y procesos cuidadosamente
              calibrados.
            </p>

            <p>
              Nos inspira la cultura geek, el diseño funcional y la
              personalización. Desde piezas inspiradas en universos icónicos
              hasta soluciones prácticas para el día a día, nuestro objetivo es
              ofrecer productos únicos que no se encuentran en tiendas
              tradicionales.
            </p>

            <p>
              Fabricamos en Chile y trabajamos bajo pedido para asegurar un
              mejor control de calidad y reducir desperdicio. Esto nos permite
              optimizar cada impresión y entregar productos hechos con
              dedicación.
            </p>

            <p>
              Eden 3D no es solo una tienda, es un espacio donde las ideas se
              transforman en objetos reales. Si puedes imaginarlo, podemos
              imprimirlo.
            </p>

          </div>

          <footer className="mt-12">
            <p className="font-medium text-zinc-900">
              Eden 3D
            </p>
            <p className="text-sm text-zinc-500">
              Diseño • Impresión • Personalización
            </p>
          </footer>
        </article>
      </div>
    </section>
  );
};

export default SobreNosotros;