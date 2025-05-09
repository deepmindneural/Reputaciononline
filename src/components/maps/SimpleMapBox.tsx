"use client";

import React, { useRef, useEffect, useState } from 'react';
import { loadMapbox, setMapboxToken } from '@/utils/mapboxLoader';

// Definir el tipo para ubicaciones
interface Location {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitud, latitud]
  value: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface SimpleMapBoxProps {
  apiKey: string;
  locations: Location[];
  height?: number;
  title?: string;
  interactive?: boolean;
  onLocationClick?: (location: Location) => void;
}

const SimpleMapBox: React.FC<SimpleMapBoxProps> = ({
  apiKey,
  locations = [],
  height = 400,
  title,
  interactive = true,
  onLocationClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Centro predeterminado (Colombia)
  const defaultCenter: [number, number] = [-74.297333, 4.570868];
  
  // Inicializar el mapa cuando el componente se monta
  useEffect(() => {
    // Verificar que tenemos un contenedor y el mapa no está ya inicializado
    if (!mapContainer.current || map.current) return;
    
    try {
      // Cargar mapboxgl y configurar el token
      const mapboxgl = loadMapbox();
      if (!mapboxgl) {
        console.error('No se pudo cargar mapbox-gl');
        // Intentar cargar via importación dinámica como fallback
        import('mapbox-gl').then((mod) => {
          // Usar cualquier exportación válida (default o módulo completo)
          const mapboxInstance = mod.default || mod;
          if (!mapboxInstance) {
            console.error('Fallo al cargar mapbox-gl mediante importación dinámica');
            return;
          }
          
          // Configurar el token explícitamente
          mapboxInstance.accessToken = apiKey || 'pk.eyJ1Ijoia2lldjk5IiwiYSI6ImNqNmJrYTZ3bzFnYTYzM3JwcG1mdXlvbTEifQ.p2qnpIhHV-mjXv9bLYT-Cw';
          
          // Crear nueva instancia de mapa
          if (!mapContainer.current) return;
          map.current = new mapboxInstance.Map({
            container: mapContainer.current as HTMLElement,
            style: 'mapbox://styles/mapbox/light-v11',
            center: defaultCenter,
            zoom: 5,
            interactive: interactive,
          });
          
          // Añadir controles de navegación si es interactivo
          if (interactive && map.current) {
            map.current.addControl(new mapboxInstance.NavigationControl());
          }
          
          // Forzar resize para asegurar que se muestra correctamente
          setTimeout(() => {
            map.current?.resize();
          }, 100);
          
          // Marcar cuando el mapa esté listo
          map.current.on('load', () => {
            setMapLoaded(true);
            console.log('Mapa cargado exitosamente via import dinámico');
          });
        }).catch(err => {
          console.error('Error en importación dinámica de mapbox-gl:', err);
        });
        return;
      }
      
      // Configurar el token de Mapbox
      setMapboxToken(apiKey);
      
      // Crear nueva instancia de mapa
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: defaultCenter,
        zoom: 5,
        interactive: interactive,
      });
      
      // Añadir controles de navegación si es interactivo
      if (interactive && map.current) {
        map.current.addControl(new mapboxgl.NavigationControl());
      }
      
      // Marcar cuando el mapa esté listo
      if (map.current) {
        map.current.on('load', () => {
          setMapLoaded(true);
        });
      }
    } catch (error) {
      console.error('Error al inicializar el mapa de Mapbox:', error);
      // Informar al usuario que hubo un problema con el mapa
      if (mapContainer.current) {
        mapContainer.current.innerHTML = '<div class="p-4 text-center"><p>Error al cargar el mapa. Por favor, recargue la página.</p></div>';
      }
    }
    
    // Limpieza al desmontar
    return () => {
      // Asegurarse de limpiar todos los marcadores
      if (markers.current && markers.current.length > 0) {
        markers.current.forEach(marker => {
          if (marker) marker.remove();
        });
      }
      // Limpiar y destruir la instancia del mapa
      if (map.current) {
        try {
          map.current.remove();
        } catch (e) {
          console.error('Error al limpiar el mapa:', e);
        }
      }
    };
  }, [apiKey, interactive]);
  
  // Añadir marcadores cuando cambian las ubicaciones
  useEffect(() => {
    // Asegurarse de que el mapa esté cargado y las ubicaciones estén disponibles
    if (!map.current || !mapLoaded || locations.length === 0) return;
    
    // Cargar mapboxgl
    const mapboxgl = loadMapbox();
    if (!mapboxgl) {
      console.error('No se pudo cargar mapbox-gl para los marcadores');
      return;
    }
    
    try {
      // Limpiar marcadores anteriores de manera segura
      if (markers.current.length > 0) {
        markers.current.forEach(marker => {
          if (marker) marker.remove();
        });
        markers.current = [];
      }
      
      // Calcular límites para ajustar la vista
      const bounds = new mapboxgl.LngLatBounds();
      
      // Añadir nuevos marcadores
      locations.forEach(location => {
        try {
          // Determinar color según sentimiento
          let color = '#3B82F6'; // azul por defecto
          if (location.sentiment === 'positive') color = '#10B981'; // verde
          else if (location.sentiment === 'negative') color = '#EF4444'; // rojo
          else if (location.sentiment === 'neutral') color = '#9CA3AF'; // gris
          
          // Crear elemento para el marcador
          const el = document.createElement('div');
          el.className = 'mapbox-marker';
          el.style.backgroundColor = color;
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.borderRadius = '50%';
          el.style.border = '2px solid white';
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
          el.style.cursor = 'pointer';
          
          // Crear popup si el mapa está disponible
          let popup;
          if (map.current) {
            popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div style="padding: 10px;">
                  <h3 style="margin: 0 0 5px; font-weight: bold;">${location.name}</h3>
                  <div>
                    <span>Valor: <strong>${location.value}</strong></span>
                  </div>
                </div>
              `);
          }
          
          // Crear y añadir marcador si el mapa está disponible
          if (map.current) {
            const marker = new mapboxgl.Marker(el)
              .setLngLat(location.coordinates);
            
            // Añadir popup si está disponible
            if (popup) {
              marker.setPopup(popup);
            }
            
            // Añadir al mapa
            marker.addTo(map.current);
            
            // Añadir evento click si está definido el manejador
            if (onLocationClick) {
              el.addEventListener('click', () => {
                onLocationClick(location);
              });
            }
            
            // Almacenar referencia al marcador y extender los límites
            markers.current.push(marker);
            bounds.extend(location.coordinates);
          }
        } catch (e) {
          console.error('Error al crear marcador:', e);
        }
      });
      
      // Ajustar vista para mostrar todos los marcadores si hay más de uno
      if (locations.length > 1 && map.current) {
        try {
          map.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 7
          });
        } catch (e) {
          console.error('Error al ajustar el zoom del mapa:', e);
        }
      }
    } catch (e) {
      console.error('Error general al actualizar marcadores:', e);
    }
  }, [locations, mapLoaded, onLocationClick]);
  
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
      <div 
        style={{ height: `${height}px` }} 
        className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
};

export default SimpleMapBox;
