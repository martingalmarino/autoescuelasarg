"use client"

import Link from 'next/link'
import { MapPin, Star, Award, ChevronRight } from 'lucide-react'
import { analyticsEvents } from '@/lib/analytics'
import { SchoolSummary } from '@/lib/types'

interface RelatedSchoolsProps {
  schools: SchoolSummary[]
  city: string
  citySlug: string
  provinceSlug: string
}

export default function RelatedSchools({ schools, city, citySlug, provinceSlug }: RelatedSchoolsProps) {
  const handleSchoolClick = (school: SchoolSummary) => {
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

  if (schools.length === 0) {
    return null // No mostrar la sección si no hay autoescuelas relacionadas
  }

  return (
    <section className="py-10 sm:py-14 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="section-title inline-block text-2xl sm:text-3xl mb-3">
            Otras Autoescuelas en {city}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
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
              className="surface-card surface-card-hover group relative p-5"
            >
              {/* Featured badge */}
              {school.isFeatured && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-signal text-signal-foreground text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    <Award className="h-3 w-3 inline mr-1" />
                    Destacada
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* School name and location */}
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200 mb-2">
                    {school.name}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1 text-primary" />
                    <span>{school.city}, {school.province}</span>
                  </div>
                </div>

                {/* Rating and reviews */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-signal text-signal" />
                      <span className="ml-1 font-bold text-foreground">
                        {formatRating(school.rating)}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
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
                  <div className="inline-flex rounded-md bg-accent px-2 py-0.5 text-sm font-semibold text-primary">
                    {formatPrice(school.priceMin, school.priceMax)}
                  </div>
                )}

                {/* Arrow indicator */}
                <div className="flex items-center justify-end">
                  <div className="text-muted-foreground group-hover:text-primary transition-all duration-200 group-hover:translate-x-1">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Subtle border accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-signal rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>
          ))}
        </div>

        {/* View all schools in city CTA */}
        <div className="text-center mt-8">
          <Link
            href={`/provincias/${provinceSlug}/${citySlug}`}
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors duration-300"
          >
            Ver todas las autoescuelas en {city}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
