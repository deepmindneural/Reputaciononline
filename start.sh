#!/bin/sh

# Iniciar el backend en segundo plano
cd /app/backend && npm start &

# Esperar 5 segundos para que el backend inicie correctamente
sleep 5

# Iniciar el frontend
cd /app && npm start
