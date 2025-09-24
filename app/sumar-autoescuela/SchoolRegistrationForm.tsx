'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ImageUpload from '@/components/ImageUpload'
import { MapPin, Phone, Mail, Globe, Clock, DollarSign } from 'lucide-react'

interface FormData {
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  city: string
  province: string
  priceMin: string
  priceMax: string
  services: string[]
  imageUrl: string
  logoUrl: string
  hours: string
}

export default function SchoolRegistrationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    city: '',
    province: '',
    priceMin: '',
    priceMax: '',
    services: [],
    imageUrl: '',
    logoUrl: '',
    hours: '',
  })

  const provinces = [
    'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
    'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
    'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
    'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
    'Tierra del Fuego', 'Tucumán'
  ]

  const serviceOptions = [
    'Licencia B (Auto)',
    'Licencia A (Moto)',
    'Clases particulares',
    'Simulador de manejo',
    'Curso teórico',
    'Renovación de licencia',
    'Licencia profesional',
    'Manejo defensivo'
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const handleImageUpload = (url: string, publicId: string, type: 'image' | 'logo') => {
    if (type === 'image') {
      setFormData(prev => ({ ...prev, imageUrl: url }))
    } else {
      setFormData(prev => ({ ...prev, logoUrl: url }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/schools/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        alert('¡Autoescuela registrada exitosamente! Será revisada antes de aparecer en el directorio.')
        router.push('/')
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error al registrar la autoescuela. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la autoescuela *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ej: Autoescuela Premium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe tu autoescuela, experiencia, metodología..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provincia *
              </label>
              <Select value={formData.province} onValueChange={(value) => handleInputChange('province', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una provincia" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad *
              </label>
              <Input
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Ej: Córdoba Capital"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacto */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="inline h-4 w-4 mr-1" />
              Dirección *
            </label>
            <Input
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Dirección completa"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="inline h-4 w-4 mr-1" />
                Teléfono *
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+54 351 123-4567"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="inline h-4 w-4 mr-1" />
                Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="info@autoescuela.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Globe className="inline h-4 w-4 mr-1" />
              Sitio web
            </label>
            <Input
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://www.autoescuela.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="inline h-4 w-4 mr-1" />
              Horarios de atención
            </label>
            <Input
              value={formData.hours}
              onChange={(e) => handleInputChange('hours', e.target.value)}
              placeholder="Lunes a Viernes 8:00-18:00, Sábados 8:00-12:00"
            />
          </div>
        </CardContent>
      </Card>

      {/* Precios */}
      <Card>
        <CardHeader>
          <CardTitle>Precios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Precio mínimo (ARS)
              </label>
              <Input
                type="number"
                value={formData.priceMin}
                onChange={(e) => handleInputChange('priceMin', e.target.value)}
                placeholder="25000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Precio máximo (ARS)
              </label>
              <Input
                type="number"
                value={formData.priceMax}
                onChange={(e) => handleInputChange('priceMax', e.target.value)}
                placeholder="40000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Servicios */}
      <Card>
        <CardHeader>
          <CardTitle>Servicios Ofrecidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {serviceOptions.map((service) => (
              <label key={service} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.services.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{service}</span>
              </label>
            ))}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen principal de la autoescuela
            </label>
            <ImageUpload
              onUpload={(url, publicId) => handleImageUpload(url, publicId, 'image')}
              folder="autoescuelas/images"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo de la autoescuela
            </label>
            <ImageUpload
              onUpload={(url, publicId) => handleImageUpload(url, publicId, 'logo')}
              folder="autoescuelas/logos"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="px-8 py-2"
        >
          {loading ? 'Registrando...' : 'Registrar Autoescuela'}
        </Button>
      </div>
    </form>
  )
}
