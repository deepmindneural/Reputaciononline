"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, User, MapPin, Briefcase, Award, AlertTriangle, CheckCircle2, X, Clock, ArrowUpRight, BarChart3, Facebook, Twitter, Instagram, Linkedin, Globe, RefreshCcw, Download, Share2 } from 'lucide-react';

type ResultadoBusqueda = {
  id: string;
  nombre: string;
  profesion: string;
  ubicacion: string;
  edad: number;
  foto: string;
  sentimiento: 'positivo' | 'negativo' | 'neutro' | 'mixto';
  puntuacion: number;
  presencia: {
    twitter: boolean;
    facebook: boolean;
    instagram: boolean;
    linkedin: boolean;
    web: boolean;
  };
  menciones: number;
};

type PersonaDetalle = ResultadoBusqueda & {
  noticias: Array<{
    id: string;
    titulo: string;
    fuente: string;
    fecha: string;
    sentimiento: 'positivo' | 'negativo' | 'neutro';
    url: string;
  }>;
  redes: Array<{
    plataforma: string;
    usuario: string;
    url: string;
    seguidores: number;
    sentimiento: 'positivo' | 'negativo' | 'neutro' | 'mixto';
  }>;
  empresas: Array<{
    nombre: string;
    cargo: string;
    periodo: string;
  }>;
  educacion: Array<{
    institucion: string;
    titulo: string;
    periodo: string;
  }>;
};

import PersonaCard from '@/components/busqueda/PersonaCard';

export default function BusquedaPersonasPage() {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [cargando, setCargando] = useState(false);
  const [personaSeleccionada, setPersonaSeleccionada] = useState<PersonaDetalle | null>(null);
  const [tabActiva, setTabActiva] = useState('general');
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  // Simular búsqueda de personas
  const buscarPersonas = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!terminoBusqueda.trim()) return;
    
    setCargando(true);
    setBusquedaRealizada(true);
    
    // Simular tiempo de búsqueda
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Filtrar resultados basados en el término de búsqueda (simulación)
    const resultadosFiltrados = resultadosSimulados.filter(persona => 
      persona.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      persona.profesion.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      persona.ubicacion.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );
    
    setResultados(resultadosFiltrados);
    setCargando(false);
  };

  // Ver detalles de una persona
  const verDetallesPersona = (id: string) => {
    // Encontrar la persona seleccionada (simulación)
    if (id === '1') {
      setPersonaSeleccionada(personaDetalleSimulada);
    } else {
      // Para otros IDs podríamos tener datos diferentes
      setPersonaSeleccionada(personaDetalleSimulada);
    }
  };

  // Cerrar vista de detalles
  const cerrarDetalles = () => {
    setPersonaSeleccionada(null);
    setTabActiva('general');
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">Búsqueda de Personas</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Encuentra información y analiza la reputación online de personas en Colombia
        </p>
      </motion.div>
      
      {/* Formulario de búsqueda */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={buscarPersonas} className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="block w-full rounded-md border-gray-300 pl-10 py-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Nombre, profesión o ubicación..."
                required
              />
            </div>
            <Button type="submit" disabled={cargando} className="sm:w-auto">
              {cargando ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                'Buscar'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

// Datos simulados para resultados de búsqueda
const resultadosSimulados: ResultadoBusqueda[] = [
  {
    id: '1',
    nombre: 'Carlos Rodríguez',
    profesion: 'Abogado / Político',
    ubicacion: 'Bogotá, Colombia',
    edad: 45,
    foto: '',
    sentimiento: 'positivo',
    puntuacion: 78,
    presencia: {
      twitter: true,
      facebook: true,
      instagram: true,
      linkedin: true,
      web: true
    },
    menciones: 1240
  },
  {
    id: '2',
    nombre: 'Ana María González',
    profesion: 'Empresaria',
    ubicacion: 'Medellín, Colombia',
    edad: 38,
    foto: '',
    sentimiento: 'mixto',
    puntuacion: 65,
    presencia: {
      twitter: true,
      facebook: true,
      instagram: true,
      linkedin: true,
      web: false
    },
    menciones: 865
  },
  {
    id: '3',
    nombre: 'Juan Felipe Martínez',
    profesion: 'Periodista',
    ubicacion: 'Cali, Colombia',
    edad: 42,
    foto: '',
    sentimiento: 'negativo',
    puntuacion: 32,
    presencia: {
      twitter: true,
      facebook: true,
      instagram: false,
      linkedin: true,
      web: true
    },
    menciones: 1820
  },
  {
    id: '4',
    nombre: 'María Fernanda López',
    profesion: 'Médica',
    ubicacion: 'Barranquilla, Colombia',
    edad: 35,
    foto: '',
    sentimiento: 'positivo',
    puntuacion: 92,
    presencia: {
      twitter: false,
      facebook: true,
      instagram: true,
      linkedin: true,
      web: true
    },
    menciones: 450
  },
  {
    id: '5',
    nombre: 'Jorge Eduardo Vargas',
    profesion: 'Ingeniero / Empresario',
    ubicacion: 'Bogotá, Colombia',
    edad: 52,
    foto: '',
    sentimiento: 'neutro',
    puntuacion: 58,
    presencia: {
      twitter: true,
      facebook: false,
      instagram: false,
      linkedin: true,
      web: true
    },
    menciones: 320
  }
];

// Datos simulados para una persona específica
const personaDetalleSimulada: PersonaDetalle = {
  ...resultadosSimulados[0],
  noticias: [
    {
      id: 'n1',
      titulo: 'Carlos Rodríguez presenta nuevo proyecto de ley sobre transparencia',
      fuente: 'El Tiempo',
      fecha: '15 mayo, 2025',
      sentimiento: 'positivo',
      url: '#'
    },
    {
      id: 'n2',
      titulo: 'Entrevista exclusiva con Carlos Rodríguez sobre reforma judicial',
      fuente: 'Caracol Radio',
      fecha: '2 mayo, 2025',
      sentimiento: 'neutro',
      url: '#'
    },
    {
      id: 'n3',
      titulo: 'Carlos Rodríguez participa en debate sobre derechos humanos',
      fuente: 'Semana',
      fecha: '28 abril, 2025',
      sentimiento: 'positivo',
      url: '#'
    },
    {
      id: 'n4',
      titulo: 'Controversia por comentarios de Carlos Rodríguez en caso judicial',
      fuente: 'El Espectador',
      fecha: '15 abril, 2025',
      sentimiento: 'negativo',
      url: '#'
    }
  ],
  redes: [
    {
      plataforma: 'Twitter',
      usuario: '@carlosrodriguez',
      url: '#',
      seguidores: 58700,
      sentimiento: 'positivo'
    },
    {
      plataforma: 'Facebook',
      usuario: 'Carlos Rodríguez Oficial',
      url: '#',
      seguidores: 125000,
      sentimiento: 'mixto'
    },
    {
      plataforma: 'Instagram',
      usuario: '@carlosrodriguezoficial',
      url: '#',
      seguidores: 35200,
      sentimiento: 'positivo'
    },
    {
      plataforma: 'LinkedIn',
      usuario: 'Carlos Rodríguez',
      url: '#',
      seguidores: 8500,
      sentimiento: 'neutro'
    }
  ],
  empresas: [
    {
      nombre: 'Rodríguez & Asociados',
      cargo: 'Socio Fundador',
      periodo: '2010 - Presente'
    },
    {
      nombre: 'Ministerio de Justicia',
      cargo: 'Asesor Jurídico',
      periodo: '2008 - 2010'
    },
    {
      nombre: 'Universidad Nacional de Colombia',
      cargo: 'Profesor Asociado',
      periodo: '2005 - 2008'
    }
  ],
  educacion: [
    {
      institucion: 'Universidad de Los Andes',
      titulo: 'Maestría en Derecho Constitucional',
      periodo: '2002 - 2004'
    },
    {
      institucion: 'Universidad Javeriana',
      titulo: 'Pregrado en Derecho',
      periodo: '1997 - 2002'
    }
  ]
};

// Componente principal de búsqueda de personas
export default function BusquedaPersonasPage() {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [cargando, setCargando] = useState(false);
  const [personaSeleccionada, setPersonaSeleccionada] = useState<PersonaDetalle | null>(null);
  const [tabActiva, setTabActiva] = useState('general');
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);

  // Simular búsqueda de personas
  const buscarPersonas = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!terminoBusqueda.trim()) return;
    
    setCargando(true);
    setBusquedaRealizada(true);
    
    // Simular tiempo de búsqueda
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Filtrar resultados basados en el término de búsqueda (simulación)
    const resultadosFiltrados = resultadosSimulados.filter(persona => 
      persona.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      persona.profesion.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      persona.ubicacion.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );
    
    setResultados(resultadosFiltrados);
    setCargando(false);
  };

  // Ver detalles de una persona
  const verDetallesPersona = (id: string) => {
    // Encontrar la persona seleccionada (simulación)
    const personaEncontrada = resultadosSimulados.find(p => p.id === id);
    
    if (personaEncontrada) {
      if (id === '1') {
        setPersonaSeleccionada(personaDetalleSimulada);
      } else {
        // Para otros IDs creamos un detalle basado en la persona encontrada
        setPersonaSeleccionada({
          ...personaEncontrada,
          noticias: [],
          redes: [],
          empresas: [],
          educacion: []
        });
      }
      setDialogoAbierto(true);
    }
  };

  // Cerrar vista de detalles
  const cerrarDetalles = () => {
    setDialogoAbierto(false);
    setTimeout(() => {
      setPersonaSeleccionada(null);
      setTabActiva('general');
    }, 300);
  };
