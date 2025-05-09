"use client";

import React, { useState } from 'react';
import { 
  FaMoneyBillWave, 
  FaExchangeAlt, 
  FaChartBar, 
  FaShoppingCart,
  FaCalendarAlt,
  FaHistory,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
  FaCheck,
  FaCreditCard,
  FaDownload,
  FaSpinner
} from 'react-icons/fa';
import { useCreditos } from '@/context/CreditosContext';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function CreditosPage() {
  // Uso del contexto de créditos
  const { 
    creditos, 
    historialTransacciones, 
    planesDisponibles,
    comprarCreditos,
    verificarCreditosSuficientes
  } = useCreditos();

  const [selectedPlan, setSelectedPlan] = useState('');
  const [showCompraModal, setShowCompraModal] = useState(false);
  const [isCompraExitosa, setIsCompraExitosa] = useState(false);
  const [isCompraProcesando, setIsCompraProcesando] = useState(false);
  const [filtroPeriodo, setFiltroPeriodo] = useState('todo');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  // Filtrar transacciones
  const transaccionesFiltradas = historialTransacciones.filter(transaccion => {
    const cumpleTipo = filtroTipo === 'todos' || transaccion.tipo === filtroTipo;
    
    if (filtroPeriodo === 'todo') return cumpleTipo;
    
    const fechaTransaccion = new Date(transaccion.fecha.split(' ')[0].split('/').reverse().join('-'));
    const hoy = new Date();
    const unaSemanaAtras = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
    const unMesAtras = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate());
    
    if (filtroPeriodo === 'semana') return fechaTransaccion >= unaSemanaAtras && cumpleTipo;
    if (filtroPeriodo === 'mes') return fechaTransaccion >= unMesAtras && cumpleTipo;
    
    return cumpleTipo;
  });

  // Calcular datos para gráficos
  const datosConsumo = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Créditos consumidos',
        data: [120, 190, 30, 50, 200, 150, 80],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  // Manejar compra de créditos
  const handleComprarCreditos = async () => {
    if (!selectedPlan) return;
    
    setIsCompraProcesando(true);
    
    try {
      const resultado = await comprarCreditos(selectedPlan);
      if (resultado) {
        setIsCompraExitosa(true);
        setTimeout(() => {
          setShowCompraModal(false);
          setIsCompraExitosa(false);
          setSelectedPlan('');
        }, 2000);
      }
    } catch (error) {
      console.error('Error al comprar créditos:', error);
    } finally {
      setIsCompraProcesando(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Gestión de Créditos</h1>
      
      {/* Sección 1: Resumen de créditos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-3 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-500 mr-4">
              <FaMoneyBillWave size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{creditos.disponibles.toLocaleString()}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Créditos disponibles</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-500 mr-4">
              <FaExchangeAlt size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{creditos.gastados.toLocaleString()}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Créditos consumidos</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-500 mr-4">
              <FaCreditCard size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{creditos.plan}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Plan actual <small className="text-xs text-gray-500">(Última recarga: {creditos.ultimaRecarga})</small></p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sección 2: Historial de transacciones */}
      <Card className="mb-8">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <CardTitle className="mb-4 sm:mb-0">Historial de Transacciones</CardTitle>
            
            <div className="flex flex-wrap gap-2">
              <select 
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded px-3 py-2 text-sm"
                value={filtroPeriodo}
                onChange={(e) => setFiltroPeriodo(e.target.value)}
              >
                <option value="todo">Todo el historial</option>
                <option value="semana">Última semana</option>
                <option value="mes">Último mes</option>
              </select>
              
              <select 
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded px-3 py-2 text-sm"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="todos">Todos los tipos</option>
                <option value="consumo">Consumos</option>
                <option value="recarga">Recargas</option>
              </select>
              
              <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                <FaDownload className="mr-1" /> Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descripción</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
                  <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cantidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {transaccionesFiltradas.length > 0 ? (
                  transaccionesFiltradas.map((transaccion) => (
                    <tr key={transaccion.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-300">{transaccion.fecha}</td>
                      <td className="py-4 px-6 text-sm text-gray-900 dark:text-white">{transaccion.descripcion}</td>
                      <td className="py-4 px-6 text-sm">
                        <Badge 
                          className={transaccion.tipo === 'consumo' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}
                        >
                          {transaccion.tipo === 'consumo' ? 'Consumo' : 'Recarga'}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-sm text-right font-medium">
                        <span className={transaccion.tipo === 'consumo' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                          {transaccion.tipo === 'consumo' ? '-' : '+'}{transaccion.cantidad.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400">
                      No hay transacciones con los filtros seleccionados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Sección 3: Planes disponibles */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Planes Disponibles</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {planesDisponibles.map((plan) => (
            <Card key={plan.id} className={`overflow-hidden ${plan.destacado ? 'border-2 border-cyan-500 dark:border-cyan-400' : ''}`}>
              {plan.destacado && (
                <div className="bg-cyan-500 text-white py-1 px-4 text-sm font-semibold text-center">
                  Más popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.nombre}</CardTitle>
                <CardDescription>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    ${plan.precio.toLocaleString('es-CO')} <span className="text-sm font-normal text-gray-500">COP</span>
                  </div>
                  <p className="text-cyan-600 dark:text-cyan-400 font-semibold mt-2">
                    {plan.creditos.toLocaleString()} créditos incluidos
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.caracteristicas.map((caracteristica, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{caracteristica}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    setShowCompraModal(true);
                  }}
                  className="w-full"
                >
                  Comprar plan
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Modal de compra */}
      <Dialog open={showCompraModal} onOpenChange={setShowCompraModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isCompraExitosa ? 'Compra exitosa' : 'Confirmar compra'}
            </DialogTitle>
          </DialogHeader>
          
          {isCompraExitosa ? (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <FaCheck className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">¡Compra realizada con éxito!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Los créditos han sido añadidos a tu cuenta. Ya puedes comenzar a utilizarlos.
              </p>
            </div>
          ) : (
            <>
              <DialogDescription>
                Estás a punto de comprar el siguiente plan:
              </DialogDescription>
              
              {selectedPlan && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {planesDisponibles.find(p => p.id === selectedPlan)?.nombre}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    ${planesDisponibles.find(p => p.id === selectedPlan)?.precio.toLocaleString('es-CO')} COP
                  </p>
                  <p className="text-cyan-600 dark:text-cyan-400 text-sm">
                    {planesDisponibles.find(p => p.id === selectedPlan)?.creditos.toLocaleString()} créditos
                  </p>
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  variant="outline"
                  onClick={() => setShowCompraModal(false)}
                  disabled={isCompraProcesando}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleComprarCreditos}
                  disabled={isCompraProcesando}
                >
                  {isCompraProcesando ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Procesando...
                    </>
                  ) : 'Confirmar compra'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
