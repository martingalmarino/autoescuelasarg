'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus, Trash2 } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import RichTextEditor from '@/components/RichTextEditor'
import { SCHOOL_FEATURE_OPTIONS, isPremiumActive, parseFaqs, type SchoolFaq } from '@/lib/premium'

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
  ownerName?: string | null
  ownerEmail?: string | null
  ownerPhone?: string | null
  plan?: 'FREE' | 'PREMIUM'
  planExpiresAt?: string | Date | null
  whatsapp?: string | null
  gallery?: string[]
  videoUrl?: string | null
  promotion?: string | null
  faqs?: unknown
  features?: string[]
  foundedYear?: number | null
  licenseNumber?: string | null
  createdAt: Date
  updatedAt: Date
}

const toDateInput = (value: string | Date | null | undefined) =>
  value
    ? new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date(value))
    : ''

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
  const [selectedProvince, setSelectedProvince] = useState(school.provinceId || '')
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
    isActive: school.isActive ?? true,
    isVerified: school.isVerified || false,
    ownerName: school.ownerName || '',
    ownerEmail: school.ownerEmail || '',
    ownerPhone: school.ownerPhone || '',
    plan: school.plan || 'FREE',
    planExpiresAt: toDateInput(school.planExpiresAt),
    whatsapp: school.whatsapp || '',
    videoUrl: school.videoUrl || '',
    promotion: school.promotion || '',
    foundedYear: school.foundedYear?.toString() || '',
    licenseNumber: school.licenseNumber || '',
  })
  const [gallery, setGallery] = useState<string[]>(school.gallery || [])
  const [galleryUploadKey, setGalleryUploadKey] = useState(0)
  const [features, setFeatures] = useState<string[]>(school.features || [])
  const [extraFeatures, setExtraFeatures] = useState(
    (school.features || []).filter(feature => SCHOOL_FEATURE_OPTIONS.indexOf(feature) === -1).join(', ')
  )
  const [faqs, setFaqs] = useState<SchoolFaq[]>(parseFaqs(school.faqs))

  // Cargar provincias al montar el componente
  useEffect(() => {
    fetchProvinces()
    if (school.provinceId) fetchCities(school.provinceId)
  }, [school.provinceId])

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

  const toggleFeature = (feature: string, checked: boolean) => {
    setFeatures(prev => (checked ? [...prev, feature] : prev.filter(item => item !== feature)))
  }

  const updateFaq = (index: number, field: keyof SchoolFaq, value: string) => {
    setFaqs(prev => prev.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq)))
  }

  const premiumActive = isPremiumActive({
    plan: formData.plan,
    planExpiresAt: formData.planExpiresAt ? `${formData.planExpiresAt}T23:59:59-03:00` : null,
  })

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
          gallery,
          features: [
            ...features.filter(feature => SCHOOL_FEATURE_OPTIONS.indexOf(feature) !== -1),
            ...extraFeatures.split(',').map(feature => feature.trim()).filter(Boolean),
          ],
          faqs,
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

            {/* Dueño y plan */}
            <Card>
              <CardHeader>
                <CardTitle>Dueño y plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="school-plan" className="block text-sm font-medium mb-1">Plan</label>
                    <select
                      id="school-plan"
                      value={formData.plan}
                      onChange={(e) => handleInputChange('plan', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="FREE">Gratis</option>
                      <option value="PREMIUM">Premium</option>
                    </select>
                  </div>
                  {formData.plan === 'PREMIUM' && (
                    <div>
                      <label htmlFor="school-plan-expires" className="block text-sm font-medium mb-1">
                        Vence el (vacío = sin vencimiento)
                      </label>
                      <Input
                        id="school-plan-expires"
                        type="date"
                        value={formData.planExpiresAt}
                        onChange={(e) => handleInputChange('planExpiresAt', e.target.value)}
                      />
                    </div>
                  )}
                </div>
                {formData.plan === 'PREMIUM' && (
                  <p className={`text-sm ${premiumActive ? 'text-green-700' : 'text-red-700'}`}>
                    {premiumActive
                      ? 'Premium vigente: la ficha muestra el contenido premium y aparece como destacada.'
                      : 'La fecha de vencimiento ya pasó: la ficha se muestra como gratuita.'}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="school-owner-name" className="block text-sm font-medium mb-1">Responsable</label>
                    <Input
                      id="school-owner-name"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="school-owner-email" className="block text-sm font-medium mb-1">Email del responsable</label>
                    <Input
                      id="school-owner-email"
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="school-owner-phone" className="block text-sm font-medium mb-1">Teléfono del responsable</label>
                    <Input
                      id="school-owner-phone"
                      value={formData.ownerPhone}
                      onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Datos privados: no se muestran en el sitio. Con email o teléfono cargado, la ficha cuenta como reclamada.
                </p>
              </CardContent>
            </Card>

            {/* Contenido premium */}
            <Card>
              <CardHeader>
                <CardTitle>Contenido premium</CardTitle>
                <p className="text-sm text-gray-500">Se muestra en la ficha solo mientras el plan Premium esté vigente.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="school-whatsapp" className="block text-sm font-medium mb-1">WhatsApp</label>
                    <Input
                      id="school-whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      placeholder="Ej: +54 9 351 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="school-video" className="block text-sm font-medium mb-1">Video de YouTube</label>
                    <Input
                      id="school-video"
                      value={formData.videoUrl}
                      onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="school-promotion" className="block text-sm font-medium mb-1">Promoción vigente</label>
                    <Input
                      id="school-promotion"
                      value={formData.promotion}
                      maxLength={200}
                      onChange={(e) => handleInputChange('promotion', e.target.value)}
                      placeholder="Ej: 20% de descuento en la primera clase hasta el 31 de octubre"
                    />
                  </div>
                  <div>
                    <label htmlFor="school-founded" className="block text-sm font-medium mb-1">Año de inicio</label>
                    <Input
                      id="school-founded"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.foundedYear}
                      onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                      placeholder="Ej: 1998"
                    />
                  </div>
                  <div>
                    <label htmlFor="school-license" className="block text-sm font-medium mb-1">N° de habilitación</label>
                    <Input
                      id="school-license"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Detalles del servicio</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SCHOOL_FEATURE_OPTIONS.map(feature => (
                      <label key={feature} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={features.indexOf(feature) !== -1}
                          onChange={(e) => toggleFeature(feature, e.target.checked)}
                          className="rounded"
                        />
                        {feature}
                      </label>
                    ))}
                  </div>
                  <label htmlFor="school-extra-features" className="block text-sm font-medium mt-3 mb-1">
                    Otros detalles (separados por coma)
                  </label>
                  <Input
                    id="school-extra-features"
                    value={extraFeatures}
                    onChange={(e) => setExtraFeatures(e.target.value)}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Galería de fotos ({gallery.length}/12)</p>
                  {gallery.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                      {gallery.map((url, index) => (
                        <div key={url} className="relative aspect-square overflow-hidden rounded-md border bg-gray-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Foto ${index + 1}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setGallery(prev => prev.filter(item => item !== url))}
                            className="absolute right-1 top-1 rounded-full bg-white/90 p-1 shadow"
                            aria-label={`Quitar foto ${index + 1}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {gallery.length < 12 && (
                    <ImageUpload
                      key={galleryUploadKey}
                      onUpload={(url) => {
                        setGallery(prev => [...prev, url])
                        setGalleryUploadKey(key => key + 1)
                      }}
                      folder="autoescuelas/galeria"
                    />
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Preguntas frecuentes</p>
                  <div className="space-y-3">
                    {faqs.map((faq, index) => (
                      <div key={index} className="rounded-md border p-3 space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={faq.question}
                            onChange={(e) => updateFaq(index, 'question', e.target.value)}
                            placeholder="Pregunta"
                            aria-label={`Pregunta ${index + 1}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setFaqs(prev => prev.filter((_, i) => i !== index))}
                            aria-label={`Quitar pregunta ${index + 1}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                          placeholder="Respuesta"
                          aria-label={`Respuesta ${index + 1}`}
                          rows={2}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  {faqs.length < 10 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-3"
                      onClick={() => setFaqs(prev => [...prev, { question: '', answer: '' }])}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar pregunta
                    </Button>
                  )}
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

                  <p className="text-xs text-gray-500">
                    &quot;Destacada&quot; se activa sola mientras el plan Premium esté vigente.
                  </p>
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
