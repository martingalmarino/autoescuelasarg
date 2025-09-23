import { PrismaClient } from '@prisma/client'
import { testSupabaseConnection, checkEnvironmentVariables } from '@/lib/test-connection'

const prisma = new PrismaClient()

export default async function AdminPage() {
  // Verificar variables de entorno
  const envCheck = checkEnvironmentVariables()
  
  // Test de conexión (solo en desarrollo)
  let connectionTest = null
  if (process.env.NODE_ENV === 'development') {
    connectionTest = await testSupabaseConnection()
  }

  // Obtener estadísticas básicas
  let stats = null
  try {
    const [provincesCount, schoolsCount, citiesCount] = await Promise.all([
      prisma.province.count(),
      prisma.drivingSchool.count(),
      prisma.city.count()
    ])
    
    stats = {
      provinces: provincesCount,
      schools: schoolsCount,
      cities: citiesCount
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Panel de Administración
        </h1>
        
        {/* Estado de la conexión */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Estado de la Base de Datos</h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 w-48">
                Variables de entorno:
              </span>
              <span className={`px-2 py-1 rounded text-sm ${
                envCheck ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {envCheck ? '✅ Configuradas' : '❌ Faltantes'}
              </span>
            </div>
            
            {connectionTest !== null && (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 w-48">
                  Conexión Supabase:
                </span>
                <span className={`px-2 py-1 rounded text-sm ${
                  connectionTest ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {connectionTest ? '✅ Conectado' : '❌ Error'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        {stats && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.provinces}</div>
                <div className="text-sm text-gray-600">Provincias</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.cities}</div>
                <div className="text-sm text-gray-600">Ciudades</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.schools}</div>
                <div className="text-sm text-gray-600">Autoescuelas</div>
              </div>
            </div>
          </div>
        )}

        {/* Instrucciones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Próximos Pasos</h2>
          
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <strong>1. Configurar variables de entorno en Vercel:</strong>
              <ul className="ml-4 mt-2 space-y-1">
                <li>• DATABASE_URL</li>
                <li>• NEXT_PUBLIC_SUPABASE_URL</li>
                <li>• NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              </ul>
            </div>
            
            <div>
              <strong>2. Ejecutar migración de base de datos:</strong>
              <code className="block bg-gray-100 p-2 rounded mt-1">
                npm run db:push
              </code>
            </div>
            
            <div>
              <strong>3. Poblar base de datos con datos de ejemplo:</strong>
              <code className="block bg-gray-100 p-2 rounded mt-1">
                npm run db:seed
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
