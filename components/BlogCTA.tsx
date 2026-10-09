"use client";

import Link from "next/link";
import { Car, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BlogCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  variant?: "default" | "featured" | "minimal";
  className?: string;
}

export default function BlogCTA({
  title = "¿Buscás una autoescuela cerca tuyo?",
  description = "Encontrá la escuela de manejo perfecta en tu ciudad. Miles de opciones con calificaciones reales de estudiantes.",
  buttonText = "Buscar autoescuelas",
  buttonLink = "/autoescuelas",
  variant = "default",
  className = "",
}: BlogCTAProps) {
  if (variant === "minimal") {
    return (
      <div
        className={`my-6 sm:my-8 p-4 sm:p-6 bg-accent border-l-4 border-signal rounded-r-lg ${className}`}
      >
        <p className="text-sm sm:text-base text-accent-foreground mb-3 sm:mb-4">
          <strong>💡 Tip:</strong> {description}
        </p>
        <Link href={buttonLink}>
          <Button
            size="sm"
            variant="outline"
            className="text-primary border-primary/30 text-sm sm:text-base"
          >
            {buttonText}
          </Button>
        </Link>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <Card
        className={`page-hero bg-navy my-8 sm:my-12 p-6 sm:p-8 border-0 text-white ${className}`}
      >
        <div className="relative flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-shrink-0 self-center sm:self-start">
            <div className="w-12 h-12 bg-signal rounded-xl flex items-center justify-center shadow-md">
              <Car className="w-6 h-6 text-navy" />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-sm sm:text-base text-white/80 mb-4">{description}</p>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href={buttonLink} className="w-full sm:w-auto">
                <Button size="lg" variant="signal" className="font-bold w-full sm:w-auto">
                  {buttonText}
                </Button>
              </Link>
              <div className="flex items-center justify-center sm:justify-start text-xs sm:text-sm text-white/70">
                <Star className="w-4 h-4 fill-signal text-signal mr-1" />
                <span>Miles de opciones verificadas</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      className={`my-6 sm:my-8 p-4 sm:p-6 border-2 border-dashed border-primary/25 bg-accent/50 ${className}`}
    >
      <div className="text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-navy rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-card">
          <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-signal" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto">{description}</p>
        <Link href={buttonLink}>
          <Button size="lg" className="w-full sm:w-auto">
            {buttonText}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
