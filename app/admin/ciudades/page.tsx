"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  MapPin,
  Building2,
  Users,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface Province {
  id: string
  name: string
  slug: string
}

interface City {
  id: string
  name: string
  slug: string
  provinceId: string
  province: Province
  schoolsCount: number
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export default function CitiesAdminPage() {
  const [cities, setCities] = useState<City[]>([])
  const [provinces, setProvinces] = useState<Province[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCity, setEditingCity] = useState<City | null>(null)

  useEffect(() => {
    fetchCities()
    fetchProvinces()
  }, [])

  const fetchCities = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/ciudades')
      if (!response.ok) {
        throw new Error('Failed to fetch cities')
      }
      const data = await response.json()
      setCities(data.data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchProvinces = async () => {
    try {
      const response = await fetch('/api/admin/provincias')
      if (!response.ok) {
        throw new Error('Failed to fetch provinces')
      }
      const data = await response.json()
      setProvinces(data.data)
    } catch (err: any) {
      console.error('Error fetching provinces:', err)
    }
  }

  const handleDelete = async (cityId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta ciudad?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/ciudades/${cityId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete city')
      }
      setCities(cities.filter(city => city.id !== cityId))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         city.province.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProvince = selectedProvince === 'all' || city.provinceId === selectedProvince
    return matchesSearch && matchesProvince
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Admin
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestión de Ciudades
              </h1>
              <p className="text-gray-600">
                Administra todas las ciudades del directorio
              </p>
            </div>
            <Button onClick={() => setShowAddForm(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Ciudad
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{cities.length}</div>
              <div className="text-sm text-gray-600">Total Ciudades</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {cities.reduce((sum, city) => sum + city.schoolsCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Autoescuelas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{provinces.length}</div>
              <div className="text-sm text-gray-600">Provincias</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(cities.reduce((sum, city) => sum + city.schoolsCount, 0) / cities.length) || 0}
              </div>
              <div className="text-sm text-gray-600">Promedio por Ciudad</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar ciudades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-64">
                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las provincias</SelectItem>
                    {provinces.map((province) => (
                      <SelectItem key={province.id} value={province.id}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cities List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Ciudades ({filteredCities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center p-8">
                <div className="text-blue-600 mb-2">Cargando ciudades...</div>
              </div>
            ) : error ? (
              <div className="text-center p-8">
                <div className="text-red-600 mb-2">❌ {error}</div>
                <Button onClick={fetchCities} variant="outline">
                  Reintentar
                </Button>
              </div>
            ) : filteredCities.length === 0 ? (
              <div className="text-center p-8">
                <div className="text-gray-500 mb-4">No se encontraron ciudades</div>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primera Ciudad
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCities.map((city) => (
                  <div key={city.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{city.name}</h3>
                          <Badge variant="secondary">{city.province.name}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            <span>Slug: {city.slug}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{city.schoolsCount} autoescuelas</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>Orden: {city.sortOrder}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/provincias/${city.province.slug}/${city.slug}`}>
                            Ver
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingCity(city)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(city.id)}
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

        {/* Add/Edit Form Modal */}
        {(showAddForm || editingCity) && (
          <CityForm
            city={editingCity}
            provinces={provinces}
            onClose={() => {
              setShowAddForm(false)
              setEditingCity(null)
            }}
            onSuccess={() => {
              fetchCities()
              setShowAddForm(false)
              setEditingCity(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

// Componente del formulario
function CityForm({ city, provinces, onClose, onSuccess }: {
  city: City | null
  provinces: Province[]
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    name: city?.name || '',
    slug: city?.slug || '',
    provinceId: city?.provinceId || '',
    sortOrder: city?.sortOrder || 1
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = city ? `/api/admin/ciudades/${city.id}` : '/api/admin/ciudades'
      const method = city ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar la ciudad')
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {city ? 'Editar Ciudad' : 'Agregar Nueva Ciudad'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre de la Ciudad *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => {
                  handleInputChange('name', e.target.value)
                  if (!city) {
                    // Auto-generar slug solo para nuevas ciudades
                    const slug = e.target.value
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .replace(/[^a-z0-9\s-]/g, '')
                      .replace(/\s+/g, '-')
                      .replace(/-+/g, '-')
                      .replace(/^-|-$/g, '')
                    handleInputChange('slug', slug)
                  }
                }}
                placeholder="Ej: Alta Gracia"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Slug *
              </label>
              <Input
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="Ej: alta-gracia"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Provincia *
              </label>
              <Select value={formData.provinceId} onValueChange={(value) => handleInputChange('provinceId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar provincia" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.id} value={province.id}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Orden de Visualización
              </label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 1)}
                placeholder="1"
                min="1"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Guardando...' : (city ? 'Actualizar' : 'Agregar')}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
