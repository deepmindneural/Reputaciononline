FROM node:18-alpine AS base

# Configurar variables de entorno
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuraciu00f3n
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el cu00f3digo fuente
COPY . .

# Construir la aplicaciu00f3n
RUN npm run build

# Etapa de producciu00f3n
FROM node:18-alpine AS runner
WORKDIR /app

# Configurar variables de entorno
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar archivos necesarios
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

# Exponer puerto
EXPOSE 3000

# Comando para iniciar la aplicaciu00f3n
CMD ["npm", "start"]
