"use client"

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6 px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">
          ¡Ups! Algo salió mal
        </h2>
        <p className="mt-2 text-muted-foreground">
          Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Detalles del error (desarrollo)
            </summary>
            <pre className="mt-2 rounded bg-muted p-4 text-xs text-muted-foreground">
              {error.message}
            </pre>
          </details>
        )}
      </div>
      
      <Button 
        onClick={reset}
        className="flex items-center space-x-2"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Intentar nuevamente</span>
      </Button>
    </div>
  )
}
