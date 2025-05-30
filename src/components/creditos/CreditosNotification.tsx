import React, { useState, useEffect } from 'react';
import { useCreditosContext } from '@/context/CreditosContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, CreditCard } from 'lucide-react';

export default function CreditosNotification() {
  const { creditos } = useCreditosContext();
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mostrarCompra, setMostrarCompra] = useState(false);
  
  useEffect(() => {
    if (creditos.disponibles > 0) {
      const porcentajeDisponible = (creditos.disponibles / (creditos.disponibles + creditos.gastados)) * 100;
      
      // Mostrar alerta si los cru00e9ditos estu00e1n por debajo del umbral
      if (porcentajeDisponible <= creditos.umbralAlerta) {
        setMostrarAlerta(true);
        
        // Si los cru00e9ditos son muy bajos, mostrar tambiu00e9n la opciu00f3n de compra
        if (porcentajeDisponible <= 10) {
          setMostrarCompra(true);
        }
      } else {
        setMostrarAlerta(false);
        setMostrarCompra(false);
      }
    } else if (creditos.disponibles <= 0) {
      // Si no hay cru00e9ditos, mostrar alerta cru00edtica
      setMostrarAlerta(true);
      setMostrarCompra(true);
    }
  }, [creditos.disponibles, creditos.gastados, creditos.umbralAlerta]);
  
  // Cerrar la notificaciu00f3n
  const cerrarNotificacion = () => {
    setMostrarAlerta(false);
  };
  
  // Animaciu00f3n para la notificaciu00f3n
  const notificationVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0,
      y: -50,
      transition: { 
        duration: 0.3 
      }
    }
  };
  
  // Determinar el color de la alerta segu00fan el nivel de cru00e9ditos
  const getAlertaColor = () => {
    const porcentajeDisponible = (creditos.disponibles / (creditos.disponibles + creditos.gastados)) * 100;
    
    if (creditos.disponibles <= 0) {
      return 'bg-red-500 dark:bg-red-800';
    } else if (porcentajeDisponible <= 10) {
      return 'bg-red-500 dark:bg-red-800';
    } else if (porcentajeDisponible <= 30) {
      return 'bg-amber-500 dark:bg-amber-800';
    } else {
      return 'bg-blue-500 dark:bg-blue-800';
    }
  };
  
  // Obtener el mensaje de la alerta segu00fan el nivel de cru00e9ditos
  const getMensajeAlerta = () => {
    const porcentajeDisponible = (creditos.disponibles / (creditos.disponibles + creditos.gastados)) * 100;
    
    if (creditos.disponibles <= 0) {
      return 'u00a1No tienes cru00e9ditos disponibles! Compra mu00e1s para seguir usando la plataforma.';
    } else if (porcentajeDisponible <= 10) {
      return `u00a1Nivel cru00edtico de cru00e9ditos! Solo te quedan ${creditos.disponibles} cru00e9ditos disponibles.`;
    } else if (porcentajeDisponible <= 30) {
      return `Tus cru00e9ditos estu00e1n bajos. Te quedan ${creditos.disponibles} cru00e9ditos disponibles.`;
    } else {
      return `Estu00e1s por debajo del umbral de alerta (${creditos.umbralAlerta}%). Te quedan ${creditos.disponibles} cru00e9ditos.`;
    }
  };
  
  return (
    <AnimatePresence>
      {mostrarAlerta && (
        <motion.div
          className={`fixed bottom-4 right-4 z-50 flex max-w-md items-center justify-between rounded-lg p-4 text-white shadow-lg ${getAlertaColor()}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={notificationVariants}
        >
          <div className="flex items-center">
            <AlertCircle className="mr-3 h-6 w-6" />
            <p className="text-sm font-medium">{getMensajeAlerta()}</p>
          </div>
          
          <div className="ml-4 flex items-center space-x-2">
            {mostrarCompra && (
              <button 
                className="rounded-md bg-white bg-opacity-20 px-3 py-1 text-xs font-medium text-white hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40"
                onClick={() => console.log('Navegar a compra de cru00e9ditos')}
              >
                <CreditCard className="mr-1 inline h-3 w-3" />
                Comprar
              </button>
            )}
            
            <button 
              className="rounded-full p-1 hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40"
              onClick={cerrarNotificacion}
              aria-label="Cerrar notificaciu00f3n"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
