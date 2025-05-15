      {/* Secciu00f3n de casos de uso */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Cu00f3mo utilizan nuestra plataforma
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              Soluciones para diferentes industrias y necesidades
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Caso de uso 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="p-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-cyan-100 dark:bg-cyan-800 rounded-md p-3">
                    <svg className="h-8 w-8 text-cyan-700 dark:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="ml-4 text-xl font-medium text-gray-900 dark:text-white">Sector retail y e-commerce</h3>
                </div>
                <div className="mt-4 text-gray-600 dark:text-gray-400 space-y-4">
                  <p>Las empresas de retail utilizan nuestra plataforma para:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Monitorear opiniones sobre productos y servicios</li>
                    <li>Identificar oportunidades de mejora basadas en feedback</li>
                    <li>Responder ru00e1pidamente a comentarios negativos</li>
                    <li>Medir sentimiento en campau00f1as de marketing</li>
                  </ul>
                  <p className="italic mt-4">"Sofia IA nos ayudu00f3 a identificar un problema con nuestro proceso de devoluciones antes de que se convirtiera en una crisis mayor." - Comercio Moderno</p>
                </div>
              </div>
            </div>
            
            {/* Caso de uso 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="p-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-cyan-100 dark:bg-cyan-800 rounded-md p-3">
                    <svg className="h-8 w-8 text-cyan-700 dark:text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="ml-4 text-xl font-medium text-gray-900 dark:text-white">Sector hospitalidad y turismo</h3>
                </div>
                <div className="mt-4 text-gray-600 dark:text-gray-400 space-y-4">
                  <p>Hoteles, restaurantes y servicios turu00edsticos utilizan nuestra plataforma para:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Monitorear reseu00f1as en plataformas especializadas</li>
                    <li>Detectar problemas recurrentes en la experiencia del cliente</li>
                    <li>Analizar sentimiento en temporadas altas vs. bajas</li>
                    <li>Comparar rendimiento contra competidores</li>
                  </ul>
                  <p className="italic mt-4">"Desde que implementamos Reputaciu00f3n Online, nuestra calificaciu00f3n en plataformas de reseu00f1as aumentu00f3 de 3.8 a 4.6 estrellas." - Hotel Ejecutivo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer/CTA */}
      <section className="bg-cyan-600 dark:bg-cyan-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">u00bfListo para mejorar tu reputaciu00f3n digital?</span>
            <span className="block text-cyan-200">Comienza hoy mismo.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/registro"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-cyan-600 bg-white hover:bg-gray-50"
              >
                Registrarse
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-800 hover:bg-cyan-900"
              >
                Iniciar sesiu00f3n
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <h2 className="text-xl font-bold text-cyan-600 dark:text-cyan-400">Reputaciu00f3n Online</h2>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-base text-gray-500 dark:text-gray-400">&copy; 2025 Reputaciu00f3n Online. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
