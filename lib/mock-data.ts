import { DrivingSchool, Province } from './types'
import { createSlug } from './utils'

// Datos simulados para Córdoba
export const cordobaData: Province = {
  id: '6',
  name: 'Córdoba',
  slug: 'cordoba',
  description: 'Córdoba es una de las provincias más importantes de Argentina, conocida por su rica historia, cultura y paisajes únicos. La capital, Córdoba, es una ciudad universitaria vibrante con una gran oferta educativa y cultural.',
  imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop',
  schoolsCount: 67,
  cities: [
    { id: '1', name: 'Córdoba Capital', slug: 'cordoba-capital', schoolsCount: 45 },
    { id: '2', name: 'Villa María', slug: 'villa-maria', schoolsCount: 8 },
    { id: '3', name: 'Río Cuarto', slug: 'rio-cuarto', schoolsCount: 6 },
    { id: '4', name: 'San Francisco', slug: 'san-francisco', schoolsCount: 4 },
    { id: '5', name: 'Villa Carlos Paz', slug: 'villa-carlos-paz', schoolsCount: 4 }
  ]
}

// Autoescuelas simuladas de Córdoba
export const cordobaSchools: DrivingSchool[] = [
  {
    id: '1',
    name: 'Autoescuela Premium Córdoba',
    slug: 'autoescuela-premium-cordoba',
    rating: 4.9,
    reviewsCount: 1563,
    city: 'Córdoba Capital',
    province: 'Córdoba',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    priceMin: 30000,
    priceMax: 40000,
    description: 'Autoescuela Premium Córdoba es la institución líder en formación de conductores en la provincia. Con más de 15 años de experiencia, ofrecemos clases personalizadas con instructores certificados y vehículos modernos.',
    address: 'Av. Colón 1234, Córdoba Capital',
    phone: '+54 351 234-5678',
    email: 'info@autoescuelapremium.com',
    website: 'https://autoescuelapremium.com',
    hours: 'Lunes a Viernes: 08:00 - 18:00, Sábados: 08:00 - 14:00, Domingos: Cerrado',
    services: [
      'Clases teóricas y prácticas',
      'Preparación para examen teórico',
      'Preparación para examen práctico',
      'Clases intensivas',
      'Vehículos modernos',
      'Instructores certificados',
      'Horarios flexibles',
      'Seguimiento personalizado'
    ],
    courses: [
      {
        id: '1',
        name: 'Licencia B - Automóviles',
        description: 'Curso completo para obtener la licencia de conducir para automóviles',
        duration: '20 horas',
        price: 35000,
        includes: ['Clases teóricas', 'Clases prácticas', 'Material de estudio', 'Examen teórico', 'Examen práctico']
      },
      {
        id: '2',
        name: 'Licencia A - Motocicletas',
        description: 'Curso para obtener la licencia de conducir para motocicletas',
        duration: '15 horas',
        price: 25000,
        includes: ['Clases teóricas', 'Clases prácticas', 'Material de estudio', 'Examen teórico', 'Examen práctico']
      }
    ],
    reviews: [
      {
        id: '1',
        userName: 'María González',
        rating: 5,
        comment: 'Excelente autoescuela, los instructores son muy profesionales y pacientes. Logré obtener mi licencia en el primer intento.',
        date: '2024-01-15'
      },
      {
        id: '2',
        userName: 'Carlos Rodríguez',
        rating: 5,
        comment: 'Muy recomendable. Las clases son personalizadas y los vehículos están en perfecto estado. El precio es justo por la calidad del servicio.',
        date: '2024-01-10'
      },
      {
        id: '3',
        userName: 'Ana Martínez',
        rating: 4,
        comment: 'Buena experiencia en general. Los instructores son amables y el proceso es claro. Solo tuve que esperar un poco para conseguir horario.',
        date: '2024-01-05'
      }
    ],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Escuela de Manejo del Centro',
    slug: 'escuela-manejo-centro',
    rating: 4.6,
    reviewsCount: 892,
    city: 'Córdoba Capital',
    province: 'Córdoba',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    priceMin: 25000,
    priceMax: 32000,
    description: 'Ubicada en el corazón de Córdoba Capital, ofrecemos una formación integral para conductores con más de 10 años de experiencia en el mercado.',
    address: 'San Martín 567, Córdoba Capital',
    phone: '+54 351 123-4567',
    email: 'info@escuelacentro.com',
    website: 'https://escuelacentro.com',
    hours: 'Lunes a Viernes: 07:30 - 19:00, Sábados: 08:00 - 16:00, Domingos: Cerrado',
    services: [
      'Clases teóricas y prácticas',
      'Preparación para exámenes',
      'Clases grupales e individuales',
      'Vehículos bien mantenidos',
      'Instructores experimentados',
      'Horarios extendidos',
      'Precios accesibles'
    ],
    courses: [
      {
        id: '3',
        name: 'Licencia B - Automóviles',
        description: 'Curso estándar para licencia de conducir',
        duration: '18 horas',
        price: 28000,
        includes: ['Clases teóricas', 'Clases prácticas', 'Material de estudio']
      }
    ],
    reviews: [
      {
        id: '4',
        userName: 'Luis Fernández',
        rating: 4,
        comment: 'Buena autoescuela, precios accesibles y horarios flexibles. Los instructores son pacientes y explican bien.',
        date: '2024-01-12'
      },
      {
        id: '5',
        userName: 'Sofía López',
        rating: 5,
        comment: 'Excelente atención y servicio. Me ayudaron mucho a superar el miedo a manejar. Muy recomendable.',
        date: '2024-01-08'
      }
    ],
    createdAt: new Date('2022-06-01'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    name: 'Autoescuela Villa María',
    slug: 'autoescuela-villa-maria',
    rating: 4.4,
    reviewsCount: 234,
    city: 'Villa María',
    province: 'Córdoba',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    priceMin: 22000,
    priceMax: 28000,
    description: 'Autoescuela familiar en Villa María, especializada en formar conductores responsables con más de 8 años de experiencia.',
    address: 'Av. Sabattini 890, Villa María',
    phone: '+54 353 456-7890',
    email: 'info@autoescuelavm.com',
    website: 'https://autoescuelavm.com',
    hours: 'Lunes a Viernes: 08:00 - 17:00, Sábados: 08:00 - 12:00, Domingos: Cerrado',
    services: [
      'Clases teóricas y prácticas',
      'Ambiente familiar',
      'Precios competitivos',
      'Atención personalizada',
      'Vehículos en buen estado'
    ],
    courses: [
      {
        id: '4',
        name: 'Licencia B - Automóviles',
        description: 'Curso básico para licencia de conducir',
        duration: '16 horas',
        price: 25000,
        includes: ['Clases teóricas', 'Clases prácticas', 'Material de estudio']
      }
    ],
    reviews: [
      {
        id: '6',
        userName: 'Roberto Silva',
        rating: 4,
        comment: 'Autoescuela familiar con buena atención. Los precios son accesibles y el trato es personalizado.',
        date: '2024-01-14'
      }
    ],
    createdAt: new Date('2021-03-01'),
    updatedAt: new Date('2024-01-16')
  }
]

// Función para obtener datos de una provincia por slug
export function getProvinceBySlug(slug: string): Province | null {
  // Normalizar el slug para manejar acentos y caracteres especiales
  const normalizedSlug = createSlug(slug)
  
  // Verificar múltiples variantes para asegurar compatibilidad
  if (normalizedSlug === 'cordoba' || 
      slug === 'cordoba' || 
      slug === 'córdoba' || 
      slug === 'c%C3%B3rdoba' ||
      slug.includes('cordoba')) {
    return cordobaData
  }
  return null
}

// Función para obtener autoescuelas de una provincia
export function getSchoolsByProvince(provinceSlug: string): DrivingSchool[] {
  // Normalizar el slug para manejar acentos y caracteres especiales
  const normalizedSlug = createSlug(provinceSlug)
  
  // Verificar múltiples variantes para asegurar compatibilidad
  if (normalizedSlug === 'cordoba' || 
      provinceSlug === 'cordoba' || 
      provinceSlug === 'córdoba' || 
      provinceSlug === 'c%C3%B3rdoba' ||
      provinceSlug.includes('cordoba')) {
    return cordobaSchools
  }
  return []
}

// Función para obtener una autoescuela por slug
export function getSchoolBySlug(slug: string): DrivingSchool | null {
  const allSchools = [...cordobaSchools]
  return allSchools.find(school => school.slug === slug) || null
}

// Todas las provincias de Argentina
export const allProvinces: Province[] = [
  { id: '1', name: 'Buenos Aires', slug: 'buenos-aires', description: 'La provincia más poblada de Argentina, con una gran oferta de autoescuelas en toda su extensión.', schoolsCount: 245 },
  { id: '2', name: 'CABA', slug: 'caba', description: 'Ciudad Autónoma de Buenos Aires, el centro urbano más importante del país.', schoolsCount: 89 },
  { id: '3', name: 'Catamarca', slug: 'catamarca', description: 'Provincia del noroeste argentino, conocida por su rica historia y paisajes únicos.', schoolsCount: 12 },
  { id: '4', name: 'Chaco', slug: 'chaco', description: 'Provincia del noreste argentino, con una importante actividad agrícola y forestal.', schoolsCount: 23 },
  { id: '5', name: 'Chubut', slug: 'chubut', description: 'Provincia patagónica conocida por sus paisajes costeros y montañosos.', schoolsCount: 18 },
  { id: '6', name: 'Córdoba', slug: 'cordoba', description: 'Córdoba es una de las provincias más importantes de Argentina, conocida por su rica historia, cultura y paisajes únicos.', schoolsCount: 67, cities: cordobaData.cities },
  { id: '7', name: 'Corrientes', slug: 'corrientes', description: 'Provincia del noreste argentino, conocida por sus esteros y cultura guaraní.', schoolsCount: 34 },
  { id: '8', name: 'Entre Ríos', slug: 'entre-rios', description: 'Provincia mesopotámica entre los ríos Paraná y Uruguay.', schoolsCount: 28 },
  { id: '9', name: 'Formosa', slug: 'formosa', description: 'Provincia del noreste argentino, fronteriza con Paraguay.', schoolsCount: 15 },
  { id: '10', name: 'Jujuy', slug: 'jujuy', description: 'Provincia del noroeste argentino, conocida por la Quebrada de Humahuaca.', schoolsCount: 19 },
  { id: '11', name: 'La Pampa', slug: 'la-pampa', description: 'Provincia de la región pampeana, conocida por su actividad ganadera.', schoolsCount: 14 },
  { id: '12', name: 'La Rioja', slug: 'la-rioja', description: 'Provincia del noroeste argentino, conocida por sus viñedos y montañas.', schoolsCount: 11 },
  { id: '13', name: 'Mendoza', slug: 'mendoza', description: 'Provincia cuyana, famosa por sus vinos y la cordillera de los Andes.', schoolsCount: 45 },
  { id: '14', name: 'Misiones', slug: 'misiones', description: 'Provincia del noreste argentino, conocida por las Cataratas del Iguazú.', schoolsCount: 31 },
  { id: '15', name: 'Neuquén', slug: 'neuquen', description: 'Provincia patagónica, importante centro de la industria petrolera.', schoolsCount: 22 },
  { id: '16', name: 'Río Negro', slug: 'rio-negro', description: 'Provincia patagónica, conocida por sus frutales y turismo.', schoolsCount: 26 },
  { id: '17', name: 'Salta', slug: 'salta', description: 'Provincia del noroeste argentino, conocida por su arquitectura colonial.', schoolsCount: 29 },
  { id: '18', name: 'San Juan', slug: 'san-juan', description: 'Provincia cuyana, importante productora de vinos y frutas.', schoolsCount: 16 },
  { id: '19', name: 'San Luis', slug: 'san-luis', description: 'Provincia cuyana, conocida por sus sierras y lagos.', schoolsCount: 13 },
  { id: '20', name: 'Santa Cruz', slug: 'santa-cruz', description: 'Provincia patagónica, conocida por sus glaciares y paisajes únicos.', schoolsCount: 8 },
  { id: '21', name: 'Santa Fe', slug: 'santa-fe', description: 'Provincia del centro-este argentino, importante centro industrial y agrícola.', schoolsCount: 52 },
  { id: '22', name: 'Santiago del Estero', slug: 'santiago-del-estero', description: 'Provincia del noroeste argentino, una de las más antiguas del país.', schoolsCount: 17 },
  { id: '23', name: 'Tierra del Fuego', slug: 'tierra-del-fuego', description: 'Provincia más austral de Argentina, conocida por su clima extremo.', schoolsCount: 6 },
  { id: '24', name: 'Tucumán', slug: 'tucuman', description: 'Provincia del noroeste argentino, conocida como el Jardín de la República.', schoolsCount: 38 }
]

// Función para obtener todas las provincias
export function getAllProvinces(): Province[] {
  return allProvinces
}

// Función para obtener todas las autoescuelas
export function getAllSchools(): DrivingSchool[] {
  return [...cordobaSchools]
}
