"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { analyticsEvents } from '@/lib/analytics'
import { createSlug } from '@/lib/utils'

const PROVINCES = [
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
  'CABA'
]

export default function HeroLocation() {
  const [selectedProvince, setSelectedProvince] = useState<string>('Argentina')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleViewAll = () => {
    if (selectedProvince && selectedProvince !== 'Argentina') {
      const provinceSlug = createSlug(selectedProvince)
      router.push(`/provincias/${provinceSlug}`)
    } else {
      router.push('/provincias')
    }
    analyticsEvents.ctaViewAll('hero')
  }

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province)
    setIsDropdownOpen(false)
    analyticsEvents.selectLocation(province)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop&crop=center')"
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-tight">
            Encuentra tu autoescuela{' '}
            <span className="text-yellow-400">estés donde estés</span>
            <span className="text-white/80">…</span>
          </h1>

          {/* Location Selector */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 border border-white/20 hover:bg-white/20 transition-colors"
              >
                <span className="text-white font-medium text-sm sm:text-base">{selectedProvince}</span>
                <ChevronDown className={`h-4 w-4 text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 w-[320px] sm:w-[400px] md:w-[500px] max-w-[90vw] max-h-96 overflow-y-auto z-50">
                  <div className="p-3 sm:p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 sm:gap-2">
                      {PROVINCES.map((province) => (
                        <button
                          key={province}
                          onClick={() => handleProvinceSelect(province)}
                          className={`text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm transition-colors ${
                            selectedProvince === province
                              ? 'bg-blue-100 text-blue-800 font-semibold'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {province}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-3 sm:space-y-4">
            <Button
              size="lg"
              onClick={handleViewAll}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl w-full sm:w-auto"
            >
              <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              VER TODAS
            </Button>
            <p className="text-white/90 text-xs sm:text-sm">
              ¡Sí, es 100% gratis!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
