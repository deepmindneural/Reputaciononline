"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { 
  CreditCard, ArrowRight, CheckCircle2, Download, Filter, TrendingUp, 
  TrendingDown, Minus, AlertCircle, Plus, History
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Datos de ejemplo para los gráficos
const datosConsumoCreditos = [
  { fecha: 'Ene', consumo: 320 },
  { fecha: 'Feb', consumo: 450 },
  { fecha: 'Mar', consumo: 380 },
  { fecha: 'Abr', consumo: 520 },
  { fecha: 'May', consumo: 480 },
  { fecha: 'Jun', consumo: 400 },
];

const datosDistribucionCreditos = [
  { name: 'Disponibles', value: 300, color: '#10b981' },
  { name: 'Consumidos', value: 700, color: '#6b7280' },
];

const transaccionesCredito = [
  {
    id: '1',
    fecha: new Date(2025, 5, 1),
    tipo: 'consumo',
    cantidad: 50,
    descripcion: 'Monitoreo de menciones Twitter'
  },
  {
    id: '2',
    fecha: new Date(2025, 5, 2),
    tipo: 'consumo',
    cantidad: 30,
    descripcion: 'Análisis de sentimiento'
  },
  {
    id: '3',
    fecha: new Date(2025, 5, 3),
    tipo: 'recarga',
    cantidad: 500,
    descripcion: 'Compra de créditos - Plan Profesional'
  },
  {
    id: '4',
    fecha: new Date(2025, 5, 4),
    tipo: 'consumo',
    cantidad: 45,
    descripcion: 'Monitoreo de hashtags'
  },
  {
    id: '5',
    fecha: new Date(2025, 5, 5),
    tipo: 'consumo',
    cantidad: 25,
    descripcion: 'Análisis de audiencia'
  },
];

// Planes disponibles para comprar
const planes = [
  {
    id: 'plan-basico',
    nombre: 'Plan Básico',
    creditos: 500,
    precio: 99000,
    duracion: '30 días',
    caracteristicas: [
      'Monitoreo de menciones básico',
      'Análisis de sentimiento limitado',
      'Soporte por email'
    ]
  },
  {
    id: 'plan-pro',
    nombre: 'Plan Profesional',
    creditos: 1500,
    precio: 249000,
    duracion: '30 días',
    popular: true,
    caracteristicas: [
      'Monitoreo avanzado de menciones',
      'Análisis de sentimiento ilimitado',
      'Informes semanales',
      'Soporte prioritario'
    ]
  },
  {
    id: 'plan-empresa',
    nombre: 'Plan Empresarial',
    creditos: 5000,
    precio: 699000,
    duracion: '30 días',
    caracteristicas: [
      'Monitoreo completo de redes sociales',
      'Análisis de sentimiento avanzado',
      'Informes personalizados',
      'API para integración',
      'Soporte 24/7'
    ]
  }
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

export default function CreditosPage() {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Créditos</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Administra tus créditos, revisa el historial de consumo y adquiere más para continuar utilizando la plataforma
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0">
          <Button variant="outline" size="sm" className="flex items-center">
            <History className="mr-2 h-4 w-4" />
            Historial
          </Button>
          <Button variant="default" size="sm" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Comprar Créditos
          </Button>
        </div>
      </div>

      {/* Pestañas de navegación */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
          <TabsTrigger value="planes">Planes</TabsTrigger>
        </TabsList>
        
        {/* Pestaña de Resumen */}
        <TabsContent value="resumen" className="space-y-6">
          {/* Tarjeta de resumen de créditos */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Créditos</CardTitle>
                <CardDescription>Estado actual de tus créditos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">Créditos Disponibles</h3>
                      <div className="mt-2 flex items-baseline">
                        <span className="text-3xl font-bold text-primary-600">300</span>
                        <span className="ml-2 text-sm text-gray-500">de 1,000 totales</span>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-500">30% disponible</span>
                          <span className="text-sm font-medium">300/1,000</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
                          <div className="h-2 bg-primary-600 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Consumo diario promedio</p>
                          <p className="text-lg font-medium">25 créditos</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Días restantes estimados</p>
                          <p className="text-lg font-medium">12 días</p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button className="w-full">Comprar más créditos</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={datosDistribucionCreditos}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {datosDistribucionCreditos.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Gráfico de consumo */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Consumo de Créditos</CardTitle>
                <CardDescription>Evolución del consumo en los últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={datosConsumoCreditos}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="consumo" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        {/* Pestaña de Historial */}
        <TabsContent value="historial" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Historial de Transacciones</CardTitle>
                <CardDescription>Registro de consumos y recargas de créditos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">Fecha</th>
                        <th scope="col" className="px-6 py-3">Tipo</th>
                        <th scope="col" className="px-6 py-3">Cantidad</th>
                        <th scope="col" className="px-6 py-3">Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaccionesCredito.map((transaccion) => (
                        <tr key={transaccion.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <td className="px-6 py-4">{transaccion.fecha.toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              transaccion.tipo === 'recarga' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            }`}>
                              {transaccion.tipo === 'recarga' ? 'Recarga' : 'Consumo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium">
                            {transaccion.tipo === 'recarga' ? '+' : '-'}{transaccion.cantidad}
                          </td>
                          <td className="px-6 py-4">{transaccion.descripcion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between w-full">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando 5 de 120 transacciones
                  </div>
                  <Button variant="outline" size="sm">
                    Ver todas
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        {/* Pestaña de Planes */}
        <TabsContent value="planes" className="space-y-6">
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {planes.map((plan, index) => (
                <Card key={plan.id} className={`relative overflow-hidden ${plan.popular ? 'border-primary-500 ring-1 ring-primary-500' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -right-12 top-6 w-36 -rotate-45 bg-primary-500 py-1 text-center text-sm font-medium text-white">
                      Más Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.nombre}</CardTitle>
                    <CardDescription>{plan.creditos.toLocaleString('es-CO')} créditos | {plan.duracion}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                      <span className="text-3xl font-extrabold tracking-tight">
                        ${plan.precio.toLocaleString('es-CO')}
                      </span>
                      <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400">/mes</span>
                    </div>
                    
                    <ul className="mt-6 space-y-3">
                      {plan.caracteristicas.map((caracteristica, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary-500 dark:text-primary-400" />
                          <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{caracteristica}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Comprar Ahora
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="mt-6 rounded-md bg-gray-50 p-4 dark:bg-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">¿Necesitas un plan personalizado?</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Si necesitas una cantidad específica de créditos o tienes requerimientos especiales, contacta con nuestro equipo comercial.
              </p>
              <div className="mt-3">
                <button className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                  Solicitar plan personalizado <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
