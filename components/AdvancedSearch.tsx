'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Star, DollarSign, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SearchFilters {
  province: string
  city: string
  minRating: number
  maxPrice: number
  minPrice: number
}

interface SearchResult {
  id: string
  name: string
  slug: string
  description: string | null
  rating: number
  reviewsCount: number
  city: string
  province: string
  priceMin: number | null
  priceMax: number | null
  imageUrl: string | null
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  services: string[] | null
  _formatted?: {
    name?: string
    description?: string
    city?: string
    province?: string
  }
}

interface AdvancedSearchProps {
  provinces: Array<{ name: string; slug: string }>
  cities: Array<{ name: string; province: string }>
}

export default function AdvancedSearch({ provinces, cities }: AdvancedSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    province: '',
    city: '',
    minRating: 0,
    maxPrice: 0,
    minPrice: 0
  })
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Filtrar ciudades por provincia seleccionada
  const availableCities = cities.filter(city => 
    !filters.province || city.province.toLowerCase() === filters.province.toLowerCase()
  )

  // Función de búsqueda
  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    setShowResults(true)

    try {
      const searchParams = new URLSearchParams({
        q: query,
        ...(filters.province && { province: filters.province }),
        ...(filters.city && { city: filters.city }),
        ...(filters.minRating > 0 && { minRating: filters.minRating.toString() }),
        ...(filters.minPrice > 0 && { minPrice: filters.minPrice.toString() }),
        ...(filters.maxPrice > 0 && { maxPrice: filters.maxPrice.toString() }),
      })

      const response = await fetch(`/api/search/schools?${searchParams}`)
      const data = await response.json()
      
      setResults(data.hits || [])
    } catch (error) {
      console.error('Error searching:', error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Navegar a autoescuela
  const handleSchoolClick = (school: SearchResult) => {
    router.push(`/autoescuelas/${school.slug}`)
    setShowResults(false)
  }

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      province: '',
      city: '',
      minRating: 0,
      maxPrice: 0,
      minPrice: 0
    })
  }

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto" ref={searchRef}>
      {/* Barra de búsqueda principal */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar autoescuelas, ciudades, provincias..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isSearching}
            className="px-6 py-3"
          >
            {isSearching ? 'Buscando...' : 'Buscar'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Filtros avanzados */}
        {showFilters && (
          <Card className="mt-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Provincia */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Provincia
                </label>
                <Select
                  value={filters.province}
                  onValueChange={(value) => {
                    setFilters(prev => ({ ...prev, province: value, city: '' }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las provincias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las provincias</SelectItem>
                    {provinces.map((province) => (
                      <SelectItem key={province.slug} value={province.name}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ciudad */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Ciudad
                </label>
                <Select
                  value={filters.city}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}
                  disabled={!filters.province}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las ciudades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las ciudades</SelectItem>
                    {availableCities.map((city) => (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating mínimo */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Rating mínimo
                </label>
                <Select
                  value={filters.minRating.toString()}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquier rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Cualquier rating</SelectItem>
                    <SelectItem value="3">3+ estrellas</SelectItem>
                    <SelectItem value="4">4+ estrellas</SelectItem>
                    <SelectItem value="4.5">4.5+ estrellas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Precio máximo */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Precio máximo
                </label>
                <Input
                  type="number"
                  placeholder="Ej: 50000"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Limpiar filtros
              </Button>
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? 'Buscando...' : 'Aplicar filtros'}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {showResults && (
        <Card className="mt-4 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {results.length > 0 ? (
              <div className="divide-y">
                {results.map((school) => (
                  <div
                    key={school.id}
                    onClick={() => handleSchoolClick(school)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex gap-4">
                      {/* Imagen */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {school.imageUrl ? (
                          <img
                            src={school.imageUrl}
                            alt={school.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🚗
                          </div>
                        )}
                      </div>

                      {/* Información */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">
                          {school._formatted?.name || school.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{school._formatted?.city || school.city}, {school._formatted?.province || school.province}</span>
                        </div>

                        {school.description && (
                          <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                            {school._formatted?.description || school.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm">
                          {/* Rating */}
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{school.rating.toFixed(1)}</span>
                            <span className="text-gray-500">({school.reviewsCount})</span>
                          </div>

                          {/* Precio */}
                          {(school.priceMin || school.priceMax) && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span>
                                {school.priceMin && school.priceMax
                                  ? `$${school.priceMin.toLocaleString()} - $${school.priceMax.toLocaleString()}`
                                  : school.priceMin
                                  ? `Desde $${school.priceMin.toLocaleString()}`
                                  : `Hasta $${school.priceMax?.toLocaleString()}`
                                }
                              </span>
                            </div>
                          )}

                          {/* Servicios */}
                          {school.services && school.services.length > 0 && (
                            <div className="flex gap-1">
                              {school.services.slice(0, 2).map((service) => (
                                <Badge key={service} variant="secondary" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                              {school.services.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{school.services.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No se encontraron resultados para tu búsqueda</p>
                <p className="text-sm">Intenta con otros términos o ajusta los filtros</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
