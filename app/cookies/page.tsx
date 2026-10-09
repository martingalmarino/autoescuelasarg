import Link from 'next/link'
import LegalPage, { LEGAL_CONTACT_EMAIL } from '@/components/LegalPage'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  titleVariants: ['Política de cookies'],
  description:
    'Qué cookies usa Autoescuelas.ar, incluidas las de publicidad de Google AdSense, para qué sirven y cómo podés configurarlas o desactivarlas desde tu navegador.',
  path: '/cookies',
})

const cookieTypes = [
  {
    type: 'Técnicas o necesarias',
    provider: 'Autoescuelas.ar',
    purpose:
      'Permiten el funcionamiento básico y la seguridad del Sitio, por ejemplo mantener la sesión del panel de administración.',
    duration: 'Hasta 24 horas',
  },
  {
    type: 'Publicidad',
    provider: 'Google LLC (AdSense) y sus socios',
    purpose:
      'Muestran anuncios, limitan la cantidad de veces que ves un mismo anuncio, miden su rendimiento y, si lo permitís, personalizan los anuncios según tus intereses y visitas anteriores. Algunos ejemplos son __gads, __gpi, __eoi, IDE y test_cookie.',
    duration: 'Desde minutos hasta 13 meses',
  },
]

const browserGuides = [
  { name: 'Google Chrome', href: 'https://support.google.com/chrome/answer/95647?hl=es' },
  {
    name: 'Mozilla Firefox',
    href: 'https://support.mozilla.org/es/kb/Borrar%20cookies',
  },
  { name: 'Safari (Mac)', href: 'https://support.apple.com/es-es/guide/safari/sfri11471/mac' },
  { name: 'Safari (iPhone y iPad)', href: 'https://support.apple.com/es-es/HT201265' },
  {
    name: 'Microsoft Edge',
    href: 'https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09',
  },
]

const sections = [
  {
    id: 'que-son',
    title: 'Qué son las cookies',
    content: (
      <p>
        Las cookies son pequeños archivos de texto que un sitio web guarda en tu navegador cuando lo visitás. Sirven
        para que el sitio funcione correctamente, recuerde ciertas preferencias y, en algunos casos, para mostrar
        publicidad. También existen tecnologías similares, como el almacenamiento local del navegador, los píxeles o las
        etiquetas, a las que esta política también se aplica.
      </p>
    ),
  },
  {
    id: 'tipos',
    title: 'Qué cookies usamos',
    content: (
      <>
        <p>
          Según quién las instala, pueden ser <strong>propias</strong> (de Autoescuelas.ar) o{' '}
          <strong>de terceros</strong> (de otras empresas, como Google). En el Sitio usamos las siguientes:
        </p>
        <div className="mb-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="bg-muted text-left text-foreground">
                <th className="border p-3">Tipo</th>
                <th className="border p-3">Proveedor</th>
                <th className="border p-3">Finalidad</th>
                <th className="border p-3">Duración</th>
              </tr>
            </thead>
            <tbody>
              {cookieTypes.map((cookie) => (
                <tr key={cookie.type} className="align-top">
                  <td className="border p-3 font-medium text-foreground">{cookie.type}</td>
                  <td className="border p-3">{cookie.provider}</td>
                  <td className="border p-3">{cookie.purpose}</td>
                  <td className="border p-3">{cookie.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Actualmente no utilizamos cookies de análisis o medición de audiencia. Si en el futuro incorporamos alguna,
          actualizaremos esta política.
        </p>
      </>
    ),
  },
  {
    id: 'google',
    title: 'Cookies de publicidad de Google',
    content: (
      <>
        <p>
          El Sitio utiliza Google AdSense para mostrar anuncios. Proveedores externos, incluido Google, utilizan cookies
          para mostrar anuncios basados en las visitas anteriores que hiciste a este Sitio o a otros sitios web. Las
          cookies de publicidad permiten a Google y a sus socios mostrarte anuncios basados en tus visitas a este Sitio
          y a otros sitios de Internet.
        </p>
        <p>
          Podés inhabilitar la publicidad personalizada desde la{' '}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            Configuración de anuncios de Google
          </a>
          , o inhabilitar las cookies de otros proveedores desde{' '}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            www.aboutads.info
          </a>
          . Más información en{' '}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
            Cómo usa Google las cookies en la publicidad
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'consentimiento',
    title: 'Consentimiento',
    content: (
      <p>
        Las cookies técnicas son necesarias para que el Sitio funcione y no requieren tu consentimiento. Para las
        cookies de publicidad, al continuar navegando el Sitio aceptás su uso en los términos de esta política. Cuando
        la normativa aplicable lo exija, por ejemplo para visitantes del Espacio Económico Europeo, el Reino Unido o
        Suiza, te pediremos tu consentimiento antes de usar cookies de publicidad personalizada. Podés retirar tu
        consentimiento en cualquier momento borrando las cookies de tu navegador.
      </p>
    ),
  },
  {
    id: 'configurar',
    title: 'Cómo configurar o desactivar las cookies',
    content: (
      <>
        <p>
          Podés permitir, bloquear o eliminar las cookies desde la configuración de tu navegador. Estas son las guías de
          los navegadores más usados:
        </p>
        <ul>
          {browserGuides.map((guide) => (
            <li key={guide.name}>
              <a href={guide.href} target="_blank" rel="noopener noreferrer">
                {guide.name}
              </a>
            </li>
          ))}
        </ul>
        <p>
          Si bloqueás todas las cookies, es posible que algunas funciones del Sitio no estén disponibles. Bloquear las
          cookies de publicidad no elimina los anuncios: vas a seguir viéndolos, pero no estarán personalizados.
        </p>
      </>
    ),
  },
  {
    id: 'mas-informacion',
    title: 'Más información',
    content: (
      <p>
        Para conocer cómo tratamos tus datos personales, consultá nuestra{' '}
        <Link href="/privacidad">Política de privacidad</Link>. Si tenés dudas sobre esta política de cookies, escribinos
        a <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>. Podemos actualizar esta política cuando
        cambien las cookies que usamos o la normativa; la versión vigente es siempre la publicada en esta página.
      </p>
    ),
  },
]

export default function CookiesPage() {
  return (
    <LegalPage
      title="Política de cookies"
      intro={
        <p>
          Esta política explica qué son las cookies, cuáles usa Autoescuelas.ar, para qué sirven y cómo podés
          gestionarlas. Se aplica a todas las páginas de www.autoescuelas.ar.
        </p>
      }
      sections={sections}
    />
  )
}
