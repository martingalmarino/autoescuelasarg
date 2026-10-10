import type { Product, ProductCategory } from './types'
import catalog from './data/products.json'

export type { Product, ProductBadge, ProductCategory, ProductCategoryId } from './types'

// Precios, cuotas, descuentos y disponibilidad los actualiza cada lunes scripts/update-product-prices.mjs
// (GitHub Actions). Título, categoría, vendedor y nota son editoriales y el script no los toca.
const allProducts = catalog.products as Product[]

/** Fecha en que se revisaron por última vez los precios de referencia (AAAA-MM-DD). */
export const PRICES_CHECKED_ON: string = catalog.checkedOn

export const productCategories: ProductCategory[] = [
  { id: 'neumaticos', name: 'Neumáticos y aire' },
  { id: 'bateria', name: 'Batería y arranque' },
  { id: 'limpieza', name: 'Limpieza y lavado' },
  { id: 'seguridad', name: 'Seguridad y emergencias' },
  { id: 'accesorios', name: 'Accesorios' },
]

export const products: Product[] = allProducts.filter(product => product.available !== false)

export function discountPercentage(product: Product): number | null {
  if (!product.price || !product.originalPrice || product.originalPrice <= product.price) return null
  return product.discount ?? Math.floor((1 - product.price / product.originalPrice) * 100)
}
