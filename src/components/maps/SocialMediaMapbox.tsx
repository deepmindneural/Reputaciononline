"use client";

import React, { useRef, useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaComments } from 'react-icons/fa';
import { loadMapbox } from '@/utils/mapboxLoader';

// Variables globales para la instancia de Mapbox y el estado de la hoja de estilos
let mapboxgl: any = null;
let mapboxCss = false;

// Definiciones de tipos
interface RegionMention {
  id: string;
  region: string;
  coordinates: [number, number]; // [longitud, latitud]
  count: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  platform?: string;
  platformColor?: string;
}

interface SocialMediaMapboxProps {
  apiKey: string;
  mentions: RegionMention[];
  title?: string;
  height?: number;
  interactive?: boolean;
  onRegionClick?: (region: RegionMention) => void;
}

const SocialMediaMapbox: React.FC<SocialMediaMapboxProps> = ({
  apiKey,
  mentions = [],
  title = 'Mapa de Menciones por Región',
  height = 400,
  interactive = true,
  onRegionClick,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRefs = useRef<{ [id: string]: mapboxgl.Marker }>({});
  const [mapReady, setMapReady] = useState(false);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  // Centro predeterminado en Colombia
  const defaultCenter: [number, number] = [-74.297333, 4.570868];
  
  // Estado para rastrear si mapbox-gl ha sido cargado
  const [mapboxLoaded, setMapboxLoaded] = useState(false);

  // Efecto para debugging de la API key
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('SocialMediaMapbox - API Key recibida:', apiKey ? `${apiKey.substring(0, 10)}...` : 'No API key');
    }
  }, [apiKey]);

  // Efecto para cargar mapbox-gl dinámicamente
  useEffect(() => {
    let isMounted = true;
    
    if (typeof window === 'undefined') return;

    // Intentar cargar mapbox-gl mediante util si aún no está cargado
    const utilInstance = loadMapbox();
    if (utilInstance) {
      mapboxgl = utilInstance;
      // Asegurarnos de que el CSS esté cargado
      if (!mapboxCss) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        document.head.appendChild(link);
        mapboxCss = true;
      }
      setMapboxLoaded(true);
      return; // Salir porque ya lo cargamos
    }

    // Verificar si mapboxgl ya está disponible
    if (mapboxgl) {
      setMapboxLoaded(true);
      return;
    }

    // Cargar mapbox-gl dinámicamente
    import('mapbox-gl').then((mod) => {
      if (!isMounted) return;
      
      // Obtener la exportación por defecto o el propio módulo (compatibilidad CommonJS / ESM)
      // @ts-ignore
      mapboxgl = (mod as any).default ? (mod as any).default : mod;
      
      // Cargar CSS si aún no se ha cargado
      if (!mapboxCss) {
        // Cargar CSS de forma dinámica usando un elemento style
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        document.head.appendChild(link);
        mapboxCss = true;
      }
      setMapboxLoaded(true);
    }).catch(err => {
      console.error('Error cargando mapbox-gl:', err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Inicializar el mapa cuando mapbox-gl esté cargado
  useEffect(() => {
    // Verificar que mapbox-gl esté cargado, estamos en el navegador y que el contenedor existe
    if (!mapboxLoaded || typeof window === 'undefined' || !mapContainer.current) {
      return;
    }

    // Verificar si ya hay un mapa inicializado
    if (map.current) {
      return;
    }
    
    try {
      // Establecer API key de Mapbox
      const mapboxApiKey = apiKey || 'pk.eyJ1Ijoia2lldjk5IiwiYSI6ImNqNmJrYTZ3bzFnYTYzM3JwcG1mdXlvbTEifQ.p2qnpIhHV-mjXv9bLYT-Cw';
      mapboxgl.accessToken = mapboxApiKey;
      
      console.log('Inicializando mapa con token:', mapboxApiKey.substring(0, 10) + '...');
      
      // Crear la instancia del mapa
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v10',
        center: defaultCenter,
        zoom: 5,
        interactive: interactive,
        attributionControl: true,
        preserveDrawingBuffer: true,
        antialias: true
      });
      
      // Agregar controles de navegación si el mapa es interactivo
      if (interactive && map.current) {
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      }
      
      // Marcar cuando el mapa esté listo
      if (map.current) {
        map.current.on('load', () => {
          console.log('Mapa cargado correctamente');
          setMapReady(true);
          // Asegurar que el mapa se redimensione correctamente cuando el contenedor ya esté renderizado
          setTimeout(() => {
            try {
              map.current?.resize();
            } catch (e) {
              console.warn('Error al redimensionar el mapa:', e);
            }
          }, 50);
        });
        
        // Manejar errores
        map.current.on('error', (e) => {
          console.error('Error en el mapa:', e);
        });
      }
      
      // Agregar controles de navegación si el mapa es interactivo
      if (interactive && map.current) {
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      }
      
      // Marcar cuando el mapa esté listo (solo si map.current existe)
      if (map.current) {
        map.current.on('load', () => {
          console.log('SocialMediaMapbox loaded successfully');
          setMapReady(true);
          // Forzar redimensionamiento para asegurarse de que el mapa se vea correctamente
          setTimeout(() => {
            try {
              map.current?.resize();
            } catch (e) {
              console.warn('Error al redimensionar el mapa:', e);
            }
          }, 50);
        });
      }
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
    }
    
    // Limpieza al desmontar
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [apiKey, interactive]);
  
  // Agregar/actualizar marcadores cuando cambian las menciones
  useEffect(() => {
    if (!map.current || !mapReady || mentions.length === 0) return;
    
    // Limpiar marcadores anteriores
    Object.values(markerRefs.current).forEach(marker => marker.remove());
    markerRefs.current = {};
    
    // Ajustar los límites del mapa para mostrar todos los marcadores
    const bounds = new mapboxgl.LngLatBounds();
    
    // Agregar nuevos marcadores
    mentions.forEach(mention => {
      // Calcular tamaño basado en la cantidad de menciones (min: 25px, max: 50px)
      const size = Math.max(25, Math.min(50, 25 + (mention.count / 50))); 
      
      // Determinar color basado en el sentimiento
      let color;
      if (mention.sentiment === 'positive') {
        color = '#10B981'; // Verde para sentimiento positivo
      } else if (mention.sentiment === 'negative') {
        color = '#EF4444'; // Rojo para sentimiento negativo
      } else {
        color = '#9CA3AF'; // Gris para sentimiento neutral
      }
      
      // Usar color de la plataforma si está disponible
      if (mention.platformColor) {
        color = mention.platformColor;
      }
      
      // Crear elemento para el marcador
      const el = document.createElement('div');
      el.className = 'mapbox-custom-marker';
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.borderRadius = '50%';
      el.style.backgroundColor = color;
      el.style.border = '3px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 3px 6px rgba(0,0,0,0.3)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.transition = 'all 0.2s ease';
      
      if (activeRegion === mention.id) {
        el.style.transform = 'scale(1.2)';
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
      }
      
      // Añadir icono o número en el marcador para menciones grandes
      if (size > 35) {
        const icon = document.createElement('div');
        icon.style.color = 'white';
        icon.style.fontSize = `${size/2.5}px`;
        icon.style.fontWeight = 'bold';
        icon.innerHTML = `${mention.count}`;
        el.appendChild(icon);
      }
      
      // Crear popup con información detallada
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(`
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 8px; font-weight: bold; font-size: 16px; color: #1F2937;">${mention.region}</h3>
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
              <span style="margin-right: 5px; color: #4B5563;"><svg style="width: 16px; height: 16px; vertical-align: middle;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 64C177.9 64 114.3 127.6 114.3 205.7c0 48.3 24.3 94.3 63.5 131l70.2 62.9c4.9 4.4 11.6 6.8 18.8 6.8s13.8-2.4 18.8-6.8l70.2-62.9c39.2-36.7 63.5-82.7 63.5-131C419.7 127.6 356.1 64 278 64h-22zm0 125.7c-23.5 0-42.5-19-42.5-42.5s19-42.5 42.5-42.5 42.5 19 42.5 42.5-19 42.5-42.5 42.5z"></path></svg></span>
              <span style="color: #4B5563;">${mention.region}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
              <span style="margin-right: 5px; color: #1D4ED8;"><svg style="width: 16px; height: 16px; vertical-align: middle;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M448 128C448 57.3 390.7 0 320 0H64C28.65 0 0 28.65 0 64v288c0 35.35 28.65 64 64 64h49.6l-26.27 68.31c-2.885 7.514 4.842 14.58 11.73 10.73l72.33-40.18h148.6c70.7 0 128-57.31 128-128V128z"></path></svg></span>
              <span style="color: #1D4ED8; font-weight: bold;">${mention.count} menciones</span>
            </div>
            ${mention.platform ? `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 13px;">
              <span>Principal plataforma: ${mention.platform}</span>
            </div>` : ''}
          </div>
        `);
      
      // Crear y agregar el marcador al mapa
      const marker = new mapboxgl.Marker(el)
        .setLngLat(mention.coordinates)
        .setPopup(popup);
      
      // Agregar el marcador al mapa
      if (map.current) {
        marker.addTo(map.current);
      }
      
      // Guardar referencia al marcador
      markerRefs.current[mention.id] = marker;
      
      // Extender los límites para incluir este marcador
      bounds.extend(mention.coordinates);
      
      // Añadir manejador de eventos clic si se proporciona una función de callback
      if (onRegionClick) {
        el.addEventListener('click', () => {
          setActiveRegion(mention.id);
          onRegionClick(mention);
        });
      }
    });
    
    // Si hay más de un marcador, ajustar la vista para mostrar todos
    if (mentions.length > 1 && map.current) {
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 7 // Evitar zoom excesivo
      });
    }
  }, [mentions, mapReady, onRegionClick, activeRegion]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      {title && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <FaMapMarkerAlt className="mr-2 text-primary-500" />
            {title}
          </h3>
        </div>
      )}
      <div style={{ height: `${height}px` }} className="relative">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
    </div>
  );
};

export default SocialMediaMapbox;
