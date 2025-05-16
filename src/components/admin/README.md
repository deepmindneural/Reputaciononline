# Componentes de Administración para Reputación Online

Este directorio contiene componentes reutilizables diseñados específicamente para las páginas de administración de la plataforma Reputación Online. Estos componentes garantizan una coherencia visual y una experiencia de usuario consistente en toda la interfaz de administración.

## Componentes Disponibles

### AdminPageHeader

Encabezado estándar para todas las páginas de administración. Incluye un fondo con gradiente, título, descripción opcional y acciones.

```tsx
import { AdminPageHeader } from '@/components/admin';
import { FaUsers } from 'react-icons/fa';

// Uso básico
<AdminPageHeader 
  title="Administración de Usuarios" 
  description="Gestiona los usuarios de la plataforma" 
  icon={<FaUsers size={24} />} 
/>

// Con acciones
<AdminPageHeader 
  title="Administración de Planes" 
  description="Configura los planes disponibles" 
  actions={<AdminButton>Nuevo Plan</AdminButton>} 
/>
```

### StatCard

Tarjeta para mostrar estadísticas con un diseño moderno y profesional. Incluye soporte para cambios porcentuales y diferentes colores.

```tsx
import { StatCard } from '@/components/admin';
import { FaCoins } from 'react-icons/fa';

<StatCard 
  title="Créditos Totales" 
  value={150000} 
  icon={<FaCoins className="h-6 w-6 text-white" />}
  change={8.2}
  changeType="up"
  color="cyan"
  isCurrency={true}
/>
```

### ContentCard

Contenedor para secciones de contenido con encabezado estilizado.

```tsx
import { ContentCard } from '@/components/admin';
import { FaChartBar } from 'react-icons/fa';

<ContentCard 
  title="Análisis de Créditos" 
  icon={<FaChartBar />} 
  color="blue"
>
  <p>Contenido del análisis...</p>
</ContentCard>
```

### AdminButton

Botón estilizado con soporte para diferentes variantes, tamaños e iconos.

```tsx
import { AdminButton } from '@/components/admin';
import { FaPlus } from 'react-icons/fa';

// Botón primario
<AdminButton>Guardar Cambios</AdminButton>

// Botón con icono
<AdminButton 
  variant="primary" 
  icon={<FaPlus />}
>
  Nuevo Usuario
</AdminButton>

// Botón de peligro (rojo)
<AdminButton 
  variant="danger" 
  size="sm"
>
  Eliminar
</AdminButton>
```

## Implementación en Nuevas Páginas

Para mantener la coherencia visual en todas las páginas de administración, sigue estos pasos:

1. Importa los componentes necesarios desde `@/components/admin`
2. Usa `AdminPageHeader` para el encabezado de la página
3. Agrupa las estadísticas en `StatCard`
4. Utiliza `ContentCard` para cada sección de contenido
5. Implementa `AdminButton` para todas las acciones y botones

## Tema y Estilos

Todos los componentes utilizan el tema centralizado definido en `@/theme/admin-theme.ts`. Si necesitas modificar colores o estilos globales, edita este archivo para mantener la coherencia en toda la plataforma.

Los colores corporativos de Reputación Online son principalmente el turquesa/cyan, y los valores monetarios se muestran en pesos colombianos (COP).
