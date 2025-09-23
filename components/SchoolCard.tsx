"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { DrivingSchool } from '@/lib/types'
import { formatRating, formatReviews, formatPrice } from '@/lib/utils'
import { analyticsEvents } from '@/lib/analytics'

interface SchoolCardProps {
  school: DrivingSchool
}

export default function SchoolCard({ school }: SchoolCardProps) {
  const handleClick = () => {
    analyticsEvents.clickSchoolCard(school.id, school.name)
  }

  return (
    <Link href={`/autoescuelas/${school.slug}`} onClick={handleClick}>
      <Card className="group h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative h-40 sm:h-48 w-full overflow-hidden rounded-t-lg">
            {school.imageUrl ? (
              <Image
                src={school.imageUrl}
                alt={school.name}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <div className="text-3xl sm:text-4xl text-muted-foreground">🚗</div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4">
            {/* Name */}
            <h3 className="mb-2 line-clamp-2 text-base sm:text-lg font-semibold text-foreground group-hover:text-primary">
              {school.name}
            </h3>

            {/* Rating */}
            <div className="mb-2 sm:mb-3 flex items-center space-x-2">
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
              <MapPin className="h-3 w-3" />
              <span className="text-xs sm:text-sm">
                {school.city}, {school.province}
              </span>
            </div>

            {/* Price Range */}
            {school.priceRange && (
              <div className="text-xs sm:text-sm font-medium text-primary">
                {formatPrice(school.priceRange.min)} - {formatPrice(school.priceRange.max)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
