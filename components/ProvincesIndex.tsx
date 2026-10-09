"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Province } from "@/lib/types";
import { analyticsEvents } from "@/lib/analytics";

interface ProvincesIndexProps {
  provinces: Province[];
}

const defaultProvinces: Province[] = [
  { id: "1", name: "Buenos Aires", slug: "buenos-aires", schoolsCount: 245 },
  { id: "2", name: "CABA", slug: "caba", schoolsCount: 89 },
  { id: "3", name: "Catamarca", slug: "catamarca", schoolsCount: 12 },
  { id: "4", name: "Chaco", slug: "chaco", schoolsCount: 23 },
  { id: "5", name: "Chubut", slug: "chubut", schoolsCount: 18 },
  { id: "6", name: "Córdoba", slug: "cordoba", schoolsCount: 67 },
  { id: "7", name: "Corrientes", slug: "corrientes", schoolsCount: 34 },
  { id: "8", name: "Entre Ríos", slug: "entre-rios", schoolsCount: 28 },
  { id: "9", name: "Formosa", slug: "formosa", schoolsCount: 15 },
  { id: "10", name: "Jujuy", slug: "jujuy", schoolsCount: 19 },
  { id: "11", name: "La Pampa", slug: "la-pampa", schoolsCount: 14 },
  { id: "12", name: "La Rioja", slug: "la-rioja", schoolsCount: 11 },
  { id: "13", name: "Mendoza", slug: "mendoza", schoolsCount: 45 },
  { id: "14", name: "Misiones", slug: "misiones", schoolsCount: 31 },
  { id: "15", name: "Neuquén", slug: "neuquen", schoolsCount: 22 },
  { id: "16", name: "Río Negro", slug: "rio-negro", schoolsCount: 26 },
  { id: "17", name: "Salta", slug: "salta", schoolsCount: 29 },
  { id: "18", name: "San Juan", slug: "san-juan", schoolsCount: 16 },
  { id: "19", name: "San Luis", slug: "san-luis", schoolsCount: 13 },
  { id: "20", name: "Santa Cruz", slug: "santa-cruz", schoolsCount: 8 },
  { id: "21", name: "Santa Fe", slug: "santa-fe", schoolsCount: 52 },
  {
    id: "22",
    name: "Santiago del Estero",
    slug: "santiago-del-estero",
    schoolsCount: 17,
  },
  {
    id: "23",
    name: "Tierra del Fuego",
    slug: "tierra-del-fuego",
    schoolsCount: 6,
  },
  { id: "24", name: "Tucumán", slug: "tucuman", schoolsCount: 38 },
];

export default function ProvincesIndex({
  provinces = defaultProvinces,
}: ProvincesIndexProps) {
  const handleProvinceClick = (province: Province) => {
    analyticsEvents.provinceLinkClick(province.name);
  };

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {provinces.map((province) => (
        <Link
          key={province.id}
          href={`/provincias/${province.slug}`}
          onClick={() => handleProvinceClick(province)}
          className="surface-card surface-card-hover group relative flex items-center justify-between overflow-hidden p-4 sm:p-5"
        >
          <div className="relative flex items-center space-x-3 sm:space-x-4">
            <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg shadow-sm transition-colors duration-200 group-hover:bg-primary ${province.schoolsCount === 0 ? "bg-muted" : "bg-navy"}`}>
              <MapPin className={`h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 group-hover:scale-110 group-hover:text-signal ${province.schoolsCount === 0 ? "text-muted-foreground" : "text-signal"}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors duration-200">
                {province.name}
              </h3>
              <p className="mt-1 inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors duration-200 group-hover:bg-accent group-hover:text-primary">
                {province.schoolsCount} autoescuelas
              </p>
            </div>
          </div>
          
          {/* Enhanced arrow with animation */}
          <div className="relative text-muted-foreground group-hover:text-primary transition-all duration-200 text-lg sm:text-xl group-hover:translate-x-1">
            →
          </div>
          
          {/* Subtle border accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-signal opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </Link>
      ))}
    </div>
  );
}
