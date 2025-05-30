# Panel Administrativo Moderno - Reputación Online

Panel de administración moderno para la plataforma Reputación Online, desarrollado con Next.js, Tailwind CSS, shadcn/ui y Framer Motion, siguiendo los colores corporativos y mejores prácticas de diseño UX/UI.

## Características

- 🎨 **Diseño Moderno**: Interfaz completamente renovada con Tailwind CSS y componentes shadcn/ui
- 🔄 **Animaciones Fluidas**: Implementadas con Framer Motion para una experiencia de usuario mejorada
- 🌓 **Modo Oscuro**: Soporte completo para modo claro/oscuro
- 📱 **Diseño Responsive**: Funciona perfectamente en dispositivos móviles, tablets y escritorio
- 🧩 **Componentes Reutilizables**: Arquitectura modular para fácil mantenimiento
- 📊 **Visualización de Datos**: Gráficos interactivos para métricas de créditos y transacciones
- 🇪🇸 **Interfaz en Español**: Completamente localizado para usuarios hispanohablantes

## Secciones Principales

- **Dashboard**: Resumen general con estadísticas clave y métricas de rendimiento
- **Usuarios**: Gestión completa de usuarios con búsqueda y filtros
- **Créditos**: Administración de transacciones y asignaciones de créditos
- **Planes**: Gestión de planes de suscripción con visualización estilo tarjetas

## Tecnologías Utilizadas

- **Frontend**: Next.js 14 con App Router
- **Estilos**: Tailwind CSS con shadcn/ui
- **Animaciones**: Framer Motion
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Temas**: Next Themes para modo oscuro/claro

## Colores Corporativos

- **Primario (Turquesa)**: #00B3B0
- **Secundario (Cyan)**: #0CA5E9

## Requisitos Previos

- Node.js 18 o superior
- npm o yarn

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:

```bash
cd admin-modern
npm install
```

## Ejecutar en Desarrollo

```bash
npm run dev
```

El panel estará disponible en http://localhost:3006

## Construir para Producción

```bash
npm run build
npm start
```

## Integración con APIs

El panel se conecta a las siguientes APIs existentes:

- `/api/admin/usuarios` - Gestión de usuarios
- `/api/admin/creditos` - Gestión de transacciones de créditos
- `/api/admin/planes` - Gestión de planes de suscripción

## Estructura del Proyecto

```
├── public/              # Archivos estáticos
├── src/
│   ├── app/            # Páginas de la aplicación (App Router)
│   │   ├── (dashboard) # Layout y páginas del panel
│   │   └── api/        # API Routes
│   ├── components/     # Componentes reutilizables
│   │   └── ui/         # Componentes de interfaz
│   ├── lib/            # Utilidades y funciones
│   └── styles/         # Estilos globales
└── package.json        # Dependencias y scripts
```

## Próximos Pasos

- Implementar autenticación completa
- Añadir formularios para crear/editar usuarios, créditos y planes
- Integrar sistema de notificaciones en tiempo real
- Mejorar la visualización de datos con más gráficos y métricas

---

Desarrollado para la plataforma Reputación Online
