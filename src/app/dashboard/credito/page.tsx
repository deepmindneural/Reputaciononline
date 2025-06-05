"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, CreditCard, Receipt, Scroll } from 'lucide-react';

// Importar componentes del módulo de crédito
import CreditBalance from '@/components/credit/CreditBalance';
import PricingPlans from '@/components/credit/PricingPlans';
import BillingHistory from '@/components/credit/BillingHistory';
import PurchaseCredits from '@/components/credit/PurchaseCredits';

export default function CreditPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("balance");
  const pageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Datos simulados para los componentes
  const creditBalance = 2500;
  const balanceHistory = [
    {
      date: '2025-06-03T15:30:00',
      amount: 500,
      description: 'Compra de créditos',
      type: 'in' as const
    },
    {
      date: '2025-06-01T10:12:00',
      amount: 250,
      description: 'Uso en campaña',
      type: 'out' as const
    },
    {
      date: '2025-05-28T14:45:00',
      amount: 1000,
      description: 'Créditos de bienvenida',
      type: 'in' as const
    },
    {
      date: '2025-05-25T09:30:00',
      amount: 1500,
      description: 'Compra de créditos',
      type: 'in' as const
    }
  ];

  const pricingPlans = [
    {
      id: 'basic',
      name: 'Plan Básico',
      price: 29,
      billingPeriod: '/mes',
      description: 'Ideal para usuarios individuales y perfiles iniciales.',
      features: [
        { title: 'Monitoreo básico de menciones', included: true },
        { title: 'Alertas de reputación', included: true },
        { title: 'Análisis semanal', included: true },
        { title: 'Soporte por email', included: true },
        { title: 'Personalización avanzada', included: false },
        { title: 'API access', included: false }
      ],
      buttonText: 'Comenzar'
    },
    {
      id: 'pro',
      name: 'Plan Profesional',
      price: 79,
      billingPeriod: '/mes',
      description: 'Para profesionales y pequeñas empresas.',
      features: [
        { title: 'Monitoreo avanzado de menciones', included: true },
        { title: 'Alertas en tiempo real', included: true },
        { title: 'Análisis diario', included: true },
        { title: 'Soporte prioritario', included: true },
        { title: 'Personalización avanzada', included: true },
        { title: 'API access', included: false }
      ],
      isPopular: true,
      buttonText: 'Prueba Gratuita'
    },
    {
      id: 'enterprise',
      name: 'Plan Empresarial',
      price: 199,
      billingPeriod: '/mes',
      description: 'Solución completa para grandes organizaciones.',
      features: [
        { title: 'Monitoreo ilimitado', included: true },
        { title: 'Alertas personalizadas', included: true },
        { title: 'Análisis en tiempo real', included: true },
        { title: 'Soporte 24/7', included: true },
        { title: 'Personalización total', included: true },
        { title: 'API access', included: true }
      ],
      buttonText: 'Contactar Ventas'
    }
  ];

  const invoices = [
    {
      id: 'inv-001',
      invoiceNumber: 'INV-2025-001',
      date: '2025-06-01T00:00:00',
      amount: 79,
      status: 'paid' as const,
      downloadUrl: '#'
    },
    {
      id: 'inv-002',
      invoiceNumber: 'INV-2025-002',
      date: '2025-05-01T00:00:00',
      amount: 79,
      status: 'paid' as const,
      downloadUrl: '#'
    },
    {
      id: 'inv-003',
      invoiceNumber: 'INV-2025-003',
      date: '2025-04-01T00:00:00',
      amount: 79,
      status: 'paid' as const,
      downloadUrl: '#'
    }
  ];

  const currentPlan = {
    name: 'Plan Profesional',
    nextBillingDate: '2025-07-01T00:00:00',
    amount: 79
  };

  const creditPackages = [
    {
      id: 'credits-100',
      name: 'Paquete Básico',
      credits: 100,
      price: 9.99
    },
    {
      id: 'credits-500',
      name: 'Paquete Popular',
      credits: 500,
      price: 39.99,
      popular: true
    },
    {
      id: 'credits-1000',
      name: 'Paquete Premium',
      credits: 1000,
      price: 69.99
    },
    {
      id: 'credits-3000',
      name: 'Paquete Empresarial',
      credits: 3000,
      price: 179.99
    }
  ];

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Animaciones GSAP
  useEffect(() => {
    if (!isLoading && titleRef.current && pageRef.current) {
      // Timeline para secuencia de animaciones
      const tl = gsap.timeline();
      
      // Animación del título
      tl.from(titleRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
      
      // Animación de las pestañas
      tl.from('.tabs-animation', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.4');
      
      // Efecto sutil para toda la página
      gsap.from(pageRef.current, {
        backgroundColor: 'rgba(249, 250, 251, 0.5)',
        duration: 1.5,
        ease: 'power2.inOut'
      });
    }
  }, [isLoading]);

  // Manejar cambio de pestañas con animación
  const handleTabChange = (value: string) => {
    // Animación de salida para el contenido actual
    gsap.to(`.tab-content-${activeTab}`, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: 'power1.out',
      onComplete: () => {
        setActiveTab(value);
        
        // Animación de entrada para el nuevo contenido
        setTimeout(() => {
          gsap.fromTo(`.tab-content-${value}`,
            { opacity: 0, y: 10 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.4, 
              ease: 'power2.out' 
            }
          );
        }, 50);
      }
    });
  };

  // Esqueleto de carga
  if (isLoading) {
    return (
      <div className="animate-pulse p-6">
        <div className="mb-6 h-8 w-1/4 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-6 h-10 w-full max-w-md rounded-md bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-6 h-64 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-96 rounded-md bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="p-6">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 ref={titleRef} className="text-2xl font-bold text-gray-900 dark:text-white">
          Créditos y Suscripciones
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gestiona tus créditos, suscripciones y método de pago
        </p>
      </div>
      
      {/* Pestañas */}
      <Tabs 
        defaultValue="balance" 
        className="tabs-animation w-full"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="mb-6 grid w-full max-w-3xl grid-cols-4">
          <TabsTrigger value="balance" className="flex items-center">
            <Wallet className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Saldo</span>
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center">
            <Scroll className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Planes</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center">
            <Receipt className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Facturación</span>
          </TabsTrigger>
          <TabsTrigger value="purchase" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Comprar</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Contenido de las pestañas */}
        <TabsContent value="balance" className="tab-content-balance">
          <CreditBalance 
            currentBalance={creditBalance}
            balanceHistory={balanceHistory}
          />
        </TabsContent>
        
        <TabsContent value="plans" className="tab-content-plans">
          <PricingPlans plans={pricingPlans} />
        </TabsContent>
        
        <TabsContent value="billing" className="tab-content-billing">
          <BillingHistory 
            invoices={invoices}
            currentPlan={currentPlan}
          />
        </TabsContent>
        
        <TabsContent value="purchase" className="tab-content-purchase">
          <PurchaseCredits packages={creditPackages} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
