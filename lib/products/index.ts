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
    discount: 49,
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
    discount: 7,
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
    discount: 32,
    installments: { count: 6, amount: 15466 },
    badge: 'Más vendido',
    note: 'Reúne en un solo kit los productos para lavar y cuidar el auto en casa.',
  },
  {
    id: 'aspiradora-yelmo',
    title: 'Aspiradora para auto Yelmo AS-3240 recargable por USB',
    category: 'limpieza',
    url: 'https://meli.la/2t8ypc1',
    image: 'https://http2.mlstatic.com/D_NQ_NP_622390-MLA115077354443_072026-O.webp',
    price: 41000,
    originalPrice: 77349,
    discount: 46,
    badge: 'Más vendido',
    note: 'Inalámbrica y recargable por USB: práctica para limpiar asientos y alfombras entre lavado y lavado.',
  },
  {
    id: 'kit-seguridad-ever-safe',
    title: 'Kit de seguridad complementario para auto con baliza, chaleco y botiquín',
    category: 'seguridad',
    url: 'https://meli.la/18anZc7',
    image: 'https://http2.mlstatic.com/D_NQ_NP_857642-MLA117663268671_092026-O.webp',
    seller: 'Ever Safe',
    price: 19899,
    originalPrice: 23000,
    discount: 13,
    badge: 'Más vendido',
    note: 'Para tener a mano baliza, chaleco reflectivo y botiquín ante un desperfecto o un accidente en la ruta.',
  },
  {
    id: 'butaca-booster-mega-baby',
    title: 'Butaca booster Mega Baby Daytona i-Size para chicos de 9 a 36 kg',
    category: 'seguridad',
    url: 'https://meli.la/2ZB4BvX',
    image: 'https://http2.mlstatic.com/D_NQ_NP_953367-MLA111275978301_052026-O.webp',
    seller: 'Bukito',
    price: 106050,
    originalPrice: 124764,
    discount: 14,
    installments: { count: 6, amount: 23859 },
    badge: 'Más vendido',
    note: 'Acompaña al chico desde los 9 hasta los 36 kg. Los menores deben viajar atrás, en un sistema de retención acorde a su peso y talla.',
  },
  {
    id: 'soporte-celular-sopapa',
    title: 'Soporte de celular para auto con sopapa y brazo extensible 360°',
    category: 'accesorios',
    url: 'https://meli.la/2PyZi32',
    image: 'https://http2.mlstatic.com/D_NQ_NP_969556-MLA85303893916_062025-O.webp',
    seller: 'IEY',
    price: 18924,
    originalPrice: 23363,
    discount: 19,
    badge: 'Más vendido',
    note: 'Deja el celular a la vista para seguir el GPS sin tenerlo en la mano mientras manejás.',
  },
  {
    id: 'funda-mascotas',
    title: 'Funda protectora impermeable para mascotas, para auto y camioneta',
    category: 'accesorios',
    url: 'https://meli.la/1Z59Ueg',
    image: 'https://http2.mlstatic.com/D_NQ_NP_608099-MLA93190713175_092025-O.webp',
    seller: 'Jass Ventas',
    price: 18399,
    originalPrice: 19999,
    discount: 8,
    badge: 'Más vendido',
    note: 'Protege el asiento trasero del pelo, el barro y los rasguños cuando viajás con tu perro.',
  },
]

export function discountPercentage(product: Product): number | null {
  if (!product.price || !product.originalPrice || product.originalPrice <= product.price) return null
  return product.discount ?? Math.floor((1 - product.price / product.originalPrice) * 100)
}
