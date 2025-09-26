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
        className={`my-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg ${className}`}
      >
        <p className="text-sm text-blue-800 mb-2">
          <strong>💡 Tip:</strong> {description}
        </p>
        <Link href={buttonLink}>
          <Button
            size="sm"
            variant="outline"
            className="text-blue-600 border-blue-300 hover:bg-blue-100"
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
        className={`my-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 ${className}`}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="flex items-center space-x-4">
              <Link href={buttonLink}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  {buttonText}
                </Button>
              </Link>
              <div className="flex items-center text-sm text-gray-500">
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
      className={`my-8 p-6 border-2 border-dashed border-gray-300 bg-gray-50 ${className}`}
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-primary-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 max-w-md mx-auto">{description}</p>
        <Link href={buttonLink}>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            {buttonText}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
