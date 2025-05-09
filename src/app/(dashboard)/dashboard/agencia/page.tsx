'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bell, 
  Briefcase, 
  DollarSign, 
  Download, 
  Users, 
  PlusCircle,
  Percent,
  FileText,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  agencyService,
  AgencyProfile,
  SaleTransaction,
  AgencyClient,
  Withdrawal
} from '@/services/agencyService';
import Link from 'next/link';

export default function AgencyDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AgencyProfile | null>(null);
  const [clients, setClients] = useState<AgencyClient[]>([]);
  const [sales, setSales] = useState<SaleTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Cargar datos de la agencia
        const [profileData, clientsData, salesData, withdrawalsData] = await Promise.all([
          agencyService.getAgencyProfile(),
          agencyService.getAgencyClients(),
          agencyService.getSalesHistory(),
          agencyService.getWithdrawals()
        ]);
        
        setProfile(profileData.agencyProfile);
        setClients(clientsData.clients);
        setSales(salesData.sales);
        setWithdrawals(withdrawalsData.withdrawals);
      } catch (error) {
        console.error('Error al cargar datos de agencia:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  // Calcular métricas
  const totalEarnings = sales
    .filter(sale => sale.status === 'completed')
    .reduce((sum, sale) => sum + sale.commissionAmount, 0);
  
  const pendingSales = sales.filter(sale => sale.status === 'pending').length;
  const activeClients = clients.filter(client => client.status === 'active').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount, 0);
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Panel de Agencia</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/agencia/clientes/nuevo">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Perfil de Agencia */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border border-primary/20">
                <AvatarImage src={profile?.logo || ''} alt={profile?.name || 'Agencia'} />
                <AvatarFallback className="text-lg bg-primary/20">{profile?.name?.substring(0, 2) || 'AG'}</AvatarFallback>
              </Avatar>
              <div>
                {loading ? (
                  <>
                    <Skeleton className="h-8 w-[250px] mb-2" />
                    <Skeleton className="h-4 w-[200px]" />
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold">{profile?.name || 'Mi Agencia'}</h3>
                    <p className="text-muted-foreground">{profile?.description || 'Sin descripción'}</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/agencia/perfil">
                  <FileText className="mr-2 h-4 w-4" />
                  Editar Perfil
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href="/dashboard/agencia/ventas/nueva">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Registrar Venta
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comisiones Totales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-24" /> : `$${totalEarnings.toLocaleString()}`}
                </div>
                <p className="text-xs text-muted-foreground">
                  Comisiones por ventas completadas
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasa de Comisión</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-20" /> : `${profile?.commissionRate || 10}%`}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasa estándar de comisión
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : activeClients}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total de {activeClients === 1 ? 'cliente activo' : 'clientes activos'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Disponible</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-24" /> : `$${(profile?.balanceAmount || 0).toLocaleString()}`}
                </div>
                <p className="text-xs text-muted-foreground">
                  Disponible para retiro
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        
        <CardFooter className="border-t p-4 flex justify-between items-center">
          <div>
            <p className="text-muted-foreground text-sm">
              {pendingWithdrawals > 0 && `$${pendingWithdrawals.toLocaleString()} en retiros pendientes`}
              {pendingSales > 0 && pendingWithdrawals > 0 && ' • '}
              {pendingSales > 0 && `${pendingSales} ${pendingSales === 1 ? 'venta pendiente' : 'ventas pendientes'}`}
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/agencia/retiros/nuevo">
              <Download className="mr-2 h-4 w-4" />
              Solicitar Retiro
            </Link>
          </Button>
        </CardFooter>
      </Card>
      
      {/* Tabs de Actividad */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="recent">Actividad Reciente</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="withdrawals">Retiros</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ventas Recientes</CardTitle>
              <CardDescription>
                Historial de las últimas ventas registradas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))
              ) : sales.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">No hay ventas registradas</p>
              ) : (
                <div className="space-y-4">
                  {sales.slice(0, 5).map((sale) => (
                    <div key={sale.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 border border-primary/10">
                          <AvatarFallback className="bg-primary/5">{sale.clientName.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">{sale.clientName}</p>
                          <p className="text-sm text-muted-foreground">{sale.planName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(sale.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${sale.planPrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-emerald-500 dark:text-emerald-400">
                          +${sale.commissionAmount.toLocaleString()}
                        </div>
                        <div className="text-xs">
                          <span className={`px-2 py-0.5 rounded-full ${
                            sale.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {sale.status === 'completed' ? 'Completada' : 
                             sale.status === 'pending' ? 'Pendiente' : 'Reembolsada'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link href="/dashboard/agencia/ventas">
                  Ver todas las ventas
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clientes de la Agencia</CardTitle>
              <CardDescription>
                Listado de clientes gestionados por su agencia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))
              ) : clients.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">No hay clientes registrados</p>
              ) : (
                <div className="space-y-4">
                  {clients.slice(0, 5).map((client) => (
                    <div key={client.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 border border-primary/10">
                          <AvatarFallback>{client.client.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">{client.client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.client.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Cliente desde {new Date(client.client.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs">
                          <span className={`px-2 py-0.5 rounded-full ${
                            client.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            client.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {client.status === 'active' ? 'Activo' : 
                             client.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                          </span>
                        </div>
                        {client.commissionRate && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Comisión: {client.commissionRate}%
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link href="/dashboard/agencia/clientes">
                  Ver todos los clientes
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="withdrawals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Retiros</CardTitle>
              <CardDescription>
                Últimos retiros de comisiones solicitados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))
              ) : withdrawals.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">No hay retiros solicitados</p>
              ) : (
                <div className="space-y-4">
                  {withdrawals.slice(0, 5).map((withdrawal) => (
                    <div key={withdrawal.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center">
                          <Download className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            ${withdrawal.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {withdrawal.paymentMethod.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(withdrawal.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs">
                          <span className={`px-2 py-0.5 rounded-full ${
                            withdrawal.status === 'processed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {withdrawal.status === 'processed' ? 'Procesado' : 
                             withdrawal.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                          </span>
                        </div>
                        {withdrawal.processedAt && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Procesado: {new Date(withdrawal.processedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link href="/dashboard/agencia/retiros">
                  Ver todos los retiros
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
