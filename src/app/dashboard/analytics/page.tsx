"use client";

import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  UserCheck, 
  BarChart3, 
  TrendingUp, 
  MessageSquare,
  Calendar,
  ChevronDown
} from 'lucide-react';

// Datos simulados para cuando el servicio no carga datos
const simulationData = {
  mentions: {
    total: 1245,
    positive: 845,
    negative: 124,
    neutral: 276,
    trend: '+12%',
    sentiment: 87,
    reach: 28950,
    timeline: [
      { date: '2025-01-01', sentiment: 74, mentions: 85, engagement: 22 },
      { date: '2025-02-01', sentiment: 78, mentions: 110, engagement: 28 },
      { date: '2025-03-01', sentiment: 82, mentions: 125, engagement: 32 },
      { date: '2025-04-01', sentiment: 85, mentions: 150, engagement: 38 },
      { date: '2025-05-01', sentiment: 86, mentions: 180, engagement: 45 },
      { date: '2025-06-01', sentiment: 87, mentions: 210, engagement: 52 }
    ],
    latestMentions: [
      {
        id: 'm001',
        source: 'twitter',
        author: 'María López',
        content: 'Excelente servicio de atención al cliente. Muy satisfecha con la rapidez de respuesta.',
        date: '2025-06-04T14:23:00',
        sentiment: 'positive',
        engagement: 158,
        url: 'https://twitter.com/example/status/123456789'
      },
      {
        id: 'm002',
        source: 'facebook',
        author: 'Carlos Rodríguez',
        content: 'Me encantó el producto, aunque creo que podrían mejorar el envoltorio para hacerlo más ecológico.',
        date: '2025-06-03T10:15:00',
        sentiment: 'neutral',
        engagement: 42,
        url: 'https://facebook.com/example/posts/987654321'
      },
      {
        id: 'm003',
        source: 'instagram',
        author: 'Laura Martínez',
        content: 'Totalmente recomendable. No cambiaría por otra marca.',
        date: '2025-06-03T08:45:00',
        sentiment: 'positive',
        engagement: 215,
        url: 'https://instagram.com/p/example123'
      },
      {
        id: 'm004',
        source: 'news',
        author: 'El Informador',
        content: 'La empresa continúa expandiéndose en el mercado nacional con resultados positivos.',
        date: '2025-06-02T18:30:00',
        sentiment: 'positive',
        engagement: 89,
        url: 'https://elinformador.com/economia/example-article'
      },
      {
        id: 'm005',
        source: 'blogs',
        author: 'TechReviewer',
        content: 'Probamos el servicio y encontramos algunos puntos que necesitan mejora urgente.',
        date: '2025-06-01T12:05:00',
        sentiment: 'negative',
        engagement: 124,
        url: 'https://techreviewer.com/reviews/example-review'
      }
    ]
  }
};

// Componentes de analytics
import ReputationChart from '@/components/analytics/ReputationChart';
import SentimentAnalysis from '@/components/analytics/SentimentAnalysis';
import MetricCard from '@/components/analytics/MetricCard';
import MentionsTable from '@/components/analytics/MentionsTable';

// Servicios para obtener datos
import { 
  getReputationMetrics,
  getTimelineData,
  getSentimentData,
  getLatestMentions
} from '@/lib/services/analyticsService';

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [metrics, setMetrics] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<{reputationScore: any; mentions: any; engagement: any} | null>(null);
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [mentions, setMentions] = useState<any[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Solo cargar datos en el cliente
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Cargar datos en paralelo
        try {
          const metricsData = await getReputationMetrics();
          setMetrics(metricsData);
        } catch (e) {
          console.warn('Error cargando métricas:', e);
        }
        
        try {
          const timeline = await getTimelineData(period);
          setTimelineData(timeline);
        } catch (e) {
          console.warn('Error cargando timeline:', e);
        }
        
        try {
          const sentiment = await getSentimentData();
          setSentimentData(sentiment);
        } catch (e) {
          console.warn('Error cargando sentimientos:', e);
        }
        
        try {
          const latestMentions = await getLatestMentions(5);
          setMentions(latestMentions);
        } catch (e) {
          console.warn('Error cargando menciones:', e);
        }
        
      } catch (error) {
        console.error('Error cargando datos de analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  // Animaciones GSAP
  useEffect(() => {
    if (!isLoading && headerRef.current) {
      try {
        // Timeline para secuencia de animaciones
        const tl = gsap.timeline();
        
        // Animación del encabezado
        tl.from(headerRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        });
        
        // Animación general
        if (pageRef.current) {
          // Efecto sutil de presencia para toda la página
          gsap.from(pageRef.current, {
            opacity: 0.8,
            duration: 1.5,
            ease: 'power2.inOut'
          });
        }
      } catch (error) {
        console.error('Error en animaciones:', error);
      }
    }
  }, [isLoading]);

  // Cambiar el período
  const handlePeriodChange = (newPeriod: 'week' | 'month' | 'quarter') => {
    if (period !== newPeriod) {
      setPeriod(newPeriod);
    }
  };

  // Esqueletos de carga
  if (isLoading) {
    return (
      <div className="animate-pulse p-6">
        {/* Esqueleto del encabezado */}
        <div className="mb-8">
          <div className="h-8 w-1/4 rounded-md bg-gray-200 dark:bg-gray-700"></div>
          <div className="mt-2 h-4 w-2/5 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        </div>
        
        {/* Esqueleto para métricas */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          ))}
        </div>
        
        {/* Esqueleto para gráficos */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-2 h-80 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-80 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
        
        {/* Esqueleto para tabla */}
        <div className="h-96 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="p-6">
      {/* Encabezado */}
      <div ref={headerRef} className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Panel de Análisis
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitoriza tu reputación online y analiza el sentimiento de las menciones
        </p>
      </div>
      
      {/* Selector de período */}
      <div className="mb-8 flex">
        <div className="ml-auto inline-flex rounded-md border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={() => handlePeriodChange('week')}
            className={`flex items-center rounded-l-md px-4 py-2 text-sm font-medium ${
              period === 'week'
                ? 'bg-primary text-white hover:bg-primary-600'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Calendar className="mr-1 h-4 w-4" />
            Semana
          </button>
          <button
            onClick={() => handlePeriodChange('month')}
            className={`flex items-center border-l border-r border-gray-200 px-4 py-2 text-sm font-medium dark:border-gray-700 ${
              period === 'month'
                ? 'bg-primary text-white hover:bg-primary-600'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Calendar className="mr-1 h-4 w-4" />
            Mes
          </button>
          <button
            onClick={() => handlePeriodChange('quarter')}
            className={`flex items-center rounded-r-md px-4 py-2 text-sm font-medium ${
              period === 'quarter'
                ? 'bg-primary text-white hover:bg-primary-600'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Calendar className="mr-1 h-4 w-4" />
            Trimestre
          </button>
        </div>
      </div>
      
      {/* Métricas principales */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Puntuación de Reputación" 
          value={metrics ? metrics.overallScore : simulationData.mentions.sentiment} 
          icon={UserCheck}
          trend={metrics ? metrics.trends.overallScoreTrend : simulationData.mentions.trend}
          colorScheme="primary"
        />
        <MetricCard 
          title="Menciones" 
          value={metrics ? metrics.mentionsCount : simulationData.mentions.total} 
          icon={MessageSquare}
          trend={metrics ? metrics.trends.mentionsCountTrend : simulationData.mentions.trend}
          colorScheme="blue"
        />
        <MetricCard 
          title="Alcance" 
          value={metrics ? metrics.reachScore : simulationData.mentions.reach} 
          icon={BarChart3}
          trend={metrics ? metrics.trends.reachScoreTrend : '+6%'}
          colorScheme="green"
        />
        <MetricCard 
          title="Tasa de Engagement" 
          value={metrics ? metrics.engagementRate : 32.5} 
          icon={TrendingUp}
          trend={metrics ? metrics.trends.engagementRateTrend : '+3.2%'}
          colorScheme="yellow"
        />
      </div>
      
      {/* Gráficos y análisis */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2">
          <ReputationChart 
            data={{
              labels: timelineData?.reputationScore?.labels || simulationData.mentions.timeline.map(item => item.date),
              values: timelineData?.reputationScore?.values || simulationData.mentions.timeline.map(item => item.sentiment),
              previousPeriodValues: timelineData?.reputationScore?.previousPeriodValues
            }}
            title="Evolución de Puntuación de Reputación" 
            showComparison={true}
          />
        </div>
        <div>
          <SentimentAnalysis 
            data={sentimentData?.current || {
              positive: simulationData.mentions.positive,
              negative: simulationData.mentions.negative,
              neutral: simulationData.mentions.neutral,
              total: simulationData.mentions.total
            }}
            title="Análisis de Sentimiento" 
          />
        </div>
      </div>
      
      {/* Gráficos secundarios */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <ReputationChart 
          data={{
            labels: timelineData?.mentions?.labels || simulationData.mentions.timeline.map(item => item.date),
            values: timelineData?.mentions?.values || simulationData.mentions.timeline.map(item => item.mentions),
            previousPeriodValues: timelineData?.mentions?.previousPeriodValues
          }}
          title="Evolución de Menciones" 
          type="bar"
        />
        <ReputationChart 
          data={{
            labels: timelineData?.engagement?.labels || simulationData.mentions.timeline.map(item => item.date),
            values: timelineData?.engagement?.values || simulationData.mentions.timeline.map(item => item.engagement),
            previousPeriodValues: timelineData?.engagement?.previousPeriodValues
          }}
          title="Tasa de Engagement" 
          showComparison={true}
        />
      </div>
      
      {/* Tabla de menciones */}
      <div className="mb-8">
        <MentionsTable 
          mentions={mentions?.length > 0 ? mentions : simulationData.mentions.latestMentions} 
          title="Últimas Menciones" 
        />
      </div>

      {/* Botón para generar informe */}
      <div className="flex justify-center">
        <button
          className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-base font-medium text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:ring-offset-gray-900"
        >
          Generar Informe Completo
          <ChevronDown className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
