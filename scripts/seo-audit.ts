/**
 * Audita title, meta description, canonical y robots de todas las URLs del sitemap.
 * Uso: npx tsx scripts/seo-audit.ts [baseUrl]   (por defecto https://www.autoescuelas.ar)
 */

const baseUrl = (process.argv[2] || 'https://www.autoescuelas.ar').replace(/\/$/, '')
const CANONICAL_HOST = 'https://www.autoescuelas.ar'

const EXTRA_URLS = ['/buscar', '/autoescuelas?page=2', '/autoescuelas?sort=name_asc']

interface PageReport {
  url: string
  status: number
  title: string
  description: string
  canonical: string
  noindex: boolean
  issues: string[]
}

function decode(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function pick(html: string, regex: RegExp) {
  const match = html.match(regex)
  return match ? decode(match[1]).trim() : ''
}

async function audit(path: string, inSitemap: boolean): Promise<PageReport> {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'follow' })
  const html = await response.text()
  const title = pick(html, /<title>([^<]*)<\/title>/)
  const description = pick(html, /<meta name="description" content="([^"]*)"/)
  const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/)
  const robots = pick(html, /<meta name="robots" content="([^"]*)"/)
  const noindex = /noindex/.test(robots)
  const issues: string[] = []

  if (response.status !== 200) issues.push(`status ${response.status}`)
  if (!title) issues.push('sin title')
  else if (title.length > 60) issues.push(`title largo (${title.length})`)
  if (!description) issues.push('sin description')
  else {
    if (description.length > 160) issues.push(`description larga (${description.length})`)
    if (description.length < 120) issues.push(`description corta (${description.length})`)
    if (/[<>]|&lt;|&gt;/.test(description)) issues.push('description con HTML')
  }

  const expectedCanonical = path.startsWith('/autoescuelas?') && !path.startsWith('/autoescuelas?page=')
    ? `${CANONICAL_HOST}/autoescuelas`
    : `${CANONICAL_HOST}${path === '/' ? '' : path}`
  const normalize = (url: string) => url.replace(/\/$/, '')
  if (normalize(canonical) !== normalize(expectedCanonical)) {
    issues.push(`canonical ${canonical || '(vacío)'} != ${expectedCanonical}`)
  }
  if (inSitemap && noindex) issues.push('noindex pero está en el sitemap')

  return { url: path, status: response.status, title, description, canonical, noindex, issues }
}

async function main() {
  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text()
  const sitemapPaths = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map(([, loc]) =>
    loc.replace(/^https?:\/\/[^/]+/, '') || '/'
  )
  const duplicates = sitemapPaths.filter((path, index) => sitemapPaths.indexOf(path) !== index)

  const reports: PageReport[] = []
  const queue = [
    ...sitemapPaths.map(path => ({ path, inSitemap: true })),
    ...EXTRA_URLS.map(path => ({ path, inSitemap: false })),
  ]
  const concurrency = 6
  for (let i = 0; i < queue.length; i += concurrency) {
    const batch = queue.slice(i, i + concurrency)
    reports.push(...(await Promise.all(batch.map(item => audit(item.path, item.inSitemap)))))
  }

  const titleCounts = new Map<string, number>()
  reports.filter(report => !report.noindex).forEach(report => {
    titleCounts.set(report.title, (titleCounts.get(report.title) || 0) + 1)
  })
  reports.forEach(report => {
    if (!report.noindex && (titleCounts.get(report.title) || 0) > 1) report.issues.push('title duplicado')
  })

  for (const report of reports) {
    const flag = report.issues.length ? 'FAIL' : 'ok  '
    console.log(`${flag} ${report.url}${report.noindex ? ' [noindex]' : ''}`)
    console.log(`     T(${report.title.length}) ${report.title}`)
    console.log(`     D(${report.description.length}) ${report.description}`)
    report.issues.forEach(issue => console.log(`     ! ${issue}`))
  }

  const failing = reports.filter(report => report.issues.length)
  console.log(`\n${reports.length} URLs auditadas, ${failing.length} con observaciones.`)
  if (duplicates.length) console.log(`URLs duplicadas en el sitemap: ${duplicates.join(', ')}`)
  process.exitCode = failing.length || duplicates.length ? 1 : 0
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
