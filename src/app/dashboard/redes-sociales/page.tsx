"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, Facebook, Instagram, Linkedin, Youtube, Music, Globe, Check, AlertCircle, Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type RedSocial = {
  id: number;
  nombre: string;
  icono: any;
  usuario?: string;
  followers?: string;
  conectado: boolean;
  estado?: string;
  color: string;
};

export default function RedesSocialesPage() {
  // Estado para redes sociales conectadas y pendientes
  const [redesConectadas, setRedesConectadas] = useState<RedSocial[]>([
    { id: 1, nombre: 'Twitter', icono: Twitter, usuario: '@tuempresa', followers: '5.2K', conectado: true, estado: 'activo', color: 'bg-blue-500' },
    { id: 2, nombre: 'Facebook', icono: Facebook, usuario: 'Tu Empresa', followers: '12.8K', conectado: true, estado: 'activo', color: 'bg-blue-600' },
    { id: 3, nombre: 'Instagram', icono: Instagram, usuario: '@tuempresa', followers: '8.7K', conectado: true, estado: 'activo', color: 'bg-pink-600' }
  ]);
  
  const [redesDisponibles, setRedesDisponibles] = useState<RedSocial[]>([
    { id: 4, nombre: 'LinkedIn', icono: Linkedin, conectado: false, color: 'bg-blue-700' },
    { id: 5, nombre: 'YouTube', icono: Youtube, conectado: false, color: 'bg-red-600' },
    { id: 6, nombre: 'TikTok', icono: Music, conectado: false, color: 'bg-black' },
    { id: 7, nombre: 'Sitio Web', icono: Globe, conectado: false, color: 'bg-gray-600' }
  ]);
  
  // Estados para el modal de conexión
  const [modalAbierto, setModalAbierto] = useState(false);
  const [redSeleccionada, setRedSeleccionada] = useState<RedSocial | null>(null);
  
  // Estados para formulario de conexión
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [token, setToken] = useState('');
  const [conectando, setConectando] = useState(false);
  
  // Función para abrir el modal de conexión
  const abrirModalConexion = (red: RedSocial) => {
    setRedSeleccionada(red);
    setUsuario('');
    setContraseña('');
    setToken('');
    setModalAbierto(true);
  };
  
  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setRedSeleccionada(null);
  };
  
  // Función para simular la conexión de una red social
  const conectarRedSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!redSeleccionada) return;
    
    try {
      setConectando(true);
      
      // Simulamos una llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Actualizamos el estado
      const nuevaRed = {
        ...redSeleccionada,
        usuario: usuario || `@${usuario || 'usuario'}`,
        followers: '0',
        conectado: true,
        estado: 'activo'
      };
      
      setRedesConectadas([...redesConectadas, nuevaRed]);
      setRedesDisponibles(redesDisponibles.filter(red => red.id !== redSeleccionada.id));
      
      cerrarModal();
    } catch (error) {
      console.error('Error al conectar red social:', error);
    } finally {
      setConectando(false);
    }
  };
  
  // Función para desconectar una red social
  const desconectarRedSocial = (id: number) => {
    const redDesconectada = redesConectadas.find(red => red.id === id);
    
    if (redDesconectada) {
      // Movemos la red de conectadas a disponibles
      const redParaDisponibles = {
        id: redDesconectada.id,
        nombre: redDesconectada.nombre,
        icono: redDesconectada.icono,
        conectado: false,
        color: redDesconectada.color
      };
      
      setRedesDisponibles([...redesDisponibles, redParaDisponibles]);
      setRedesConectadas(redesConectadas.filter(red => red.id !== id));
    }
  };
  
  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">Conecta tus Redes Sociales</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Conecta tus redes sociales para monitorear y analizar tu presencia digital en un solo lugar
        </p>
      </motion.div>
      
      {/* Dashboard de redes conectadas */}
      <div className="mb-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Redes Sociales Conectadas</h2>
          <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200">
            {redesConectadas.length} conectadas
          </span>
        </div>
        
        {redesConectadas.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {redesConectadas.map((red) => (
              <motion.div 
                key={red.id}
                variants={itemVariants}
                className="overflow-hidden"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card>
                  <div className={cn("p-4", red.color)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-white">
                        <red.icono className="h-6 w-6" />
                        <h3 className="ml-2 font-semibold">{red.nombre}</h3>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-white bg-opacity-25 px-2 py-1 text-xs font-medium text-white">
                        {red.estado === 'activo' ? (
                          <>
                            <Check className="mr-1 h-3 w-3" />
                            Activa
                          </>
                        ) : (
                          <>
                            <AlertCircle className="mr-1 h-3 w-3" />
                            {red.estado}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-4 flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Usuario</p>
                        <p className="font-medium text-gray-900 dark:text-white">{red.usuario}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Seguidores</p>
                        <p className="font-medium text-gray-900 dark:text-white">{red.followers}</p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                    <Button 
                      variant="ghost"
                      className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                      onClick={() => {}}
                    >
                      Ver estadísticas
                    </Button>
                    <Button 
                      variant="ghost"
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => desconectarRedSocial(red.id)}
                    >
                      Desconectar
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No hay redes sociales conectadas</p>
            <Button 
              className="mt-4"
              onClick={() => {}}
            >
              Conectar primera red social
            </Button>
          </Card>
        )}
      </div>
      
      {/* Redes sociales disponibles para conectar */}
      <div>
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Conecta más redes</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Amplía tu monitoreo conectando más canales</p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {redesDisponibles.map((red) => (
            <motion.div
              key={red.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <Card className="cursor-pointer border-2 border-dashed border-gray-200 hover:border-primary-400 dark:border-gray-700 dark:hover:border-primary-500">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className={cn("mb-4 flex h-14 w-14 items-center justify-center rounded-full", red.color)}>
                    <red.icono className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-1 text-lg font-medium">{red.nombre}</h3>
                  <p className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Analiza menciones y sentimiento en {red.nombre}
                  </p>
                  <Button
                    onClick={() => abrirModalConexion(red)}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Conectar
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Modal de conexión */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {redSeleccionada && (
                <>
                  <div className={cn("mr-2 flex h-8 w-8 items-center justify-center rounded-full", redSeleccionada.color)}>
                    <redSeleccionada.icono className="h-4 w-4 text-white" />
                  </div>
                  Conectar {redSeleccionada.nombre}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Ingresa las credenciales necesarias para conectar tu cuenta
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={conectarRedSocial}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="usuario" className="text-sm font-medium">
                  Nombre de usuario
                </label>
                <input
                  id="usuario"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                  placeholder={redSeleccionada?.nombre === 'Sitio Web' ? 'https://tusitio.com' : '@usuario'}
                  required
                />
              </div>
              
              {redSeleccionada?.nombre !== 'Sitio Web' && (
                <div className="grid gap-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                    placeholder="•••••••••"
                    required
                  />
                </div>
              )}
              
              {(redSeleccionada?.nombre === 'Twitter' || redSeleccionada?.nombre === 'Facebook') && (
                <div className="grid gap-2">
                  <label htmlFor="token" className="text-sm font-medium">
                    API Token (opcional)
                  </label>
                  <input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                    placeholder="abc123xyz..."
                  />
                </div>
              )}
              
              <div className="rounded-md bg-cyan-50 p-3 text-sm text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300">
                <p>Conectar tu cuenta nos permitirá monitorear menciones y analizar sentimiento. No publicaremos sin tu permiso.</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={cerrarModal} disabled={conectando}>
                Cancelar
              </Button>
              <Button type="submit" disabled={conectando}>
                {conectando ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Conectando...
                  </>
                ) : (
                  'Conectar cuenta'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Componente flotante de chat con Sofia */}
      {/* <ChatSofia /> */}
    </div>
  );
}
