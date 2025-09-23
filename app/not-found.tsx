"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-foreground">
          Página no encontrada
        </h2>
        <p className="mt-2 text-muted-foreground">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link href="/">
          <Button className="flex items-center space-x-2">
            <Home className="h-4 w-4" />
            <span>Ir al inicio</span>
          </Button>
        </Link>
        
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver atrás</span>
        </Button>
      </div>
    </div>
  )
}
