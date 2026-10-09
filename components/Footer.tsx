import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'
import Logo from '@/components/Logo'

export default function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground" role="contentinfo">
      <div className="lane-divider" />
      <div className="container py-10 sm:py-14 px-4 sm:px-6">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4">
            <Link href="/" className="inline-flex items-center">
              <Logo tone="dark" />
            </Link>
            <p className="text-xs sm:text-sm text-navy-foreground/70">
              El directorio más completo de escuelas de manejo en Argentina. 
              Encuentra la autoescuela perfecta para obtener tu licencia de conducir.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-display font-bold text-sm sm:text-base text-white">Enlaces rápidos</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link 
                  href="/autoescuelas" 
                  className="text-navy-foreground/70 hover:text-signal transition-colors"
                >
                  Todas las autoescuelas
                </Link>
              </li>
              <li>
                <Link 
                  href="/provincias" 
                  className="text-navy-foreground/70 hover:text-signal transition-colors"
                >
                  Buscar por provincia
                </Link>
              </li>
              <li>
                <Link 
                  href="/autoescuelas?sort=rating_desc" 
                  className="text-navy-foreground/70 hover:text-signal transition-colors"
                >
                  Mejor calificadas
                </Link>
              </li>
              <li>
                <Link 
                  href="/test-de-conducir" 
                  className="text-navy-foreground/70 hover:text-signal transition-colors"
                >
                  Test de conducir
                </Link>
              </li>
              <li>
                <Link 
                  href="/productos-para-conductores" 
                  className="text-navy-foreground/70 hover:text-signal transition-colors"
                >
                  Productos recomendados
                </Link>
              </li>
              <li>
                <Link 
                  href="/para-autoescuelas" 
                  className="text-navy-foreground/70 hover:text-signal transition-colors"
                >
                  ¿Tenés una autoescuela?
                </Link>
              </li>
              <li>
                <Link 
                  href="/contacto" 
                  className="text-navy-foreground/70 hover:text-signal transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-display font-bold text-sm sm:text-base text-white">Contacto</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-center space-x-2 text-navy-foreground/70">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>info@autoescuelas.ar</span>
              </li>
              <li className="flex items-center space-x-2 text-navy-foreground/70">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>+54 11 1234-5678</span>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-display font-bold text-sm sm:text-base text-white">Enlaces útiles</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a 
                  href="https://www.guiadelconductor.ar/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy-foreground/70 hover:text-signal transition-colors"
                >
                  Test de conducir Córdoba
                </a>
              </li>
              <li>
                <a 
                  href="https://calculadorapatentes.ar/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy-foreground/70 hover:text-signal transition-colors"
                >
                  Calculadora de Patentes
                </a>
              </li>
              <li>
                <a 
                  href="https://www.patentearba.com/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy-foreground/70 hover:text-signal transition-colors"
                >
                  Patente Arba
                </a>
              </li>
              <li>
                <a 
                  href="https://www.autoschinos.ar/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy-foreground/70 hover:text-signal transition-colors"
                >
                  Autos Chinos en Argentina
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-display font-bold text-sm sm:text-base text-white">Legal</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link 
                  href="/terminos" 
                  className="text-navy-foreground/70 hover:text-signal transition-colors"
                >
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacidad" 
                  className="text-navy-foreground/70 hover:text-signal transition-colors"
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookies" 
                  className="text-navy-foreground/70 hover:text-signal transition-colors"
                >
                  Política de cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 sm:mt-10 border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-navy-foreground/70">
              © 2025 Autoescuelas.ar. Todos los derechos reservados.
            </p>
            <p className="text-xs sm:text-sm text-navy-foreground/70">
              Desarrollado por{" "}
              <a
                href="mailto:m.galmarino@gmail.com"
                className="font-semibold text-white hover:text-signal transition-colors"
              >
                Martín Galmarino
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
