import type { SchoolSummary } from '@/lib/types'

const unsplash = (id: string, width = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`

const daysAgo = (now: Date, days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

/** Ficha ficticia para mostrar a las autoescuelas cómo se ve una ficha Premium. */
export function getDemoSchool(now: Date = new Date()) {
  return {
    id: 'demo-autoescuela-modelo',
    name: 'Autoescuela Modelo',
    slug: 'ejemplo-premium',
    rating: 4.8,
    reviewsCount: 127,
    city: 'Córdoba Capital',
    citySlug: 'cordoba-capital',
    province: 'Córdoba',
    provinceSlug: 'cordoba',
    imageUrl: unsplash('1541899481282-d53bffe3c35d', 1600),
    logoUrl: '/images/demo/autoescuela-modelo.svg',
    priceMin: 25000,
    priceMax: 240000,
    description:
      '<p>Somos una escuela de manejo familiar con más de quince años enseñando a manejar en Córdoba. ' +
      'Nuestros instructores te acompañan desde la primera clase hasta el examen municipal, con autos ' +
      'doble comando y a tu ritmo.</p>' +
      '<p>Trabajamos con <strong>clases personalizadas</strong>: practicamos en calles con tránsito, ' +
      'estacionamiento, rotondas y ruta, para que llegues al examen con confianza.</p>',
    address: 'Av. Colón 1250',
    phone: '0351 456-7890',
    email: 'hola@autoescuelamodelo.com.ar',
    website: 'https://www.autoescuelamodelo.com.ar',
    hours: 'Lunes a viernes de 8 a 20 h · Sábados de 9 a 13 h',
    services: ['Clases prácticas', 'Curso teórico', 'Preparación para el examen', 'Clases de perfeccionamiento'],
    isActive: true,
    isVerified: true,
    isFeatured: true,
    isClaimed: true,
    isPremium: true,
    whatsapp: '351 456-7890',
    gallery: [
      unsplash('1449965408869-eaa3f722e40d'),
      unsplash('1541899481282-d53bffe3c35d'),
      unsplash('1506521781263-d8422e82f27a'),
      unsplash('1471444928139-48c5bf5173f8'),
      unsplash('1519003722824-194d4455a60c'),
      unsplash('1485463611174-f302f6a5c1c9'),
    ],
    videoUrl: null,
    promotion: '15% de descuento en el curso completo para inscripciones de este mes, y la clase de evaluación sin cargo.',
    faqs: [
      {
        question: '¿Las clases son en autos doble comando?',
        answer: 'Sí. Todas las clases prácticas son en autos con doble comando, así el instructor puede frenar si hace falta.',
      },
      {
        question: '¿Me pueden buscar por mi casa?',
        answer: 'Sí, te buscamos y te llevamos de vuelta dentro de Córdoba Capital, sin costo adicional.',
      },
      {
        question: '¿Puedo rendir el examen con el auto de la autoescuela?',
        answer: 'Sí. Te acompañamos al examen práctico municipal y podés rendirlo con el mismo auto con el que practicaste.',
      },
      {
        question: 'Tengo miedo de manejar, ¿es para mí?',
        answer: 'Claro. Empezamos en calles tranquilas y vamos sumando dificultad cuando te sientas cómodo.',
      },
    ],
    features: [
      'Auto con doble comando',
      'Auto manual',
      'Auto automático',
      'Retiro a domicilio',
      'Clases los fines de semana',
      'Acompañamiento al examen práctico',
      'Clases para personas con miedo a manejar',
    ],
    foundedYear: now.getFullYear() - 18,
    licenseNumber: 'CBA-0427',
    courses: [
      {
        id: 'demo-curso-completo',
        name: 'Curso completo Licencia B',
        description: 'Desde cero hasta el examen: teoría, práctica en ciudad y ruta, y acompañamiento al examen.',
        duration: 10,
        price: 240000,
        includes: ['10 clases prácticas', 'Curso teórico', 'Simulacro de examen', 'Auto para el examen'],
      },
      {
        id: 'demo-perfeccionamiento',
        name: 'Perfeccionamiento',
        description: 'Para quienes ya tienen registro y quieren ganar confianza en el tránsito.',
        duration: 4,
        price: 98000,
        includes: ['4 clases prácticas', 'Estacionamiento', 'Manejo en ruta'],
      },
      {
        id: 'demo-clase-suelta',
        name: 'Clase suelta',
        description: 'Una clase práctica para repasar antes del examen.',
        duration: 1,
        price: 25000,
        includes: ['Retiro a domicilio'],
      },
    ],
    reviews: [
      {
        id: 'demo-resena-1',
        rating: 5,
        author: 'Camila R.',
        comment: 'Llegué con mucho miedo y rendí a la primera. El instructor tiene una paciencia enorme.',
        createdAt: daysAgo(now, 6),
      },
      {
        id: 'demo-resena-2',
        rating: 5,
        author: 'Martín G.',
        comment: 'Muy buena atención por WhatsApp, me organizaron las clases según mis horarios de trabajo.',
        createdAt: daysAgo(now, 19),
      },
      {
        id: 'demo-resena-3',
        rating: 4,
        author: 'Lucía F.',
        comment: 'Los autos impecables y las clases en ruta me sirvieron muchísimo.',
        createdAt: daysAgo(now, 41),
      },
    ],
  }
}

export type DemoSchool = ReturnType<typeof getDemoSchool>

const competitor = (number: number, name: string, rating: number, reviewsCount: number): SchoolSummary => ({
  id: `demo-competidora-${number}`,
  name,
  slug: `demo-competidora-${number}`,
  rating,
  reviewsCount,
  city: 'Córdoba Capital',
  citySlug: 'cordoba-capital',
  province: 'Córdoba',
  provinceSlug: 'cordoba',
  imageUrl: null,
  logoUrl: null,
  priceMin: 90000 + number * 15000,
  priceMax: 200000 + number * 15000,
  description: null,
  phone: null,
  email: null,
  isFeatured: number === 1,
  isVerified: false,
})

/** Autoescuelas ficticias que aparecen al pie de una ficha gratis. */
export const DEMO_COMPETITORS: SchoolSummary[] = [
  competitor(1, 'Autoescuela competidora A', 4.6, 88),
  competitor(2, 'Autoescuela competidora B', 4.3, 52),
  competitor(3, 'Autoescuela competidora C', 4.1, 35),
]
