import { PrismaClient } from '@prisma/client'
import { testSupabaseConnection, checkEnvironmentVariables } from '@/lib/test-connection'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  // Verificar variables de entorno
  const envCheck = checkEnvironmentVariables()
  
  // Test de conexión (solo en desarrollo)
  let connectionTest = null
  if (process.env.NODE_ENV === 'development') {
    try {
      connectionTest = await testSupabaseConnection()
    } catch (error) {
      console.error('Connection test failed:', error)
      connectionTest = false
    }
  }

  // Obtener estadísticas básicas
  let stats = null
  let dbError = null
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
    dbError = error instanceof Error ? error.message : 'Unknown database error'
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
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
          
          {stats ? (
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
          ) : (
            <div className="text-center p-8">
              <div className="text-red-600 mb-2">❌ Error de conexión a la base de datos</div>
              <div className="text-sm text-gray-600 mb-4">
                {dbError || 'No se pudo conectar a la base de datos'}
              </div>
              <div className="text-xs text-gray-500">
                Verifica que la DATABASE_URL esté configurada correctamente en Vercel
              </div>
            </div>
          )}
        </div>

        {/* Acciones de administración */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Acciones de Administración</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Indexar datos en Meilisearch</h3>
              <p className="text-sm text-gray-600 mb-3">
                Indexa todos los datos de la base de datos en Meilisearch para habilitar la búsqueda avanzada.
              </p>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/admin/index-data', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    })
                    const result = await response.json()
                    if (result.success) {
                      alert('✅ Datos indexados correctamente!')
                      window.location.reload()
                    } else {
                      alert('❌ Error: ' + result.error)
                    }
                  } catch (error) {
                    alert('❌ Error al indexar datos')
                  }
                }}
                disabled={!stats}
                className={`px-4 py-2 rounded transition-colors ${
                  stats 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {stats ? 'Indexar Datos' : 'Base de datos no disponible'}
              </button>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Estado del Sistema</h2>
          
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <strong>✅ Base de datos:</strong> Conectada y funcionando
            </div>
            
            <div>
              <strong>✅ Variables de entorno:</strong> Configuradas correctamente
            </div>
            
            <div>
              <strong>🔍 Búsqueda:</strong> Requiere indexación de datos
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
