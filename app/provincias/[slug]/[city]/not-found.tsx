import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-navy rounded-2xl shadow-card-hover flex items-center justify-center">
          <MapPin className="h-12 w-12 text-signal" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-foreground mb-4">
          Ciudad no encontrada
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          La ciudad que buscas no existe o no está disponible en nuestro directorio.
        </p>
        
        <div className="space-x-4">
          <Link href="/provincias">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ver todas las provincias
            </Button>
          </Link>
          
          <Link href="/autoescuelas">
            <Button>
              Ver todas las autoescuelas
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
