"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, X, Minimize2, Maximize2, PanelRightOpen } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mensaje = {
  id: string;
  texto: string;
  esUsuario: boolean;
  timestamp: Date;
};

type SugerenciaChat = {
  id: string;
  texto: string;
};

export default function ChatSofia() {
  const [expandido, setExpandido] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([{
    id: '1',
    texto: '¡Hola! Soy Sofia, tu asistente de Reputación Online. ¿En qué puedo ayudarte hoy?',
    esUsuario: false,
    timestamp: new Date()
  }]);
  const [inputTexto, setInputTexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [visible, setVisible] = useState(true);
  const mensajesContenedorRef = useRef<HTMLDivElement>(null);
  
  // Sugerencias de consultas comunes
  const [sugerencias] = useState<SugerenciaChat[]>([
    { id: '1', texto: '¿Cómo puedo analizar mis menciones?' },
    { id: '2', texto: '¿Cuántos créditos me quedan?' },
    { id: '3', texto: '¿Cómo interpreto el análisis de sentimiento?' },
    { id: '4', texto: 'Muéstrame reportes recientes' }
  ]);

  // Función para generar respuestas de la IA
  const generarRespuestaIA = async (consulta: string): Promise<string> => {
    // Simulamos una respuesta de IA con un retraso
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const respuestas = {
      'hola': '¡Hola! ¿En qué puedo ayudarte con tu reputación online?',
      'créditos': 'Actualmente tienes 328 créditos disponibles. Has consumido 172 créditos este mes, principalmente en análisis de Twitter.',
      'menciones': 'Para analizar tus menciones, ve a la sección "Análisis" en el panel de control y selecciona las redes sociales que quieres monitorear. Puedes filtrar por fecha, sentimiento o alcance.',
      'sentimiento': 'El análisis de sentimiento clasifica las menciones como positivas, negativas o neutras. Un puntaje superior a 70% indica una buena recepción. Te recomiendo prestar atención a las menciones negativas para gestionar posibles crisis.',
      'reportes': 'He encontrado 3 reportes recientes: Análisis de Facebook (hace 2 días), Menciones en Twitter (ayer) y Tendencias de Instagram (hoy). ¿Cuál te gustaría revisar?',
      'default': 'Entiendo tu consulta. Permíteme buscar información relevante sobre esto en la plataforma de Reputación Online.'
    };
    
    // Buscar palabras clave en la consulta
    const consultaLower = consulta.toLowerCase();
    for (const [keyword, respuesta] of Object.entries(respuestas)) {
      if (consultaLower.includes(keyword)) {
        return respuesta;
      }
    }
    
    return respuestas.default;
  };

  // Auto-scroll cuando hay nuevos mensajes
  useEffect(() => {
    if (mensajesContenedorRef.current) {
      mensajesContenedorRef.current.scrollTop = mensajesContenedorRef.current.scrollHeight;
    }
  }, [mensajes]);

  // Enviar mensaje
  const enviarMensaje = async () => {
    if (!inputTexto.trim()) return;
    
    // Agregar mensaje del usuario
    const mensajeUsuario: Mensaje = {
      id: Date.now().toString(),
      texto: inputTexto,
      esUsuario: true,
      timestamp: new Date()
    };
    
    setMensajes(prev => [...prev, mensajeUsuario]);
    setInputTexto('');
    setCargando(true);
    
    try {
      // Generar respuesta de la IA
      const respuesta = await generarRespuestaIA(inputTexto);
      
      // Agregar respuesta de Sofia
      const mensajeSofia: Mensaje = {
        id: (Date.now() + 1).toString(),
        texto: respuesta,
        esUsuario: false,
        timestamp: new Date()
      };
      
      setMensajes(prev => [...prev, mensajeSofia]);
    } catch (error) {
      console.error('Error al generar respuesta:', error);
    } finally {
      setCargando(false);
    }
  };

  // Manejar envío con Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };
  
  // Seleccionar una sugerencia
  const seleccionarSugerencia = (texto: string) => {
    setInputTexto(texto);
    // Opcional: enviar automáticamente
    // setInputTexto(texto);
    // setTimeout(() => enviarMensaje(), 100);
  };
  
  // Formatear hora
  const formatearHora = (fecha: Date) => {
    return fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  };

  // Si el chat está oculto, mostrar solo el botón flotante
  if (!visible) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-lg"
        onClick={() => setVisible(true)}
        title="Abrir chat con Sofia"
      >
        <Bot className="h-6 w-6" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800",
        expandido ? "h-[80vh] w-[80vw] max-w-4xl" : "h-[450px] w-[350px]"
      )}
    >
      {/* Encabezado del chat */}
      <div className="flex items-center justify-between bg-gradient-to-r from-primary-600 to-cyan-600 p-3 text-white">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 border-2 border-white">
            <AvatarImage src="/sofia-avatar.png" alt="Sofia IA" />
            <AvatarFallback className="bg-cyan-100 text-cyan-800">S</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Sofia</h3>
            <p className="text-xs opacity-90">Asistente IA</p>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full text-white hover:bg-white/20"
            onClick={() => setExpandido(!expandido)}
          >
            {expandido ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full text-white hover:bg-white/20"
            onClick={() => setVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Contenedor de mensajes */}
      <div className="flex flex-1 overflow-hidden">
        <div ref={mensajesContenedorRef} className="flex-1 overflow-y-auto p-4">
          <AnimatePresence initial={false}>
            {mensajes.map((mensaje) => (
              <motion.div
                key={mensaje.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={cn(
                  "mb-4 flex",
                  mensaje.esUsuario ? "justify-end" : "justify-start"
                )}
              >
                {!mensaje.esUsuario && (
                  <Avatar className="mr-2 mt-1 h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-cyan-100 text-cyan-800">S</AvatarFallback>
                  </Avatar>
                )}
                
                <div className="max-w-[80%]">
                  <div 
                    className={cn(
                      "rounded-lg px-4 py-2",
                      mensaje.esUsuario 
                        ? "bg-primary-600 text-white" 
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{mensaje.texto}</p>
                  </div>
                  <p className="mt-1 text-right text-xs text-gray-500">
                    {formatearHora(mensaje.timestamp)}
                  </p>
                </div>
                
                {mensaje.esUsuario && (
                  <Avatar className="ml-2 mt-1 h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-gray-200 text-gray-800">U</AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
            
            {cargando && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 flex items-start"
              >
                <Avatar className="mr-2 mt-1 h-8 w-8">
                  <AvatarFallback className="bg-cyan-100 text-cyan-800">S</AvatarFallback>
                </Avatar>
                <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-400" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-400" style={{ animationDelay: '0.2s' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-400" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Panel lateral para chat expandido */}
        {expandido && (
          <div className="hidden w-64 border-l border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900 md:block">
            <h3 className="mb-3 font-medium text-gray-700 dark:text-gray-300">Historial de consultas</h3>
            <div className="space-y-2">
              {mensajes
                .filter(m => m.esUsuario)
                .slice(-5)
                .map(m => (
                  <div 
                    key={m.id} 
                    className="cursor-pointer rounded bg-white p-2 text-sm shadow hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                    onClick={() => setInputTexto(m.texto)}
                  >
                    {m.texto.length > 40 ? `${m.texto.substring(0, 40)}...` : m.texto}
                  </div>
                ))}
            </div>
            
            <h3 className="mb-3 mt-6 font-medium text-gray-700 dark:text-gray-300">Recursos</h3>
            <div className="space-y-2">
              <div className="cursor-pointer rounded bg-cyan-50 p-2 text-sm text-cyan-700 shadow hover:bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400 dark:hover:bg-cyan-900/50">
                <PanelRightOpen className="mr-1 inline h-4 w-4" />
                Tutorial de análisis
              </div>
              <div className="cursor-pointer rounded bg-cyan-50 p-2 text-sm text-cyan-700 shadow hover:bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400 dark:hover:bg-cyan-900/50">
                <PanelRightOpen className="mr-1 inline h-4 w-4" />
                Gestión de créditos
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Sugerencias */}
      {mensajes.length < 3 && (
        <div className="border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-850">
          <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Prueba preguntarme:</p>
          <div className="flex flex-wrap gap-2">
            {sugerencias.map(sugerencia => (
              <button
                key={sugerencia.id}
                onClick={() => seleccionarSugerencia(sugerencia.texto)}
                className="rounded-full bg-white px-3 py-1 text-xs text-gray-700 shadow-sm hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {sugerencia.texto}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Área de entrada de texto */}
      <div className="border-t border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-end rounded-lg border bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
          <textarea
            className="min-h-[20px] w-full resize-none bg-transparent p-3 text-sm outline-none placeholder:text-gray-400 dark:text-white"
            placeholder="Escribe tu mensaje a Sofia..."
            rows={1}
            value={inputTexto}
            onChange={(e) => setInputTexto(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button
            type="button"
            onClick={enviarMensaje}
            className="mb-1 mr-1 bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
            size="sm"
            disabled={!inputTexto.trim() || cargando}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          Sofia te ayuda a gestionar tu reputación online con IA avanzada
        </p>
      </div>
    </motion.div>
  );
}
