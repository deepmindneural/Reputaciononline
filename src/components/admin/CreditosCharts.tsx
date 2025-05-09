import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Componente para el gru00e1fico de consumo por canal
interface ConsumosPorCanalProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

export const ConsumosPorCanalChart: React.FC<ConsumosPorCanalProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Distribuciu00f3n de Consumo por Canal</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value.toLocaleString()} cru00e9ditos`, '']}/>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Componente para el gru00e1fico de tendencia de uso
interface TendenciaUsoProps {
  data: {
    fecha: string;
    consumidos: number;
    recargados: number;
  }[];
}

export const TendenciaUsoChart: React.FC<TendenciaUsoProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tendencia de Uso de Cru00e9ditos</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} cru00e9ditos`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="consumidos"
              stroke="#ff5252"
              activeDot={{ r: 8 }}
              name="Cru00e9ditos Consumidos"
            />
            <Line
              type="monotone"
              dataKey="recargados"
              stroke="#4caf50"
              activeDot={{ r: 8 }}
              name="Cru00e9ditos Recargados"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Componente para el gru00e1fico de cru00e9ditos por usuario
interface CreditosPorUsuarioProps {
  data: {
    nombre: string;
    disponibles: number;
    gastados: number;
  }[];
}

export const CreditosPorUsuarioChart: React.FC<CreditosPorUsuarioProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Cru00e9ditos por Usuario (Top 10)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 150,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1} />
            <XAxis type="number" />
            <YAxis dataKey="nombre" type="category" width={150} />
            <Tooltip formatter={(value) => `${value.toLocaleString()} cru00e9ditos`} />
            <Legend />
            <Bar dataKey="disponibles" name="Cru00e9ditos Disponibles" fill="#4caf50" />
            <Bar dataKey="gastados" name="Cru00e9ditos Gastados" fill="#ff9800" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Componente para la predicciu00f3n de uso
interface PrediccionUsoProps {
  data: {
    fecha: string;
    prediccion: number;
    actual?: number;
  }[];
}

export const PrediccionUsoChart: React.FC<PrediccionUsoProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Predicciu00f3n de Consumo Mensual</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} cru00e9ditos`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#2196f3"
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
              name="Consumo Real"
            />
            <Line
              type="monotone"
              dataKey="prediccion"
              stroke="#9c27b0"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Predicciu00f3n"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
