"use client"

import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Users, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice, formatRating, formatReviews } from '@/lib/utils'
import { analyticsEvents } from '@/lib/analytics'
import { SchoolSummary } from '@/lib/types'
import ForSchoolsBanner from '@/components/claims/ForSchoolsBanner'

const BANNER_AFTER = 6

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

interface CityPageClientProps {
  city: City
  schools: SchoolSummary[]
}

export default function CityPageClient({ city, schools }: CityPageClientProps) {
  const handleSchoolClick = (schoolId: string, schoolName: string) => {
    analyticsEvents.clickSchoolCard(schoolId, schoolName)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="page-hero text-white py-10 sm:py-14 md:py-16">
        <div className="relative container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl w-full">
            <Link 
              href={`/provincias/${city.province.slug}`}
              className="inline-flex items-center text-white/80 hover:text-white mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a {city.province.name}
            </Link>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 leading-tight">
              Autoescuelas en {city.name}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-4 sm:mb-6 leading-relaxed">
              Aprendé a manejar en {city.name} con autoescuelas que ofrecen instructores capacitados, autos doble comando y clases prácticas adaptadas a tu ritmo.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-white/80">
              <div className="flex items-center space-x-2 text-sm sm:text-base">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-signal" />
                <span>{city.schoolsCount} autoescuelas</span>
              </div>
              <div className="flex items-center space-x-2 text-sm sm:text-base">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-signal" />
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
            <h2 className="section-title text-2xl sm:text-3xl mb-4 sm:mb-0">
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
              {schools.map((school, index) => (
                <Fragment key={school.id}>
                  <Link
                    href={`/autoescuelas/${school.slug}`}
                    onClick={() => handleSchoolClick(school.id, school.name)}
                    className="group"
                  >
                    <Card className="surface-card-hover h-full overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        {school.imageUrl ? (
                          <Image
                            src={school.imageUrl}
                            alt={school.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-accent flex items-center justify-center">
                            <div className="text-center text-primary">
                              <div className="w-16 h-16 mx-auto mb-2 bg-card shadow-card rounded-full flex items-center justify-center">
                                <span className="text-2xl">🚗</span>
                              </div>
                              <p className="text-sm font-semibold">{school.name}</p>
                            </div>
                          </div>
                        )}
                      
                        {/* Logo overlay */}
                        {school.logoUrl && (
                          <div className="absolute top-2.5 left-2.5 w-12 h-12 rounded-lg overflow-hidden bg-white shadow-card ring-1 ring-black/5">
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
                          <div className="absolute top-2.5 right-2.5 bg-signal text-signal-foreground px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                            Destacada
                          </div>
                        )}
                      </div>
                    
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="font-bold text-lg leading-snug mb-2 group-hover:text-primary transition-colors">
                          {school.name}
                        </h3>
                      
                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="h-4 w-4 fill-signal text-signal" />
                          <span className="text-sm font-bold">{formatRating(school.rating)}</span>
                          <span className="text-sm text-muted-foreground">({formatReviews(school.reviewsCount)})</span>
                        </div>
                      
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4 mr-1 text-primary" />
                          <span>{school.city}, {school.province}</span>
                        </div>
                      
                        {school.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {school.description}
                          </p>
                        )}
                      
                        {school.priceMin && school.priceMax && (
                          <div className="flex items-center justify-between">
                            <span className="rounded-md bg-accent px-2 py-0.5 text-sm font-semibold text-primary">
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
                  {index === Math.min(BANNER_AFTER, schools.length) - 1 && (
                    <ForSchoolsBanner place={city.name} className="col-span-full" />
                  )}
                </Fragment>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <span className="text-4xl">🚗</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                No hay autoescuelas disponibles
              </h3>
              <p className="text-muted-foreground mb-6">
                No se encontraron autoescuelas en {city.name} en este momento.
              </p>
              <Link href="/autoescuelas">
                <Button>
                  Ver todas las autoescuelas
                </Button>
              </Link>
              <ForSchoolsBanner place={city.name} className="mt-10 text-left" />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
