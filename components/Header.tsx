"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Car, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/autoescuelas?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary">
            <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-foreground">
            Autoescuelas.ar
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <Link 
            href="/autoescuelas" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Todas las autoescuelas
          </Link>
          <Link 
            href="/provincias" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Por provincia
          </Link>
        </nav>

        {/* Search */}
        <div className="flex items-center">
          {/* Search - Always visible */}
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Buscar autoescuelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 sm:w-64 h-9"
            />
            <Button type="submit" size="sm" className="h-9">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}