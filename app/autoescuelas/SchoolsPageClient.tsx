"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Users, 
  Phone, 
  Mail,
  ChevronDown,
  X,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { DrivingSchool, Province } from '@/lib/types'
import { formatPrice, formatRating, formatReviews } from '@/lib/utils'
import { analyticsEvents } from '@/lib/analytics'

interface SchoolsPageClientProps {
  schools: DrivingSchool[]
  provinces: Province[]
  searchParams: {
    page?: string
    province?: string
    city?: string
    sort?: string
    search?: string
  }
}

const ITEMS_PER_PAGE = 12

export default function SchoolsPageClient({ schools, provinces, searchParams }: SchoolsPageClientProps) {
  // Updated to use priceMin/priceMax instead of priceRange
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '')
  const [selectedProvince, setSelectedProvince] = useState(searchParams.province || 'all')
  const [selectedCity, setSelectedCity] = useState(searchParams.city || 'all')
  const [sortBy, setSortBy] = useState(searchParams.sort || 'rating_desc')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.page || '1'))

  // Filtrar y ordenar autoescuelas
  const filteredAndSortedSchools = useMemo(() => {
    let filtered = schools

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.province.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por provincia
    if (selectedProvince && selectedProvince !== 'all') {
      filtered = filtered.filter(school => school.province.toLowerCase() === selectedProvince.toLowerCase())
    }

    // Filtro por ciudad
    if (selectedCity && selectedCity !== 'all') {
      filtered = filtered.filter(school => school.city.toLowerCase() === selectedCity.toLowerCase())
    }

    // Ordenamiento
    switch (sortBy) {
      case 'rating_desc':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'rating_asc':
        filtered.sort((a, b) => a.rating - b.rating)
        break
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'price_asc':
        filtered.sort((a, b) => {
          const aPrice = a.priceMin || 0
          const bPrice = b.priceMin || 0
          return aPrice - bPrice
        })
        break
      case 'price_desc':
        filtered.sort((a, b) => {
          const aPrice = a.priceMin || 0
          const bPrice = b.priceMin || 0
          return bPrice - aPrice
        })
        break
    }

    return filtered
  }, [schools, searchTerm, selectedProvince, selectedCity, sortBy])

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedSchools.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedSchools = filteredAndSortedSchools.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Obtener ciudades únicas de la provincia seleccionada
  const availableCities = useMemo(() => {
    if (!selectedProvince || selectedProvince === 'all') return []
    const provinceSchools = schools.filter(school => 
      school.province.toLowerCase() === selectedProvince.toLowerCase()
    )
    return Array.from(new Set(provinceSchools.map(school => school.city))).sort()
  }, [selectedProvince, schools])

  const updateURL = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(urlSearchParams.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all') {
        newSearchParams.set(key, value)
      } else {
        newSearchParams.delete(key)
      }
    })

    router.push(`/autoescuelas?${newSearchParams.toString()}`)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
    updateURL({ search: value, page: '1' })
  }

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value)
    setSelectedCity('all')
    setCurrentPage(1)
    updateURL({ 
      province: value, 
      city: 'all', 
      page: '1' 
    })
  }

  const handleCityChange = (value: string) => {
    setSelectedCity(value)
    setCurrentPage(1)
    updateURL({ city: value, page: '1' })
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setCurrentPage(1)
    updateURL({ sort: value, page: '1' })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateURL({ page: page.toString() })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedProvince('all')
    setSelectedCity('all')
    setSortBy('rating_desc')
    setCurrentPage(1)
    router.push('/autoescuelas')
  }

  const handleSchoolClick = (schoolId: string, schoolName: string) => {
    analyticsEvents.clickSchoolCard(schoolId, schoolName)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center text-white">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Todas las Autoescuelas
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Encuentra la autoescuela perfecta para obtener tu licencia de conducir. 
              Filtra por ubicación, calificación y precio.
            </p>
            <div className="flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>{schools.length} autoescuelas</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>{provinces.length} provincias</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 sm:py-8 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            {/* Mobile: Simple search + one filter, Desktop: Full filters */}
            <div className="space-y-4">
              {/* Search - Always visible */}
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar autoescuelas..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>

              {/* Mobile: Simple province filter only */}
              <div className="block md:hidden">
                <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas las provincias" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    <SelectItem value="all">Todas las provincias</SelectItem>
                    {provinces.map((province) => (
                      <SelectItem key={province.id} value={province.name}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Desktop: Full filters grid */}
              <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Province Filter */}
                <div className="w-full">
                  <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todas las provincias" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      <SelectItem value="all">Todas las provincias</SelectItem>
                      {provinces.map((province) => (
                        <SelectItem key={province.id} value={province.name}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* City Filter */}
                <div className="w-full">
                  <Select 
                    value={selectedCity} 
                    onValueChange={handleCityChange}
                    disabled={!selectedProvince || selectedProvince === 'all'}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todas las ciudades" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      <SelectItem value="all">Todas las ciudades</SelectItem>
                      {availableCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div className="w-full">
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating_desc">Mejor calificadas</SelectItem>
                      <SelectItem value="rating_asc">Menor calificación</SelectItem>
                      <SelectItem value="name_asc">Nombre A-Z</SelectItem>
                      <SelectItem value="name_desc">Nombre Z-A</SelectItem>
                      <SelectItem value="price_asc">Precio menor</SelectItem>
                      <SelectItem value="price_desc">Precio mayor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Active Filters - Simplified for mobile */}
            {(searchTerm || (selectedProvince && selectedProvince !== 'all') || (selectedCity && selectedCity !== 'all')) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                {/* Mobile: Simple clear button */}
                <div className="block md:hidden">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-xs w-full"
                  >
                    Limpiar filtros
                  </Button>
                </div>
                
                {/* Desktop: Full filter badges */}
                <div className="hidden md:block">
                  <div className="flex flex-col space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {searchTerm && (
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs px-2 py-1">
                          <span className="truncate max-w-[150px]">Búsqueda: {searchTerm}</span>
                          <X 
                            className="h-3 w-3 cursor-pointer flex-shrink-0 hover:text-red-500" 
                            onClick={() => handleSearch('')}
                          />
                        </Badge>
                      )}
                      {selectedProvince && selectedProvince !== 'all' && (
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs px-2 py-1">
                          <span className="truncate max-w-[120px]">Provincia: {selectedProvince}</span>
                          <X 
                            className="h-3 w-3 cursor-pointer flex-shrink-0 hover:text-red-500" 
                            onClick={() => handleProvinceChange('all')}
                          />
                        </Badge>
                      )}
                      {selectedCity && selectedCity !== 'all' && (
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs px-2 py-1">
                          <span className="truncate max-w-[120px]">Ciudad: {selectedCity}</span>
                          <X 
                            className="h-3 w-3 cursor-pointer flex-shrink-0 hover:text-red-500" 
                            onClick={() => handleCityChange('all')}
                          />
                        </Badge>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearFilters}
                      className="text-xs w-auto self-start"
                    >
                      Limpiar todos los filtros
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Results Header */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
              {filteredAndSortedSchools.length} autoescuelas encontradas
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Página {currentPage} de {totalPages}
            </p>
          </div>

          {/* Schools Grid */}
          {paginatedSchools.length > 0 ? (
            <>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedSchools.map((school) => (
                  <Link
                    key={school.id}
                    href={`/autoescuelas/${school.slug}`}
                    onClick={() => handleSchoolClick(school.id, school.name)}
                    className="group"
                  >
                    <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                      <CardContent className="p-0">
                        {/* Image */}
                        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                          {school.imageUrl ? (
                            <Image
                              src={school.imageUrl}
                              alt={school.name}
                              fill
                              className="object-cover transition-transform duration-200 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-muted">
                              <div className="text-4xl text-muted-foreground">🚗</div>
                            </div>
                          )}
                          
                          {/* Logo overlay */}
                          {school.logoUrl && (
                            <div className="absolute top-3 right-3 w-14 h-14 rounded-lg overflow-hidden bg-white shadow-lg border-2 border-white">
                              <Image
                                src={school.logoUrl}
                                alt={`Logo de ${school.name}`}
                                fill
                                className="object-contain p-1"
                                sizes="56px"
                              />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-3 sm:p-4 lg:p-6">
                          {/* Name */}
                          <h3 className="mb-2 text-base sm:text-lg lg:text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {school.name}
                          </h3>

                          {/* Rating */}
                          <div className="mb-2 sm:mb-3 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs sm:text-sm font-medium text-foreground">
                                {formatRating(school.rating)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span className="text-xs">
                                {formatReviews(school.reviewsCount)} reseñas
                              </span>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="mb-2 sm:mb-3 flex items-center space-x-1 text-muted-foreground">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="text-xs sm:text-sm truncate">
                              {school.city}, {school.province}
                            </span>
                          </div>

                          {/* Description */}
                          {school.description && (
                            <p className="mb-2 sm:mb-3 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                              {school.description}
                            </p>
                          )}

                          {/* Price Range */}
                          {school.priceMin && school.priceMax && (
                            <div className="text-xs sm:text-sm font-medium text-primary mb-2 sm:mb-3">
                              {formatPrice(school.priceMin)} - {formatPrice(school.priceMax)}
                            </div>
                          )}

                          {/* Contact Info */}
                          <div className="pt-2 sm:pt-3 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-muted-foreground">
                              {school.phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-3 w-3" />
                                  <span className="hidden sm:inline">Llamar</span>
                                </div>
                              )}
                              {school.email && (
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-3 w-3" />
                                  <span className="hidden sm:inline">Email</span>
                                </div>
                              )}
                            </div>
                            <div className="text-primary text-xs sm:text-sm font-medium">
                              Ver detalles →
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 sm:mt-8">
                  {/* Mobile: Simple pagination */}
                  <div className="flex items-center justify-between sm:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex-1 mr-2"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>
                    <span className="text-sm text-muted-foreground px-4">
                      {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex-1 ml-2"
                    >
                      Siguiente
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  
                  {/* Desktop: Full pagination */}
                  <div className="hidden sm:flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        )
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="text-muted-foreground">...</span>
                      }
                      return null
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">
                No se encontraron autoescuelas
              </h3>
              <p className="text-muted-foreground mb-6">
                Intenta ajustar tus filtros de búsqueda
              </p>
              <Button onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
