"use client"

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  MapPin, 
  Star, 
  Users, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  ArrowLeft,
  CheckCircle,
  Calendar,
  DollarSign,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getSchoolBySlug } from '@/lib/mock-data'
import { formatPrice, formatRating, formatReviews } from '@/lib/utils'
import { analyticsEvents } from '@/lib/analytics'

interface SchoolPageClientProps {
  params: {
    slug: string
  }
}

export default function SchoolPageClient({ params }: SchoolPageClientProps) {
  const school = getSchoolBySlug(params.slug)

  if (!school) {
    notFound()
  }

  const handleContactClick = (type: 'phone' | 'email' | 'website') => {
    analyticsEvents.ctaViewAll(`contact_${type}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 sm:h-80 bg-gradient-to-r from-blue-600 to-blue-800">
        {school.imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={school.imageUrl}
              alt={school.name}
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
        )}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="text-white">
            <Link 
              href={`/provincias/${school.province.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a {school.province}
            </Link>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {school.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>{school.city}, {school.province}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span>{formatRating(school.rating)} ({formatReviews(school.reviewsCount)} reseñas)</span>
              </div>
              {school.priceRange && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>{formatPrice(school.priceRange.min)} - {formatPrice(school.priceRange.max)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {school.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {school.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            {school.services && school.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Servicios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {school.services.map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Courses */}
            {school.courses && school.courses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Cursos Disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {school.courses.map((course) => (
                      <div key={course.id} className="border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <h3 className="font-semibold text-lg">{course.name}</h3>
                          <Badge variant="secondary" className="w-fit">
                            {formatPrice(course.price)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{course.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Incluye:</h4>
                          <ul className="grid gap-1 sm:grid-cols-2">
                            {course.includes.map((item, index) => (
                              <li key={index} className="flex items-center space-x-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            {school.reviews && school.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Reseñas de Estudiantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {school.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{review.userName}</span>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString('es-AR')}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {school.address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Dirección</p>
                      <p className="text-sm text-muted-foreground">{school.address}</p>
                    </div>
                  </div>
                )}

                {school.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Teléfono</p>
                      <a 
                        href={`tel:${school.phone}`}
                        onClick={() => handleContactClick('phone')}
                        className="text-sm text-primary hover:underline"
                      >
                        {school.phone}
                      </a>
                    </div>
                  </div>
                )}

                {school.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a 
                        href={`mailto:${school.email}`}
                        onClick={() => handleContactClick('email')}
                        className="text-sm text-primary hover:underline"
                      >
                        {school.email}
                      </a>
                    </div>
                  </div>
                )}

                {school.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Sitio Web</p>
                      <a 
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleContactClick('website')}
                        className="text-sm text-primary hover:underline"
                      >
                        Visitar sitio web
                      </a>
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  {school.phone && (
                    <Button className="w-full" asChild>
                      <a href={`tel:${school.phone}`} onClick={() => handleContactClick('phone')}>
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar Ahora
                      </a>
                    </Button>
                  )}
                  {school.email && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`mailto:${school.email}`} onClick={() => handleContactClick('email')}>
                        <Mail className="h-4 w-4 mr-2" />
                        Enviar Email
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hours */}
            {school.hours && (
              <Card>
                <CardHeader>
                  <CardTitle>Horarios de Atención</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Lunes - Viernes</span>
                      <span className="text-muted-foreground">{school.hours.monday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábado</span>
                      <span className="text-muted-foreground">{school.hours.saturday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingo</span>
                      <span className="text-muted-foreground">{school.hours.sunday}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rating Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Calificación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">{formatRating(school.rating)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Basado en {formatReviews(school.reviewsCount)} reseñas
                  </p>
                  <div className="mt-4">
                    <Badge variant="secondary" className="flex items-center space-x-1 w-fit mx-auto">
                      <Award className="h-3 w-3" />
                      <span>Verificada</span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
