export default function MencionesPage() {
  const [filteredMenciones, setFilteredMenciones] = useState(menciones);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [selectedSentiment, setSelectedSentiment] = useState<string>('todos');
  const [showSocialAuthModal, setShowSocialAuthModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'recent' | 'relevance'>('recent');
  const [connectedPlatforms, setConnectedPlatforms] = useState<{
    facebook: boolean;
    twitter: boolean;
    instagram: boolean;
    linkedin: boolean;
  }>({ facebook: false, twitter: false, instagram: false, linkedin: false });

  // Verificar quu00e9 redes sociales estu00e1n conectadas al cargar la pu00e1gina
  useEffect(() => {
    const savedTokens = localStorage.getItem('socialTokens');
    if (savedTokens) {
      try {
        const tokens = JSON.parse(savedTokens);
        const connected = {
          facebook: false,
          twitter: false,
          instagram: false,
          linkedin: false
        };
        
        tokens.forEach((token: any) => {
          connected[token.platform as keyof typeof connected] = true;
        });
        
        setConnectedPlatforms(connected);
      } catch (e) {
        console.error('Error parsing social tokens:', e);
      }
    }
  }, []);

  // Manejar la autenticaciu00f3n exitosa de redes sociales
  const handleAuthSuccess = (platform: string) => {
    setConnectedPlatforms(prev => ({
      ...prev,
      [platform]: true
    }));
    setShowSocialAuthModal(false);
  };

  // Aplicar filtros cuando cambian los criterios
  useEffect(() => {
    let resultado = [...menciones];
    
    // Filtrar por consulta de bu00fasqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      resultado = resultado.filter(mencion => {
        return (
          mencion.content.toLowerCase().includes(query) ||
          mencion.author.toLowerCase().includes(query) ||
          (mencion.authorUsername && mencion.authorUsername.toLowerCase().includes(query))
        );
      });
    }
    
    // Filtrar por redes seleccionadas
    if (selectedNetworks.length > 0) {
      resultado = resultado.filter(mencion => selectedNetworks.includes(mencion.network));
    }
    
    // Filtrar por sentimiento
    if (selectedSentiment !== 'todos') {
      resultado = resultado.filter(mencion => mencion.sentiment === selectedSentiment);
    }
    
    // Ordenar resultados
    if (sortBy === 'recent') {
      // Ya estu00e1n ordenados por fecha en los datos de ejemplo
    } else if (sortBy === 'relevance') {
      resultado.sort((a, b) => b.relevance - a.relevance);
    }
    
    setFilteredMenciones(resultado);
  }, [searchQuery, selectedNetworks, selectedSentiment, sortBy]);

  // Alternar la selecciu00f3n de redes
  const toggleNetwork = (network: string) => {
    setSelectedNetworks(prev => {
      if (prev.includes(network)) {
        return prev.filter(n => n !== network);
      } else {
        return [...prev, network];
      }
    });
  };

  return (
    <div className="py-6 px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menciones</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitorea todas las menciones en redes sociales y noticias
          </p>
        </div>
        
        {/* Estado de conexiu00f3n de redes sociales */}
        <div className="mt-4 md:mt-0 flex items-center">
          {Object.values(connectedPlatforms).some(val => val) ? (
            <div className="flex items-center mr-4">
              <div className="flex -space-x-2 mr-2">
                {connectedPlatforms.facebook && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-white">
                    <FaFacebook className="text-[#1877F2]" />
                  </div>
                )}
                {connectedPlatforms.twitter && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-white">
                    <FaTwitter className="text-[#1DA1F2]" />
                  </div>
                )}
                {connectedPlatforms.instagram && (
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center ring-2 ring-white">
                    <FaInstagram className="text-[#E1306C]" />
                  </div>
                )}
                {connectedPlatforms.linkedin && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-white">
                    <FaLinkedin className="text-[#0077B5]" />
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Object.values(connectedPlatforms).filter(Boolean).length} redes conectadas
              </span>
            </div>
          ) : (
            <div className="flex items-center text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-md mr-4">
              <FaExclamationCircle className="mr-2" />
              <span className="text-sm">Sin redes conectadas</span>
            </div>
          )}
          
          <button
            onClick={() => setShowSocialAuthModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center transition-colors"
          >
            Conectar redes
          </button>
        </div>
      </div>
      
      {/* Controles de filtrado y bu00fasqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Buscador */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Buscar en menciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filtro de redes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Redes</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggleNetwork('x')}
                className={`px-2 py-1 text-xs rounded-full flex items-center ${selectedNetworks.includes('x') ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                <img src="/images/social/x-logo.png" alt="X" className="w-3 h-3 mr-1" />
                X
              </button>
              <button
                onClick={() => toggleNetwork('facebook')}
                className={`px-2 py-1 text-xs rounded-full flex items-center ${selectedNetworks.includes('facebook') ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                <FaFacebook className="mr-1" />
                Facebook
              </button>
              <button
                onClick={() => toggleNetwork('instagram')}
                className={`px-2 py-1 text-xs rounded-full flex items-center ${selectedNetworks.includes('instagram') ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                <FaInstagram className="mr-1" />
                Instagram
              </button>
              <button
                onClick={() => toggleNetwork('linkedin')}
                className={`px-2 py-1 text-xs rounded-full flex items-center ${selectedNetworks.includes('linkedin') ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                <FaLinkedin className="mr-1" />
                LinkedIn
              </button>
              <button
                onClick={() => toggleNetwork('news')}
                className={`px-2 py-1 text-xs rounded-full flex items-center ${selectedNetworks.includes('news') ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                <FaNewspaper className="mr-1" />
                Noticias
              </button>
            </div>
          </div>
          
          {/* Filtro de sentimiento */}
          <div>
            <label htmlFor="filterSentiment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sentimiento
            </label>
            <select
              id="filterSentiment"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="positivo">Positivo</option>
              <option value="neutral">Neutral</option>
              <option value="negativo">Negativo</option>
            </select>
          </div>
          
          {/* Controles adicionales */}
          <div className="flex items-end gap-2">
            <button 
              onClick={() => setSortBy(sortBy === 'recent' ? 'relevance' : 'recent')}
              className="p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
              title={sortBy === 'recent' ? 'Ordenar por relevancia' : 'Ordenar por recientes'}
            >
              <FaSort className="mr-1" />
              {sortBy === 'recent' ? 'Recientes' : 'Relevancia'}
            </button>
            
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white'}`}
                title="Vista de lista"
              >
                <FaListAlt />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white'}`}
                title="Vista de cuadru00edcula"
              >
                <FaTh />
              </button>
            </div>
            
            <button 
              className="p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
              title="Exportar menciones"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de menciones */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Menciones recientes 
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              {filteredMenciones.length} resultados
            </span>
          </h2>
          
          <div className="flex items-center">
            <div className="flex -space-x-1 mr-2">
              {Array.from(new Set(filteredMenciones.map(m => m.network))).map(network => (
                <div key={network} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-white">
                  {network === 'x' && <img src="/images/social/x-logo.png" alt="X" className="w-3 h-3" />}
                  {network === 'facebook' && <FaFacebook className="text-[#1877F2] text-xs" />}
                  {network === 'instagram' && <FaInstagram className="text-[#E1306C] text-xs" />}
                  {network === 'linkedin' && <FaLinkedin className="text-[#0077B5] text-xs" />}
                  {network === 'news' && <FaNewspaper className="text-gray-500 text-xs" />}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Array.from(new Set(filteredMenciones.map(m => m.network))).length} fuentes
            </span>
          </div>
        </div>
        
        {/* Grid o lista de menciones */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
          {filteredMenciones.length > 0 ? (
            filteredMenciones.map(mencion => (
              <MencionItem key={mencion.id} {...mencion} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No se encontraron menciones con los filtros aplicados.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedNetworks([]);
                  setSelectedSentiment('todos');
                }}
                className="mt-2 text-primary-500 hover:text-primary-600 text-sm font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
