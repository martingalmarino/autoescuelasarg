#!/usr/bin/env node
// Revisa cada enlace de afiliado de lib/products/data/products.json en Mercado Libre y actualiza
// precio, precio anterior, descuento, cuotas, imagen, etiqueta "Más vendido" y disponibilidad.
// Uso: node scripts/update-product-prices.mjs [--dry-run]
// Con REPORT_PATH definido escribe ahí un resumen en Markdown (lo usa el workflow para el PR).

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const DATA_PATH = fileURLToPath(new URL('../lib/products/data/products.json', import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())

const formatMoney = value =>
  value === undefined ? '—' : `$${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value)}`

async function fetchPage(url) {
  let lastError
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'es-AR,es;q=0.9' },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.text()
    } catch (error) {
      lastError = error
      await sleep(3000 * attempt)
    }
  }
  throw lastError
}

const decode = text =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .trim()

/** Lee la tarjeta destacada del perfil de afiliado al que redirige el enlace meli.la. */
function parseAffiliatePage(html) {
  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1]
  const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1]
  if (!ogImage || !ogTitle) throw new Error('la página no tiene los datos del producto (¿bloqueo o cambio de diseño?)')

  const pictureId = ogImage.match(/D_NQ_NP_(?:2X_)?([\w-]+?)-[A-Z]\.\w+$/)?.[1]
  const start = html.indexOf('poly-card__portada')
  if (start === -1 || !pictureId) throw new Error('no se encontró la tarjeta del producto')
  const nextCard = html.indexOf('poly-card__portada', start + 1)
  const card = html.slice(start, nextCard === -1 ? start + 30000 : nextCard)
  if (!card.includes(pictureId)) throw new Error('la tarjeta destacada no coincide con el producto del enlace')

  const amount = re => {
    const match = card.match(re)
    return match ? Number(match[1]) : undefined
  }
  const currentBlock = card.match(/poly-price__current[\s\S]*?<\/div>/)?.[0] ?? ''
  const price = Number(currentBlock.match(/aria-label="(?:Ahora: )?(\d+) pesos/)?.[1]) || undefined
  const installmentsBlock = card.match(/poly-price__installments[^>]*>([\s\S]*?)<\/span><\/span>/)?.[1] ?? ''
  const installmentsCount = Number(installmentsBlock.match(/(\d+) cuotas/)?.[1]) || undefined
  const installmentsAmount = Number(installmentsBlock.match(/aria-label="(\d+) pesos/)?.[1]) || undefined
  const highlight = card.match(/poly-component__highlight">([^<]+)</)?.[1]

  return {
    title: decode(ogTitle),
    image: ogImage,
    price,
    originalPrice: amount(/aria-label="Antes: (\d+) pesos/),
    discount: amount(/>(\d+)% OFF</),
    installments:
      installmentsCount && installmentsAmount ? { count: installmentsCount, amount: installmentsAmount } : undefined,
    bestSeller: highlight ? decode(highlight).toUpperCase() === 'MÁS VENDIDO' : false,
  }
}

function applyUpdate(product, scraped) {
  const changes = []
  const set = (key, value, label, format = String) => {
    const before = product[key]
    if (JSON.stringify(before) === JSON.stringify(value)) return
    changes.push(`${label}: ${before === undefined ? '—' : format(before)} → ${value === undefined ? '—' : format(value)}`)
    if (value === undefined) delete product[key]
    else product[key] = value
  }

  if (!scraped.price) {
    if (product.available !== false) {
      product.available = false
      changes.push('Disponible: sí → no (sin precio; se oculta)')
    }
    return changes
  }

  if (product.available === false) {
    delete product.available
    changes.push('Disponible: no → sí')
  }
  set('price', scraped.price, 'Precio', formatMoney)
  set('originalPrice', scraped.originalPrice, 'Precio anterior', formatMoney)
  set('discount', scraped.originalPrice ? scraped.discount : undefined, 'Descuento', v => `${v}% OFF`)
  set('installments', scraped.installments, 'Cuotas', v => `${v.count} cuotas de ${formatMoney(v.amount)}`)
  set('image', scraped.image, 'Imagen', () => 'actualizada')
  // "Recomendado" y "Oferta" son editoriales; solo "Más vendido" depende de Mercado Libre.
  if (scraped.bestSeller && !product.badge) set('badge', 'Más vendido', 'Etiqueta')
  if (!scraped.bestSeller && product.badge === 'Más vendido') set('badge', undefined, 'Etiqueta')
  return changes
}

async function main() {
  const catalog = JSON.parse(readFileSync(DATA_PATH, 'utf8'))
  const results = []

  for (const product of catalog.products) {
    try {
      const scraped = parseAffiliatePage(await fetchPage(product.url))
      const changes = applyUpdate(product, scraped)
      results.push({ product, changes, error: null })
      console.log(`✓ ${product.id}${changes.length ? `: ${changes.join('; ')}` : ' sin cambios'}`)
    } catch (error) {
      results.push({ product, changes: [], error: error.message })
      console.error(`✗ ${product.id}: ${error.message}`)
    }
    await sleep(2000)
  }

  const checked = results.filter(result => !result.error)
  const failed = results.filter(result => result.error)
  const changed = checked.filter(result => result.changes.length > 0)

  if (checked.length > 0) catalog.checkedOn = today

  const lines = [
    `Revisión automática de precios en Mercado Libre del ${today}.`,
    '',
    `- Productos revisados: ${checked.length} de ${results.length}`,
    `- Con cambios: ${changed.length}`,
    '',
  ]
  if (changed.length) {
    lines.push('### Cambios', '')
    for (const { product, changes } of changed) {
      lines.push(`**${product.title}** ([enlace](${product.url}))`, ...changes.map(change => `- ${change}`), '')
    }
  }
  const hidden = catalog.products.filter(product => product.available === false)
  if (hidden.length) {
    lines.push(
      '### Ocultos por no mostrar precio',
      '',
      'La publicación puede estar pausada o sin stock. Se vuelven a mostrar solos si reaparece el precio.',
      '',
      ...hidden.map(product => `- [${product.title}](${product.url})`),
      ''
    )
  }
  if (failed.length) {
    lines.push(
      '### No se pudieron revisar',
      '',
      'Se mantienen los datos anteriores. Conviene abrir el enlace y revisarlo a mano.',
      '',
      ...failed.map(({ product, error }) => `- [${product.title}](${product.url}): ${error}`),
      ''
    )
  }
  const report = lines.join('\n')
  console.log(`\n${report}`)

  if (process.env.REPORT_PATH) writeFileSync(process.env.REPORT_PATH, report)
  if (!DRY_RUN) writeFileSync(DATA_PATH, `${JSON.stringify(catalog, null, 2)}\n`)

  if (checked.length === 0) {
    console.error('No se pudo revisar ningún producto.')
    process.exit(1)
  }
}

await main()
