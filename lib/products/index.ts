import type { Product, ProductCategory } from './types'

export type { Product, ProductBadge, ProductCategory, ProductCategoryId } from './types'

/** Fecha en que se revisaron por última vez los precios de referencia (AAAA-MM-DD). */
export const PRICES_CHECKED_ON = '2026-10-09'

export const productCategories: ProductCategory[] = [
  { id: 'neumaticos', name: 'Neumáticos y aire' },
  { id: 'bateria', name: 'Batería y arranque' },
  { id: 'limpieza', name: 'Limpieza y lavado' },
  { id: 'seguridad', name: 'Seguridad y emergencias' },
  { id: 'accesorios', name: 'Accesorios' },
]

export const products: Product[] = [
  {
    id: 'compresor-gadnic',
    title: 'Compresor de aire portátil Gadnic para neumáticos, 150 PSI con pantalla LCD',
    category: 'neumaticos',
    url: 'https://meli.la/2YLHPCi',
    image: 'https://http2.mlstatic.com/D_NQ_NP_888368-MLA110992831005_042026-O.webp',
    seller: 'Gadnic',
    price: 53721,
    originalPrice: 105599,
    installments: { count: 6, amount: 12086 },
    badge: 'Más vendido',
    note: 'Para controlar y corregir la presión en casa o en la ruta, sin depender de una estación de servicio.',
  },
  {
    id: 'arrancador-smartbit',
    title: 'Arrancador de batería Smartbit Maxcharge 4 en 1 con compresor, power bank y linterna',
    category: 'bateria',
    url: 'https://meli.la/1NJN5qE',
    image: 'https://http2.mlstatic.com/D_NQ_NP_953033-MLA105900826976_022026-O.webp',
    seller: 'SmartBit',
    price: 184290,
    originalPrice: 199990,
    installments: { count: 6, amount: 41462 },
    badge: 'Más vendido',
    note: 'Te permite arrancar con la batería descargada sin necesitar otro auto, y además infla neumáticos y carga el celular.',
  },
  {
    id: 'kit-lavado-toxic-shine',
    title: 'Kit de lavado para auto Toxic Shine Premium completo',
    category: 'limpieza',
    url: 'https://meli.la/1CUxxH9',
    image: 'https://http2.mlstatic.com/D_NQ_NP_738912-MLA116940999494_092026-O.webp',
    seller: 'Herman Repuestos',
    price: 68742,
    originalPrice: 101250,
    installments: { count: 6, amount: 15466 },
    badge: 'Más vendido',
    note: 'Reúne en un solo kit los productos para lavar y cuidar el auto en casa.',
  },
]

export function discountPercentage(product: Product): number | null {
  if (!product.price || !product.originalPrice || product.originalPrice <= product.price) return null
  return Math.floor((1 - product.price / product.originalPrice) * 100)
}
