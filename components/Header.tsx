"use client"

import Link from 'next/link'
import { Car, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <Link 
            href="/buscar" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Búsqueda avanzada
          </Link>
        </nav>

        {/* Search and Admin */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
            <Link href="/buscar">
              <Search className="h-4 w-4" />
              <span className="sr-only">Buscar</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-8 px-3 sm:h-10 sm:px-4 text-xs sm:text-sm">
            <Link href="/admin">Admin</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
