import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["400","900"], /*400 = Regular, 900 = Black */
  subsets: ["latin"],
});

const Footer = () => {
    return (
      <footer className="border-t border-gray-200 mt-10">
      <div className="container mx-45 px-1 py-4  flex justify-between grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-6">
        
        {/* Texto grande */}
        <div className="col-span-1 lg:col-span-2">
          <h1 className={`${inter.className} text-4xl md:text-8xl font-black  leading-20`}>
            EL FUTURO <br />
            ESTA <br />
            IMPRESO
          </h1>
      </div>

        {/* Columna redes */}
        <div className="col-span-1">
          <h3 className="font-semibold mb-4">Síguenos</h3>
          <ul>
            <li>
              <a
                href="https://www.instagram.com/eden.3d_/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                <span className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                  @eden_3d_
                </span>
              </a>
            </li>
          </ul>
        </div>

        {/* Columna explorar */}
        <div className="col-span-1">
          <h3 className="font-semibold mb-4">Explora</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">Políticas de privacidad</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Perfil</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Sobre nosotros</a>
            </li>
          </ul>
        </div>

        {/* Columna contacto */}
        <div className="col-span-1">
          <h3 className=" font-semibold mb-4">Contáctanos</h3>
          <ul className="space-y-2">
            <li>
              <a href="mailto:EdenCorreos@gmail.com" className="hover:underline">
                EdenCorreos@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+931107284" className="hover:underline">
                +93 110 7284
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Parte inferior */}
      <div className="border-t border-gray-200 mt-2 py-2 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 px-46">
        <p>© 2025 Eden.</p>
        <p>Todos Los Derechos Reservados</p>
      </div>
    </footer>
  );
};
   
export default Footer;