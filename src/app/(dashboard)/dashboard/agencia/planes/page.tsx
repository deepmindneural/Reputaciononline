"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, AlertCircle, Zap, Award, Sparkles } from 'lucide-react';

interface PlanInfo {
  id: string;
  nombre: string;
  precio: number;
  creditos: number;
  ciclo: 'mensual' | 'anual';
  popular?: boolean;
  caracteristicas: string[];
}

const planesAgencia: PlanInfo[] = [
  {
    id: 'basico-mensual',
    nombre: 'Básico',
    precio: 299000,
    creditos: 5000,
    ciclo: 'mensual',
    caracteristicas: [
      'Acceso a todas las redes sociales',
      'Monitoreo para 5 clientes',
      'Análisis básico de sentimiento',
      'Alertas de menciones negativas',
      'Informes mensuales',
      'Soporte por correo electrónico'
    ],
  },
  {
    id: 'profesional-mensual',
    nombre: 'Profesional',
    precio: 499000,
    creditos: 10000,
    ciclo: 'mensual',
    popular: true,
    caracteristicas: [
      'Todo lo del plan Básico',
      'Monitoreo para 15 clientes',
      'Análisis avanzado de sentimiento',
      'Identificación de influencers',
      'Dashboard personalizable',
      'Informes semanales',
      'Soporte prioritario'
    ],
  },
  {
    id: 'premium-mensual',
    nombre: 'Premium',
    precio: 799000,
    creditos: 20000,
    ciclo: 'mensual',
    caracteristicas: [
      'Todo lo del plan Profesional',
      'Monitoreo para clientes ilimitados',
      'Herramientas de gestión de crisis',
      'Inteligencia competitiva',
      'API de acceso a datos',
      'Asistente AI personalizado',
      'Soporte 24/7',
      'Gestor de cuenta dedicado'
    ],
  },
  {
    id: 'basico-anual',
    nombre: 'Básico',
    precio: 2990000,
    creditos: 60000,
    ciclo: 'anual',
    caracteristicas: [
      'Acceso a todas las redes sociales',
      'Monitoreo para 5 clientes',
      'Análisis básico de sentimiento',
      'Alertas de menciones negativas',
      'Informes mensuales',
      'Soporte por correo electrónico',
      '2 meses gratis'
    ],
  },
  {
    id: 'profesional-anual',
    nombre: 'Profesional',
    precio: 4990000,
    creditos: 120000,
    ciclo: 'anual',
    popular: true,
    caracteristicas: [
      'Todo lo del plan Básico',
      'Monitoreo para 15 clientes',
      'Análisis avanzado de sentimiento',
      'Identificación de influencers',
      'Dashboard personalizable',
      'Informes semanales',
      'Soporte prioritario',
      '2 meses gratis'
    ],
  },
  {
    id: 'premium-anual',
    nombre: 'Premium',
    precio: 7990000,
    creditos: 240000,
    ciclo: 'anual',
    caracteristicas: [
      'Todo lo del plan Profesional',
      'Monitoreo para clientes ilimitados',
      'Herramientas de gestión de crisis',
      'Inteligencia competitiva',
      'API de acceso a datos',
      'Asistente AI personalizado',
      'Soporte 24/7',
      'Gestor de cuenta dedicado',
      '2 meses gratis'
    ],
  },
];

export default function PlanesAgenciaPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [ciclo, setCiclo] = useState<'mensual' | 'anual'>('mensual');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const planesActuales = planesAgencia.filter(plan => plan.ciclo === ciclo);

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(precio);
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleAdquirirPlan = async (plan: PlanInfo) => {
    if (!session?.user) {
      toast.error('Debes iniciar sesión para adquirir un plan');
      router.push('/login');
      return;
    }

    setLoading(plan.id);

    try {
      const response = await fetch('/api/creditos/comprar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          creditos: plan.creditos,
          monto: plan.precio,
          ciclo: plan.ciclo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al adquirir el plan');
      }

      toast.success('¡Plan adquirido correctamente!');
      router.push('/dashboard/agencia/clientes');
    } catch (err: any) {
      toast.error(err.message || 'Ha ocurrido un error al procesar la compra');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-cyan-600 mb-2">Selecciona el Plan para tu Agencia</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Elige el plan que mejor se adapte a las necesidades de tu agencia. Todos los planes incluyen acceso a nuestras herramientas de monitoreo y gestión de reputación online.
        </p>

        <div className="mt-6">
          <Tabs 
            value={ciclo} 
            onValueChange={(value) => setCiclo(value as 'mensual' | 'anual')}
            className="mx-auto max-w-md"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mensual">Mensual</TabsTrigger>
              <TabsTrigger value="anual">
                Anual
                <Badge variant="secondary" className="ml-2 bg-cyan-100 text-cyan-800">20% Ahorro</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planesActuales.map((plan) => (
          <Card 
            key={plan.id} 
            className={`border-2 transition-all ${selectedPlan === plan.id ? 'border-cyan-500 shadow-lg' : plan.popular ? 'border-amber-300' : 'border-gray-200'} ${plan.popular ? 'relative overflow-hidden' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0">
                <Badge className="mr-0 mt-0 bg-amber-500 rounded-none rounded-bl-lg text-white px-3 py-1 text-xs font-medium">
                  <Award className="h-3 w-3 mr-1" /> 
                  MÁS POPULAR
                </Badge>
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                {plan.nombre === 'Básico' && <Zap className="h-5 w-5 mr-2 text-blue-500" />}
                {plan.nombre === 'Profesional' && <Sparkles className="h-5 w-5 mr-2 text-amber-500" />}
                {plan.nombre === 'Premium' && <CreditCard className="h-5 w-5 mr-2 text-purple-600" />}
                {plan.nombre}
              </CardTitle>
              <CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-800">{formatPrecio(plan.precio)}</span>
                  <span className="text-gray-500 ml-1">
                    /{plan.ciclo === 'mensual' ? 'mes' : 'año'}
                  </span>
                </div>
                <p className="mt-2 text-cyan-600 font-medium">
                  {plan.creditos.toLocaleString()} créditos incluidos
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.caracteristicas.map((feature, index) => (
                  <li key={index} className="flex">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-cyan-600 hover:bg-cyan-700 transition-colors"
                onClick={() => handleAdquirirPlan(plan)}
                disabled={loading !== null}
              >
                {loading === plan.id ? 'Procesando...' : 'Adquirir Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start space-x-4">
          <div className="bg-cyan-100 p-3 rounded-full">
            <AlertCircle className="h-6 w-6 text-cyan-700" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">¿Necesitas un plan personalizado?</h3>
            <p className="text-gray-600 mb-4">
              Si ninguno de nuestros planes estándar se ajusta a tus necesidades, podemos crear un plan personalizado para tu agencia.
            </p>
            <Button variant="outline" className="border-cyan-600 text-cyan-600 hover:bg-cyan-50">
              Contactar con ventas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
