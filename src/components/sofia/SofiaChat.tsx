"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaInfoCircle, FaDownload, FaRegLightbulb } from 'react-icons/fa';

type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'sofia';
  timestamp: Date;
  isLoading?: boolean;
  suggestions?: string[];
};

interface SofiaChatProps {
  initialMessage?: string;
  onAnalysisComplete?: (analysis: any) => void;
}

const SofiaChat: React.FC<SofiaChatProps> = ({ 
  initialMessage = "Hola, soy Sofia, tu asistente de inteligencia artificial para Reputación Online. ¿En qué puedo ayudarte hoy?",
  onAnalysisComplete
}) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<{
    topics: string[];
    userPreferences: string[];
    lastQueries: string[];
    userInfo: {
      name?: string;
      role?: string;
      interests?: string[];
    }
  }>({  
    topics: [],
    userPreferences: [],
    lastQueries: [],
    userInfo: {}
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Opciones de conversación recientes para sugerir al usuario
  const conversationOptions = [
    "Análisis de sentimiento en X",
    "¿Cómo mejorar mi presencia en LinkedIn?",
    "Identificar temas clave en mis menciones",
    "Sugerir estrategia para crisis de reputación",
    "Resumir tendencias de mi sector"
  ];

  useEffect(() => {
    // Agregar mensaje inicial de Sofia
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          content: initialMessage,
          sender: 'sofia',
          timestamp: new Date(),
          suggestions: conversationOptions.slice(0, 3)
        }
      ]);
    }
  }, [initialMessage, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;
    
    // Agregar mensaje del usuario
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Actualizar el contexto de la conversación con la consulta del usuario
    updateConversationContext(inputMessage);
    
    // Simular tiempo de respuesta de IA
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generar respuesta de Sofia usando el contexto de la conversación
    let sofiaResponse = generateSofiaResponse(inputMessage, conversationContext);
    
    setMessages(prevMessages => [...prevMessages, {
      id: Date.now().toString(),
      content: sofiaResponse.message,
      sender: 'sofia',
      timestamp: new Date(),
      suggestions: sofiaResponse.suggestions
    }]);
    
    setIsTyping(false);
    
    // Si hay un callback para análisis completo, llamarlo con datos simulados
    if (onAnalysisComplete && inputMessage.toLowerCase().includes('análisis')) {
      onAnalysisComplete({
        sentiment: { positive: 65, negative: 15, neutral: 20 },
        keywords: ['política', 'propuestas', 'desarrollo', 'comunidad'],
        channels: { x: 42, instagram: 28, facebook: 30 }
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Función para actualizar el contexto de la conversación basado en la entrada del usuario
  const updateConversationContext = (userInput: string) => {
    const input = userInput.toLowerCase();
    const newContext = {...conversationContext};
    
    // Guardar las últimas consultas del usuario (máximo 5)
    newContext.lastQueries = [userInput, ...newContext.lastQueries.slice(0, 4)];
    
    // Detectar temas mencionados
    const topicKeywords = {
      'redes_sociales': ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok', 'red social', 'redes'],
      'reputacion': ['reputación', 'imagen', 'percepción', 'crítica', 'comentario'],
      'analisis': ['análisis', 'estadística', 'dato', 'tendencia', 'gráfico', 'reporte'],
      'estrategia': ['estrategia', 'plan', 'campaña', 'objetivo', 'meta', 'tactic'],
      'crisis': ['crisis', 'emergencia', 'problema', 'negativo', 'ataque', 'escandalo']
    };
    
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => input.includes(keyword)) && !newContext.topics.includes(topic)) {
        newContext.topics.push(topic);
      }
    });
    
    // Detectar preferencias del usuario
    if (input.includes('detallado') || input.includes('profundidad') || input.includes('especifico')) {
      if (!newContext.userPreferences.includes('detallado')) {
        newContext.userPreferences.push('detallado');
      }
    }
    
    if (input.includes('rápido') || input.includes('breve') || input.includes('resumen')) {
      if (!newContext.userPreferences.includes('conciso')) {
        newContext.userPreferences.push('conciso');
      }
    }
    
    // Extraer posible nombre del usuario si lo menciona
    const nameMatch = userInput.match(/(?:me llamo|soy) (\w+)/i);
    if (nameMatch && nameMatch[1]) {
      newContext.userInfo.name = nameMatch[1];
    }
    
    // Extraer posible rol o cargo del usuario
    const roleMatch = userInput.match(/(?:trabajo como|soy) (?:un |una |)([\w\s]+?)(?:,|\.|y|en|$)/i);
    if (roleMatch && roleMatch[1]) {
      newContext.userInfo.role = roleMatch[1].trim();
    }
    
    setConversationContext(newContext);
  };

  const generateSofiaResponse = (userInput: string, context: typeof conversationContext): {message: string, suggestions?: string[]} => {
    // Versión mejorada que utiliza el contexto de la conversación
    const input = userInput.toLowerCase();
    
    // Personalizar el saludo si conocemos el nombre del usuario
    const personalizacion = context.userInfo.name ? `${context.userInfo.name}` : '';
    
    // Usar las preferencias del usuario para ajustar el nivel de detalle
    const esDetallado = context.userPreferences.includes('detallado');
    const esConciso = context.userPreferences.includes('conciso');
    
    // Referencia a consultas anteriores si existen
    const tieneHistorial = context.lastQueries.length > 1;
    
    // Analizar consultas específicas usando el contexto
    if (input.includes('análisis') && input.includes('x')) {
      // Respuesta más personalizada y contextual
      let respuesta = "He analizado tus menciones en X durante los últimos 30 días. ";
      
      if (personalizacion) {
        respuesta = `${personalizacion}, ${respuesta.toLowerCase()}`;
      }
      
      respuesta += "Observo un sentimiento general positivo (65%), con algunos temas recurrentes: tus propuestas de desarrollo sostenible han generado buena recepción. ";
      
      if (esDetallado) {
        respuesta += "Los hashtags #DesarrolloSostenible y #FuturoVerde asociados a tus publicaciones han tenido un 78% de interacciones positivas, principalmente en audiencias urbanas entre 25-45 años. ";
      }
      
      respuesta += "Sin embargo, detecto un 15% de menciones negativas relacionadas con tu postura sobre transporte público. ";
      
      if (context.topics.includes('crisis')) {
        respuesta += "Noto que anteriormente te interesó el manejo de crisis. Esta situación podría requerir atención preventiva. ";
      }
      
      respuesta += "¿Te gustaría un análisis más detallado sobre este aspecto?";
      
      return {
        message: respuesta,
        suggestions: ["Profundizar en menciones negativas", "Comparar con competidores", "Sugerir respuesta a críticas"]
      };
    } 
    else if (input.includes('linkedin')) {
      let respuesta = "Para mejorar tu presencia en LinkedIn, te recomiendo: ";
      
      if (context.userInfo.role && context.userInfo.role.includes('político')) {
        respuesta += "Como figura política, deberías 1) Destacar tus logros en políticas públicas, 2) ";
      } else {
        respuesta += "1) Actualizar tu perfil con palabras clave relacionadas a tu sector, 2) ";
      }
      
      respuesta += "Publicar contenido de valor 2-3 veces por semana alternando formatos, 3) Interactuar con líderes de opinión de tu sector, y 4) Compartir casos de éxito de proyectos anteriores. ";
      
      if (esDetallado) {
        respuesta += "Tus publicaciones actuales tienen una interacción un 23% por debajo del promedio para perfiles de tu sector. El análisis de engagement muestra que tus publicaciones con imágenes reciben un 45% más de interacciones que las que solo contienen texto. ";
      } else if (esConciso) {
        respuesta += "El análisis muestra que necesitas mejorar tu tasa de engagement en un 23%. ";
      } else {
        respuesta += "Tus publicaciones actuales tienen una interacción un 23% por debajo del promedio para perfiles de tu sector. ";
      }
      
      respuesta += "¿Quieres que elabore un plan de contenido semanal?";
      
      return {
        message: respuesta,
        suggestions: ["Crear plan de contenido", "Ejemplos de publicaciones efectivas", "Mejorar interacción"]
      };
    }
    else if (input.includes('crisis') || input.includes('negativ')) {
      let respuesta = "Para gestionar una crisis de reputación, ";
      
      if (tieneHistorial && context.topics.includes('estrategia')) {
        respuesta += "continuando con nuestra conversación sobre estrategias, ";
      }
      
      respuesta += "recomiendo este protocolo: 1) Monitoreo intensivo para entender el alcance y origen, 2) Preparar comunicado oficial abordando directamente la situación, 3) Activar respuesta en todos los canales donde la crisis es visible, 4) Comunicación transparente y honesta, sin evasivas, 5) Seguimiento posterior a la crisis para evaluar el impacto. ";
      
      if (esDetallado) {
        respuesta += "Es crucial identificar si se trata de una crítica aislada o un patrón emergente. Nuestros datos muestran que el 67% de las crisis de reputación comienzan en Twitter/X y luego se expanden a otras plataformas, con un tiempo promedio de 3.5 horas antes de volverse virales. ";
      }
      
      respuesta += "¿Estás enfrentando actualmente alguna situación específica que requiera atención?";
      
      return {
        message: respuesta,
        suggestions: ["Elaborar comunicado", "Analizar impacto actual", "Prevención de crisis futuras"]
      };
    }
    else if (input.includes('tendencia') || input.includes('tema')) {
      let respuesta = "";
      
      if (personalizacion) {
        respuesta = `${personalizacion}, analizando las conversaciones `;
      } else {
        respuesta = "Analizando las conversaciones ";
      }
      
      if (context.userInfo.role && context.userInfo.role.includes('político')) {
        respuesta += "del sector político en Colombia ";
      } else {
        respuesta += "de tu sector ";
      }
      
      respuesta += "durante la última semana, estas son las tendencias clave: 1) Sostenibilidad y cambio climático (+43% menciones vs semana anterior), 2) Transformación digital del gobierno (+27%), 3) Seguridad ciudadana en zonas urbanas (+18%), 4) Reforma educativa (-5%). ";
      
      if (context.topics.includes('redes_sociales')) {
        respuesta += "Estos temas están teniendo mayor resonancia en Twitter e Instagram, con diferentes enfoques en cada plataforma. ";
      }
      
      respuesta += "Tu presencia en estos temas es fuerte en sostenibilidad, pero tienes oportunidad de posicionarte mejor en transformación digital. ¿Desearías un plan de contenidos enfocado en alguno de estos temas?";
      
      return {
        message: respuesta,
        suggestions: ["Plan de contenidos sostenibilidad", "Mejorar posición en transformación digital", "Comparativa con otros candidatos"]
      };
    }
    else if (input.includes('hola') || input.includes('saludos') || input.includes('buenos')) {
      let respuesta = "¡Hola";
      
      if (personalizacion) {
        respuesta += `, ${personalizacion}`;
      }
      
      respuesta += "! Soy Sofia, tu asistente de IA especializada en reputación online. ";
      
      if (tieneHistorial) {
        respuesta += "Me alegra verte de nuevo. ";
      }
      
      respuesta += "Puedo ayudarte con análisis de sentimiento en redes sociales, detectar tendencias, generar perspectivas estratégicas, o sugerir acciones para mejorar tu imagen digital. ";
      
      if (context.topics.length > 0) {
        respuesta += `Veo que te ha interesado ${context.topics.includes('analisis') ? 'el análisis de datos' : context.topics.includes('estrategia') ? 'las estrategias de contenido' : 'la gestión de reputación'}. ¿Quieres continuar con ese tema? `;
      }
      
      respuesta += "¿Qué te gustaría conocer hoy?";
      
      const sugerencias = ["Analizar mis menciones recientes", "Sugerir estrategia de contenido"];
      
      if (context.topics.includes('crisis')) {
        sugerencias.push("Revisar plan de manejo de crisis");
      } else {
        sugerencias.push("Detectar riesgos para mi reputación");
      }
      
      return {
        message: respuesta,
        suggestions: sugerencias
      };
    }
    else {
      let respuesta = "Gracias por tu consulta";
      
      if (personalizacion) {
        respuesta += `, ${personalizacion}`;
      }
      
      respuesta += ". ";
      
      if (tieneHistorial) {
        respuesta += "Basándome en nuestra conversación anterior, ";
      }
      
      respuesta += "Para proporcionarte la información más precisa, ¿podrías especificar en qué red social o aspecto de tu reputación online estás interesado? Puedo analizar sentimientos, tendencias, sugerir estrategias de contenido o ayudarte a gestionar situaciones específicas.";
      
      return {
        message: respuesta,
        suggestions: ["Analizar X", "Estrategia para Instagram", "Gestionar comentarios negativos"]
      };
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col h-full">
      {/* Cabecera del chat */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 px-6 py-4 rounded-t-lg flex items-center">
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mr-4 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
            <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.178-.331.176-.662.352-.988.528-2.56 1.386-4.926 2.837-6.735 4.246a60.376 60.376 0 0 0-1.257.95 4.125 4.125 0 0 0-.296.282c-.166.16-.33.32-.487.485l-.006.006a2.619 2.619 0 0 0-.361.39c-.088.108-.172.22-.25.337a2.99 2.99 0 0 0-.225.394 3.81 3.81 0 0 0-.101.783c0 .903.462 1.697 1.16 2.157.55.36 1.257.53 2.069.53a5.33 5.33 0 0 0 1.564-.239c.542-.174 1.096-.429 1.675-.76C11.043 22.56 14.61 20.895 17.6 19.5c5.298-2.477 7.951-5.41 7.951-7.5 0-1.041-.406-2.042-1.194-2.982A6.753 6.753 0 0 0 22.8 7.4a6.08 6.08 0 0 0-1.964-1.872A6.893 6.893 0 0 0 18.724 4.8c-.47 0-.914.073-1.312.219a5.69 5.69 0 0 0-1.56.95a5.491 5.491 0 0 0-1.13 1.215c-.238.35-.43.7-.57 1.05a4.751 4.751 0 0 0-.076-.572 6.414 6.414 0 0 0-.064-.401c-.071-.363-.17-.693-.3-.985a4.57 4.57 0 0 0-.394-.8c-.629-1.013-1.68-1.684-2.955-1.684-1.442 0-2.697.66-3.262 1.653-.59 1.035-.59 2.354 0 3.59.137.283.313.55.521.798.467.556 1.155 1.038 1.997 1.455a1.674 1.674 0 0 1-.557-.797c-.113-.325-.069-.678.137-.976.06-.088.128-.172.2-.25a1.87 1.87 0 0 1 .272-.25c.123-.095.263-.178.426-.241.208-.088.458-.142.769-.142.3 0 .559.054.785.142a1.81 1.81 0 0 1 .484.297a1.668 1.668 0 0 1 .342.454c.072.131.124.295.156.491.07.426.01.81-.193 1.148a1.744 1.744 0 0 1-.43.467 5.212 5.212 0 0 1-.495.327a9.05 9.05 0 0 1-.583.29c-.2.095-.398.179-.592.242-1.95.661-3.203 1.358-3.762 2.09a3.272 3.272 0 0 0-.305.546c-.592 1.298-.157 2.433 1.307 3.388 1.157.757 2.646 1.136 4.467 1.136 1.87 0 4.126-.449 6.767-1.345 2.601-.882 4.992-2.133 7.17-3.75a.75.75 0 0 0 .272-.83 21.999 21.999 0 0 0-12.271-14.987Z" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Sofia</h3>
          <p className="text-primary-100 text-sm">Asistente inteligente • <span className="text-white/70">En línea</span></p>
        </div>
      </div>
      
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-primary-500 ml-3' : 'bg-gray-200 dark:bg-gray-700 mr-3'}`}>
                {message.sender === 'user' ? (
                  <FaUser className="text-white" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-500 dark:text-primary-400">
                    <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.178-.331.176-.662.352-.988.528-2.56 1.386-4.926 2.837-6.735 4.246a60.376 60.376 0 0 0-1.257.95 4.125 4.125 0 0 0-.296.282c-.166.16-.33.32-.487.485l-.006.006a2.619 2.619 0 0 0-.361.39c-.088.108-.172.22-.25.337a2.99 2.99 0 0 0-.225.394 3.81 3.81 0 0 0-.101.783c0 .903.462 1.697 1.16 2.157.55.36 1.257.53 2.069.53a5.33 5.33 0 0 0 1.564-.239c.542-.174 1.096-.429 1.675-.76C11.043 22.56 14.61 20.895 17.6 19.5c5.298-2.477 7.951-5.41 7.951-7.5 0-1.041-.406-2.042-1.194-2.982A6.753 6.753 0 0 0 22.8 7.4a6.08 6.08 0 0 0-1.964-1.872A6.893 6.893 0 0 0 18.724 4.8c-.47 0-.914.073-1.312.219a5.69 5.69 0 0 0-1.56.95 5.491 5.491 0 0 0-1.13 1.215c-.238.35-.43.7-.57 1.05a4.751 4.751 0 0 0-.076-.572 6.414 6.414 0 0 0-.064-.401c-.071-.363-.17-.693-.3-.985a4.57 4.57 0 0 0-.394-.8c-.629-1.013-1.68-1.684-2.955-1.684-1.442 0-2.697.66-3.262 1.653-.59 1.035-.59 2.354 0 3.59.137.283.313.55.521.798.467.556 1.155 1.038 1.997 1.455a1.674 1.674 0 0 1-.557-.797c-.113-.325-.069-.678.137-.976.06-.088.128-.172.2-.25a1.87 1.87 0 0 1 .272-.25c.123-.095.263-.178.426-.241.208-.088.458-.142.769-.142.3 0 .559.054.785.142a1.81 1.81 0 0 1 .484.297a1.668 1.668 0 0 1 .342.454c.072.131.124.295.156.491.07.426.01.81-.193 1.148a1.744 1.744 0 0 1-.43.467 5.212 5.212 0 0 1-.495.327a9.05 9.05 0 0 1-.583.29c-.2.095-.398.179-.592.242-1.95.661-3.203 1.358-3.762 2.09a3.272 3.272 0 0 0-.305.546c-.592 1.298-.157 2.433 1.307 3.388 1.157.757 2.646 1.136 4.467 1.136 1.87 0 4.126-.449 6.767-1.345 2.601-.882 4.992-2.133 7.17-3.75a.75.75 0 0 0 .272-.83 21.999 21.999 0 0 0-12.271-14.987Z" />
                  </svg>
                )}
              </div>
              
              <div>
                <div className={`rounded-2xl px-4 py-3 mb-1 ${message.sender === 'user' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'}`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                
                <div className={`text-xs text-gray-500 dark:text-gray-400 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {formatTimestamp(message.timestamp)}
                </div>
                
                {/* Sugerencias que aparecen debajo de los mensajes de Sofia */}
                {message.sender === 'sofia' && message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-sm bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-full px-3 py-1 hover:bg-primary-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%]">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-500 dark:text-primary-400">
                  <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.178-.331.176-.662.352-.988.528-2.56 1.386-4.926 2.837-6.735 4.246a60.376 60.376 0 0 0-1.257.95 4.125 4.125 0 0 0-.296.282c-.166.16-.33.32-.487.485l-.006.006a2.619 2.619 0 0 0-.361.39c-.088.108-.172.22-.25.337a2.99 2.99 0 0 0-.225.394 3.81 3.81 0 0 0-.101.783c0 .903.462 1.697 1.16 2.157.55.36 1.257.53 2.069.53a5.33 5.33 0 0 0 1.564-.239c.542-.174 1.096-.429 1.675-.76C11.043 22.56 14.61 20.895 17.6 19.5c5.298-2.477 7.951-5.41 7.951-7.5 0-1.041-.406-2.042-1.194-2.982A6.753 6.753 0 0 0 22.8 7.4a6.08 6.08 0 0 0-1.964-1.872A6.893 6.893 0 0 0 18.724 4.8c-.47 0-.914.073-1.312.219a5.69 5.69 0 0 0-1.56.95a5.491 5.491 0 0 0-1.13 1.215c-.238.35-.43.7-.57 1.05a4.751 4.751 0 0 0-.076-.572 6.414 6.414 0 0 0-.064-.401c-.071-.363-.17-.693-.3-.985a4.57 4.57 0 0 0-.394-.8c-.629-1.013-1.68-1.684-2.955-1.684-1.442 0-2.697.66-3.262 1.653-.59 1.035-.59 2.354 0 3.59.137.283.313.55.521.798.467.556 1.155 1.038 1.997 1.455a1.674 1.674 0 0 1-.557-.797c-.113-.325-.069-.678.137-.976.06-.088.128-.172.2-.25a1.87 1.87 0 0 1 .272-.25c.123-.095.263-.178.426-.241.208-.088.458-.142.769-.142.3 0 .559.054.785.142a1.81 1.81 0 0 1 .484.297a1.668 1.668 0 0 1 .342.454c.072.131.124.295.156.491.07.426.01.81-.193 1.148a1.744 1.744 0 0 1-.43.467a5.212 5.212 0 0 1-.495.327a9.05 9.05 0 0 1-.583.29c-.2.095-.398.179-.592.242-1.95.661-3.203 1.358-3.762 2.09a3.272 3.272 0 0 0-.305.546c-.592 1.298-.157 2.433 1.307 3.388 1.157.757 2.646 1.136 4.467 1.136 1.87 0 4.126-.449 6.767-1.345 2.601-.882 4.992-2.133 7.17-3.75a.75.75 0 0 0 .272-.83 21.999 21.999 0 0 0-12.271-14.987Z" />
                </svg>
              </div>
              <div>
                <div className="rounded-2xl px-4 py-3 mb-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg pl-4 pr-2 py-2">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje a Sofia..."
            className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            onClick={handleSendMessage}
            disabled={inputMessage.trim() === ''}
            className={`p-2 rounded-full ${inputMessage.trim() === '' ? 'text-gray-400 cursor-not-allowed' : 'text-primary-500 hover:bg-primary-100 dark:hover:bg-gray-700'}`}
          >
            <FaPaperPlane />
          </button>
        </div>
        
        <div className="flex items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
          <FaRegLightbulb className="mr-2" />
          <span>Sofia puede analizar sentimientos, detectar tendencias y sugerir estrategias para mejorar tu reputaciu00f3n online.</span>
        </div>
      </div>
    </div>
  );
};

export default SofiaChat;
