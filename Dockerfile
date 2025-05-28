# Imagen base
FROM node:16-alpine AS builder

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de configuraciu00f3n
COPY package.json package-lock.json ./
COPY next.config.js ./

# Instalar dependencias
RUN npm ci

# Copiar cu00f3digo fuente
COPY . .

# Construir la aplicaciu00f3n
RUN npm run build

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
