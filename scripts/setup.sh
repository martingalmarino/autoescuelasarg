#!/bin/bash

# Autoescuelas.ar - Setup Script
echo "🚀 Configurando Autoescuelas.ar..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Se requiere Node.js 18 o superior. Versión actual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Install dependencies
echo "📦 Instalando dependencias..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creando archivo de configuración..."
    cp env.example .env.local
    echo "⚠️  Por favor edita .env.local con tus credenciales antes de continuar"
    echo "   - DATABASE_URL: URL de tu base de datos PostgreSQL"
    echo "   - NEXTAUTH_SECRET: Clave secreta para autenticación"
    echo "   - GOOGLE_ANALYTICS_ID: ID de Google Analytics (opcional)"
    read -p "Presiona Enter cuando hayas configurado .env.local..."
fi

# Generate Prisma client
echo "🗄️  Generando cliente Prisma..."
npx prisma generate

# Check if database is configured
if grep -q "postgresql://username:password@localhost" .env.local; then
    echo "⚠️  DATABASE_URL no está configurado correctamente en .env.local"
    echo "   Por favor configura tu base de datos PostgreSQL antes de continuar"
    read -p "Presiona Enter cuando hayas configurado la base de datos..."
fi

# Push database schema
echo "🗄️  Aplicando esquema de base de datos..."
npx prisma db push

echo "✅ ¡Configuración completada!"
echo ""
echo "🚀 Para iniciar el servidor de desarrollo:"
echo "   npm run dev"
echo ""
echo "📚 Para más información, consulta el README.md"
echo ""
echo "🌐 El sitio estará disponible en: http://localhost:3000"
