const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3006;

// Contenido HTML directo para mostrar el panel de administración
const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Administrativo - Reputación Online</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen">
    <div class="container mx-auto px-4 py-6">
        <header class="mb-8">
            <h1 class="text-3xl font-bold text-white">Panel Administrativo - Reputación Online</h1>
            <p class="text-white/80 mt-2">Sistema de gestión de créditos</p>
        </header>

        <!-- Estadísticas principales -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white/10 border border-white/30 p-6 rounded-lg">
                <h2 class="text-xl font-bold mb-2 text-white">Usuarios Totales</h2>
                <p class="text-4xl font-bold text-white">145</p>
                <p class="text-white/70 text-sm mt-2">↑ 12% desde el mes pasado</p>
            </div>
            
            <div class="bg-white/10 border border-white/30 p-6 rounded-lg">
                <h2 class="text-xl font-bold mb-2 text-white">Créditos Asignados</h2>
                <p class="text-4xl font-bold text-white">45.000</p>
                <p class="text-white/70 text-sm mt-2">↑ 8% desde el mes pasado</p>
            </div>
            
            <div class="bg-white/10 border border-white/30 p-6 rounded-lg">
                <h2 class="text-xl font-bold mb-2 text-white">Créditos Consumidos</h2>
                <p class="text-4xl font-bold text-white">28.500</p>
                <p class="text-white/70 text-sm mt-2">↑ 15% desde el mes pasado</p>
            </div>
            
            <div class="bg-white/10 border border-white/30 p-6 rounded-lg">
                <h2 class="text-xl font-bold mb-2 text-white">Ingresos Totales</h2>
                <p class="text-4xl font-bold text-white">$12.450</p>
                <p class="text-white/70 text-sm mt-2">↑ 5% desde el mes pasado</p>
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white/10 border border-white/30 p-6 rounded-lg">
                <h2 class="text-xl font-bold mb-4 text-white">Gestión de Usuarios</h2>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-white/20">
                                <th class="text-left py-3 px-4 text-white">Usuario</th>
                                <th class="text-left py-3 px-4 text-white">Email</th>
                                <th class="text-left py-3 px-4 text-white">Plan</th>
                                <th class="text-left py-3 px-4 text-white">Créditos</th>
                                <th class="text-left py-3 px-4 text-white">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-white/10 hover:bg-white/5">
                                <td class="py-3 px-4 text-white">Juan Pérez</td>
                                <td class="py-3 px-4 text-white">juan@ejemplo.com</td>
                                <td class="py-3 px-4 text-white">Premium</td>
                                <td class="py-3 px-4 text-white">2.450</td>
                                <td class="py-3 px-4">
                                    <button class="text-sm bg-cyan-500 px-2 py-1 rounded mr-2 text-white">Editar</button>
                                    <button class="text-sm bg-red-500/70 px-2 py-1 rounded text-white">Suspender</button>
                                </td>
                            </tr>
                            <tr class="border-b border-white/10 hover:bg-white/5">
                                <td class="py-3 px-4 text-white">María García</td>
                                <td class="py-3 px-4 text-white">maria@ejemplo.com</td>
                                <td class="py-3 px-4 text-white">Básico</td>
                                <td class="py-3 px-4 text-white">850</td>
                                <td class="py-3 px-4">
                                    <button class="text-sm bg-cyan-500 px-2 py-1 rounded mr-2 text-white">Editar</button>
                                    <button class="text-sm bg-red-500/70 px-2 py-1 rounded text-white">Suspender</button>
                                </td>
                            </tr>
                            <tr class="border-b border-white/10 hover:bg-white/5">
                                <td class="py-3 px-4 text-white">Carlos Rodríguez</td>
                                <td class="py-3 px-4 text-white">carlos@ejemplo.com</td>
                                <td class="py-3 px-4 text-white">Premium Plus</td>
                                <td class="py-3 px-4 text-white">5.200</td>
                                <td class="py-3 px-4">
                                    <button class="text-sm bg-cyan-500 px-2 py-1 rounded mr-2 text-white">Editar</button>
                                    <button class="text-sm bg-red-500/70 px-2 py-1 rounded text-white">Suspender</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mt-4 flex justify-center">
                    <button class="bg-teal-500 text-white px-4 py-2 rounded-md font-medium">Ver Todos los Usuarios</button>
                </div>
            </div>
            
            <div class="bg-white/10 border border-white/30 p-6 rounded-lg">
                <h2 class="text-xl font-bold mb-4 text-white">Gestión de Créditos</h2>
                <div class="space-y-4">
                    <div class="bg-white/5 p-4 rounded-md">
                        <h3 class="font-bold mb-2 text-white">Asignar Créditos</h3>
                        <div class="flex flex-col space-y-2">
                            <input 
                                type="text" 
                                placeholder="Buscar usuario..."
                                class="bg-white/10 border border-white/30 rounded p-2 text-white placeholder-white/50"
                            />
                            <input 
                                type="number" 
                                placeholder="Cantidad de créditos"
                                class="bg-white/10 border border-white/30 rounded p-2 text-white placeholder-white/50"
                            />
                            <button class="bg-teal-500 text-white px-4 py-2 rounded-md font-medium mt-2">
                                Asignar Créditos
                            </button>
                        </div>
                    </div>
                    
                    <div class="bg-white/5 p-4 rounded-md">
                        <h3 class="font-bold mb-2 text-white">Planes de Créditos</h3>
                        <div class="space-y-2">
                            <div class="flex justify-between items-center p-2 bg-white/10 rounded">
                                <span class="text-white">Básico</span>
                                <span class="text-white">1.000 créditos</span>
                            </div>
                            <div class="flex justify-between items-center p-2 bg-white/10 rounded">
                                <span class="text-white">Premium</span>
                                <span class="text-white">3.000 créditos</span>
                            </div>
                            <div class="flex justify-between items-center p-2 bg-white/10 rounded">
                                <span class="text-white">Premium Plus</span>
                                <span class="text-white">10.000 créditos</span>
                            </div>
                        </div>
                        <button class="bg-cyan-500 text-white px-4 py-2 rounded-md font-medium mt-4 w-full">
                            Gestionar Planes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

// Ruta principal que muestra el panel de administración directamente
app.get('/', (req, res) => {
  res.send(htmlContent);
});

// Ruta para el dashboard
app.get('/dashboard', (req, res) => {
  res.send(htmlContent);
});

// Proxy para las llamadas a la API
app.use('/api', (req, res) => {
  res.json({ message: 'API conectada correctamente' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Panel administrativo ejecutándose en http://localhost:${port}`);
});

