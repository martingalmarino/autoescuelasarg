import HeroLocation from '@/components/HeroLocation'
import TopRatedGrid from '@/components/TopRatedGrid'
import FAQAccordion from '@/components/FAQAccordion'
import ProvincesIndex from '@/components/ProvincesIndex'
import JsonLd from '@/components/SEO/JsonLd'
import { FAQ } from '@/lib/types'
import { getActiveProvinces, getFeaturedSchools } from '@/lib/database'

// FAQ data - contenido estático que puede quedarse hardcodeado
const faqData: FAQ[] = [
  {
    id: 'faq-1',
    question: '¿A partir de qué edad se puede comenzar a manejar en Argentina?',
    answer: 'En la mayoría de las provincias argentinas, la edad mínima para sacar la licencia de conducir particular (auto) es 17 años con autorización de los padres o 18 años sin autorización. Para motos, puede variar según la cilindrada: algunas categorías se habilitan desde los 16 años.'
  },
  {
    id: 'faq-2',
    question: '¿Qué requisitos necesito para inscribirme en una autoescuela?',
    answer: 'Generalmente se piden: DNI actualizado, certificado de apto médico (otorgado en el municipio), foto carnet, comprobante de domicilio y, en el caso de menores de 18 años, autorización firmada por madre, padre o tutor. Cada municipio puede tener pequeñas variaciones en los requisitos.'
  },
  {
    id: 'faq-3',
    question: '¿Cuánto dura el curso en una escuela de conducir?',
    answer: 'La duración depende de la autoescuela y del paquete contratado. En promedio: clases prácticas entre 5 y 15 clases de 40 a 60 minutos y curso teórico dictado en 2 o 3 jornadas intensivas, o complementado con material online.'
  },
  {
    id: 'faq-4',
    question: '¿El curso incluye el examen de conducir?',
    answer: 'No. El curso de la autoescuela prepara al alumno para el examen, pero el examen teórico y práctico se rinde en la Municipalidad correspondiente. La autoescuela puede ayudarte con turnos y trámites, pero la licencia la otorga el Estado.'
  },
  {
    id: 'faq-5',
    question: '¿Cuánto cuesta aprender a manejar en Argentina?',
    answer: 'Los precios varían según la ciudad y la cantidad de clases. En 2025, un paquete de 10 clases prácticas en una autoescuela suele costar entre $150.000 y $250.000 ARS, incluyendo material teórico. Los cursos más completos (con simulador, clases extras o autos automáticos) pueden superar los $300.000 ARS.'
  }
]

export default async function HomePage() {
  // Obtener datos reales de la base de datos
  const [provinces, featuredSchools] = await Promise.all([
    getActiveProvinces(),
    getFeaturedSchools(8) // Obtener 8 autoescuelas destacadas
  ])

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroLocation />
      
      {/* Top Rated Schools */}
      <TopRatedGrid schools={featuredSchools} />
      
      {/* FAQ Section */}
      <FAQAccordion faqs={faqData} />
      
      {/* Provinces Index */}
      <ProvincesIndex provinces={provinces} />
      
      {/* JSON-LD Structured Data */}
      <JsonLd 
        faqs={faqData}
        organization={{
          name: 'Autoescuelas.ar',
          description: 'El directorio más completo de escuelas de manejo en Argentina',
          url: 'https://autoescuelas.ar',
          logo: 'https://autoescuelas.ar/logo.png',
          contactPoint: {
            telephone: '+54-11-1234-5678',
            contactType: 'customer service',
            email: 'info@autoescuelas.ar'
          }
        }}
      />
    </main>
  )
}