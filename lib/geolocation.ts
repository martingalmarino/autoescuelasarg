"use client"

export interface GeolocationResult {
  success: boolean
  data?: {
    lat: number
    lng: number
    city?: string
    province?: string
    address?: string
  }
  error?: string
}

export const getCurrentLocation = (): Promise<GeolocationResult> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        success: false,
        error: 'La geolocalización no está disponible en tu navegador'
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // En un entorno real, aquí harías una llamada a una API de geocodificación inversa
          // como Google Maps Geocoding API o OpenStreetMap Nominatim
          const mockLocation = await reverseGeocode(latitude, longitude)
          
          resolve({
            success: true,
            data: {
              lat: latitude,
              lng: longitude,
              ...mockLocation
            }
          })
        } catch (error) {
          resolve({
            success: false,
            error: 'Error al obtener la ubicación'
          })
        }
      },
      (error) => {
        let errorMessage = 'Error al obtener la ubicación'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Ubicación no disponible'
            break
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado'
            break
        }
        
        resolve({
          success: false,
          error: errorMessage
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

// Mock function - En un entorno real, esto sería una llamada a una API de geocodificación
const reverseGeocode = async (lat: number, lng: number): Promise<{
  city: string
  province: string
  address: string
}> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock data basado en coordenadas aproximadas
  if (lat > -35 && lat < -34 && lng > -59 && lng < -58) {
    return {
      city: 'Buenos Aires',
      province: 'CABA',
      address: 'Ciudad Autónoma de Buenos Aires'
    }
  } else if (lat > -35 && lat < -33 && lng > -61 && lng < -59) {
    return {
      city: 'La Plata',
      province: 'Buenos Aires',
      address: 'La Plata, Buenos Aires'
    }
  } else if (lat > -33 && lat < -32 && lng > -61 && lng < -60) {
    return {
      city: 'Rosario',
      province: 'Santa Fe',
      address: 'Rosario, Santa Fe'
    }
  } else if (lat > -32 && lat < -30 && lng > -65 && lng < -63) {
    return {
      city: 'Córdoba',
      province: 'Córdoba',
      address: 'Córdoba Capital'
    }
  } else if (lat > -33 && lat < -32 && lng > -69 && lng < -67) {
    return {
      city: 'Mendoza',
      province: 'Mendoza',
      address: 'Mendoza Capital'
    }
  }
  
  // Default fallback
  return {
    city: 'Buenos Aires',
    province: 'CABA',
    address: 'Ciudad Autónoma de Buenos Aires'
  }
}
