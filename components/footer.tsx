import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["400","900"],
  subsets: ["latin"],
});

const Footer = () => {
    return (
      <footer className="border-t border-gray-200 mt-10">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Contenido principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Texto grande */}
            <div className="md:col-span-2 lg:col-span-2">
              <h1 className={`${inter.className} text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight`}>
                EL FUTURO <br />
                ESTA <br />
                IMPRESO
              </h1>
            </div>

            {/* Columna redes */}
            <div className="col-span-1">
              <h3 className="font-semibold mb-4 text-lg">Síguenos</h3>
              <ul>
                <li>
                  <a
                    href="https://www.instagram.com/eden.3d_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:underline transition-colors"
                  >
                    <span className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full text-sm font-medium transition-colors">
                      @eden_3d_
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna explorar + contacto */}
            <div className="col-span-1 space-y-8">
              {/* Explorar */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">Explora</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900 hover:underline transition-colors">
                      Políticas de privacidad
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900 hover:underline transition-colors">
                      Perfil
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900 hover:underline transition-colors">
                      Sobre nosotros
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contacto */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">Contáctanos</h3>
                <ul className="space-y-3">
                  <li>
                    <a 
                      href="mailto:EdenCorreos@gmail.com" 
                      className="text-gray-600 hover:text-gray-900 hover:underline transition-colors break-all"
                    >
                      EdenCorreos@gmail.com
                    </a>
                  </li>
                  <li>
                    <a 
                      href="tel:+931107284" 
                      className="text-gray-600 hover:text-gray-900 hover:underline transition-colors"
                    >
                      +93 110 7284
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Parte inferior */}
        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 gap-2">
              <p>© 2025 Eden.</p>
              <p>Todos Los Derechos Reservados</p>
            </div>
          </div>
        </div>
      </footer>
    );
};
   
export default Footer;