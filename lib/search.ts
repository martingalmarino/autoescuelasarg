import { MeiliSearch } from 'meilisearch'

// Configuración del cliente de Meilisearch
const client = process.env.MEILISEARCH_HOST && process.env.MEILISEARCH_API_KEY 
  ? new MeiliSearch({
      host: process.env.MEILISEARCH_HOST,
      apiKey: process.env.MEILISEARCH_API_KEY,
    })
  : null

// Índices
export const searchIndexes = {
  schools: 'schools',
  provinces: 'provinces',
  cities: 'cities'
} as const

// Cliente de búsqueda
export const searchClient = client

// Tipos para la búsqueda
export interface SearchSchool {
  id: string
  name: string
  slug: string
  description: string | null
  rating: number
  reviewsCount: number
  city: string
  province: string
  priceMin: number | null
  priceMax: number | null
  imageUrl: string | null
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  services: string[] | null
}

export interface SearchProvince {
  id: string
  name: string
  slug: string
  description: string | null
  schoolsCount: number
  imageUrl: string | null
}

export interface SearchCity {
  id: string
  name: string
  slug: string
  province: string
  provinceSlug: string
  schoolsCount: number
}

// Funciones de búsqueda
export async function searchSchools(query: string, filters?: {
  province?: string
  city?: string
  minRating?: number
  maxPrice?: number
  minPrice?: number
}) {
  if (!searchClient) {
    return { hits: [], totalHits: 0, processingTimeMs: 0 }
  }
  
  try {
    const index = searchClient.index(searchIndexes.schools)
    
    let searchParams: any = {
      q: query,
      limit: 20,
      attributesToRetrieve: ['*'],
      attributesToHighlight: ['name', 'description', 'city', 'province'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    }

    // Aplicar filtros
    if (filters) {
      const filterArray = []
      
      if (filters.province) {
        filterArray.push(`province = "${filters.province}"`)
      }
      
      if (filters.city) {
        filterArray.push(`city = "${filters.city}"`)
      }
      
      if (filters.minRating) {
        filterArray.push(`rating >= ${filters.minRating}`)
      }
      
      if (filters.minPrice) {
        filterArray.push(`priceMin >= ${filters.minPrice}`)
      }
      
      if (filters.maxPrice) {
        filterArray.push(`priceMax <= ${filters.maxPrice}`)
      }
      
      if (filterArray.length > 0) {
        searchParams.filter = filterArray.join(' AND ')
      }
    }

    const results = await index.search(query, searchParams)
    return results
  } catch (error) {
    console.error('Error searching schools:', error)
    return { hits: [], totalHits: 0, processingTimeMs: 0 }
  }
}

export async function searchProvinces(query: string) {
  if (!searchClient) {
    return { hits: [], totalHits: 0, processingTimeMs: 0 }
  }
  
  try {
    const index = searchClient.index(searchIndexes.provinces)
    
    const results = await index.search(query, {
      limit: 10,
      attributesToRetrieve: ['*'],
      attributesToHighlight: ['name', 'description'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    })
    
    return results
  } catch (error) {
    console.error('Error searching provinces:', error)
    return { hits: [], totalHits: 0, processingTimeMs: 0 }
  }
}

export async function searchCities(query: string, province?: string) {
  if (!searchClient) {
    return { hits: [], totalHits: 0, processingTimeMs: 0 }
  }
  
  try {
    const index = searchClient.index(searchIndexes.cities)
    
    let searchParams: any = {
      q: query,
      limit: 15,
      attributesToRetrieve: ['*'],
      attributesToHighlight: ['name', 'province'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    }

    if (province) {
      searchParams.filter = `province = "${province}"`
    }

    const results = await index.search(query, searchParams)
    return results
  } catch (error) {
    console.error('Error searching cities:', error)
    return { hits: [], totalHits: 0, processingTimeMs: 0 }
  }
}

// Función para indexar datos
export async function indexSchools(schools: SearchSchool[]) {
  if (!searchClient) {
    console.log('⚠️ Meilisearch not configured, skipping indexing')
    return
  }
  
  try {
    const index = searchClient.index(searchIndexes.schools)
    
    // Configurar el índice
    await index.updateSettings({
      searchableAttributes: ['name', 'description', 'city', 'province', 'address'],
      filterableAttributes: ['province', 'city', 'rating', 'priceMin', 'priceMax'],
      sortableAttributes: ['rating', 'reviewsCount', 'priceMin', 'priceMax'],
      displayedAttributes: ['*'],
    })
    
    // Indexar los datos
    await index.addDocuments(schools)
    
    console.log(`✅ Indexed ${schools.length} schools`)
  } catch (error) {
    console.error('Error indexing schools:', error)
  }
}

export async function indexProvinces(provinces: SearchProvince[]) {
  if (!searchClient) {
    console.log('⚠️ Meilisearch not configured, skipping indexing')
    return
  }
  
  try {
    const index = searchClient.index(searchIndexes.provinces)
    
    await index.updateSettings({
      searchableAttributes: ['name', 'description'],
      filterableAttributes: ['schoolsCount'],
      sortableAttributes: ['name', 'schoolsCount'],
      displayedAttributes: ['*'],
    })
    
    await index.addDocuments(provinces)
    
    console.log(`✅ Indexed ${provinces.length} provinces`)
  } catch (error) {
    console.error('Error indexing provinces:', error)
  }
}

export async function indexCities(cities: SearchCity[]) {
  if (!searchClient) {
    console.log('⚠️ Meilisearch not configured, skipping indexing')
    return
  }
  
  try {
    const index = searchClient.index(searchIndexes.cities)
    
    await index.updateSettings({
      searchableAttributes: ['name', 'province'],
      filterableAttributes: ['province', 'provinceSlug'],
      sortableAttributes: ['name', 'schoolsCount'],
      displayedAttributes: ['*'],
    })
    
    await index.addDocuments(cities)
    
    console.log(`✅ Indexed ${cities.length} cities`)
  } catch (error) {
    console.error('Error indexing cities:', error)
  }
}
