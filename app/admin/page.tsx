'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Database, Search, Upload, Edit, Trash2 } from 'lucide-react'

export default function AdminPage() {
  const [stats, setStats] = useState<{provinces: number, schools: number, cities: number} | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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

    fetchStats()
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Gestiona todas las autoescuelas, provincias y ciudades del directorio
          </p>
        </div>
        
        {/* Estado de la conexión */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Base de datos:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  !error ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {!error ? '✅ Conectada' : '❌ Error'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Búsqueda:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  stats ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {stats ? '✅ Configurada' : '⚠️ Pendiente'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Estadísticas del Directorio</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center p-8">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                <div className="text-blue-600">Cargando estadísticas...</div>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stats.provinces}</div>
                  <div className="text-sm text-gray-600">Provincias</div>
                </div>
                
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">{stats.cities}</div>
                  <div className="text-sm text-gray-600">Ciudades</div>
                </div>
                
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{stats.schools}</div>
                  <div className="text-sm text-gray-600">Autoescuelas</div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="text-red-600 mb-2">❌ Error de conexión</div>
                <div className="text-sm text-gray-600">
                  {error || 'No se pudo conectar a la base de datos'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Acciones de administración */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Indexa todos los datos en Meilisearch para habilitar la búsqueda avanzada.
              </p>
              <Button
                onClick={handleIndexData}
                disabled={!stats || loading}
                className="w-full"
              >
                {loading ? 'Procesando...' : 'Indexar Datos'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Gestión de Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar desde Excel/CSV
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Autoescuelas
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar Datos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}