"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BadgePesos } from '@/components/ui/badge-pesos';
import { CheckCircle, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ComprarPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [metodoPago, setMetodoPago] = useState<'credit_card' | 'paypal'>('credit_card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Planes disponibles
  const planes = [
    {
      id: 'plan_basico',
      nombre: 'Plan Bu00e1sico',
      creditos: 100,
      precio: 499.00,
      descripcion: 'Ideal para comenzar a monitorizar tu presencia online',
      caracteristicas: [
        'Hasta 100 menciones por mu00e9s',
        'Informes bu00e1sicos',
        'Soporte por email'
      ]
    },
    {
      id: 'plan_estandar',
      nombre: 'Plan Estu00e1ndar',
      creditos: 300,
      precio: 999.00,
      descripcion: 'Para usuarios que necesitan un seguimiento mu00e1s completo',
      caracteristicas: [
        'Hasta 300 menciones por mu00e9s',
        'Informes detallados con gru00e1ficos',
        'Soporte prioritario',
        'Alertas en tiempo real'
      ]
    },
    {
      id: 'plan_premium',
      nombre: 'Plan Premium',
      creditos: 500,
      precio: 1999.00,
      descripcion: 'Monitoreo completo para profesionales y empresas',
      caracteristicas: [
        'Hasta 500 menciones por mu00e9s',
        'Anu00e1lisis de sentimiento avanzado',
        'Soporte 24/7',
        'Dashboard personalizado',
        'Exportaciu00f3n de datos'
      ]
    },
    {
      id: 'plan_agencia',
      nombre: 'Plan Agencia',
      creditos: 1000,
      precio: 4999.00,
      descripcion: 'Soluciu00f3n escalable para agencias con mu00faltiples clientes',
      caracteristicas: [
        'Hasta 1000 menciones por mu00e9s',
        'Gestor de mu00faltiples cuentas',
        'Informes personalizados por cliente',
        'API completa',
        'Soporte dedicado',
        'Segu00fan para cuentas de clientes'
      ]
    }
  ];

  const handleCompra = async () => {
    if (!selectedPlan) {
      setError('Por favor selecciona un plan');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/creditos/comprar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan,
          metodoPago
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar la compra');
      }

      setSuccess(true);
      toast.success(data.message);
      
      // Esperar 3 segundos antes de redirigir al dashboard de cru00e9ditos
      setTimeout(() => {
        router.push('/dashboard/creditos');
      }, 3000);

    } catch (error: any) {
      setError(error.message);
      toast.error('Error al procesar tu compra. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Comprar Cru00e9ditos</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success ? (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">u00a1Compra exitosa!</h2>
              <p className="text-green-600 dark:text-green-400 mt-2">
                Tu compra ha sido procesada correctamente. Tus cru00e9ditos han sido agregados a tu cuenta.
              </p>
              <Button 
                onClick={() => router.push('/dashboard/creditos')} 
                className="mt-6 bg-green-600 hover:bg-green-700"
              >
                Ver mis cru00e9ditos
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Selecciona un plan</CardTitle>
              <CardDescription>
                Elige el plan que mejor se adapte a tus necesidades de monitoreo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {planes.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedPlan === plan.id ? 'border-cyan-500 ring-1 ring-cyan-500 shadow-sm' : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{plan.nombre}</CardTitle>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                          <BadgePesos valor={plan.precio} />
                        </span>
                        <span className="text-sm text-gray-500">/plan</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-4">{plan.descripcion}</p>
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 p-2 rounded-md mb-4">
                        <p className="text-center text-cyan-600 dark:text-cyan-400 font-medium">{plan.creditos} cru00e9ditos</p>
                      </div>
                      <ul className="space-y-2">
                        {plan.caracteristicas.map((feature, idx) => (
                          <li key={idx} className="text-sm flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant={selectedPlan === plan.id ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {selectedPlan === plan.id ? 'Seleccionado' : 'Seleccionar'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedPlan && (
            <Card>
              <CardHeader>
                <CardTitle>Mu00e9todo de pago</CardTitle>
                <CardDescription>
                  Selecciona cu00f3mo quieres pagar tu plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="credit_card" onValueChange={(value) => setMetodoPago(value as any)}>
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="credit_card">Tarjeta de Cru00e9dito</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  </TabsList>
                  <TabsContent value="credit_card" className="pt-4">
                    <div className="flex items-center p-4 border rounded-md">
                      <CreditCard className="h-6 w-6 mr-4 text-gray-500" />
                      <div>
                        <p className="font-medium">Tarjeta de Cru00e9dito/Du00e9bito</p>
                        <p className="text-sm text-gray-500">Paga de forma segura con tu tarjeta</p>
                      </div>
                    </div>
                    {/* En una implementaciu00f3n real, aquu00ed iru00eda el formulario de tarjeta */}
                  </TabsContent>
                  <TabsContent value="paypal" className="pt-4">
                    <div className="flex items-center p-4 border rounded-md">
                      <svg className="h-6 w-6 mr-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.0597 6.4375C19.1157 6.76741 19.1457 7.10254 19.1457 7.44238C19.1457 10.7159 16.976 12.7329 13.4639 12.7329H12.1319C11.7958 12.7329 11.5119 12.9726 11.458 13.3057L10.7979 17.8635C10.7799 17.9855 10.7139 18.0964 10.6139 18.178C10.5139 18.2595 10.3859 18.3066 10.2539 18.3066H7.48389C7.25789 18.3066 7.0919 18.1171 7.14789 17.8965L9.6979 3.41772C9.7419 3.2507 9.8919 3.13281 10.0639 3.13281H15.558C17.618 3.13281 18.7499 4.35644 19.0597 6.4375Z" fill="#002987"/>
                        <path d="M6.39411 13.0996L5.02613 21.4075C4.98413 21.6466 5.16812 21.8656 5.41011 21.8656H7.94209C8.17409 21.8656 8.37009 21.6851 8.41209 21.457L9.74408 13.3346C9.78608 13.1055 9.60209 12.8866 9.3601 12.8866H6.77811C6.64011 12.8866 6.51811 12.9786 6.45811 13.1055L6.39411 13.0996Z" fill="#0085CC"/>
                        <path d="M13.4459 6.4375C13.5019 6.76741 13.5319 7.10254 13.5319 7.44238C13.5319 10.7159 11.3621 12.7329 7.85002 12.7329H6.518C6.17998 12.7329 5.89599 12.9726 5.842 13.3057L5.18204 17.8635C5.16404 17.9855 5.09804 18.0964 4.99804 18.178C4.89804 18.2595 4.77004 18.3066 4.63804 18.3066H1.86801C1.64201 18.3066 1.47602 18.1171 1.53201 17.8965L4.08201 3.41772C4.12601 3.2507 4.27601 3.13281 4.44801 3.13281H9.94202C12.002 3.13281 13.134 4.35644 13.4459 6.4375Z" fill="#00186A"/>
                      </svg>
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-gray-500">Paga de forma segura con PayPal</p>
                      </div>
                    </div>
                    {/* En una implementaciu00f3n real, aquu00ed iru00eda el botou00f1 de PayPal */}
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleCompra} 
                  disabled={loading} 
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  {loading ? 'Procesando...' : 'Completar compra'}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
