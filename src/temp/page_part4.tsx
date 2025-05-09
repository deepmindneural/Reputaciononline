      {/* Tabla de transacciones */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Historial de transacciones</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {transaccionesFiltradas.length} transacciones encontradas
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usuario</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cantidad</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {transaccionesFiltradas.map((transaccion) => (
                <tr key={transaccion.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">#{transaccion.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{transaccion.usuario}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipoClasses(transaccion.tipo)}`}>
                      {getTipoLabel(transaccion.tipo)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={transaccion.cantidad > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {transaccion.cantidad > 0 ? '+' : ''}{transaccion.cantidad.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaccion.fecha).toLocaleString('es-CO', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClasses(transaccion.estado)}`}>
                      {getEstadoLabel(transaccion.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleVerDetalles(transaccion)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                      title="Ver detalles"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleConfirmDelete(transaccion.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Eliminar transacciu00f3n"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {transaccionesFiltradas.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No se encontraron transacciones con los filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Modal de detalles de transacciu00f3n */}
      {showModal && transaccionActual && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Detalles de la transacciu00f3n #{transaccionActual.id}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTipoClasses(transaccionActual.tipo)}`}>
                    {getTipoLabel(transaccionActual.tipo)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoClasses(transaccionActual.estado)}`}>
                    {getEstadoLabel(transaccionActual.estado)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Usuario:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{transaccionActual.usuario}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Cantidad:</span>
                  <span className={`text-sm ${transaccionActual.cantidad > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {transaccionActual.cantidad > 0 ? '+' : ''}{transaccionActual.cantidad.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha:</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(transaccionActual.fecha).toLocaleString('es-CO')}
                  </span>
                </div>
                {transaccionActual.plan && (
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Plan:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{transaccionActual.plan}</span>
                  </div>
                )}
                {transaccionActual.metodoPago && (
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Mu00e9todo de pago:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{transaccionActual.metodoPago}</span>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Descripciu00f3n:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{transaccionActual.descripcion}</p>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-right">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de ajuste de cru00e9ditos */}
      {showAjusteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Ajuste de cru00e9ditos
              </h3>
              <button 
                onClick={() => setShowAjusteModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Usuario
                </label>
                <select
                  id="usuario"
                  name="usuario"
                  className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={ajusteData.usuario}
                  onChange={handleAjusteChange}
                  required
                >
                  <option value="">Seleccionar usuario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.nombre}>
                      {usuario.nombre} - {usuario.correo}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de ajuste
                </label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="ajuste"
                      name="tipo"
                      value="ajuste"
                      checked={ajusteData.tipo === 'ajuste'}
                      onChange={handleAjusteChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor="ajuste" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Agregar cru00e9ditos
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="reembolso"
                      name="tipo"
                      value="reembolso"
                      checked={ajusteData.tipo === 'reembolso'}
                      onChange={handleAjusteChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor="reembolso" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Restar cru00e9ditos
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cantidad
                </label>
                <input
                  type="number"
                  id="cantidad"
                  name="cantidad"
                  value={ajusteData.cantidad}
                  onChange={handleAjusteChange}
                  className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="1"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripciu00f3n / Motivo
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows={3}
                  value={ajusteData.descripcion}
                  onChange={handleAjusteChange}
                  className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                ></textarea>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right">
              <button
                type="button"
                onClick={() => setShowAjusteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md mr-2 hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleGuardarAjuste}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
