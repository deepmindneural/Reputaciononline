      {/* Secciu00f3n de canales de monitoreo */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Redes sociales y canales monitoreados
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              Vigilamos todas las plataformas relevantes para tu marca con anu00e1lisis en tiempo real e histu00f3rico
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FaTwitter className="h-10 w-10 text-blue-400" />
              </div>
              <span className="mt-2 text-gray-700 dark:text-gray-300">X (Twitter)</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monitoreo completo de menciones, hashtags y tendencias</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FaFacebook className="h-10 w-10 text-blue-600" />
              </div>
              <span className="mt-2 text-gray-700 dark:text-gray-300">Facebook</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Seguimiento de comentarios en pu00e1ginas y grupos relevantes</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="p-4 bg-pink-100 dark:bg-pink-900 rounded-full">
                <FaInstagram className="h-10 w-10 text-pink-500" />
              </div>
              <span className="mt-2 text-gray-700 dark:text-gray-300">Instagram</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Anu00e1lisis de contenido visual y menciones en stories</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FaLinkedin className="h-10 w-10 text-blue-700" />
              </div>
              <span className="mt-2 text-gray-700 dark:text-gray-300">LinkedIn</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monitoreo de contenido profesional y corporativo</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                <FaTiktok className="h-10 w-10 text-black dark:text-white" />
              </div>
              <span className="mt-2 text-gray-700 dark:text-gray-300">TikTok</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Seguimiento de tendencias virales y opiniones</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="p-4 bg-cyan-100 dark:bg-cyan-900 rounded-full">
                <svg className="h-10 w-10 text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5 2H14V7H5V15.5H5.82L6 16.5H3V19H15V16H8V10H21V13.53C21.17 13.62 21.33 13.72 21.5 13.83V7L17.5 2ZM16 5V3.5L18.5 6H16V5Z" />
                  <path d="M16.5 10C14 10 12 12 12 14.5C12 17 14 19 16.5 19C19 19 21 17 21 14.5C21 12 19 10 16.5 10ZM16.5 16.5L14 13.9L14.7 13.05L16.07 14.69L19.24 12.03L19.95 12.87L16.5 16.5Z" />
                </svg>
              </div>
              <span className="mt-2 text-gray-700 dark:text-gray-300">Noticias</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monitoreo de medios digitales y prensa online</p>
            </div>
          </div>
        </div>
      </section>

      {/* Secciu00f3n de testimonios */}
      <section id="testimonios" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Lo que dicen nuestros clientes
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              Casos de u00e9xito y testimonios de quienes confu00edan en nuestra plataforma
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Testimonio 1 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-cyan-500 mr-4">
                  <FaQuoteLeft className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <div className="flex mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 h-4 w-4" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                "Reputaciu00f3n Online nos ha permitido anticiparnos a crisis potenciales y mantener una comunicaciu00f3n efectiva con nuestra audiencia. Su herramienta Sofia IA ha sido fundamental para interpretar los datos correctamente y tomar decisiones estratu00e9gicas a tiempo."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-cyan-600 font-bold">MC</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Maru00eda Camargo</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Directora de Comunicaciones, Empresa Verde</p>
                </div>
              </div>
            </div>

            {/* Testimonio 2 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-cyan-500 mr-4">
                  <FaQuoteLeft className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <div className="flex mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 h-4 w-4" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                "El monitoreo en tiempo real de todas las redes sociales nos ha dado una ventaja competitiva enorme. Ahora podemos responder ru00e1pidamente a las tendencias y mejorar nuestra estrategia digital de forma constante. Sofia IA detecta patrones que seru00edan imposibles de ver manualmente."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-cyan-600 font-bold">JR</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Juan Ramu00edrez</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Gerente de Marketing, Grupo Innovador</p>
                </div>
              </div>
            </div>

            {/* Testimonio 3 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-cyan-500 mr-4">
                  <FaQuoteLeft className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <div className="flex mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 h-4 w-4" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                "Los informes personalizados y el anu00e1lisis de sentimiento han sido claves para entender cu00f3mo nos percibe el pu00fablico. Sofia IA detectu00f3 patrones negativos que pudimos corregir ru00e1pidamente. Gracias a Reputaciu00f3n Online, hemos mejorado significativamente nuestra imagen de marca."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-cyan-600 font-bold">LG</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Laura Gu00f3mez</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">CEO, Consultores Digitales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Secciu00f3n de beneficios */}
      <section className="py-16 bg-cyan-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Beneficios de usar nuestra plataforma
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              Invertir en la gestiu00f3n de tu reputaciu00f3n digital genera resultados tangibles
            </p>
          </div>

          <div className="mt-16">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">75% de aumento en retenciu00f3n de clientes</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  Las empresas que gestionan activamente su reputaciu00f3n online logran retener a 3 de cada 4 clientes insatisfechos.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">63% de incremento en ingresos</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  Las marcas con una reputaciu00f3n digital positiva generan en promedio un 63% mu00e1s de ingresos que sus competidores con menor visibilidad.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">41% mejora en conversiu00f3n</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  Las tasas de conversiu00f3n mejoran significativamente cuando los clientes potenciales encuentran comentarios positivos y una su00f3lida presencia digital.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">87% resoluciu00f3n de crisis</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  Nuestros clientes logran resolver satisfactoriamente el 87% de las crisis de reputaciu00f3n en menos de 24 horas con nuestro sistema de alertas.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
