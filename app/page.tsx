import HeroLocation from '@/components/HeroLocation'
import TopRatedGrid from '@/components/TopRatedGrid'
import FAQAccordion from '@/components/FAQAccordion'
import ProvincesIndex from '@/components/ProvincesIndex'
import JsonLd from '@/components/SEO/JsonLd'
import { DrivingSchool, FAQ } from '@/lib/types'
import { getAllProvinces } from '@/lib/mock-data'

// Mock data - En un entorno real, esto vendría de la base de datos
const mockSchools: DrivingSchool[] = [
  {
    id: '1',
    name: 'Autoescuela Central',
    slug: 'autoescuela-central',
    rating: 4.8,
    reviewsCount: 1247,
    city: 'Buenos Aires',
    province: 'CABA',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    priceRange: { min: 25000, max: 35000 },
    description: 'Autoescuela con más de 20 años de experiencia',
    address: 'Av. Corrientes 1234',
    phone: '+54 11 1234-5678',
    website: 'https://autoescuelacentral.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Escuela de Manejo del Norte',
    slug: 'escuela-manejo-norte',
    rating: 4.6,
    reviewsCount: 892,
    city: 'Rosario',
    province: 'Santa Fe',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    priceRange: { min: 22000, max: 30000 },
    description: 'Especialistas en clases para principiantes',
    address: 'Av. Pellegrini 5678',
    phone: '+54 341 123-4567',
    website: 'https://escuelanorte.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Autoescuela Premium',
    slug: 'autoescuela-premium',
    rating: 4.9,
    reviewsCount: 1563,
    city: 'Córdoba',
    province: 'Córdoba',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    priceRange: { min: 30000, max: 40000 },
    description: 'Clases personalizadas y vehículos modernos',
    address: 'Av. Colón 9012',
    phone: '+54 351 234-5678',
    website: 'https://autoescuelapremium.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Escuela de Conducción Sur',
    slug: 'escuela-conduccion-sur',
    rating: 4.5,
    reviewsCount: 734,
    city: 'La Plata',
    province: 'Buenos Aires',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
    priceRange: { min: 20000, max: 28000 },
    description: 'Instructores certificados y horarios flexibles',
    address: 'Calle 7 3456',
    phone: '+54 221 345-6789',
    website: 'https://escuelasur.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Autoescuela Express',
    slug: 'autoescuela-express',
    rating: 4.3,
    reviewsCount: 456,
    city: 'Mendoza',
    province: 'Mendoza',
    imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    priceRange: { min: 18000, max: 25000 },
    description: 'Cursos intensivos y preparación para examen',
    address: 'Av. San Martín 7890',
    phone: '+54 261 456-7890',
    website: 'https://autoescuelaexpress.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Escuela de Manejo Profesional',
    slug: 'escuela-manejo-profesional',
    rating: 4.7,
    reviewsCount: 1023,
    city: 'Tucumán',
    province: 'Tucumán',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    priceRange: { min: 24000, max: 32000 },
    description: 'Formación integral para conductores profesionales',
    address: 'Av. Sarmiento 1234',
    phone: '+54 381 567-8901',
    website: 'https://escuelaprofesional.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    name: 'Autoescuela Familiar',
    slug: 'autoescuela-familiar',
    rating: 4.4,
    reviewsCount: 678,
    city: 'Mar del Plata',
    province: 'Buenos Aires',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    priceRange: { min: 21000, max: 29000 },
    description: 'Ambiente familiar y enseñanza personalizada',
    address: 'Av. Constitución 5678',
    phone: '+54 223 678-9012',
    website: 'https://autoescuelafamiliar.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    name: 'Escuela de Conducción Moderna',
    slug: 'escuela-conduccion-moderna',
    rating: 4.6,
    reviewsCount: 845,
    city: 'Salta',
    province: 'Salta',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
    priceRange: { min: 23000, max: 31000 },
    description: 'Tecnología moderna y métodos de enseñanza actualizados',
    address: 'Av. Belgrano 9012',
    phone: '+54 387 789-0123',
    website: 'https://escuelamoderna.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

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

export default function HomePage() {
  const provinces = getAllProvinces()
  
  return (
    <>
      <JsonLd type="FAQPage" data={faqData} />
      <JsonLd type="LocalBusiness" data={{}} />
      <JsonLd type="Organization" data={{}} />
      
      <HeroLocation />
      <TopRatedGrid schools={mockSchools} />
      <FAQAccordion faqs={faqData} />
      <ProvincesIndex provinces={provinces} />
    </>
  )
}
