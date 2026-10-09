"use client"

import { useEffect } from 'react'
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
  Award,
  BadgeCheck,
  Crown,
  ExternalLink,
  FileCheck,
  Camera,
  ListChecks,
  MessageCircle,
  Navigation,
  PlayCircle,
  Tag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ContactForm from '@/components/ContactForm'
import SafeHTML from '@/components/SafeHTML'
import RelatedSchools from '@/components/RelatedSchools'
import ClaimCta from '@/components/claims/ClaimCta'
import JsonLd from '@/components/SEO/JsonLd'
import SchoolGallery from '@/components/school-premium/SchoolGallery'
import SchoolVideo from '@/components/school-premium/SchoolVideo'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { formatPrice, formatRating, formatReviews } from '@/lib/utils'
import { mapsUrl, whatsappUrl, youtubeVideoId, type SchoolEventType, type SchoolFaq } from '@/lib/premium'
import { trackSchoolEvent, trackSchoolView } from '@/lib/school-tracking'
import { SchoolSummary } from '@/lib/types'

interface Course {
  id: string
  name: string
  description?: string | null
  duration?: number | null
  price?: number | null
  includes?: string[]
}

interface Review {
  id: string
  rating: number
  comment?: string | null
  author: string
  createdAt: Date
}

interface DrivingSchool {
  id: string
  name: string
  slug: string
  rating: number
  reviewsCount: number
  city: string
  citySlug: string
  province: string
  provinceSlug: string
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
  isClaimed: boolean
  isPremium: boolean
  whatsapp?: string | null
  gallery?: string[]
  videoUrl?: string | null
  promotion?: string | null
  faqs?: SchoolFaq[]
  features?: string[]
  foundedYear?: number | null
  licenseNumber?: string | null
  courses?: Course[]
  reviews?: Review[]
}

export type DemoAction = Exclude<SchoolEventType, 'view'> | 'video'

interface SchoolPageClientProps {
  school: DrivingSchool
  relatedSchools: SchoolSummary[]
  /** Ficha de ejemplo: no registra métricas y los botones explican qué hacen en lugar de ejecutarse. */
  demo?: {
    videoPoster: string
    onAction: (action: DemoAction) => void
  }
}

function PremiumTag({ className = 'ml-auto' }: { className?: string }) {
  return (
    <span
      className={`${className} inline-flex shrink-0 items-center gap-1 rounded-full bg-signal px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-signal-foreground`}
    >
      <Crown className="h-3 w-3" />
      Premium
    </span>
  )
}

export default function SchoolPageClient({ school, relatedSchools, demo }: SchoolPageClientProps) {
  const isDemo = Boolean(demo)
  const premium = school.isPremium
  const whatsappLink = premium
    ? whatsappUrl(school.whatsapp, `Hola ${school.name}, vi su ficha en Autoescuelas.ar y quisiera consultar por clases de manejo.`)
    : null
  const directionsLink = premium && school.address ? mapsUrl([school.address, school.city, school.province]) : null
  const videoId = premium ? youtubeVideoId(school.videoUrl) : null
  const gallery = premium ? school.gallery ?? [] : []
  const features = premium ? school.features ?? [] : []
  const faqs = premium ? school.faqs ?? [] : []
  const promotion = premium ? school.promotion : null
  const yearsActive = premium && school.foundedYear ? new Date().getFullYear() - school.foundedYear : 0

  const showDemoVideo = premium && !videoId && Boolean(demo)
  // En la ficha de ejemplo los enlaces no llevan a ningún lado, ni siquiera antes de que cargue el JavaScript.
  const contactHref = (url: string) => (demo ? '#' : url)

  useEffect(() => {
    if (!isDemo) trackSchoolView(school.id)
  }, [school.id, isDemo])

  const handleContactClick = (type: Exclude<SchoolEventType, 'view'>, event: React.MouseEvent) => {
    if (demo) {
      event.preventDefault()
      demo.onAction(type)
      return
    }
    trackSchoolEvent(school.id, type)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="page-hero min-h-[280px] sm:min-h-[320px]">
        {school.imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={school.imageUrl}
              alt={school.name}
              fill
              className="object-cover opacity-15 mix-blend-luminosity"
              priority
            />
          </div>
        )}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8 h-full flex items-center">
          <div className="text-white w-full">
            <Link 
              href={`/provincias/${school.provinceSlug}`}
              className="inline-flex items-center text-white/80 hover:text-white mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a {school.province}
            </Link>
            
            {/* Logo and title section - responsive layout */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                {/* Logo */}
                {school.logoUrl && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white shadow-lg ring-4 ring-white/15 flex-shrink-0 self-start">
                    <Image
                      src={school.logoUrl}
                      alt={`Logo de ${school.name}`}
                      width={80}
                      height={80}
                      className="object-contain p-2"
                    />
                  </div>
                )}
                
                {/* Title - full width on mobile */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight break-words">
                    {school.name}
                  </h1>
                  {(premium || school.isVerified) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {premium && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-signal px-2.5 py-1 text-xs font-bold text-signal-foreground">
                          <Crown className="h-3.5 w-3.5" />
                          Destacada
                        </span>
                      )}
                      {school.isVerified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Verificada
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info section - responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-white/90">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-sm sm:text-base truncate">{school.city}, {school.province}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-signal text-signal flex-shrink-0" />
                <span className="text-sm sm:text-base">{formatRating(school.rating)} ({formatReviews(school.reviewsCount)} reseñas)</span>
              </div>
              {school.priceMin && school.priceMax && (
                <div className="flex items-center space-x-2 sm:col-span-2 lg:col-span-1">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{formatPrice(school.priceMin)} - {formatPrice(school.priceMax)}</span>
                </div>
              )}
              {yearsActive > 0 && (
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">
                    {yearsActive} {yearsActive === 1 ? 'año' : 'años'} de trayectoria
                  </span>
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
            {promotion && (
              <div className="relative flex items-start gap-3 rounded-xl border-2 border-signal bg-signal/15 p-4 sm:p-5">
                <Tag className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-navy">Promoción</p>
                  <p className="font-semibold text-foreground">{promotion}</p>
                </div>
                {demo && <PremiumTag className="absolute -top-2.5 right-3" />}
              </div>
            )}

            {/* Description */}
            {school.description && (
              <Card>
                <CardHeader>
                  <h2 className="font-display text-2xl font-bold leading-tight tracking-tight">
                    Sobre {school.name}
                  </h2>
                </CardHeader>
                <CardContent>
                  <SafeHTML 
                    content={school.description} 
                    className="text-muted-foreground leading-relaxed"
                  />
                </CardContent>
              </Card>
            )}

            {features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-primary" />
                    Detalles del servicio
                    {demo && <PremiumTag />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-wrap gap-2">
                    {features.map(feature => (
                      <li
                        key={feature}
                        className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-sm font-medium text-primary"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {gallery.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    Fotos
                    {demo && <PremiumTag />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SchoolGallery images={gallery} schoolName={school.name} />
                </CardContent>
              </Card>
            )}

            {(videoId || showDemoVideo) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-primary" />
                    Video
                    {demo && <PremiumTag />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SchoolVideo
                    videoId={videoId ?? ''}
                    title={`Video de ${school.name}`}
                    thumbnailUrl={showDemoVideo ? demo?.videoPoster : undefined}
                    onPlay={demo ? () => demo.onAction('video') : undefined}
                  />
                </CardContent>
              </Card>
            )}

            {/* Services */}
            {school.services && school.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Cursos de manejo ofrecidos</CardTitle>
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
                      <div key={course.id} className="rounded-lg border border-l-4 border-l-primary bg-muted/30 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <h3 className="font-semibold text-lg">{course.name}</h3>
                          {course.price && (
                            <Badge variant="secondary" className="w-fit">
                              {formatPrice(course.price)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3">{course.description}</p>
                        {course.duration ? (
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration} {course.duration === 1 ? 'hora' : 'horas'}</span>
                            </div>
                          </div>
                        ) : null}
                        <div>
                          {course.includes && course.includes.length > 0 && (
                            <>
                              <h4 className="font-medium mb-2">Incluye:</h4>
                              <ul className="grid gap-1 sm:grid-cols-2">
                                {course.includes.map((item, index) => (
                                  <li key={index} className="flex items-center space-x-2 text-sm">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
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
                            <span className="font-medium">{review.author}</span>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-signal text-signal'
                                      : 'text-border'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString('es-AR')}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {faqs.length > 0 && (
              <Card>
                {!demo && <JsonLd type="FAQPage" data={faqs} />}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Preguntas frecuentes
                    {demo && <PremiumTag />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="whitespace-pre-line text-muted-foreground">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {(whatsappLink || directionsLink) && (
              <div className="space-y-2 rounded-xl border-t-4 border-t-signal bg-card p-4 shadow-card">
                <div className="flex items-start gap-2">
                  <p className="font-display font-bold text-foreground">Contactá a {school.name}</p>
                  {demo && <PremiumTag />}
                </div>
                {whatsappLink && (
                  <a
                    href={contactHref(whatsappLink)}
                    target={demo ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    onClick={event => handleContactClick('whatsapp', event)}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#25d366] px-4 font-bold text-white shadow-sm transition-colors hover:bg-[#1ebe5b]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Escribir por WhatsApp
                  </a>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {school.phone && (
                    <Button variant="outline" asChild>
                      <a href={contactHref(`tel:${school.phone}`)} onClick={event => handleContactClick('phone', event)}>
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar
                      </a>
                    </Button>
                  )}
                  {directionsLink && (
                    <Button variant="outline" asChild className={school.phone ? '' : 'col-span-2'}>
                      <a
                        href={contactHref(directionsLink)}
                        target={demo ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        onClick={event => handleContactClick('directions', event)}
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Cómo llegar
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Contact Form - Moved to top */}
            <ContactForm 
              schoolName={school.name}
              schoolId={school.id}
              demo={isDemo}
            />

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
                        href={contactHref(`tel:${school.phone}`)}
                        onClick={event => handleContactClick('phone', event)}
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
                        href={contactHref(`mailto:${school.email}`)}
                        onClick={event => handleContactClick('email', event)}
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
                        href={contactHref(school.website)}
                        target={demo ? undefined : "_blank"}
                        rel={premium ? 'noopener noreferrer' : 'nofollow noopener noreferrer'}
                        onClick={event => handleContactClick('website', event)}
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        Visitar sitio web
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {premium && school.licenseNumber && (
                  <div className="flex items-center space-x-3">
                    <FileCheck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Habilitación</p>
                      <p className="text-sm text-muted-foreground">N° {school.licenseNumber}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  {school.phone && (
                    <Button className="w-full" asChild>
                      <a href={contactHref(`tel:${school.phone}`)} onClick={event => handleContactClick('phone', event)}>
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar Ahora
                      </a>
                    </Button>
                  )}
                  {school.email && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={contactHref(`mailto:${school.email}`)} onClick={event => handleContactClick('email', event)}>
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
                    {school.hours && (
                      <div className="text-muted-foreground">
                        {school.hours}
                      </div>
                    )}
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
                  <div className="mx-auto mb-3 inline-flex items-center justify-center space-x-2 rounded-xl border-4 border-navy bg-signal px-5 py-2.5 shadow-card">
                    <Star className="h-6 w-6 fill-navy text-navy" />
                    <span className="font-display text-3xl font-extrabold text-signal-foreground">{formatRating(school.rating)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Basado en {formatReviews(school.reviewsCount)} reseñas
                  </p>
                  {school.isVerified && (
                    <div className="mt-4">
                      <Badge variant="secondary" className="flex items-center space-x-1 w-fit mx-auto">
                        <Award className="h-3 w-3" />
                        <span>Verificada</span>
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {!demo && <ClaimCta slug={school.slug} isClaimed={school.isClaimed} isPremium={school.isPremium} />}
          </div>
        </div>
      </div>

      {!premium && (
        <RelatedSchools
          schools={relatedSchools}
          city={school.city}
          citySlug={school.citySlug}
          provinceSlug={school.provinceSlug}
        />
      )}
    </div>
  )
}
