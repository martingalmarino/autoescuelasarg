export type ProductCategoryId = 'neumaticos' | 'bateria' | 'limpieza' | 'seguridad' | 'accesorios'

export interface ProductCategory {
  id: ProductCategoryId
  name: string
}

export type ProductBadge = 'Más vendido' | 'Recomendado' | 'Oferta'

export interface Product {
  id: string
  title: string
  category: ProductCategoryId
  /** Enlace de afiliado de Mercado Libre (meli.la). */
  url: string
  /** URL de la imagen del producto (http2.mlstatic.com u otro dominio permitido en next.config.js). */
  image?: string
  seller?: string
  /** Precio de referencia en pesos; se muestra aclarando que puede cambiar. */
  price?: number
  originalPrice?: number
  /** Porcentaje de descuento tal como lo muestra Mercado Libre; si falta, se calcula con los precios. */
  discount?: number
  installments?: { count: number; amount: number }
  badge?: ProductBadge
  /** Por qué lo recomendamos, en una o dos oraciones. */
  note?: string
}
