import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export type Database = {
  public: {
    Tables: {
      provinces: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          schools_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          schools_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          schools_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      cities: {
        Row: {
          id: string
          name: string
          slug: string
          province_id: string
          schools_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          province_id: string
          schools_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          province_id?: string
          schools_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      driving_schools: {
        Row: {
          id: string
          name: string
          slug: string
          rating: number
          reviews_count: number
          city_id: string
          province_id: string
          image_url: string | null
          price_min: number | null
          price_max: number | null
          description: string | null
          address: string | null
          phone: string | null
          email: string | null
          website: string | null
          hours: any | null
          services: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          rating?: number
          reviews_count?: number
          city_id: string
          province_id: string
          image_url?: string | null
          price_min?: number | null
          price_max?: number | null
          description?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          hours?: any | null
          services?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          rating?: number
          reviews_count?: number
          city_id?: string
          province_id?: string
          image_url?: string | null
          price_min?: number | null
          price_max?: number | null
          description?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          hours?: any | null
          services?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
