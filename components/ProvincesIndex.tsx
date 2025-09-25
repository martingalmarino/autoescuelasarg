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
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {provinces.map((province) => (
        <Link
          key={province.id}
          href={`/provincias/${province.slug}`}
          onClick={() => handleProvinceClick(province)}
          className="group flex items-center justify-between rounded-lg border bg-card p-3 sm:p-4 transition-all duration-200 hover:shadow-md hover:border-primary/50"
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                {province.name}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {province.schoolsCount} autoescuelas
              </p>
            </div>
          </div>
          <div className="text-muted-foreground group-hover:text-primary transition-colors text-sm sm:text-base">
            →
          </div>
        </Link>
      ))}
    </div>
  );
}
