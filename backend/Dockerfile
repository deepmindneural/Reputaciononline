FROM node:18-alpine

# Configurar variables de entorno
ENV NODE_ENV=production

# Crear directorio de la aplicaciu00f3n
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto de archivos
COPY . .

# Generar el cliente Prisma
RUN npx prisma generate

# Exponer el puerto
EXPOSE 3001

# Comando para iniciar la aplicaciu00f3n
CMD ["npm", "start"]
