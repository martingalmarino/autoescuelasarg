"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { SchoolSummary } from '@/lib/types'
import { formatRating, formatReviews, formatPrice } from '@/lib/utils'
import { analyticsEvents } from '@/lib/analytics'

interface SchoolCardProps {
  school: SchoolSummary
}

export default function SchoolCard({ school }: SchoolCardProps) {
  const handleClick = () => {
    analyticsEvents.clickSchoolCard(school.id, school.name)
  }

  return (
    <Link href={`/autoescuelas/${school.slug}`} onClick={handleClick}>
      <Card className="surface-card-hover group h-full cursor-pointer overflow-hidden">
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative h-40 sm:h-48 w-full overflow-hidden">
            {school.imageUrl ? (
              <Image
                src={school.imageUrl}
                alt={school.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <div className="text-3xl sm:text-4xl text-muted-foreground">🚗</div>
              </div>
            )}
            
            {/* Logo overlay */}
            {school.logoUrl && (
              <div className="absolute top-2.5 right-2.5 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-white shadow-card ring-1 ring-black/5">
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
          <div className="p-3.5 sm:p-4">
            {/* Name */}
            <h3 className="mb-2 line-clamp-2 font-display text-base sm:text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
              {school.name}
            </h3>

            {/* Rating */}
            <div className="mb-2 sm:mb-3 flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-signal text-signal" />
                <span className="text-xs sm:text-sm font-bold text-foreground">
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
              <MapPin className="h-3 w-3 text-primary" />
              <span className="text-xs sm:text-sm">
                {school.city}, {school.province}
              </span>
            </div>

            {/* Price Range */}
            {school.priceMin && school.priceMax && (
              <div className="inline-flex rounded-md bg-accent px-2 py-0.5 text-xs sm:text-sm font-semibold text-primary">
                {formatPrice(school.priceMin)} - {formatPrice(school.priceMax)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
