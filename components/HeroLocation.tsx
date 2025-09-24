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
  const buttonRef = useRef<HTMLButtonElement>(null)
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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isDropdownOpen) return

      if (event.key === 'Escape') {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDropdownOpen])

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
    
    // Navegar directamente a la provincia seleccionada
    if (province !== 'Argentina') {
      const provinceSlug = createSlug(province)
      router.push(`/provincias/${provinceSlug}`)
    }
  }

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <section className="relative min-h-[70vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:bg-center"
        style={{
          backgroundImage: "url('/images/hero-image.jpg')",
          backgroundPosition: "center top",
          backgroundSize: "cover"
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 sm:bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center py-6 sm:py-8 md:py-0">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-tight">
            Encontrá tu autoescuela{' '}
            <span className="text-yellow-400">estés donde estés</span>
            <span className="text-white/80">…</span>
          </h1>

          {/* Location Selector */}
          <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 flex justify-center">
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={handleDropdownToggle}
                className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 sm:px-4 md:px-6 py-2 sm:py-3 border border-white/20 hover:bg-white/20 transition-colors min-w-[140px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[250px]"
              >
                <span className="text-white font-medium text-xs sm:text-sm md:text-base">{selectedProvince}</span>
                <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 text-white transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown - Ahora relativo al botón */}
              {isDropdownOpen && (
                <div 
                  ref={dropdownRef}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 w-[350px] sm:w-[400px] max-w-[85vw] max-h-[350px] z-50"
                  style={{
                    // Asegurar que no se corte en pantallas pequeñas
                    maxHeight: 'calc(100vh - 200px)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Provinces List */}
                  <div className="max-h-[300px] overflow-y-auto">
                    {PROVINCES.length > 0 ? (
                      <div className="p-4">
                        <div className="grid grid-cols-3 gap-2">
                          {PROVINCES.map((province, index) => (
                            <button
                              key={province}
                              onClick={() => handleProvinceSelect(province)}
                              className={`text-left px-2 py-2 text-xs transition-colors hover:bg-gray-50 rounded ${
                                selectedProvince === province
                                  ? 'text-black font-medium underline bg-blue-50'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                              title={`${index + 1}. ${province}`}
                            >
                              {province}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <p className="text-sm">No hay provincias disponibles</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <Button
              size="lg"
              onClick={handleViewAll}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl w-auto mx-auto block sm:inline-block min-w-[140px] sm:min-w-[160px] md:min-w-[200px] lg:min-w-[240px] h-auto min-h-[48px] sm:min-h-[52px] md:min-h-[56px] flex items-center justify-center"
            >
              <MapPin className="mr-2 sm:mr-3 md:mr-4 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0" />
              <span>VER TODAS</span>
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
