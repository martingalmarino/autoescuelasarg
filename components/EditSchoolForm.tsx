'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus, Trash2 } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import RichTextEditor from '@/components/RichTextEditor'

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
}

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
  logoUrl?: string | null
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

interface EditSchoolFormProps {
  school: DrivingSchool
  onClose: () => void
  onSuccess: () => void
}

export default function EditSchoolForm({ school, onClose, onSuccess }: EditSchoolFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [provinces, setProvinces] = useState<Province[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [services, setServices] = useState<string[]>(school.services || [''])

  const [formData, setFormData] = useState({
    name: school.name,
    description: school.description || '',
    address: school.address || '',
    phone: school.phone || '',
    email: school.email || '',
    website: school.website || '',
    hours: school.hours || '',
    priceMin: school.priceMin?.toString() || '',
    priceMax: school.priceMax?.toString() || '',
    rating: school.rating?.toString() || '0',
    reviewsCount: school.reviewsCount?.toString() || '0',
    cityId: school.cityId || '',
    provinceId: school.provinceId || '',
    imageUrl: school.imageUrl || '',
    logoUrl: school.logoUrl || '',
    isActive: school.isActive || true,
    isVerified: school.isVerified || false,
    isFeatured: school.isFeatured || false,
  })

  // Cargar provincias al montar el componente
  useEffect(() => {
    fetchProvinces()
  }, [])

  const fetchProvinces = async () => {
    try {
      const response = await fetch('/api/admin/provinces')
      if (response.ok) {
        const data = await response.json()
        setProvinces(data.provinces || [])
      }
    } catch (error) {
      console.error('Error fetching provinces:', error)
    }
  }

  const fetchCities = async (provinceId: string) => {
    try {
      const response = await fetch(`/api/admin/cities?provinceId=${provinceId}`)
      if (response.ok) {
        const data = await response.json()
        setCities(data.cities || [])
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvince(provinceId)
    if (provinceId) {
      fetchCities(provinceId)
    } else {
      setCities([])
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...services]
    newServices[index] = value
    setServices(newServices)
  }

  const addService = () => {
    setServices([...services, ''])
  }

  const removeService = (index: number) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index))
    }
  }

  const handleImageUpload = (url: string, publicId: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }))
  }

  const handleLogoUpload = (url: string, publicId: string) => {
    setFormData(prev => ({ ...prev, logoUrl: url }))
  }

  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }))
  }

  const handleLogoRemove = () => {
    setFormData(prev => ({ ...prev, logoUrl: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Filtrar servicios vacíos
      const filteredServices = services.filter(service => service.trim() !== '')

      const response = await fetch(`/api/admin/autoescuelas/${school.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          services: filteredServices,
          priceMin: formData.priceMin ? parseInt(formData.priceMin) : null,
          priceMax: formData.priceMax ? parseInt(formData.priceMax) : null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Autoescuela actualizada correctamente!')
        onSuccess()
        onClose()
      } else {
        setError(data.error || 'Error al actualizar autoescuela')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Editar Autoescuela</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nombre de la autoescuela *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Autoescuela Central"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Descripción
                  </label>
                  <RichTextEditor
                    content={formData.description}
                    onChange={(content) => handleInputChange('description', content)}
                    placeholder="Describe los servicios y características de la autoescuela..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Provincia *
                    </label>
                    <select
                      value={selectedProvince}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      aria-label="Seleccionar provincia"
                      required
                    >
                      <option value="">Seleccionar provincia</option>
                      {provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ciudad *
                    </label>
                    <select
                      value={formData.cityId || ''}
                      onChange={(e) => handleInputChange('cityId', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      aria-label="Seleccionar ciudad"
                      required
                      disabled={!selectedProvince}
                    >
                      <option value="">Seleccionar ciudad</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de contacto */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Dirección
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Ej: Av. Corrientes 1234, CABA"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Teléfono
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Ej: +54 11 1234-5678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Ej: info@autoescuela.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Sitio web
                  </label>
                  <Input
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="Ej: https://autoescuela.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Horarios de atención
                  </label>
                  <Input
                    value={formData.hours}
                    onChange={(e) => handleInputChange('hours', e.target.value)}
                    placeholder="Ej: Lunes a Viernes: 08:00 - 18:00, Sábados: 08:00 - 14:00"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Imágenes */}
            <Card>
              <CardHeader>
                <CardTitle>Imágenes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Imagen principal
                  </label>
                  <ImageUpload
                    onUpload={handleImageUpload}
                    onRemove={handleImageRemove}
                    currentImage={formData.imageUrl}
                    folder="autoescuelas"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Logo
                  </label>
                  <ImageUpload
                    onUpload={handleLogoUpload}
                    onRemove={handleLogoRemove}
                    currentImage={formData.logoUrl}
                    folder="autoescuelas/logos"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Servicios */}
            <Card>
              <CardHeader>
                <CardTitle>Servicios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={service}
                      onChange={(e) => handleServiceChange(index, e.target.value)}
                      placeholder="Ej: Licencia B, Clases particulares..."
                      className="flex-1"
                    />
                    {services.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeService(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addService}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Servicio
                </Button>
              </CardContent>
            </Card>

            {/* Precios */}
            <Card>
              <CardHeader>
                <CardTitle>Precios (en ARS)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Precio mínimo
                    </label>
                    <Input
                      type="number"
                      value={formData.priceMin}
                      onChange={(e) => handleInputChange('priceMin', e.target.value)}
                      placeholder="Ej: 25000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Precio máximo
                    </label>
                    <Input
                      type="number"
                      value={formData.priceMax}
                      onChange={(e) => handleInputChange('priceMax', e.target.value)}
                      placeholder="Ej: 35000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating y Reseñas */}
            <Card>
              <CardHeader>
                <CardTitle>Calificación y Reseñas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Rating (0-5)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => handleInputChange('rating', e.target.value)}
                      placeholder="Ej: 4.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Cantidad de Reseñas
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.reviewsCount}
                      onChange={(e) => handleInputChange('reviewsCount', e.target.value)}
                      placeholder="Ej: 150"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opciones */}
            <Card>
              <CardHeader>
                <CardTitle>Opciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Autoescuela activa</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isVerified}
                      onChange={(e) => handleInputChange('isVerified', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Autoescuela verificada</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Autoescuela destacada</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Botones */}
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar Autoescuela'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
