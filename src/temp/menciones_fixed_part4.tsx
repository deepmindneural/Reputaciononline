      {/* Modal de autenticación de redes sociales */}
      {showSocialAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Conecta tus redes sociales
              </h3>
              <button 
                onClick={() => setShowSocialAuthModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Conecta tus cuentas de redes sociales para monitorear menciones y gestionar tu reputación online.
              </p>
              
              <SocialMediaAuth 
                onSuccess={handleAuthSuccess}
                showTitle={false}
                buttonVariant="compact"
              />
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">¿Por qué conectar tus redes sociales?</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Monitoreo en tiempo real de menciones</li>
                  <li>• Análisis de sentimiento de comentarios</li>
                  <li>• Alertas sobre menciones importantes</li>
                  <li>• Gestión centralizada de tu reputación</li>
                </ul>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right">
              <button
                type="button"
                onClick={() => setShowSocialAuthModal(false)}
                className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
