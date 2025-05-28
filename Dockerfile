# Imagen base
FROM node:16-alpine AS builder

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias necesarias
RUN apk add --no-cache libc6-compat python3 make g++

# Copiar archivos de configuraciu00f3n
COPY package.json package-lock.json ./
COPY next.config.js tsconfig.json ./

# Instalar dependencias con argumentos para evitar errores
RUN npm ci --legacy-peer-deps

# Copiar cu00f3digo fuente
COPY . .

# Desactivar la verificación estricta de TypeScript para build
ENV TS_NODE_TRANSPILE_ONLY=1
ENV NEXT_TELEMETRY_DISABLED=1

# Construir la aplicaciu00f3n con opciones especiales para memoria y OpenSSL
RUN NODE_OPTIONS='--max_old_space_size=4096 --openssl-legacy-provider' npm run build

# Imagen de producciu00f3n
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Copiar archivos necesarios
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Backend
COPY --from=builder /app/backend ./backend

# Exponer puertos
EXPOSE 3000
EXPOSE 4000

# Script para iniciar tanto frontend como backend
COPY --from=builder /app/start.sh ./start.sh
RUN chmod +x ./start.sh

CMD ["/bin/sh", "./start.sh"]
