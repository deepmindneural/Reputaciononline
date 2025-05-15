  {/* Planes de precios */}
  <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {/* Plan Básico */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Plan Básico</h3>
          <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
            <span className="text-3xl font-extrabold tracking-tight">$299.000</span>
            <span className="ml-1 text-xl font-semibold">/mes</span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Ideal para pequeñas empresas y emprendedores</p>
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Monitoreo de 3 redes sociales</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">50 menciones diarias</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Reportes semanales</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Acceso básico a Sofia IA</p>
            </li>
          </ul>
          <div className="mt-8">
            <Link href="/registro" className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700">
              Comenzar ahora
            </Link>
          </div>
        </div>
      </div>

      {/* Plan Premium */}
      <div className="bg-white dark:bg-gray-800 border-2 border-cyan-500 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden scale-105">
        <div className="absolute inset-x-0 transform translate-y-px">
          <div className="flex justify-center transform -translate-y-1/2">
            <span className="inline-flex rounded-full bg-cyan-600 px-4 py-1 text-sm font-semibold tracking-wider uppercase text-white">
              Más popular
            </span>
          </div>
        </div>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Plan Premium</h3>
          <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
            <span className="text-3xl font-extrabold tracking-tight">$599.000</span>
            <span className="ml-1 text-xl font-semibold">/mes</span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Perfecto para medianas empresas y crecimiento</p>
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Monitoreo de todas las redes sociales</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">200 menciones diarias</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Reportes diarios</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Acceso completo a Sofia IA</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Alertas en tiempo real</p>
            </li>
          </ul>
          <div className="mt-8">
            <Link href="/registro" className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700">
              Comenzar ahora
            </Link>
          </div>
        </div>
      </div>

      {/* Plan Empresarial */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Plan Empresarial</h3>
          <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
            <span className="text-3xl font-extrabold tracking-tight">$999.000</span>
            <span className="ml-1 text-xl font-semibold">/mes</span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Para grandes empresas y marcas establecidas</p>
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Monitoreo ilimitado de redes</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Menciones ilimitadas</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Reportes personalizados</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Acceso prioritario a Sofia IA</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Gestión de crisis 24/7</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Consultor dedicado</p>
            </li>
          </ul>
          <div className="mt-8">
            <Link href="/registro" className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700">
              Comenzar ahora
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Sección de canales de monitoreo */}
  <section className="py-16 bg-white dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Redes sociales y canales monitoreados
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
          Vigilamos todas las plataformas relevantes para tu marca
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
        <div className="flex flex-col items-center">
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
            <FaTwitter className="h-10 w-10 text-blue-400" />
          </div>
          <span className="mt-2 text-gray-700 dark:text-gray-300">X (Twitter)</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
            <FaFacebook className="h-10 w-10 text-blue-600" />
          </div>
          <span className="mt-2 text-gray-700 dark:text-gray-300">Facebook</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="p-4 bg-pink-100 dark:bg-pink-900 rounded-full">
            <FaInstagram className="h-10 w-10 text-pink-500" />
          </div>
          <span className="mt-2 text-gray-700 dark:text-gray-300">Instagram</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
            <FaLinkedin className="h-10 w-10 text-blue-700" />
          </div>
          <span className="mt-2 text-gray-700 dark:text-gray-300">LinkedIn</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
            <FaTiktok className="h-10 w-10 text-black dark:text-white" />
          </div>
          <span className="mt-2 text-gray-700 dark:text-gray-300">TikTok</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="p-4 bg-cyan-100 dark:bg-cyan-900 rounded-full">
            <svg className="h-10 w-10 text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.5 2H14V7H5V15.5H5.82L6 16.5H3V19H15V16H8V10H21V13.53C21.17 13.62 21.33 13.72 21.5 13.83V7L17.5 2ZM16 5V3.5L18.5 6H16V5Z" />
              <path d="M16.5 10C14 10 12 12 12 14.5C12 17 14 19 16.5 19C19 19 21 17 21 14.5C21 12 19 10 16.5 10ZM16.5 16.5L14 13.9L14.7 13.05L16.07 14.69L19.24 12.03L19.95 12.87L16.5 16.5Z" />
            </svg>
          </div>
          <span className="mt-2 text-gray-700 dark:text-gray-300">Noticias</span>
        </div>
      </div>
    </div>
  </section>

  {/* Sección de testimonios */}
  <section id="testimonios" className="py-16 bg-gray-50 dark:bg-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Lo que dicen nuestros clientes
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
          Empresas que ya confían en nuestra plataforma
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {/* Testimonio 1 */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="text-cyan-500 mb-4">
              <FaQuoteLeft size={30} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              "Desde que empezamos a utilizar Reputación Online, hemos incrementado nuestra capacidad de respuesta ante comentarios negativos. El sistema de alertas es increíblemente útil."
            </p>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img className="h-12 w-12 rounded-full" src="https://randomuser.me/api/portraits/women/1.jpg" alt="Foto de cliente" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">María Rodríguez</h4>
                <p className="text-gray-500 dark:text-gray-400">Directora de Marketing, InnovaTech</p>
              </div>
            </div>
            <div className="mt-4 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className="text-yellow-400" />
              ))}
            </div>
          </div>
        </div>

        {/* Testimonio 2 */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="text-cyan-500 mb-4">
              <FaQuoteLeft size={30} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              "Sofia, la IA de Reputación Online, ha transformado la forma en que gestionamos nuestra imagen. Sus recomendaciones son precisas y nos han ayudado a mejorar significativamente."
            </p>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img className="h-12 w-12 rounded-full" src="https://randomuser.me/api/portraits/men/1.jpg" alt="Foto de cliente" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Carlos Gómez</h4>
                <p className="text-gray-500 dark:text-gray-400">CEO, LogísticaExpress</p>
              </div>
            </div>
            <div className="mt-4 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className="text-yellow-400" />
              ))}
            </div>
          </div>
        </div>

        {/* Testimonio 3 */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="text-cyan-500 mb-4">
              <FaQuoteLeft size={30} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              "El monitoreo de todas las redes sociales en una sola plataforma nos ha ahorrado tiempo y recursos. El análisis de sentimiento es sorprendentemente preciso."
            </p>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img className="h-12 w-12 rounded-full" src="https://randomuser.me/api/portraits/women/2.jpg" alt="Foto de cliente" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Ana Martínez</h4>
                <p className="text-gray-500 dark:text-gray-400">Gerente de Comunicaciones, FuturoSalud</p>
              </div>
            </div>
            <div className="mt-4 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className="text-yellow-400" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Footer */}
  <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex justify-center md:justify-start">
          <h2 className="text-xl font-bold text-cyan-600 dark:text-cyan-400">Reputación Online</h2>
        </div>
        <div className="mt-8 md:mt-0">
          <p className="text-center text-base text-gray-500 dark:text-gray-400">&copy; 2025 Reputación Online. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  </footer>
