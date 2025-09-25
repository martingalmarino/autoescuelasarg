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
          className="group relative flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 sm:p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/30"
        >
          {/* Subtle background gradient on hover */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-blue-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative flex items-center space-x-3 sm:space-x-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/25 group-hover:from-primary/25 group-hover:to-primary/35 transition-all duration-300 shadow-sm">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-primary transition-colors duration-300">
                {province.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 group-hover:text-primary/80 transition-colors duration-300">
                {province.schoolsCount} autoescuelas
              </p>
            </div>
          </div>
          
          {/* Enhanced arrow with animation */}
          <div className="relative text-gray-400 group-hover:text-primary transition-all duration-300 text-lg sm:text-xl group-hover:translate-x-1">
            →
          </div>
          
          {/* Subtle border accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      ))}
    </div>
  );
}
