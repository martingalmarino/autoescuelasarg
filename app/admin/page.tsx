'use client'

import { useState, useEffect } from 'react'

export default function AdminPage() {
  const [stats, setStats] = useState<{provinces: number, schools: number, cities: number} | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar variables de entorno (solo las públicas)
    const checkEnv = () => {
      // Como estamos usando Neon, no necesitamos las variables de Supabase
      return true
    }

    // Obtener estadísticas
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.stats) {
            setStats(data.stats)
          } else {
            setError('Error en la respuesta de la API')
          }
        } else {
          setError('Error al obtener estadísticas de la base de datos')
        }
      } catch (err) {
        setError('No se pudo conectar a la base de datos')
      } finally {
        setLoading(false)
      }
    }

    if (checkEnv()) {
      fetchStats()
    } else {
      setLoading(false)
    }
  }, [])

  const handleIndexData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/index-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.success) {
        alert('✅ Datos indexados correctamente!')
        // Recargar estadísticas
        const statsResponse = await fetch('/api/admin/stats')
        if (statsResponse.ok) {
          const data = await statsResponse.json()
          if (data.success && data.stats) {
            setStats(data.stats)
          }
        }
      } else {
        alert('❌ Error: ' + result.error)
      }
    } catch (error) {
      alert('❌ Error al indexar datos')
    } finally {
      setLoading(false)
    }
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
                !error ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {!error ? '✅ Configuradas' : '❌ Faltantes'}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 w-48">
                Conexión a base de datos:
              </span>
              <span className={`px-2 py-1 rounded text-sm ${
                loading ? 'bg-yellow-100 text-yellow-800' : 
                stats ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {loading ? '🔄 Verificando...' : 
                 stats ? '✅ Conectado' : '❌ Error'}
              </span>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
          
          {loading ? (
            <div className="text-center p-8">
              <div className="text-blue-600 mb-2">🔄 Cargando estadísticas...</div>
            </div>
          ) : stats ? (
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
                {error || 'No se pudo conectar a la base de datos'}
              </div>
              <div className="text-xs text-gray-500">
                Verifica que las variables de entorno estén configuradas correctamente en Vercel
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
                onClick={handleIndexData}
                disabled={!stats || loading}
                className={`px-4 py-2 rounded transition-colors ${
                  stats && !loading
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Procesando...' : 
                 stats ? 'Indexar Datos' : 'Base de datos no disponible'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}