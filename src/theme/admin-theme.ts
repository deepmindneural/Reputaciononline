// Tema compartido para todas las páginas del administrador
// Esto asegura una coherencia visual en toda la plataforma

const ADMIN_THEME = {
  colors: {
    primary: {
      light: '#e6f7fa',
      default: '#00acc1',
      dark: '#007c91'
    },
    secondary: {
      light: '#e3f2fd',
      default: '#2196f3',
      dark: '#0d47a1'
    },
    success: '#00a389',
    warning: '#ffc107',
    error: '#f44336',
    text: {
      primary: '#263238',
      secondary: '#546e7a',
      disabled: '#90a4ae'
    },
    background: {
      main: '#f5f7fa',
      card: '#ffffff'
    },
    border: '#e0e0e0',
    gradients: {
      blue: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
      green: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
      cyan: 'linear-gradient(135deg, #26c6da 0%, #0097a7 100%)',
      orange: 'linear-gradient(135deg, #ffb74d 0%, #f57c00 100%)',
      purple: 'linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%)',
      red: 'linear-gradient(135deg, #ef5350 0%, #c62828 100%)'
    }
  },
  shadows: {
    small: '0 2px 8px rgba(0,0,0,0.1)',
    medium: '0 4px 16px rgba(0,0,0,0.12)',
    large: '0 8px 24px rgba(0,0,0,0.15)',
    card: '0 1px 3px rgba(0,0,0,0.05), 0 10px 15px -5px rgba(0,0,0,0.05)',
    button: '0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12)',
    hover: '0 8px 17px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)'
  },
  borderRadius: {
    small: '0.25rem',
    medium: '0.5rem',
    large: '1rem',
    xl: '1.5rem',
    full: '9999px'
  },
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  }
};

// Configuración de estilos para las tarjetas de estadísticas
const STAT_CARD_STYLES = {
  blue: {
    gradient: ADMIN_THEME.colors.gradients.blue,
    iconBg: 'bg-white bg-opacity-25',
    textColor: 'text-white',
    change: {
      up: 'text-green-100 bg-green-600 bg-opacity-30',
      down: 'text-red-100 bg-red-600 bg-opacity-30'
    }
  },
  green: {
    gradient: ADMIN_THEME.colors.gradients.green,
    iconBg: 'bg-white bg-opacity-25',
    textColor: 'text-white',
    change: {
      up: 'text-green-100 bg-green-600 bg-opacity-30',
      down: 'text-red-100 bg-red-600 bg-opacity-30'
    }
  },
  cyan: {
    gradient: ADMIN_THEME.colors.gradients.cyan,
    iconBg: 'bg-white bg-opacity-25',
    textColor: 'text-white',
    change: {
      up: 'text-green-100 bg-green-600 bg-opacity-30',
      down: 'text-red-100 bg-red-600 bg-opacity-30'
    }
  },
  orange: {
    gradient: ADMIN_THEME.colors.gradients.orange,
    iconBg: 'bg-white bg-opacity-25',
    textColor: 'text-white',
    change: {
      up: 'text-green-100 bg-green-600 bg-opacity-30',
      down: 'text-red-100 bg-red-600 bg-opacity-30'
    }
  },
  purple: {
    gradient: ADMIN_THEME.colors.gradients.purple,
    iconBg: 'bg-white bg-opacity-25',
    textColor: 'text-white',
    change: {
      up: 'text-green-100 bg-green-600 bg-opacity-30',
      down: 'text-red-100 bg-red-600 bg-opacity-30'
    }
  },
  red: {
    gradient: ADMIN_THEME.colors.gradients.red,
    iconBg: 'bg-white bg-opacity-25',
    textColor: 'text-white',
    change: {
      up: 'text-green-100 bg-green-600 bg-opacity-30',
      down: 'text-red-100 bg-red-600 bg-opacity-30'
    }
  }
};

// Clases CSS comunes para botones y controles
const COMMON_STYLES = {
  // Estilos para botones
  buttonPrimary: "px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-105",
  buttonSecondary: "px-4 py-2 rounded-lg font-medium bg-white border border-gray-200 transition-all duration-300 hover:bg-gray-50",
  buttonDanger: "px-4 py-2 rounded-lg font-medium text-white bg-red-600 transition-all duration-300 hover:bg-red-700",
  
  // Estilos para tarjetas y contenedores
  card: "bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg",
  cardHeader: "p-4 border-b border-gray-100",
  cardBody: "p-4",
  
  // Estilos para entradas de formulario
  input: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200",
  
  // Estilos para encabezados de sección
  sectionHeader: "text-xl font-bold text-gray-900 mb-4",
  
  // Estilos para tablas
  table: "min-w-full divide-y divide-gray-200",
  tableHeader: "bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
  tableCell: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",
  tableRow: "hover:bg-gray-50 transition-colors duration-200"
};

export { ADMIN_THEME, STAT_CARD_STYLES, COMMON_STYLES };
