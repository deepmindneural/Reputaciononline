/**
 * Servicio para gestión de agencias y reventa de planes
 */

// Tipos para el servicio de agencias
export interface AgencyProfile {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  address?: string;
  phone?: string;
  website?: string;
  commissionRate: number;
  balanceAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AgencyClient {
  id: string;
  clientId: string;
  client: {
    id: string;
    name: string;
    email: string;
    active: boolean;
    credits: number;
    createdAt: string;
  };
  status: 'active' | 'inactive' | 'pending';
  commissionRate?: number;
  createdAt: string;
}

export interface SaleTransaction {
  id: string;
  agencyProfileId: string;
  clientName: string;
  clientEmail: string;
  planName: string;
  planPrice: number;
  commissionAmount: number;
  status: 'pending' | 'completed' | 'refunded';
  paymentMethod?: string;
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  agencyProfileId: string;
  amount: number;
  status: 'pending' | 'processed' | 'rejected';
  paymentMethod: string;
  notes?: string;
  processedAt?: string;
  createdAt: string;
}

// Clase del servicio
class AgencyService {
  private apiUrl: string;
  
  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  }
  
  // Función auxiliar para realizar peticiones con token de autenticación
  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    // En producción, obtener el token del almacenamiento local o contexto
    const token = localStorage.getItem('authToken') || '';
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };
    
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        ...options,
        headers
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
      }
      
      return data;
    } catch (error) {
      console.error('Error en fetchWithAuth:', error);
      throw error;
    }
  }
  
  // Obtener perfil de agencia
  async getAgencyProfile(): Promise<{ agencyProfile: AgencyProfile }> {
    // Cuando la API esté lista, usar esto:
    // return this.fetchWithAuth('/api/agency/profile');
    
    // Mientras tanto, datos simulados
    return {
      agencyProfile: {
        id: '1',
        name: 'Agencia de Marketing Digital',
        description: 'Especialistas en marketing político y gestión de reputación online',
        commissionRate: 15,
        balanceAmount: 5000,
        address: 'Calle 100 #15-20, Bogotá',
        phone: '+57 301 123 4567',
        website: 'www.agenciamarketing.co',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }
  
  // Actualizar perfil de agencia
  async updateAgencyProfile(profileData: Partial<AgencyProfile>): Promise<{ agencyProfile: AgencyProfile }> {
    // Cuando la API esté lista, usar esto:
    // return this.fetchWithAuth('/api/agency/profile', {
    //   method: 'POST',
    //   body: JSON.stringify(profileData)
    // });
    
    // Mientras tanto, datos simulados
    return {
      agencyProfile: {
        id: '1',
        ...profileData,
        commissionRate: profileData.commissionRate || 15,
        balanceAmount: 5000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as AgencyProfile
    };
  }
  
  // Obtener clientes de la agencia
  async getAgencyClients(): Promise<{ clients: AgencyClient[] }> {
    // Cuando la API esté lista, usar esto:
    // return this.fetchWithAuth('/api/agency/clients');
    
    // Mientras tanto, datos simulados
    return {
      clients: [
        {
          id: '1',
          clientId: 'c1',
          client: {
            id: 'c1',
            name: 'Juan Rodríguez - Candidato Senado',
            email: 'juan@ejemplo.com',
            active: true,
            credits: 5000,
            createdAt: new Date().toISOString()
          },
          status: 'active',
          commissionRate: 15,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          clientId: 'c2',
          client: {
            id: 'c2',
            name: 'María López - Candidata Alcaldía',
            email: 'maria@ejemplo.com',
            active: true,
            credits: 3000,
            createdAt: new Date().toISOString()
          },
          status: 'active',
          commissionRate: 10,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          clientId: 'c3',
          client: {
            id: 'c3',
            name: 'Carlos Gómez - Partido Político',
            email: 'carlos@ejemplo.com',
            active: false,
            credits: 0,
            createdAt: new Date().toISOString()
          },
          status: 'inactive',
          commissionRate: 12,
          createdAt: new Date().toISOString()
        }
      ]
    };
  }
  
  // Añadir cliente a la agencia
  async addAgencyClient(clientData: { clientEmail: string, clientName: string, commissionRate?: number }): Promise<{ agencyClient: AgencyClient }> {
    // Cuando la API esté lista, usar esto:
    // return this.fetchWithAuth('/api/agency/clients', {
    //   method: 'POST',
    //   body: JSON.stringify(clientData)
    // });
    
    // Mientras tanto, datos simulados
    return {
      agencyClient: {
        id: Math.random().toString(36).substring(7),
        clientId: Math.random().toString(36).substring(7),
        client: {
          id: Math.random().toString(36).substring(7),
          name: clientData.clientName,
          email: clientData.clientEmail,
          active: true,
          credits: 0,
          createdAt: new Date().toISOString()
        },
        status: 'active',
        commissionRate: clientData.commissionRate || 15,
        createdAt: new Date().toISOString()
      }
    };
  }
  
  // Registrar una venta
  async registerSale(saleData: { 
    clientEmail: string, 
    clientName: string, 
    planName: string, 
    planPrice: number,
    paymentMethod?: string
  }): Promise<{ saleTransaction: SaleTransaction }> {
    // Cuando la API esté lista, usar esto:
    // return this.fetchWithAuth('/api/agency/sales', {
    //   method: 'POST',
    //   body: JSON.stringify(saleData)
    // });
    
    // Mientras tanto, datos simulados
    const commissionAmount = saleData.planPrice * 0.15;
    
    return {
      saleTransaction: {
        id: Math.random().toString(36).substring(7),
        agencyProfileId: '1',
        clientName: saleData.clientName,
        clientEmail: saleData.clientEmail,
        planName: saleData.planName,
        planPrice: saleData.planPrice,
        commissionAmount,
        status: 'pending',
        paymentMethod: saleData.paymentMethod || 'credit_card',
        createdAt: new Date().toISOString()
      }
    };
  }
  
  // Obtener historial de ventas
  async getSalesHistory(): Promise<{ sales: SaleTransaction[] }> {
    // Cuando la API esté lista, usar esto:
    // return this.fetchWithAuth('/api/agency/sales');
    
    // Mientras tanto, datos simulados
    return {
      sales: [
        {
          id: '1',
          agencyProfileId: '1',
          clientName: 'Juan Rodríguez - Candidato Senado',
          clientEmail: 'juan@ejemplo.com',
          planName: 'Plan Premium',
          planPrice: 2000,
          commissionAmount: 300,
          status: 'completed',
          paymentMethod: 'credit_card',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          agencyProfileId: '1',
          clientName: 'María López - Candidata Alcaldía',
          clientEmail: 'maria@ejemplo.com',
          planName: 'Plan Empresarial',
          planPrice: 5000,
          commissionAmount: 750,
          status: 'completed',
          paymentMethod: 'bank_transfer',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          agencyProfileId: '1',
          clientName: 'Carlos Gómez - Partido Político',
          clientEmail: 'carlos@ejemplo.com',
          planName: 'Plan Básico',
          planPrice: 1000,
          commissionAmount: 150,
          status: 'refunded',
          paymentMethod: 'paypal',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    };
  }
  
  // Solicitar retiro de comisiones
  async requestWithdrawal(withdrawalData: {
    amount: number,
    paymentMethod: string,
    paymentDetails?: Record<string, string>,
    notes?: string
  }): Promise<{ withdrawal: Withdrawal }> {
    // Cuando la API esté lista, usar esto:
    // return this.fetchWithAuth('/api/agency/withdrawals', {
    //   method: 'POST',
    //   body: JSON.stringify(withdrawalData)
    // });
    
    // Mientras tanto, datos simulados
    return {
      withdrawal: {
        id: Math.random().toString(36).substring(7),
        agencyProfileId: '1',
        amount: withdrawalData.amount,
        status: 'pending',
        paymentMethod: withdrawalData.paymentMethod,
        notes: withdrawalData.notes,
        createdAt: new Date().toISOString()
      }
    };
  }
  
  // Obtener historial de retiros
  async getWithdrawals(): Promise<{ withdrawals: Withdrawal[] }> {
    // Cuando la API esté lista, usar esto:
    // return this.fetchWithAuth('/api/agency/withdrawals');
    
    // Mientras tanto, datos simulados
    return {
      withdrawals: [
        {
          id: '1',
          agencyProfileId: '1',
          amount: 1000,
          status: 'processed',
          paymentMethod: 'bank_transfer',
          notes: 'Retiro mensual',
          processedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          agencyProfileId: '1',
          amount: 1500,
          status: 'pending',
          paymentMethod: 'paypal',
          notes: 'Retiro extraordinario',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          agencyProfileId: '1',
          amount: 500,
          status: 'rejected',
          paymentMethod: 'bank_transfer',
          notes: 'Documentación incompleta',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    };
  }
}

export const agencyService = new AgencyService();
