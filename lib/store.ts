"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Location } from './types'

interface AppState {
  selectedLocation: Location | null
  setSelectedLocation: (location: Location | null) => void
  clearLocation: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedLocation: null,
      setSelectedLocation: (location) => set({ selectedLocation: location }),
      clearLocation: () => set({ selectedLocation: null }),
    }),
    {
      name: 'autoescuelas-location',
    }
  )
)
