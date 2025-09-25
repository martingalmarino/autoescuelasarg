"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Star, Award, ChevronRight } from 'lucide-react'
import { analyticsEvents } from '@/lib/analytics'

interface RelatedSchool {
  id: string
  name: string
  slug: string
  rating: number
  reviewsCount: number
  city: string
  province: string
  priceMin?: number | null
  priceMax?: number | null
  isFeatured: boolean
  isVerified: boolean
}

interface RelatedSchoolsProps {
  currentSchoolSlug: string
}

export default function RelatedSchools({ currentSchoolSlug }: RelatedSchoolsProps) {
  const [schools, setSchools] = useState<RelatedSchool[]>([])
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<{ city: string; province: string } | null>(null)

  useEffect(() => {
    const fetchRelatedSchools = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/autoescuelas/${currentSchoolSlug}/related`)
        const data = await response.json()
        
        if (data.success) {
          setSchools(data.schools)
          setLocation(data.currentSchool)
        }
      } catch (error) {
        console.error('Error fetching related schools:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedSchools()
  }, [currentSchoolSlug])

  const handleSchoolClick = (school: RelatedSchool) => {
    analyticsEvents.schoolLinkClick(school.name, 'related_schools')
  }

  const formatPrice = (min?: number | null, max?: number | null) => {
    if (!min && !max) return null
    if (min && max && min === max) return `$${min.toLocaleString()}`
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    if (min) return `Desde $${min.toLocaleString()}`
    if (max) return `Hasta $${max.toLocaleString()}`
    return null
  }

  const formatRating = (rating: number) => {
    return rating.toFixed(1)
  }

  const formatReviews = (count: number) => {
    if (count === 1) return '1 reseña'
    return `${count} reseñas`
  }

  if (loading) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-muted-foreground">Cargando autoescuelas relacionadas...</p>
          </div>
        </div>
      </section>
    )
  }

  if (schools.length === 0) {
    return null // No mostrar la sección si no hay autoescuelas relacionadas
  }

  return (
    <section className="py-8 sm:py-12 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Otras Autoescuelas en {location?.city}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explora otras opciones de escuelas de manejo en tu zona. 
            Compará precios, calificaciones y servicios para encontrar la mejor opción.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => (
            <Link
              key={school.id}
              href={`/autoescuelas/${school.slug}`}
              onClick={() => handleSchoolClick(school)}
              className="group relative bg-white rounded-xl border border-gray-200 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1"
            >
              {/* Featured badge */}
              {school.isFeatured && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                    <Award className="h-3 w-3 inline mr-1" />
                    Destacada
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* School name and location */}
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors duration-300 mb-2">
                    {school.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1 text-primary" />
                    <span>{school.city}, {school.province}</span>
                  </div>
                </div>

                {/* Rating and reviews */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-semibold text-gray-900">
                        {formatRating(school.rating)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({formatReviews(school.reviewsCount)})
                    </span>
                  </div>
                  
                  {school.isVerified && (
                    <div className="flex items-center text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Verificada
                    </div>
                  )}
                </div>

                {/* Price range */}
                {formatPrice(school.priceMin, school.priceMax) && (
                  <div className="text-sm font-medium text-gray-700">
                    {formatPrice(school.priceMin, school.priceMax)}
                  </div>
                )}

                {/* Arrow indicator */}
                <div className="flex items-center justify-end">
                  <div className="text-gray-400 group-hover:text-primary transition-colors duration-300 group-hover:translate-x-1">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Subtle border accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </div>

        {/* View all schools in city CTA */}
        <div className="text-center mt-8">
          <Link
            href={`/provincias/${location?.province.toLowerCase().replace(/\s+/g, '-')}/${location?.city.toLowerCase().replace(/\s+/g, '-')}`}
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors duration-300"
          >
            Ver todas las autoescuelas en {location?.city}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
