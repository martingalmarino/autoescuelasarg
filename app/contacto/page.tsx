import ContactPageClient from './ContactPageClient'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  titleVariants: ['Contacto: sumá tu autoescuela al directorio'],
  description:
    'Escribinos para sumar tu autoescuela o escuela de manejo al directorio más completo de Argentina, actualizar sus datos o hacernos consultas y sugerencias.',
  path: '/contacto',
})

export default function ContactPage() {
  return <ContactPageClient />
}
