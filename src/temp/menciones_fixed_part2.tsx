// Datos para mostrar en la interfaz
const menciones: MencionItemProps[] = [
  {
    id: '1',
    author: 'María García',
    authorUsername: 'MariaGarcia',
    content: 'Las propuestas de @CarlosRodriguezG sobre educación son exactamente lo que necesitamos. Por fin alguien que entiende los problemas reales! #EleccionesSenado2026',
    date: 'Hace 35 minutos',
    network: 'x',
    sentiment: 'positivo',
    engagement: {
      likes: 48,
      reposts: 12,
      comments: 5
    },
    relevance: 82
  },
  {
    id: '2',
    author: 'Pedro Gómez',
    authorUsername: 'PedroGomezL',
    content: 'Me gusta el enfoque de @CarlosRodriguezG sobre innovación tecnológica en su programa. Sin embargo, me gustaría ver más detalles sobre implementación. #Senado2026 #Tecnología',
    date: 'Hace 2 horas',
    network: 'facebook',
    sentiment: 'neutral',
    engagement: {
      likes: 78,
      comments: 23,
      shares: 5
    },
    relevance: 75
  },
  {
    id: '3',
    author: 'El Tiempo',
    content: 'Carlos Rodríguez presenta su plan de gobierno para el Senado, centrándose en educación, innovación y sostenibilidad ambiental. El candidato promete cambios significativos en el sistema educativo.',
    date: 'Hace 5 horas',
    network: 'news',
    sentiment: 'neutral',
    engagement: {
      likes: 56,
      reposts: 7,
      comments: 19
    },
    relevance: 68
  },
  {
    id: '4',
    author: 'Laura Martínez',
    authorUsername: 'lauramartinez',
    content: 'No estoy de acuerdo con las propuestas de @CarlosRodriguezG en materia de seguridad. Creo que se enfoca demasiado en medidas punitivas y no en prevención. #Crítica #SeguridadCiudadana',
    date: 'Hace 7 horas',
    network: 'instagram',
    sentiment: 'negativo',
    engagement: {
      likes: 105,
      comments: 42
    },
    relevance: 88
  },
  {
    id: '5',
    author: 'El Espectador',
    content: 'Carlos Rodríguez revela su estrategia de campaña digital. El candidato planea llegar a los jóvenes a través de redes sociales y plataformas digitales para promover su mensaje.',
    date: 'Hace 10 horas',
    network: 'news',
    sentiment: 'positivo',
    engagement: {
      likes: 89,
      comments: 14,
      shares: 23
    },
    relevance: 71
  },
  {
    id: '6',
    author: 'Ana Ramírez',
    authorUsername: 'anaramirez.oficial',
    content: 'He estado siguiendo la campaña de @CarlosRodriguezG y cada vez me convenzo más de que es el candidato que necesitamos. Su enfoque en educación y tecnología es refrescante!',
    date: 'Hace 12 horas',
    network: 'linkedin',
    sentiment: 'positivo',
    engagement: {
      likes: 132,
      comments: 17,
      shares: 8
    },
    relevance: 79
  },
];
