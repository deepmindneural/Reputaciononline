"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, 
  Twitter, Facebook, Instagram, Linkedin, Download, Filter 
} from 'lucide-react';

// Datos de ejemplo para los gráficos
const datosSentimiento = [
  { name: 'Positivo', value: 65, color: '#10b981' },
  { name: 'Neutro', value: 25, color: '#6b7280' },
  { name: 'Negativo', value: 10, color: '#ef4444' },
];

const datosPlataformas = [
  { name: 'Twitter', value: 45, color: '#1DA1F2' },
  { name: 'Facebook', value: 25, color: '#1877F2' },
  { name: 'Instagram', value: 18, color: '#E4405F' },
  { name: 'LinkedIn', value: 12, color: '#0A66C2' },
];

const datosMenciones = [
  { fecha: 'Ene', Twitter: 65, Facebook: 40, Instagram: 25, LinkedIn: 18 },
  { fecha: 'Feb', Twitter: 59, Facebook: 45, Instagram: 28, LinkedIn: 20 },
  { fecha: 'Mar', Twitter: 80, Facebook: 50, Instagram: 35, LinkedIn: 25 },
  { fecha: 'Abr', Twitter: 81, Facebook: 55, Instagram: 40, LinkedIn: 30 },
  { fecha: 'May', Twitter: 56, Facebook: 48, Instagram: 38, LinkedIn: 28 },
  { fecha: 'Jun', Twitter: 55, Facebook: 42, Instagram: 30, LinkedIn: 25 },
  { fecha: 'Jul', Twitter: 70, Facebook: 47, Instagram: 32, LinkedIn: 26 },
];

const datosEvolucionSentimiento = [
  { mes: 'Ene', positivo: 45, neutro: 40, negativo: 15 },
  { mes: 'Feb', positivo: 50, neutro: 35, negativo: 15 },
  { mes: 'Mar', positivo: 55, neutro: 30, negativo: 15 },
  { mes: 'Abr', positivo: 60, neutro: 30, negativo: 10 },
  { mes: 'May', positivo: 65, neutro: 25, negativo: 10 },
  { mes: 'Jun', positivo: 60, neutro: 30, negativo: 10 },
];

// Componente para mostrar tendencia con icono
const TrendIndicator = ({ value, suffix = '%' }) => {
  if (value > 0) {
    return (
      <div className="flex items-center text-green-500">
        <TrendingUp className="h-4 w-4 mr-1" />
        <span>+{value}{suffix}</span>
      </div>
    );
  } else if (value < 0) {
    return (
      <div className="flex items-center text-red-500">
        <TrendingDown className="h-4 w-4 mr-1" />
        <span>{value}{suffix}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center text-gray-500">
      <Minus className="h-4 w-4 mr-1" />
      <span>Sin cambios</span>
    </div>
  );
};

// Componente para mostrar icono de plataforma
const PlatformIcon = ({ platform }) => {
  switch (platform.toLowerCase()) {
    case 'twitter':
      return <Twitter className="h-4 w-4 text-[#1DA1F2]" />;
    case 'facebook':
      return <Facebook className="h-4 w-4 text-[#1877F2]" />;
    case 'instagram':
      return <Instagram className="h-4 w-4 text-[#E4405F]" />;
    case 'linkedin':
      return <Linkedin className="h-4 w-4 text-[#0A66C2]" />;
    default:
      return null;
  }
};

export default function AnalisisPage() {
  const [activeTab, setActiveTab] = useState('resumen');
  
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      className="container mx-auto py-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Análisis de Reputación</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Visualiza y analiza los datos de tu reputación online
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0">
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Pestañas de navegación */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="sentimiento">Sentimiento</TabsTrigger>
          <TabsTrigger value="menciones">Menciones</TabsTrigger>
          <TabsTrigger value="plataformas">Plataformas</TabsTrigger>
        </TabsList>
        
        {/* Pestaña de Resumen */}
        <TabsContent value="resumen" className="space-y-6">
          {/* Tarjetas de métricas */}
          <motion.div 
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            variants={itemVariants}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Menciones Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <div className="mt-1 flex items-center text-xs">
                  <TrendIndicator value={12} />
                  <span className="ml-2 text-gray-500">vs. mes anterior</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Sentimiento Positivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">65%</div>
                <div className="mt-1 flex items-center text-xs">
                  <TrendIndicator value={5} />
                  <span className="ml-2 text-gray-500">vs. mes anterior</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Plataforma Principal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Twitter className="h-5 w-5 text-[#1DA1F2] mr-2" />
                  <span className="text-2xl font-bold">Twitter</span>
                </div>
                <div className="mt-1 flex items-center text-xs">
                  <span className="text-gray-500">45% del total de menciones</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Alcance Estimado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">125K</div>
                <div className="mt-1 flex items-center text-xs">
                  <TrendIndicator value={8} />
                  <span className="ml-2 text-gray-500">vs. mes anterior</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Gráficos principales */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Análisis de Sentimiento</CardTitle>
                  <CardDescription>Distribución de menciones por sentimiento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
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
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Plataformas</CardTitle>
                  <CardDescription>Menciones por red social</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={datosPlataformas}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {datosPlataformas.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Evolución temporal */}
          <motion.div variants={itemVariants}>
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
            </Card>
          </motion.div>
        </TabsContent>
        
        {/* Pestaña de Sentimiento */}
        <TabsContent value="sentimiento" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Sentimiento</CardTitle>
                <CardDescription>Distribución detallada del sentimiento en las menciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400">65%</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Menciones Positivas</p>
                    <div className="mt-2 flex items-center text-xs">
                      <TrendIndicator value={5} />
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <Minus className="h-8 w-8 text-gray-500 mb-2" />
                    <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">25%</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Menciones Neutras</p>
                    <div className="mt-2 flex items-center text-xs">
                      <TrendIndicator value={-3} />
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400">10%</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Menciones Negativas</p>
                    <div className="mt-2 flex items-center text-xs">
                      <TrendIndicator value={-2} />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={datosEvolucionSentimiento}
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
          </motion.div>
        </TabsContent>
        
        {/* Pestaña de Menciones */}
        <TabsContent value="menciones" className="space-y-6">
          <motion.div variants={itemVariants}>
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
          </motion.div>
        </TabsContent>
        
        {/* Pestaña de Plataformas */}
        <TabsContent value="plataformas" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Plataformas</CardTitle>
                <CardDescription>Análisis detallado por red social</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={datosPlataformas}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {datosPlataformas.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-4">
                    {datosPlataformas.map((platform) => (
                      <div key={platform.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full" style={{ backgroundColor: `${platform.color}20` }}>
                            <PlatformIcon platform={platform.name} />
                          </div>
                          <span className="ml-3 font-medium">{platform.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{platform.value}%</div>
                          <div className="text-xs text-gray-500">{Math.round(platform.value * 12.48)} menciones</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
