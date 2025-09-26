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
        className={`my-6 sm:my-8 p-4 sm:p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg ${className}`}
      >
        <p className="text-sm sm:text-base text-blue-800 mb-3 sm:mb-4">
          <strong>💡 Tip:</strong> {description}
        </p>
        <Link href={buttonLink}>
          <Button
            size="sm"
            variant="outline"
            className="text-blue-600 border-blue-300 hover:bg-blue-100 text-sm sm:text-base"
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
        className={`my-8 sm:my-12 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-shrink-0 self-center sm:self-start">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">{description}</p>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href={buttonLink} className="w-full sm:w-auto">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  {buttonText}
                </Button>
              </Link>
              <div className="flex items-center justify-center sm:justify-start text-xs sm:text-sm text-gray-500">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
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
      className={`my-6 sm:my-8 p-4 sm:p-6 border-2 border-dashed border-gray-300 bg-gray-50 ${className}`}
    >
      <div className="text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-md mx-auto">{description}</p>
        <Link href={buttonLink}>
          <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            {buttonText}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
