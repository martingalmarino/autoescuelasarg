'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, Search, LogOut } from 'lucide-react'
import Link from 'next/link'
import AddSchoolForm from '@/components/AddSchoolForm'
import EditSchoolForm from '@/components/EditSchoolForm'

interface DrivingSchool {
  id: string
  name: string
  slug: string
  rating: number
  reviewsCount: number
  city: string
  province: string
  cityId: string
  provinceId: string
  imageUrl?: string | null
  priceMin?: number | null
  priceMax?: number | null
  description?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  hours?: string | null
  services?: string[]
  isActive?: boolean
  isVerified?: boolean
  isFeatured?: boolean
  createdAt: Date
  updatedAt: Date
}

export default function AutoescuelasAdminPage() {
  const [schools, setSchools] = useState<DrivingSchool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSchool, setEditingSchool] = useState<DrivingSchool | null>(null)

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
      })
      // Redirigir a la página de login
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/autoescuelas')
      if (response.ok) {
        const data = await response.json()
        setSchools(data.schools || [])
      } else {
        setError('Error al cargar autoescuelas')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.province.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta autoescuela?')) return

    try {
      const response = await fetch(`/api/admin/autoescuelas/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setSchools(schools.filter(school => school.id !== id))
        alert('Autoescuela eliminada correctamente')
      } else {
        alert('Error al eliminar la autoescuela')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/autoescuelas/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus
        }),
      })
      
      if (response.ok) {
        setSchools(schools.map(school => 
          school.id === id ? { ...school, isActive: !currentStatus } : school
        ))
        alert('Estado actualizado correctamente')
      } else {
        alert('Error al actualizar el estado')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center p-8">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <div className="text-blue-600">Cargando autoescuelas...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestión de Autoescuelas
              </h1>
              <p className="text-gray-600">
                Administra todas las autoescuelas del directorio
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
            <Button onClick={() => setShowAddForm(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Autoescuela
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, ciudad o provincia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{schools.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {schools.filter(s => s.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Activas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {schools.filter(s => s.isFeatured).length}
              </div>
              <div className="text-sm text-gray-600">Destacadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {schools.filter(s => s.isVerified).length}
              </div>
              <div className="text-sm text-gray-600">Verificadas</div>
            </CardContent>
          </Card>
        </div>

        {/* Schools List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Autoescuelas ({filteredSchools.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center p-8">
                <div className="text-red-600 mb-2">❌ {error}</div>
                <Button onClick={fetchSchools} variant="outline">
                  Reintentar
                </Button>
              </div>
            ) : filteredSchools.length === 0 ? (
              <div className="text-center p-8">
                <div className="text-gray-500 mb-4">No se encontraron autoescuelas</div>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primera Autoescuela
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSchools.map((school) => (
                  <div key={school.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{school.name}</h3>
                          <div className="flex gap-1">
                            {school.isFeatured && (
                              <Badge variant="default" className="bg-yellow-500">Destacada</Badge>
                            )}
                            {school.isVerified && (
                              <Badge variant="default" className="bg-green-500">Verificada</Badge>
                            )}
                            {!school.isActive && (
                              <Badge variant="destructive">Inactiva</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">
                          📍 {school.city}, {school.province}
                        </p>
                        {school.phone && (
                          <p className="text-gray-600 text-sm mb-1">📞 {school.phone}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>⭐ {school.rating.toFixed(1)} ({school.reviewsCount} reseñas)</span>
                          {school.priceMin && school.priceMax && (
                            <span>💰 ${school.priceMin.toLocaleString()} - ${school.priceMax.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/autoescuelas/${school.slug}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingSchool(school)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(school.id, school.isActive || false)}
                        >
                          {school.isActive ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(school.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Form Modal */}
        {showAddForm && (
          <AddSchoolForm
            onClose={() => setShowAddForm(false)}
            onSuccess={() => {
              fetchSchools()
              setShowAddForm(false)
            }}
          />
        )}

        {/* Edit Form Modal */}
        {editingSchool && (
          <EditSchoolForm
            school={editingSchool}
            onClose={() => setEditingSchool(null)}
            onSuccess={() => {
              fetchSchools()
              setEditingSchool(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
