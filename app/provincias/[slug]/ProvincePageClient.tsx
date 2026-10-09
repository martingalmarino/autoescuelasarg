"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  Users,
  Phone,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, formatRating, formatReviews } from "@/lib/utils";
import { analyticsEvents } from "@/lib/analytics";
import { SchoolSummary } from "@/lib/types";
import ForSchoolsBanner from "@/components/claims/ForSchoolsBanner";

const BANNER_AFTER = 6;

interface City {
  id: string;
  name: string;
  slug: string;
  schoolsCount: number;
}

interface Province {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  schoolsCount: number;
  cities?: City[];
}

interface ProvincePageClientProps {
  province: Province;
  schools: SchoolSummary[];
  cities: City[];
}

export default function ProvincePageClient({
  province,
  schools,
  cities,
}: ProvincePageClientProps) {
  const handleSchoolClick = (schoolId: string, schoolName: string) => {
    analyticsEvents.clickSchoolCard(schoolId, schoolName);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="page-hero min-h-[280px] sm:min-h-[320px]">
        {province.imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={province.imageUrl}
              alt={province.name}
              fill
              className="object-cover opacity-15 mix-blend-luminosity"
              priority
            />
          </div>
        )}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8 h-full flex items-center">
          <div className="text-white w-full">
            <Link
              href="/provincias"
              className="inline-flex items-center text-white/80 hover:text-white mb-2 sm:mb-3 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a provincias
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-3 leading-tight">
              Autoescuelas en {province.name}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-2xl leading-relaxed mb-3 sm:mb-4">
              Encontrá las mejores autoescuelas en {province.name} con
              instructores profesionales, autos doble comando y clases prácticas
              en ciudad y ruta.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-white/80">
              <div className="flex items-center space-x-2 text-sm sm:text-base">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-signal" />
                <span>{province.schoolsCount} autoescuelas</span>
              </div>
              {cities && cities.length > 0 && (
                <div className="flex items-center space-x-2 text-sm sm:text-base">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-signal" />
                  <span>{cities.length} ciudades</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      {cities && cities.length > 0 && (
        <section className="py-12 sm:py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="section-title text-center text-2xl sm:text-3xl mb-8">
              Ciudades en {province.name}
            </h2>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/provincias/${province.slug}/${city.slug}`}
                  className="group"
                >
                  <Card className="surface-card-hover h-full">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                            {city.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {city.schoolsCount} autoescuelas
                          </p>
                        </div>
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Schools Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="section-title text-2xl sm:text-3xl mb-2">
                Autoescuelas en {province.name}
              </h2>
              <p className="text-muted-foreground">
                {schools?.length || 0} escuelas de manejo disponibles
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button variant="outline" asChild>
                <Link href="/autoescuelas">Ver todas las autoescuelas</Link>
              </Button>
            </div>
          </div>

          {schools && schools.length > 0 ? (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {schools.map((school, index) => (
                <Fragment key={school.id}>
                  <Link
                    href={`/autoescuelas/${school.slug}`}
                    onClick={() => handleSchoolClick(school.id, school.name)}
                    className="group"
                  >
                    <Card className="surface-card-hover h-full overflow-hidden">
                      <CardContent className="p-0">
                        {/* Image */}
                        <div className="relative h-48 w-full overflow-hidden">
                          {school.imageUrl ? (
                            <Image
                              src={school.imageUrl}
                              alt={school.name}
                              fill
                              className="object-cover transition-transform duration-200 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-muted">
                              <div className="text-4xl text-muted-foreground">
                                🚗
                              </div>
                            </div>
                          )}

                          {/* Logo overlay */}
                          {school.logoUrl && (
                            <div className="absolute top-2.5 right-2.5 w-12 h-12 rounded-lg overflow-hidden bg-white shadow-card ring-1 ring-black/5">
                              <Image
                                src={school.logoUrl}
                                alt={`Logo de ${school.name}`}
                                fill
                                className="object-contain p-1"
                                sizes="48px"
                              />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6">
                          {/* Name */}
                          <h3 className="mb-2 text-lg sm:text-xl font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                            {school.name}
                          </h3>

                          {/* Rating */}
                          <div className="mb-3 flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-signal text-signal" />
                              <span className="text-sm font-medium text-foreground">
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
                          <div className="mb-3 flex items-center space-x-1 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="text-sm">
                              {school.city}, {school.province}
                            </span>
                          </div>

                          {/* Description */}
                          {school.description && (
                            <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                              {school.description}
                            </p>
                          )}

                          {/* Price Range */}
                          {school.priceMin && school.priceMax && (
                            <div className="inline-flex rounded-md bg-accent px-2 py-0.5 text-sm font-semibold text-primary">
                              {formatPrice(school.priceMin)} -{" "}
                              {formatPrice(school.priceMax)}
                            </div>
                          )}

                          {/* Contact Info */}
                          <div className="mt-4 pt-4 border-t flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                              {school.phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-3 w-3" />
                                  <span>Llamar</span>
                                </div>
                              )}
                              {school.email && (
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-3 w-3" />
                                  <span>Email</span>
                                </div>
                              )}
                            </div>
                            <div className="text-primary text-sm font-medium">
                              Ver detalles →
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  {index === Math.min(BANNER_AFTER, schools.length) - 1 && (
                    <ForSchoolsBanner place={province.name} className="col-span-full" />
                  )}
                </Fragment>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold mb-2">
                No hay autoescuelas disponibles
              </h3>
              <p className="text-muted-foreground mb-6">
                Pronto agregaremos más autoescuelas en {province.name}
              </p>
              <Button asChild>
                <Link href="/provincias">Ver otras provincias</Link>
              </Button>
              <ForSchoolsBanner place={province.name} className="mt-10 text-left" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
