      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Confirmar eliminación
              </h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700 dark:text-gray-300">
                ¿Estás seguro de que deseas eliminar esta transacción? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md mr-2 hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteTransaccion}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de autenticación con redes sociales */}
      {showSocialAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Conectar con redes sociales
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
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Conecta la plataforma con las redes sociales para monitorear menciones y gestionar reportes.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleSocialAuth('facebook')}
                  disabled={isAuthenticating}
                  className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticating && authPlatform === 'facebook' ? (
                    <span>Conectando...</span>
                  ) : (
                    <>
                      <FaFacebook className="mr-2" />
                      <span>Conectar con Facebook</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleSocialAuth('twitter')}
                  disabled={isAuthenticating}
                  className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-400 hover:bg-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticating && authPlatform === 'twitter' ? (
                    <span>Conectando...</span>
                  ) : (
                    <>
                      <FaTwitter className="mr-2" />
                      <span>Conectar con Twitter/X</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleSocialAuth('instagram')}
                  disabled={isAuthenticating}
                  className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticating && authPlatform === 'instagram' ? (
                    <span>Conectando...</span>
                  ) : (
                    <>
                      <FaInstagram className="mr-2" />
                      <span>Conectar con Instagram</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleSocialAuth('linkedin')}
                  disabled={isAuthenticating}
                  className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticating && authPlatform === 'linkedin' ? (
                    <span>Conectando...</span>
                  ) : (
                    <>
                      <FaLinkedin className="mr-2" />
                      <span>Conectar con LinkedIn</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right">
              <button
                type="button"
                onClick={() => setShowSocialAuthModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
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
