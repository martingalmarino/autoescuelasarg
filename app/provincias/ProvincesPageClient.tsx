"use client"

import Link from 'next/link'
import { MapPin, Users, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Province } from '@/lib/types'
import { analyticsEvents } from '@/lib/analytics'

interface ProvincesPageClientProps {
  provinces: Province[]
}

export default function ProvincesPageClient({ provinces }: ProvincesPageClientProps) {
  const handleProvinceClick = (province: Province) => {
    analyticsEvents.provinceLinkClick(province.name)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center text-white">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Todas las Provincias
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Encontrá autoescuelas en todas las provincias de Argentina. 
              Navega por provincia para encontrar la escuela de manejo más cercana a ti.
            </p>
            <div className="flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>{provinces.length} provincias</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>{provinces.reduce((total, p) => total + p.schoolsCount, 0)} autoescuelas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Provinces Grid */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {provinces.map((province) => (
              <Link
                key={province.id}
                href={`/provincias/${province.slug}`}
                onClick={() => handleProvinceClick(province)}
                className="group"
              >
                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    
                    <h3 className="font-semibold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors mb-2">
                      {province.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {province.schoolsCount} autoescuelas
                    </p>
                    
                    {province.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {province.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            ¿No encuentras tu provincia?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Estamos constantemente agregando nuevas autoescuelas y provincias. 
            Si no ves tu provincia, contáctanos y te ayudaremos a encontrar la mejor opción.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/autoescuelas"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Ver todas las autoescuelas
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center px-6 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
            >
              Contactar soporte
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
