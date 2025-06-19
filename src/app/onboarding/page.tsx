"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { ChevronLeft, ChevronRight, Check, User, Briefcase, Camera, Users } from 'lucide-react';
import CategorySelector from '@/components/user/CategorySelector';
import SocialNetworkConnector from '@/components/user/SocialNetworkConnectorFixed';
import ProfilePhotoUploader from '@/components/user/ProfilePhotoUploader';

// Tipos para SocialConnectionsState
interface SocialConnection {
  connected: boolean;
  username: string;
  displayName: string;
  followers: number;
  profileImage: string;
  lastSync: string | null;
  metrics: {
    posts: number;
    engagement: number;
    reach: number;
  };
}

interface SocialConnectionsState {
  facebook: SocialConnection;
  instagram: SocialConnection;
  x: SocialConnection;
  linkedin: SocialConnection;
  tiktok: SocialConnection;
}

interface CategoryData {
  category: string;
  brandName: string;
  otherCategory: string;
  additionalSources: string[];
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser, isLoading } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Estados para los datos del onboarding
  const [basicData, setBasicData] = useState({
    name: user?.name || '',
    company: user?.company || '',
    phone: '',
    bio: ''
  });
  
  const [categoryData, setCategoryData] = useState<CategoryData>({
    category: '',
    brandName: '',
    otherCategory: '',
    additionalSources: []
  });
  
  const [connectedNetworks, setConnectedNetworks] = useState<SocialConnectionsState | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.avatarUrl || null);

  // Redirigir si el usuario ya completó el onboarding
  useEffect(() => {
    if (!isLoading && user && user.onboardingCompleted) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  // Redirigir al login si no hay usuario
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const steps = [
    {
      id: 1,
      title: 'Datos Básicos',
      description: 'Completa tu información personal',
      icon: User,
      component: 'basic'
    },
    {
      id: 2,
      title: 'Categoría de Perfil',
      description: 'Selecciona tu tipo de perfil',
      icon: Briefcase,
      component: 'category'
    },
    {
      id: 3,
      title: 'Redes Sociales',
      description: 'Conecta tus redes sociales',
      icon: Users,
      component: 'social'
    },
    {
      id: 4,
      title: 'Foto de Perfil',
      description: 'Sube tu foto de perfil',
      icon: Camera,
      component: 'photo'
    }
  ];

  const isStepValid = (stepId: number) => {
    switch (stepId) {
      case 1:
        return basicData.name.trim() !== '';
      case 2:
        return categoryData.category !== '' && 
               (categoryData.category !== 'Marca / empresa' || categoryData.brandName.trim() !== '') &&
               (categoryData.category !== 'Otro' || categoryData.otherCategory.trim() !== '');
      case 3:
        return true; // Siempre permitir avanzar desde redes sociales (es opcional)
      case 4:
        return profilePhoto !== null;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length && isStepValid(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBasicDataChange = (field: string, value: string) => {
    setBasicData(prev => ({ ...prev, [field]: value }));
  };

  const handleFinishOnboarding = async () => {
    if (!user) return;

    try {
      // Mapear la categoría a un tipo válido
      let mappedProfileType: 'personal' | 'political' | 'business' = 'personal';
      if (categoryData.category === 'Político / gubernamental') {
        mappedProfileType = 'political';
      } else if (categoryData.category === 'Marca / empresa') {
        mappedProfileType = 'business';
      }

      // Actualizar los datos del usuario incluyendo categoría
      await updateUser({
        name: basicData.name,
        company: basicData.company,
        avatarUrl: profilePhoto || user.avatarUrl,
        onboardingCompleted: true,
        // Guardar categoría y datos adicionales
        profileType: mappedProfileType,
        category: categoryData.category,
        brandName: categoryData.brandName,
        otherCategory: categoryData.otherCategory,
        additionalSources: categoryData.additionalSources,
      });

      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  // Función wrapper para manejar el callback del CategorySelector
  const handleCategoryChange = (data: any) => {
    setCategoryData({
      category: data.category || '',
      brandName: data.brandName || '',
      otherCategory: data.otherCategory || '',
      additionalSources: data.additionalSources || []
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#01257D] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // El useEffect redirigirá al login
  }

  const currentStepData = steps.find(step => step.id === currentStep);
  const isLastStep = currentStep === steps.length;
  const canProceed = isStepValid(currentStep);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/rol-logo.png" 
            alt="PUL Logo" 
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            ¡Bienvenido a Reputación Online!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configura tu perfil en unos simples pasos para comenzar a monitorear tu reputación
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              const isAccessible = step.id <= currentStep || isCompleted;

              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    isCompleted
                      ? 'bg-[#01257D] border-[#01257D] text-white'
                      : isCurrent
                      ? 'border-[#01257D] text-[#01257D] bg-white'
                      : isAccessible
                      ? 'border-gray-300 text-gray-400 bg-white'
                      : 'border-gray-200 text-gray-300 bg-gray-100'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <StepIcon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${
                      isCurrent ? 'text-[#01257D]' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                  
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className={`absolute top-6 left-1/2 w-full h-0.5 ${
                      completedSteps.includes(step.id) ? 'bg-[#01257D]' : 'bg-gray-200'
                    }`} style={{ zIndex: -1 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentStepData?.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {currentStepData?.description}
            </p>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={basicData.name}
                    onChange={(e) => handleBasicDataChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01257D] focus:border-[#01257D] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Tu nombre completo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Empresa u organización (opcional)
                  </label>
                  <input
                    type="text"
                    value={basicData.company}
                    onChange={(e) => handleBasicDataChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01257D] focus:border-[#01257D] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Nombre de tu empresa u organización"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    value={basicData.phone}
                    onChange={(e) => handleBasicDataChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01257D] focus:border-[#01257D] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Tu número de teléfono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Biografía corta (opcional)
                  </label>
                  <textarea
                    value={basicData.bio}
                    onChange={(e) => handleBasicDataChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#01257D] focus:border-[#01257D] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Cuéntanos brevemente sobre ti"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <CategorySelector
                onCategoryChange={handleCategoryChange}
                initialCategory={categoryData.category}
              />
            )}

            {currentStep === 3 && (
              <SocialNetworkConnector
                onComplete={(networks) => setConnectedNetworks(networks)}
                allowSkip={true}
                isOnboarding={true}
              />
            )}

            {currentStep === 4 && (
              <ProfilePhotoUploader
                onPhotoChange={setProfilePhoto}
                initialPhoto={profilePhoto}
              />
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-[#01257D] hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Anterior
          </button>

          <div className="text-sm text-gray-500">
            Paso {currentStep} de {steps.length}
          </div>

          {isLastStep ? (
            <button
              onClick={handleFinishOnboarding}
              disabled={!canProceed}
              className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
                canProceed
                  ? 'bg-[#01257D] text-white hover:bg-[#013AAA]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Finalizar
              <Check className="h-5 w-5 ml-1" />
            </button>
          ) : (
            <button
              onClick={handleNextStep}
              disabled={!canProceed}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                canProceed
                  ? 'bg-[#01257D] text-white hover:bg-[#013AAA]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Siguiente
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
