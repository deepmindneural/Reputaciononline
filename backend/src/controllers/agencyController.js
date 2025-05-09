const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controlador para gestionar agencias
const agencyController = {
  // Obtener perfil de agencia
  getAgencyProfile: async (req, res) => {
    try {
      const { userId } = req;
      
      const agencyProfile = await prisma.agencyProfile.findFirst({
        where: {
          user: {
            id: userId
          }
        },
        include: {
          clients: {
            include: {
              client: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  active: true
                }
              }
            }
          },
          salesTransactions: true,
          withdrawals: true
        }
      });
      
      if (!agencyProfile) {
        return res.status(404).json({ message: 'Perfil de agencia no encontrado' });
      }
      
      return res.status(200).json({ agencyProfile });
    } catch (error) {
      console.error('Error al obtener perfil de agencia:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  // Crear o actualizar perfil de agencia
  updateAgencyProfile: async (req, res) => {
    try {
      const { userId } = req;
      const { 
        name, 
        description, 
        address, 
        phone, 
        website, 
        commissionRate 
      } = req.body;
      
      // Validar datos
      if (!name) {
        return res.status(400).json({ message: 'El nombre de la agencia es obligatorio' });
      }
      
      // Verificar si ya existe un perfil
      const existingProfile = await prisma.agencyProfile.findFirst({
        where: {
          user: {
            id: userId
          }
        }
      });
      
      let agencyProfile;
      
      if (existingProfile) {
        // Actualizar perfil existente
        agencyProfile = await prisma.agencyProfile.update({
          where: {
            id: existingProfile.id
          },
          data: {
            name,
            description,
            address,
            phone,
            website,
            commissionRate: commissionRate ? parseFloat(commissionRate) : undefined,
          }
        });
      } else {
        // Crear nuevo perfil
        agencyProfile = await prisma.agencyProfile.create({
          data: {
            name,
            description,
            address,
            phone,
            website,
            commissionRate: commissionRate ? parseFloat(commissionRate) : 10.0,
            user: {
              connect: {
                id: userId
              }
            }
          }
        });
        
        // Actualizar rol de usuario a agencia
        await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            role: 'agencia'
          }
        });
      }
      
      return res.status(200).json({ 
        message: 'Perfil de agencia actualizado correctamente',
        agencyProfile 
      });
    } catch (error) {
      console.error('Error al actualizar perfil de agencia:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  // Listar clientes de la agencia
  getAgencyClients: async (req, res) => {
    try {
      const { userId } = req;
      
      const agencyProfile = await prisma.agencyProfile.findFirst({
        where: {
          user: {
            id: userId
          }
        }
      });
      
      if (!agencyProfile) {
        return res.status(404).json({ message: 'Perfil de agencia no encontrado' });
      }
      
      const clients = await prisma.agencyClient.findMany({
        where: {
          agencyProfileId: agencyProfile.id
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              active: true,
              credits: true,
              createdAt: true
            }
          }
        }
      });
      
      return res.status(200).json({ clients });
    } catch (error) {
      console.error('Error al obtener clientes de la agencia:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  // Añadir un nuevo cliente
  addAgencyClient: async (req, res) => {
    try {
      const { userId } = req;
      const { clientEmail, clientName, commissionRate } = req.body;
      
      if (!clientEmail || !clientName) {
        return res.status(400).json({ message: 'El email y nombre del cliente son obligatorios' });
      }
      
      // Obtener perfil de agencia
      const agencyProfile = await prisma.agencyProfile.findFirst({
        where: {
          user: {
            id: userId
          }
        }
      });
      
      if (!agencyProfile) {
        return res.status(404).json({ message: 'Perfil de agencia no encontrado' });
      }
      
      // Verificar si el cliente ya existe
      let client = await prisma.user.findUnique({
        where: {
          email: clientEmail
        }
      });
      
      // Si no existe, crearlo
      if (!client) {
        // Generar contraseña aleatoria temporal
        const tempPassword = Math.random().toString(36).slice(-8);
        
        client = await prisma.user.create({
          data: {
            email: clientEmail,
            name: clientName,
            password: tempPassword, // En producción, usar bcrypt para hashear
            role: 'user',
            credits: 0,
            active: true
          }
        });
        
        // TODO: Enviar email con credenciales
      }
      
      // Verificar si ya hay una relación con este cliente
      const existingRelation = await prisma.agencyClient.findUnique({
        where: {
          agencyId_clientId: {
            agencyId: userId,
            clientId: client.id
          }
        }
      });
      
      if (existingRelation) {
        return res.status(400).json({ message: 'Este cliente ya está asociado a la agencia' });
      }
      
      // Crear relación agencia-cliente
      const agencyClient = await prisma.agencyClient.create({
        data: {
          agency: {
            connect: {
              id: userId
            }
          },
          client: {
            connect: {
              id: client.id
            }
          },
          agencyProfile: {
            connect: {
              id: agencyProfile.id
            }
          },
          commissionRate: commissionRate ? parseFloat(commissionRate) : null,
          status: 'active'
        }
      });
      
      return res.status(201).json({
        message: 'Cliente añadido correctamente',
        agencyClient
      });
    } catch (error) {
      console.error('Error al añadir cliente a la agencia:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  // Registrar una venta
  registerSale: async (req, res) => {
    try {
      const { userId } = req;
      const { 
        clientEmail, 
        clientName, 
        planName, 
        planPrice,
        paymentMethod,
        paymentDetails
      } = req.body;
      
      if (!clientEmail || !clientName || !planName || !planPrice) {
        return res.status(400).json({ 
          message: 'Todos los campos son obligatorios: clientEmail, clientName, planName, planPrice' 
        });
      }
      
      // Obtener perfil de agencia
      const agencyProfile = await prisma.agencyProfile.findFirst({
        where: {
          user: {
            id: userId
          }
        }
      });
      
      if (!agencyProfile) {
        return res.status(404).json({ message: 'Perfil de agencia no encontrado' });
      }
      
      // Calcular comisión
      const commissionAmount = (parseFloat(planPrice) * agencyProfile.commissionRate) / 100;
      
      // Registrar transacción
      const saleTransaction = await prisma.saleTransaction.create({
        data: {
          agencyProfile: {
            connect: {
              id: agencyProfile.id
            }
          },
          clientName,
          clientEmail,
          planName,
          planPrice: parseFloat(planPrice),
          commissionAmount,
          status: 'pending',
          paymentMethod: paymentMethod || 'other',
          paymentDetails: paymentDetails || {}
        }
      });
      
      return res.status(201).json({
        message: 'Venta registrada correctamente',
        saleTransaction
      });
    } catch (error) {
      console.error('Error al registrar venta:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  // Solicitar retiro de comisiones
  requestWithdrawal: async (req, res) => {
    try {
      const { userId } = req;
      const { amount, paymentMethod, paymentDetails, notes } = req.body;
      
      if (!amount || !paymentMethod) {
        return res.status(400).json({ message: 'El monto y método de pago son obligatorios' });
      }
      
      // Obtener perfil de agencia
      const agencyProfile = await prisma.agencyProfile.findFirst({
        where: {
          user: {
            id: userId
          }
        }
      });
      
      if (!agencyProfile) {
        return res.status(404).json({ message: 'Perfil de agencia no encontrado' });
      }
      
      // Verificar saldo disponible
      if (parseFloat(amount) > agencyProfile.balanceAmount) {
        return res.status(400).json({ 
          message: 'Saldo insuficiente para realizar el retiro',
          available: agencyProfile.balanceAmount,
          requested: parseFloat(amount)
        });
      }
      
      // Registrar solicitud de retiro
      const withdrawal = await prisma.withdrawal.create({
        data: {
          agencyProfile: {
            connect: {
              id: agencyProfile.id
            }
          },
          amount: parseFloat(amount),
          paymentMethod,
          paymentDetails: paymentDetails || {},
          status: 'pending',
          notes: notes || ''
        }
      });
      
      // Actualizar saldo de la agencia
      await prisma.agencyProfile.update({
        where: {
          id: agencyProfile.id
        },
        data: {
          balanceAmount: {
            decrement: parseFloat(amount)
          }
        }
      });
      
      return res.status(201).json({
        message: 'Solicitud de retiro creada correctamente',
        withdrawal
      });
    } catch (error) {
      console.error('Error al solicitar retiro:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  // Obtener historial de retiros
  getWithdrawals: async (req, res) => {
    try {
      const { userId } = req;
      
      // Obtener perfil de agencia
      const agencyProfile = await prisma.agencyProfile.findFirst({
        where: {
          user: {
            id: userId
          }
        }
      });
      
      if (!agencyProfile) {
        return res.status(404).json({ message: 'Perfil de agencia no encontrado' });
      }
      
      // Obtener retiros
      const withdrawals = await prisma.withdrawal.findMany({
        where: {
          agencyProfileId: agencyProfile.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return res.status(200).json({ withdrawals });
    } catch (error) {
      console.error('Error al obtener historial de retiros:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  // Obtener historial de ventas
  getSalesHistory: async (req, res) => {
    try {
      const { userId } = req;
      
      // Obtener perfil de agencia
      const agencyProfile = await prisma.agencyProfile.findFirst({
        where: {
          user: {
            id: userId
          }
        }
      });
      
      if (!agencyProfile) {
        return res.status(404).json({ message: 'Perfil de agencia no encontrado' });
      }
      
      // Obtener ventas
      const sales = await prisma.saleTransaction.findMany({
        where: {
          agencyProfileId: agencyProfile.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return res.status(200).json({ sales });
    } catch (error) {
      console.error('Error al obtener historial de ventas:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
};

module.exports = agencyController;
