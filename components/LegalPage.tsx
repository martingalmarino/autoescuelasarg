import Link from 'next/link'

export const LEGAL_LAST_UPDATED = '9 de octubre de 2026'
export const LEGAL_CONTACT_EMAIL = 'info@autoescuelas.ar'

interface LegalSection {
  id: string
  title: string
  content: React.ReactNode
}

interface LegalPageProps {
  title: string
  intro: React.ReactNode
  sections: LegalSection[]
}

const legalLinks = [
  { href: '/terminos', label: 'Términos y condiciones' },
  { href: '/privacidad', label: 'Política de privacidad' },
  { href: '/cookies', label: 'Política de cookies' },
]

export default function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <div className="bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 text-center text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">{title}</h1>
          <p className="text-sm sm:text-base text-white/80">Última actualización: {LEGAL_LAST_UPDATED}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-24 h-fit space-y-6">
            <nav aria-label="Índice" className="rounded-lg border bg-white p-4">
              <p className="mb-3 text-sm font-semibold text-gray-900">Contenido</p>
              <ol className="space-y-2 text-sm">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-muted-foreground hover:text-primary">
                      {index + 1}. {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <nav aria-label="Documentos legales" className="rounded-lg border bg-white p-4">
              <p className="mb-3 text-sm font-semibold text-gray-900">Documentos legales</p>
              <ul className="space-y-2 text-sm">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <article className="rounded-lg border bg-white p-6 sm:p-10 text-gray-700 leading-relaxed [&_a]:text-primary [&_a]:underline [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-gray-900 [&_li]:mb-1.5 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_strong]:text-gray-900">
            <div className="mb-8 text-base sm:text-lg">{intro}</div>
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 border-t pt-6 mt-6 first-of-type:border-t-0 first-of-type:pt-0">
                <h2 className="mb-4 text-xl sm:text-2xl font-bold text-gray-900">
                  {index + 1}. {section.title}
                </h2>
                {section.content}
              </section>
            ))}
          </article>
        </div>
      </div>
    </div>
  )
}
