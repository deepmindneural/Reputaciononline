  return (
    <div className="py-6 px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Créditos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra los créditos y transacciones de todos los usuarios
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <button 
            onClick={handleMostrarAjuste}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center transition-colors"
          >
            <FaMoneyBillWave className="mr-2" />
            Realizar ajuste
          </button>
          <button 
            onClick={() => setShowSocialAuthModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center transition-colors"
          >
            <FaFacebook className="mr-2" />
            Conectar redes
          </button>
          <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center transition-colors">
            <FaDownload className="mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <FaCreditCard className="text-green-600 dark:text-green-400 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Créditos Disponibles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCreditos.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <FaMoneyBillWave className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Compras</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCompras.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 mr-4">
              <FaExchangeAlt className="text-red-600 dark:text-red-400 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Consumos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.abs(totalConsumos).toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
              <FaUserCircle className="text-purple-600 dark:text-purple-400 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Usuarios con Créditos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{usuarios.filter(u => u.creditosDisponibles > 0).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actividad Mensual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={estadisticasMensuales}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value: any) => new Intl.NumberFormat('es-CO').format(Math.abs(Number(value)))} />
              <Legend />
              <Bar dataKey="compras" name="Compras" fill="#4F46E5" />
              <Bar dataKey="consumos" name="Consumos" fill="#EF4444" />
              <Bar dataKey="total" name="Balance" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribución de Créditos por Plan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribucionPorPlan}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {distribucionPorPlan.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => new Intl.NumberFormat('es-CO').format(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Redes sociales conectadas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Redes Sociales Conectadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => {
            const isConnected = socialTokens.some(t => t.platform === platform);
            const token = socialTokens.find(t => t.platform === platform);
            const expiryDate = token ? new Date(token.expiresAt).toLocaleDateString('es-CO') : null;
            
            return (
              <div key={platform} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {platform === 'facebook' && <FaFacebook className="text-blue-600 mr-2 text-xl" />}
                    {platform === 'twitter' && <FaTwitter className="text-blue-400 mr-2 text-xl" />}
                    {platform === 'instagram' && <FaInstagram className="text-pink-600 mr-2 text-xl" />}
                    {platform === 'linkedin' && <FaLinkedin className="text-blue-700 mr-2 text-xl" />}
                    <span className="font-medium capitalize">{platform}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {isConnected ? 'Conectado' : 'No conectado'}
                  </span>
                </div>
                {isConnected && expiryDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Expira: {expiryDate}</p>
                )}
                <button
                  onClick={() => isConnected ? null : handleSocialAuth(platform as any)}
                  disabled={isConnected}
                  className={`mt-2 w-full py-1 px-2 text-xs font-medium rounded ${isConnected ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  {isConnected ? 'Conectado' : 'Conectar'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="filtroTipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de transacción</label>
            <select
              id="filtroTipo"
              className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="compra">Compras</option>
              <option value="consumo">Consumos</option>
              <option value="ajuste">Ajustes</option>
              <option value="reembolso">Reembolsos</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="filtroFecha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Período</label>
            <select
              id="filtroFecha"
              className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            >
              <option value="todos">Todo el tiempo</option>
              <option value="ultimo-mes">Último mes</option>
              <option value="ultimos-3-meses">Últimos 3 meses</option>
              <option value="ultimo-ano">Último año</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="filtroPlan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plan</label>
            <select
              id="filtroPlan"
              className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filtroPlan}
              onChange={(e) => setFiltroPlan(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="Básico">Básico</option>
              <option value="Profesional">Profesional</option>
              <option value="Empresarial">Empresarial</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="filtroUsuario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                id="filtroUsuario"
                placeholder="Buscar por nombre"
                className="pl-10 p-2.5 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
