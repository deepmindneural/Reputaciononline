  // Datos de ejemplo - Usuarios
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nombre: 'Ana Martu00ednez',
      correo: 'ana.martinez@ejemplo.com',
      plan: 'Profesional',
      creditosDisponibles: 14250
    },
    {
      id: 2,
      nombre: 'Carlos Ruiz',
      correo: 'carlos.ruiz@ejemplo.com',
      plan: 'Empresarial',
      creditosDisponibles: 48720
    },
    {
      id: 3,
      nombre: 'Laura Gu00f3mez',
      correo: 'laura.gomez@ejemplo.com',
      plan: 'Bu00e1sico',
      creditosDisponibles: 4125
    },
    {
      id: 4,
      nombre: 'Miguel Su00e1nchez',
      correo: 'miguel.sanchez@ejemplo.com',
      plan: 'Profesional',
      creditosDisponibles: 0
    },
    {
      id: 5,
      nombre: 'Sofu00eda Torres',
      correo: 'sofia.torres@ejemplo.com',
      plan: 'Empresarial',
      creditosDisponibles: 47500
    }
  ]);

  // Estadu00edsticas mensuales
  const [estadisticasMensuales, setEstadisticasMensuales] = useState<EstadisticaMensual[]>([
    { mes: 'Ene', compras: 450000, consumos: -320000, total: 130000 },
    { mes: 'Feb', compras: 520000, consumos: -380000, total: 140000 },
    { mes: 'Mar', compras: 600000, consumos: -420000, total: 180000 },
    { mes: 'Abr', compras: 580000, consumos: -390000, total: 190000 },
    { mes: 'May', compras: 670000, consumos: -460000, total: 210000 },
    { mes: 'Jun', compras: 720000, consumos: -510000, total: 210000 }
  ]);

  // Filtrado de transacciones
  const transaccionesFiltradas = transacciones.filter(transaccion => {
    // Filtro por tipo
    const matchesTipo = filtroTipo === 'todos' || transaccion.tipo === filtroTipo;
    
    // Filtro por fecha
    let fechaLimite = new Date();
    if (filtroFecha === 'ultimo-mes') {
      fechaLimite.setMonth(fechaLimite.getMonth() - 1);
    } else if (filtroFecha === 'ultimos-3-meses') {
      fechaLimite.setMonth(fechaLimite.getMonth() - 3);
    } else if (filtroFecha === 'ultimo-ano') {
      fechaLimite.setFullYear(fechaLimite.getFullYear() - 1);
    }
    const fechaTransaccion = new Date(transaccion.fecha);
    const matchesFecha = filtroFecha === 'todos' || fechaTransaccion >= fechaLimite;
    
    // Filtro por usuario
    const matchesUsuario = filtroUsuario === '' || 
                          transaccion.usuario.toLowerCase().includes(filtroUsuario.toLowerCase());
    
    // Filtro por plan
    const matchesPlan = filtroPlan === 'todos' || transaccion.plan === filtroPlan;
    
    return matchesTipo && matchesFecha && matchesUsuario && matchesPlan;
  });

  // Cu00e1lculos de estadu00edsticas
  const totalCreditos = usuarios.reduce((acc, usuario) => acc + usuario.creditosDisponibles, 0);
  const totalCompras = transacciones
    .filter(t => t.tipo === 'compra' && t.estado === 'completada')
    .reduce((acc, t) => acc + t.cantidad, 0);
  const totalConsumos = transacciones
    .filter(t => t.tipo === 'consumo')
    .reduce((acc, t) => acc + t.cantidad, 0);

  // Distribuciu00f3n de cru00e9ditos por plan
  const distribucionPorPlan = [
    { name: 'Bu00e1sico', value: usuarios.filter(u => u.plan === 'Bu00e1sico').reduce((acc, u) => acc + u.creditosDisponibles, 0) },
    { name: 'Profesional', value: usuarios.filter(u => u.plan === 'Profesional').reduce((acc, u) => acc + u.creditosDisponibles, 0) },
    { name: 'Empresarial', value: usuarios.filter(u => u.plan === 'Empresarial').reduce((acc, u) => acc + u.creditosDisponibles, 0) }
  ];

  // Colores para los gru00e1ficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Ver detalles de transacciu00f3n
  const handleVerDetalles = (transaccion: Transaccion) => {
    setTransaccionActual(transaccion);
    setShowModal(true);
  };

  // Mostrar modal de ajuste
  const handleMostrarAjuste = () => {
    setAjusteData({
      usuarioId: 0,
      usuario: '',
      cantidad: 0,
      descripcion: '',
      tipo: 'ajuste'
    });
    setShowAjusteModal(true);
  };

  // Manejar cambios en el formulario de ajuste
  const handleAjusteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'usuario') {
      const usuarioSeleccionado = usuarios.find(u => u.nombre === value);
      if (usuarioSeleccionado) {
        setAjusteData({
          ...ajusteData,
          usuario: value,
          usuarioId: usuarioSeleccionado.id
        });
      }
    } else if (name === 'cantidad') {
      setAjusteData({
        ...ajusteData,
        cantidad: parseInt(value) || 0
      });
    } else {
      setAjusteData({
        ...ajusteData,
        [name]: value
      });
    }
  };

  // Guardar ajuste
  const handleGuardarAjuste = () => {
    if (!ajusteData.usuario || !ajusteData.cantidad || !ajusteData.descripcion) {
      alert('Por favor, complete todos los campos');
      return;
    }

    // Crear nueva transacciu00f3n
    const nuevaTransaccion: Transaccion = {
      id: Math.max(...transacciones.map(t => t.id)) + 1,
      usuario: ajusteData.usuario,
      usuarioId: ajusteData.usuarioId,
      tipo: ajusteData.tipo as 'ajuste' | 'reembolso',
      cantidad: ajusteData.tipo === 'ajuste' ? Math.abs(ajusteData.cantidad) : -Math.abs(ajusteData.cantidad),
      fecha: new Date().toISOString(),
      descripcion: ajusteData.descripcion,
      estado: 'completada'
    };

    // Actualizar transacciones
    setTransacciones([...transacciones, nuevaTransaccion]);

    // Actualizar cru00e9ditos de usuario
    setUsuarios(usuarios.map(usuario => {
      if (usuario.id === ajusteData.usuarioId) {
        return {
          ...usuario,
          creditosDisponibles: usuario.creditosDisponibles + (ajusteData.tipo === 'ajuste' ? Math.abs(ajusteData.cantidad) : -Math.abs(ajusteData.cantidad))
        };
      }
      return usuario;
    }));

    setShowAjusteModal(false);
  };

  // Mostrar confirmaciu00f3n de eliminaciu00f3n
  const handleConfirmDelete = (id: number) => {
    setTransaccionToDelete(id);
    setShowDeleteModal(true);
  };

  // Eliminar transacciu00f3n
  const handleDeleteTransaccion = () => {
    if (transaccionToDelete !== null) {
      // Eliminar la transacciu00f3n
      setTransacciones(transacciones.filter(t => t.id !== transaccionToDelete));
      
      // Si la transacciu00f3n es un ajuste o reembolso, revertir los cru00e9ditos
      const transaccion = transacciones.find(t => t.id === transaccionToDelete);
      if (transaccion && (transaccion.tipo === 'ajuste' || transaccion.tipo === 'reembolso')) {
        setUsuarios(usuarios.map(usuario => {
          if (usuario.id === transaccion.usuarioId) {
            return {
              ...usuario,
              creditosDisponibles: usuario.creditosDisponibles - transaccion.cantidad
            };
          }
          return usuario;
        }));
      }
      
      setShowDeleteModal(false);
      setTransaccionToDelete(null);
    }
  };

  // Autenticaciu00f3n con redes sociales
  const handleSocialAuth = async (platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin') => {
    setIsAuthenticating(true);
    setAuthPlatform(platform);
    
    try {
      let token: SocialMediaToken | null = null;
      
      // Simulaciu00f3n de autenticaciu00f3n con diferentes plataformas
      switch (platform) {
        case 'facebook':
          // En un entorno real, esto abriru00eda una ventana OAuth
          await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay
          token = {
            platform: 'facebook',
            token: 'fb-token-' + Date.now(),
            userId: 'fb-user-123',
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
          };
          break;
          
        case 'twitter':
          await new Promise(resolve => setTimeout(resolve, 1500));
          token = {
            platform: 'twitter',
            token: 'tw-token-' + Date.now(),
            userId: 'tw-user-456',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          };
          break;
          
        case 'instagram':
          await new Promise(resolve => setTimeout(resolve, 1500));
          token = {
            platform: 'instagram',
            token: 'ig-token-' + Date.now(),
            userId: 'ig-user-789',
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
          };
          break;
          
        case 'linkedin':
          await new Promise(resolve => setTimeout(resolve, 1500));
          token = {
            platform: 'linkedin',
            token: 'li-token-' + Date.now(),
            userId: 'li-user-101',
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
          };
          break;
      }
      
      if (token) {
        // Actualizar tokens (reemplazar si ya existe uno para esa plataforma)
        setSocialTokens(prev => {
          const newTokens = prev.filter(t => t.platform !== platform);
          return [...newTokens, token!];
        });
        
        alert(`Autenticaciu00f3n con ${platform} exitosa!`);
      }
    } catch (error) {
      console.error(`Error al autenticar con ${platform}:`, error);
      alert(`Error al autenticar con ${platform}. Intu00e9ntelo de nuevo.`);
    } finally {
      setIsAuthenticating(false);
      setAuthPlatform(null);
    }
  };
