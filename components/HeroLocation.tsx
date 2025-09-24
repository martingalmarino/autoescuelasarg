"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, ChevronDown, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProvinces, setFilteredProvinces] = useState(PROVINCES)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Filter provinces based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProvinces(PROVINCES)
    } else {
      const filtered = PROVINCES.filter(province =>
        province.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProvinces(filtered)
    }
  }, [searchTerm])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isDropdownOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
        setSearchTerm('')
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
        setSearchTerm('')
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
    setSearchTerm('')
    analyticsEvents.selectLocation(province)
  }

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
    if (!isDropdownOpen) {
      setSearchTerm('')
    }
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
                onClick={handleDropdownToggle}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 border border-white/20 hover:bg-white/20 transition-colors min-w-[200px] sm:min-w-[250px]"
              >
                <span className="text-white font-medium text-sm sm:text-base truncate">{selectedProvince}</span>
                <ChevronDown className={`h-4 w-4 text-white transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 w-[320px] sm:w-[400px] md:w-[500px] max-w-[90vw] max-h-[400px] overflow-hidden z-50">
                  {/* Search Header */}
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Buscar provincia..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-10 h-9 text-sm"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Provinces List */}
                  <div className="max-h-[300px] overflow-y-auto">
                    {filteredProvinces.length > 0 ? (
                      <div className="p-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 sm:gap-2">
                          {filteredProvinces.map((province) => (
                            <button
                              key={province}
                              onClick={() => handleProvinceSelect(province)}
                              className={`text-left px-2 sm:px-3 py-2 rounded text-xs sm:text-sm transition-colors hover:scale-105 transform ${
                                selectedProvince === province
                                  ? 'bg-blue-100 text-blue-800 font-semibold border border-blue-200'
                                  : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                              }`}
                            >
                              {province}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <p className="text-sm">No se encontraron provincias</p>
                        <p className="text-xs text-gray-400 mt-1">Intenta con otro término de búsqueda</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-500 text-center">
                      {filteredProvinces.length} de {PROVINCES.length} provincias
                    </p>
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
