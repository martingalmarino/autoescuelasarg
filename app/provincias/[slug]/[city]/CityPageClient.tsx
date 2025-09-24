"use client"

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Users, Clock, Phone, Mail, Globe, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice, formatRating, formatReviews } from '@/lib/utils'
import { analyticsEvents } from '@/lib/analytics'

interface City {
  id: string
  name: string
  slug: string
  schoolsCount: number
  province: {
    id: string
    name: string
    slug: string
  }
}

interface DrivingSchool {
  id: string
  name: string
  slug: string
  rating: number
  reviewsCount: number
  city: string
  province: string
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

interface CityPageClientProps {
  params: {
    slug: string
    city: string
  }
  city?: City | null
  schools?: DrivingSchool[]
}

export default function CityPageClient({ params, city, schools }: CityPageClientProps) {

  if (!city) {
    notFound()
  }

  const handleSchoolClick = (schoolId: string, schoolName: string) => {
    analyticsEvents.clickSchoolCard(schoolId, schoolName)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl">
            <Link 
              href={`/provincias/${city.province.slug}`}
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a {city.province.name}
            </Link>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Autoescuelas en {city.name}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-6">
              {city.name} es una ciudad en {city.province.name} con {city.schoolsCount} autoescuelas disponibles.
            </p>
            <div className="mt-6 flex items-center space-x-6 text-white/80">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>{city.schoolsCount} autoescuelas</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>{city.province.name}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schools Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
              Autoescuelas en {city.name}
            </h2>
            <Link href="/autoescuelas">
              <Button variant="outline">
                Ver todas las autoescuelas
              </Button>
            </Link>
          </div>

          {schools && schools.length > 0 ? (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {schools.map((school) => (
                <Link
                  key={school.id}
                  href={`/autoescuelas/${school.slug}`}
                  onClick={() => handleSchoolClick(school.id, school.name)}
                  className="group"
                >
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      {school.imageUrl ? (
                        <Image
                          src={school.imageUrl}
                          alt={school.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <div className="text-center text-blue-600">
                            <div className="w-16 h-16 mx-auto mb-2 bg-blue-200 rounded-full flex items-center justify-center">
                              <span className="text-2xl">🚗</span>
                            </div>
                            <p className="text-sm font-medium">{school.name}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Logo overlay */}
                      {school.logoUrl && (
                        <div className="absolute top-2 left-2 w-12 h-12 rounded-lg overflow-hidden bg-white shadow-md border-2 border-white">
                          <Image
                            src={school.logoUrl}
                            alt={`Logo de ${school.name}`}
                            fill
                            className="object-contain p-1"
                            sizes="48px"
                          />
                        </div>
                      )}
                      
                      {school.isFeatured && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Destacada
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {school.name}
                      </h3>
                      
                      <div className="flex items-center space-x-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{formatRating(school.rating)}</span>
                        <span className="text-sm text-gray-500">({formatReviews(school.reviewsCount)})</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{school.city}, {school.province}</span>
                      </div>
                      
                      {school.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {school.description}
                        </p>
                      )}
                      
                      {school.priceMin && school.priceMax && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-600">
                            {formatPrice(school.priceMin)} - {formatPrice(school.priceMax)}
                          </span>
                          {school.isVerified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Verificada
                            </span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🚗</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay autoescuelas disponibles
              </h3>
              <p className="text-gray-600 mb-6">
                No se encontraron autoescuelas en {city.name} en este momento.
              </p>
              <Link href="/autoescuelas">
                <Button>
                  Ver todas las autoescuelas
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
