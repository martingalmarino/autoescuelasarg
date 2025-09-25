import ContactPageClient from './ContactPageClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto - Autoescuelas.ar',
  description: 'Contacta con nosotros para consultas, sugerencias o para agregar tu autoescuela al directorio más completo de Argentina.',
  keywords: 'contacto, autoescuelas, consultas, soporte, Argentina',
  openGraph: {
    title: 'Contacto - Autoescuelas.ar',
    description: 'Contacta con nosotros para consultas, sugerencias o para agregar tu autoescuela al directorio más completo de Argentina.',
    type: 'website',
    url: 'https://autoescuelas.ar/contacto',
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
