FROM node:18-alpine AS base

# Establecer el directorio de trabajo
WORKDIR /app

# Configurar variables de entorno
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar archivos de configuración
COPY package.json package-lock.json* ./

# Instalar dependencias (usar npm install en lugar de npm ci)
RUN npm install --production

# Copiar el resto de archivos del proyecto
COPY . .

# Construir la aplicación principal
RUN npm run build:docker

# Etapa de producción
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar las dependencias y archivos necesarios
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/next.config.js ./next.config.js
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next

# Puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
