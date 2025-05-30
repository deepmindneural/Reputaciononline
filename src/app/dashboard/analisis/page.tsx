"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Twitter, Facebook, Instagram, Linkedin, Youtube, Globe, Bookmark, Calendar, TrendingUp, AlertTriangle, CheckCircle2, RefreshCcw } from 'lucide-react';

// Datos de muestra para análisis
const datosMenciones = [
  { fecha: 'Ene', Twitter: 65, Facebook: 40, Instagram: 25, LinkedIn: 18 },
  { fecha: 'Feb', Twitter: 59, Facebook: 45, Instagram: 28, LinkedIn: 20 },
  { fecha: 'Mar', Twitter: 80, Facebook: 50, Instagram: 35, LinkedIn: 25 },
  { fecha: 'Abr', Twitter: 81, Facebook: 55, Instagram: 40, LinkedIn: 30 },
  { fecha: 'May', Twitter: 56, Facebook: 48, Instagram: 38, LinkedIn: 28 },
  { fecha: 'Jun', Twitter: 55, Facebook: 42, Instagram: 30, LinkedIn: 25 },
  { fecha: 'Jul', Twitter: 70, Facebook: 47, Instagram: 32, LinkedIn: 26 },
];

const datosSentimiento = [
  { name: 'Positivo', value: 65, color: '#10b981' },
  { name: 'Neutro', value: 25, color: '#6b7280' },
  { name: 'Negativo', value: 10, color: '#ef4444' },
];

const datosCanales = [
  { name: 'Twitter', value: 45, color: '#1DA1F2' },
  { name: 'Facebook', value: 25, color: '#1877F2' },
  { name: 'Instagram', value: 18, color: '#E4405F' },
  { name: 'LinkedIn', value: 12, color: '#0A66C2' },
];

const alertasRecientes = [
  { id: 1, tipo: 'negativo', plataforma: 'Twitter', mensaje: 'Incremento de 15% en menciones negativas', fecha: 'Hace 2 horas' },
  { id: 2, tipo: 'positivo', plataforma: 'Instagram', mensaje: 'Incremento de 25% en menciones positivas', fecha: 'Hace 5 horas' },
  { id: 3, tipo: 'neutral', plataforma: 'Facebook', mensaje: 'Nuevo comentario de influencer identificado', fecha: 'Hace 1 día' },
];

export default function AnalisisPage() {
  const [cargando, setCargando] = useState(true);
  
  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setCargando(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Conseguir el icono correspondiente a cada plataforma
  const getIconoPlataforma = (plataforma: string) => {
    switch (plataforma) {
      case 'Twitter':
        return <Twitter className="h-5 w-5 text-[#1DA1F2]" />;
      case 'Facebook':
        return <Facebook className="h-5 w-5 text-[#1877F2]" />;
      case 'Instagram':
        return <Instagram className="h-5 w-5 text-[#E4405F]" />;
      case 'LinkedIn':
        return <Linkedin className="h-5 w-5 text-[#0A66C2]" />;
      default:
        return <Globe className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Conseguir el icono y color para el tipo de alerta
  const getAlertaInfo = (tipo: string) => {
    switch (tipo) {
      case 'positivo':
        return { icono: <CheckCircle2 className="h-5 w-5 text-green-500" />, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
      case 'negativo':
        return { icono: <AlertTriangle className="h-5 w-5 text-red-500" />, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
      default:
        return { icono: <TrendingUp className="h-5 w-5 text-blue-500" />, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">Análisis de Reputación</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitorea y analiza tu presencia online a través de diferentes plataformas
        </p>
      </motion.div>
      
      {cargando ? (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center">
            <RefreshCcw className="h-12 w-12 animate-spin text-primary-600" />
            <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">Cargando análisis...</p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6 w-full justify-start rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            <TabsTrigger value="general" className="rounded-md px-4 py-2">
              General
            </TabsTrigger>
            <TabsTrigger value="menciones" className="rounded-md px-4 py-2">
              Menciones
            </TabsTrigger>
            <TabsTrigger value="sentimiento" className="rounded-md px-4 py-2">
              Análisis de Sentimiento
            </TabsTrigger>
            <TabsTrigger value="canales" className="rounded-md px-4 py-2">
              Canales
            </TabsTrigger>
          </TabsList>
          
          {/* Pestaña General */}
          <TabsContent value="general" className="w-full">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Menciones Totales</CardTitle>
                    <CardDescription>Últimos 30 días</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">1,248</div>
                    <p className="flex items-center text-sm text-green-600 dark:text-green-400">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      <span>12% más que el mes anterior</span>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Sentimiento General</CardTitle>
                    <CardDescription>Percepción de marca</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400">Positivo</div>
                    <p className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <span>65% menciones positivas</span>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Canal Principal</CardTitle>
                    <CardDescription>Mayor actividad</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Twitter className="h-8 w-8 text-[#1DA1F2]" />
                      <div className="ml-3">
                        <div className="text-2xl font-bold">Twitter</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">45% del total de menciones</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Alertas Recientes</CardTitle>
                  <CardDescription>Cambios significativos en tu reputación online</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alertasRecientes.map((alerta) => {
                      const { icono, color } = getAlertaInfo(alerta.tipo);
                      return (
                        <div 
                          key={alerta.id}
                          className="flex items-start rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-850"
                        >
                          <div className={`mr-4 rounded-full p-2 ${color}`}>
                            {icono}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              {getIconoPlataforma(alerta.plataforma)}
                              <span className="ml-2 font-medium">{alerta.plataforma}</span>
                            </div>
                            <p className="mt-1 text-gray-700 dark:text-gray-300">{alerta.mensaje}</p>
                            <p className="mt-1 text-xs text-gray-500">{alerta.fecha}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-900">
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Calendar className="mr-2 h-4 w-4" />
                    Ver historial completo
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Pestaña de Menciones */}
          <TabsContent value="menciones" className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Evolución de Menciones</CardTitle>
                <CardDescription>Menciones por plataforma en los últimos 7 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={datosMenciones}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Twitter" stackId="a" fill="#1DA1F2" />
                      <Bar dataKey="Facebook" stackId="a" fill="#1877F2" />
                      <Bar dataKey="Instagram" stackId="a" fill="#E4405F" />
                      <Bar dataKey="LinkedIn" stackId="a" fill="#0A66C2" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between w-full">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total de menciones: <span className="font-medium">1,248</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Exportar datos
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Pestaña de Análisis de Sentimiento */}
          <TabsContent value="sentimiento" className="w-full">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Sentimiento</CardTitle>
                  <CardDescription>Análisis global de percepción</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={datosSentimiento}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {datosSentimiento.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Evolución del Sentimiento</CardTitle>
                  <CardDescription>Cambios en la percepción en el tiempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { mes: 'Ene', positivo: 45, neutro: 40, negativo: 15 },
                          { mes: 'Feb', positivo: 50, neutro: 35, negativo: 15 },
                          { mes: 'Mar', positivo: 55, neutro: 30, negativo: 15 },
                          { mes: 'Abr', positivo: 60, neutro: 30, negativo: 10 },
                          { mes: 'May', positivo: 65, neutro: 25, negativo: 10 },
                          { mes: 'Jun', positivo: 60, neutro: 30, negativo: 10 },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="positivo" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="neutro" stroke="#6b7280" strokeWidth={2} />
                        <Line type="monotone" dataKey="negativo" stroke="#ef4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Pestaña de Canales */}
          <TabsContent value="canales" className="w-full">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Canales</CardTitle>
                  <CardDescription>Menciones por plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={datosCanales}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {datosCanales.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento por Canal</CardTitle>
                  <CardDescription>Comparativa de rendimiento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { nombre: 'Twitter', valor: 85, color: '#1DA1F2' },
                      { nombre: 'Facebook', valor: 70, color: '#1877F2' },
                      { nombre: 'Instagram', valor: 65, color: '#E4405F' },
                      { nombre: 'LinkedIn', valor: 60, color: '#0A66C2' },
                    ].map((canal) => (
                      <div key={canal.nombre} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getIconoPlataforma(canal.nombre)}
                            <span className="ml-2 font-medium">{canal.nombre}</span>
                          </div>
                          <span>{canal.valor}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ width: `${canal.valor}%`, backgroundColor: canal.color }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
