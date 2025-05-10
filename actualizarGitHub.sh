#!/bin/bash

# Script para actualizar automáticamente el repositorio en GitHub
# Creado: $(date)

echo "🚀 Iniciando actualización automática del repositorio..."

# Ir al directorio del proyecto
cd "$(dirname "$0")"

# Ver el estado actual
echo "📋 Estado actual de archivos:"
git status

# Añadir todos los cambios
echo "➕ Añadiendo cambios..."
git add .

# Solicitar mensaje de commit o usar uno por defecto
echo "💬 Ingresa un mensaje para el commit (deja en blanco para usar mensaje automático):"
read commit_message

if [ -z "$commit_message" ]; then
  commit_message="Actualización automática: $(date)"
fi

# Crear el commit
echo "✅ Creando commit: $commit_message"
git commit -m "$commit_message"

# Subir los cambios a GitHub
echo "☁️ Subiendo cambios a GitHub..."
git push

echo "✨ ¡Proceso completado! El repositorio está actualizado."
