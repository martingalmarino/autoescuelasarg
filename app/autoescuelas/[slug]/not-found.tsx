"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Car } from 'lucide-react'

export default function SchoolNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6 px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🚗</div>
        <h1 className="section-title text-center text-4xl font-extrabold text-navy mb-4">Autoescuela no encontrada</h1>
        <h2 className="text-xl font-bold text-foreground mb-4">
          La autoescuela que buscas no existe
        </h2>
        <p className="text-muted-foreground max-w-md">
          Es posible que la URL esté incorrecta o que la autoescuela no esté disponible en nuestro directorio.
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild>
          <Link href="/autoescuelas">
            <Car className="mr-2 h-4 w-4" />
            Ver todas las autoescuelas
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  )
}
