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
  Building2,
  Plus,
  Filter,
  ArrowDownUp,
  RefreshCw,
  Trash,
  PenSquare,
  Hotel,
  Home,
  Bed,
  Star, 
  Clock,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  hospitalityService,
  HospitalityProperty,
  PropertyAnalytics,
  HospitalityPlatform
} from '@/services/hospitalityService';
import Link from 'next/link';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Componente para la tarjeta de propiedad
const PropertyCard = ({ property }: { property: HospitalityProperty }) => {
  const platformColors = {
    airbnb: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    booking: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    tripadvisor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };
  
  const platformColor = platformColors[property.platform];
  
  return (
    <Card className="overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
      <div className="relative h-40 w-full bg-gray-200 dark:bg-gray-800">
        {property.imageUrl ? (
          <Image 
            src={property.imageUrl} 
            alt={property.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <Building2 size={40} />
          </div>
        )}
        <Badge className={`absolute top-2 right-2 ${platformColor}`}>
          {property.platform}
        </Badge>
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg line-clamp-1">{property.name}</CardTitle>
        <CardDescription className="line-clamp-1">
          {property.address || property.propertyType || 'Sin detalles adicionales'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="font-medium">{property.averageRating?.toFixed(1) || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
            <span>{property.totalReviews}</span>
          </div>
          <div className={property.active ? 'text-green-600' : 'text-gray-500'}>
            {property.active ? 'Activa' : 'Inactiva'}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button size="sm" variant="outline" asChild>
          <Link href={`/dashboard/hospedaje/${property.id}`}>
            Ver detalles
          </Link>
        </Button>
        {property.originalUrl && (
          <Button size="sm" variant="ghost" asChild>
            <a href={property.originalUrl} target="_blank" rel="noopener noreferrer">
              Ver original
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Componente para los análisis
const AnalyticsSection = ({ analytics }: { analytics: PropertyAnalytics }) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calificación promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground ml-1">/5</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de reseñas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1 text-primary" />
              <span className="text-2xl font-bold">{analytics.totalReviews}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sentimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <ThumbsUp className="h-3 w-3 text-green-500 mr-1" />
                  <span>Positivo</span>
                </div>
                <span>{analytics.sentiment.positive}</span>
              </div>
              <Progress value={(analytics.sentiment.positive / analytics.totalReviews) * 100} className="h-1 bg-gray-200" indicatorClassName="bg-green-500" />
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <span className="h-3 w-3 inline-block text-yellow-500 mr-1">•</span>
                  <span>Neutral</span>
                </div>
                <span>{analytics.sentiment.neutral}</span>
              </div>
              <Progress value={(analytics.sentiment.neutral / analytics.totalReviews) * 100} className="h-1 bg-gray-200" indicatorClassName="bg-yellow-500" />
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <ThumbsDown className="h-3 w-3 text-red-500 mr-1" />
                  <span>Negativo</span>
                </div>
                <span>{analytics.sentiment.negative}</span>
              </div>
              <Progress value={(analytics.sentiment.negative / analytics.totalReviews) * 100} className="h-1 bg-gray-200" indicatorClassName="bg-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Por plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(analytics.platforms).map(([platform, data]) => (
                <div key={platform} className="flex justify-between items-center text-xs">
                  <span className="capitalize">{platform}</span>
                  <div className="flex items-center gap-2">
                    <span>{data.count} reseñas</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span>{data.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de calificaciones</CardTitle>
          <CardDescription>
            Evolución de calificaciones durante el {analytics.period}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            {/* Aquí iría un componente de gráfico con los datos de analytics.timeline */}
            <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
              Gráfico de tendencia temporal de calificaciones
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente principal
export default function HospitalityDashboard() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<HospitalityProperty[]>([]);
  const [analytics, setAnalytics] = useState<PropertyAnalytics | null>(null);
  const [filter, setFilter] = useState<{
    platform?: HospitalityPlatform;
    status?: 'active' | 'inactive';
  }>({});
  const [newPropertyOpen, setNewPropertyOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    platform: 'booking' as HospitalityPlatform,
    address: '',
    propertyType: 'hotel' as 'hotel' | 'apartment' | 'house' | 'room',
    externalId: '',
    originalUrl: ''
  });
  
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Cargar propiedades y análisis
        const [propertiesData, analyticsData] = await Promise.all([
          hospitalityService.getProperties(filter),
          hospitalityService.getAnalytics({ period: 'month' })
        ]);
        
        setProperties(propertiesData.properties);
        setAnalytics(analyticsData.analytics);
      } catch (error) {
        console.error('Error al cargar datos de hospedaje:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [filter]);
  
  // Manejar creación de nueva propiedad
  const handleCreateProperty = async () => {
    try {
      if (!newProperty.name || !newProperty.platform) {
        alert('El nombre y la plataforma son obligatorios');
        return;
      }
      
      const result = await hospitalityService.upsertProperty(newProperty);
      setProperties(prev => [result.property, ...prev]);
      setNewPropertyOpen(false);
      setNewProperty({
        name: '',
        platform: 'booking',
        address: '',
        propertyType: 'hotel',
        externalId: '',
        originalUrl: ''
      });
    } catch (error) {
      console.error('Error al crear propiedad:', error);
      alert('Error al crear la propiedad. Inténtalo de nuevo.');
    }
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Monitor de Hospedajes</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={newPropertyOpen} onOpenChange={setNewPropertyOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Añadir propiedad
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Añadir nueva propiedad</DialogTitle>
                <DialogDescription>
                  Ingresa los detalles de la propiedad que deseas monitorear
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={newProperty.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProperty(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="platform" className="text-right">
                    Plataforma
                  </Label>
                  <Select 
                    value={newProperty.platform}
                    onValueChange={(value: string) => setNewProperty(prev => ({ ...prev, platform: value as HospitalityPlatform }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="booking">Booking</SelectItem>
                      <SelectItem value="airbnb">Airbnb</SelectItem>
                      <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Tipo
                  </Label>
                  <Select 
                    value={newProperty.propertyType}
                    onValueChange={(value: string) => setNewProperty(prev => ({ ...prev, propertyType: value as 'hotel' | 'apartment' | 'house' | 'room' }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="apartment">Apartamento</SelectItem>
                      <SelectItem value="house">Casa</SelectItem>
                      <SelectItem value="room">Habitación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Dirección
                  </Label>
                  <Input
                    id="address"
                    className="col-span-3"
                    value={newProperty.address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProperty(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">
                    URL
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://..."
                    className="col-span-3"
                    value={newProperty.originalUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProperty(prev => ({ ...prev, originalUrl: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="externalId" className="text-right">
                    ID Externo
                  </Label>
                  <Input
                    id="externalId"
                    className="col-span-3"
                    value={newProperty.externalId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProperty(prev => ({ ...prev, externalId: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewPropertyOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateProperty}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Filtros */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filtrar propiedades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[200px]">
              <Label htmlFor="platform-filter">Plataforma</Label>
              <Select 
                value={filter.platform || 'all'}
                onValueChange={(value: string) => setFilter(prev => ({ 
                  ...prev, 
                  platform: value === 'all' ? undefined : value as HospitalityPlatform 
                }))}
              >
                <SelectTrigger id="platform-filter" className="w-full">
                  <SelectValue placeholder="Todas las plataformas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="booking">Booking</SelectItem>
                  <SelectItem value="airbnb">Airbnb</SelectItem>
                  <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[200px]">
              <Label htmlFor="status-filter">Estado</Label>
              <Select 
                value={filter.status || 'all'}
                onValueChange={(value: string) => setFilter(prev => ({ 
                  ...prev, 
                  status: value === 'all' ? undefined : value as 'active' | 'inactive' 
                }))}
              >
                <SelectTrigger id="status-filter" className="w-full">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="inactive">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setFilter({})}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs de Propiedades y Análisis */}
      <Tabs defaultValue="properties" className="space-y-4">
        <TabsList>
          <TabsTrigger value="properties">Propiedades</TabsTrigger>
          <TabsTrigger value="analytics">Análisis Global</TabsTrigger>
        </TabsList>
        
        <TabsContent value="properties" className="space-y-4">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <CardHeader className="p-4 pb-0">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Skeleton className="h-9 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <Home className="h-8 w-8 text-muted-foreground" />
                <h3 className="text-lg font-medium">No hay propiedades</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  No has agregado ninguna propiedad para monitorear. Haz clic en "Nueva Propiedad" para comenzar.
                </p>
                <Button onClick={() => setNewPropertyOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Propiedad
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          {loading || !analytics ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-24 mb-1" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-60" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[200px] w-full" />
                </CardContent>
              </Card>
            </div>
          ) : (
            <AnalyticsSection analytics={analytics} />
          )}
        </TabsContent>
      </Tabs>
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm" onClick={() => {}}>
          <Filter className="h-4 w-4 mr-1" />
          Filtrar
        </Button>
        <Button variant="outline" size="sm" onClick={() => {}}>
          <ArrowDownUp className="h-4 w-4 mr-1" />
          Ordenar: A-Z
        </Button>
      </div>
    </div>
  );
}
