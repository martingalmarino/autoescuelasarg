"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SchoolCard from './SchoolCard'
import { DrivingSchool } from '@/lib/types'
import { analyticsEvents } from '@/lib/analytics'

interface TopRatedGridProps {
  schools: DrivingSchool[]
}

// Skeleton component for loading state
function SchoolCardSkeleton() {
  return (
    <div className="h-80 animate-pulse rounded-lg border bg-card">
      <div className="h-48 bg-muted rounded-t-lg" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-4 bg-muted rounded w-1/3" />
      </div>
    </div>
  )
}

export default function TopRatedGrid({ schools }: TopRatedGridProps) {
  const handleViewAllClick = () => {
    analyticsEvents.ctaViewAll('top_rated')
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="container px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Escuelas de manejo más valoradas
            </h2>
            <p className="mt-2 text-base sm:text-lg text-muted-foreground">
              Las autoescuelas mejor calificadas por nuestros usuarios
            </p>
          </div>
          
          <Link href="/autoescuelas?sort=rating_desc" onClick={handleViewAllClick}>
            <Button variant="outline" className="hidden sm:flex items-center space-x-2">
              <span>VER TODAS</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Schools Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {schools.length > 0 ? (
            schools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))
          ) : (
            // Loading skeletons
            Array.from({ length: 12 }).map((_, index) => (
              <SchoolCardSkeleton key={index} />
            ))
          )}
        </div>

        {/* View All Button - Mobile */}
        <div className="mt-6 sm:mt-8 flex justify-center sm:hidden">
          <Link href="/autoescuelas?sort=rating_desc" onClick={handleViewAllClick}>
            <Button variant="outline" className="flex items-center space-x-2 w-full sm:w-auto">
              <span>VER TODAS</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
