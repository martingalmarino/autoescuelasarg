export interface DrivingSchool {
  id: string
  name: string
  slug: string
  rating: number
  reviewsCount: number
  city: string
  province: string
  imageUrl?: string | null
  logoUrl?: string | null
  priceMin?: number | null
  priceMax?: number | null
  description?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  hours?: string
  services?: string[]
  courses?: Course[]
  reviews?: Review[]
  isActive?: boolean
  isVerified?: boolean
  isFeatured?: boolean
  sortOrder?: number
  metaTitle?: string | null
  metaDescription?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Course {
  id: string
  name: string
  description: string
  duration: string
  price: number
  includes: string[]
}

export interface Review {
  id: string
  userName: string
  rating: number
  comment: string
  date: string
}

export interface City {
  id: string
  name: string
  slug: string
  schoolsCount: number
}

export interface Province {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  schoolsCount: number
  cities?: City[]
}

export interface Location {
  province?: string
  city?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
}
