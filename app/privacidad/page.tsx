import Link from 'next/link'
import LegalPage, { LEGAL_CONTACT_EMAIL } from '@/components/LegalPage'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  titleVariants: ['Política de privacidad'],
  description:
    'Cómo Autoescuelas.ar recopila, usa y protege tus datos personales según la Ley 25.326, qué cookies y anuncios de Google usamos y cómo ejercer tus derechos.',
  path: '/privacidad',
})

const sections = [
  {
    id: 'responsable',
    title: 'Responsable del tratamiento',
    content: (
      <>
        <p>
          El responsable de los datos personales recopilados a través de www.autoescuelas.ar (en adelante, el
          &quot;Sitio&quot;) es Autoescuelas.ar. Para cualquier consulta sobre esta política o sobre el tratamiento de
          tus datos podés escribirnos a <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>.
        </p>
        <p>
          Tratamos tus datos de acuerdo con la Ley N.º 25.326 de Protección de los Datos Personales de la República
          Argentina, su Decreto Reglamentario N.º 1558/2001 y las disposiciones de la Agencia de Acceso a la
          Información Pública.
        </p>
      </>
    ),
  },
  {
    id: 'datos',
    title: 'Qué datos recopilamos',
    content: (
      <>
        <h3>Datos que nos das voluntariamente</h3>
        <ul>
          <li>
            <strong>Formularios de contacto:</strong> nombre, teléfono, correo electrónico (opcional en algunos
            formularios), el mensaje que nos enviás y, si corresponde, la autoescuela sobre la que consultás.
          </li>
          <li>
            <strong>Reseñas y opiniones:</strong> nombre o alias, calificación, comentario y, de forma opcional, tu
            correo electrónico. El correo nunca se publica.
          </li>
          <li>
            <strong>Autoescuelas que solicitan aparecer en el directorio:</strong> datos de contacto del responsable y
            datos comerciales de la escuela (nombre, dirección, teléfono, servicios y precios).
          </li>
        </ul>
        <h3>Datos que se recopilan automáticamente</h3>
        <ul>
          <li>
            Datos técnicos de navegación, como dirección IP, tipo de navegador y dispositivo, sistema operativo, páginas
            visitadas, fecha y hora de acceso. Estos datos quedan registrados en los servidores de nuestro proveedor de
            hosting por motivos de seguridad y funcionamiento.
          </li>
          <li>
            Información obtenida mediante cookies y tecnologías similares, incluidas las de terceros que muestran
            publicidad. Encontrás el detalle en nuestra <Link href="/cookies">Política de cookies</Link>.
          </li>
        </ul>
        <p>No solicitamos datos sensibles (salud, religión, origen étnico, opiniones políticas, etc.).</p>
      </>
    ),
  },
  {
    id: 'finalidades',
    title: 'Para qué usamos tus datos',
    content: (
      <ul>
        <li>Responder tus consultas y mensajes.</li>
        <li>
          Hacer llegar tu consulta a la autoescuela que elegiste contactar, para que pueda responderte sobre clases,
          precios o disponibilidad.
        </li>
        <li>Publicar y moderar reseñas sobre las autoescuelas del directorio.</li>
        <li>Incorporar o actualizar la información de autoescuelas en el directorio.</li>
        <li>Mantener la seguridad del Sitio, prevenir fraudes y abusos, y resolver problemas técnicos.</li>
        <li>Mostrar publicidad, incluida publicidad personalizada, a través de Google AdSense.</li>
        <li>Mejorar los contenidos y el funcionamiento del Sitio.</li>
        <li>Cumplir obligaciones legales y responder requerimientos de autoridades competentes.</li>
      </ul>
    ),
  },
  {
    id: 'base-legal',
    title: 'Base legal y consentimiento',
    content: (
      <p>
        Tratamos tus datos con tu consentimiento libre, expreso e informado, que otorgás al completar un formulario o
        al seguir navegando el Sitio luego de haber sido informado sobre el uso de cookies, conforme al artículo 5 de
        la Ley N.º 25.326. También podemos tratarlos cuando sea necesario para cumplir una obligación legal. Podés
        revocar tu consentimiento en cualquier momento escribiéndonos, sin efecto retroactivo.
      </p>
    ),
  },
  {
    id: 'publicidad',
    title: 'Publicidad de Google AdSense',
    content: (
      <>
        <p>
          El Sitio muestra anuncios a través de Google AdSense, un servicio de Google LLC. En relación con esta
          publicidad:
        </p>
        <ul>
          <li>
            Proveedores externos, incluido Google, utilizan cookies para mostrar anuncios basados en las visitas
            anteriores que hiciste a este Sitio o a otros sitios web.
          </li>
          <li>
            Las cookies de publicidad permiten a Google y a sus socios mostrarte anuncios basados en tus visitas a este
            Sitio y a otros sitios de Internet.
          </li>
          <li>
            Podés inhabilitar la publicidad personalizada desde la{' '}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              Configuración de anuncios de Google
            </a>
            . También podés inhabilitar las cookies de otros proveedores de publicidad personalizada desde{' '}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              www.aboutads.info
            </a>{' '}
            o{' '}
            <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer">
              www.youronlinechoices.eu
            </a>
            .
          </li>
          <li>
            Si inhabilitás la publicidad personalizada, vas a seguir viendo anuncios, pero no estarán basados en tus
            intereses.
          </li>
        </ul>
        <p>
          Para saber más sobre cómo Google usa la información de los sitios que utilizan sus servicios, consultá{' '}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            Cómo utiliza Google la información de sitios o aplicaciones que usan sus servicios
          </a>{' '}
          y la{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Política de privacidad de Google
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'compartir',
    title: 'Con quién compartimos tus datos',
    content: (
      <>
        <p>No vendemos ni alquilamos tus datos personales. Solo los compartimos en estos casos:</p>
        <ul>
          <li>
            <strong>Autoescuelas:</strong> cuando enviás una consulta a una autoescuela desde su ficha, le hacemos
            llegar tus datos de contacto y tu mensaje para que pueda responderte. Desde ese momento, la autoescuela es
            responsable del uso que haga de esos datos.
          </li>
          <li>
            <strong>Proveedores de servicios</strong> que nos ayudan a operar el Sitio y que solo acceden a los datos
            necesarios para prestar su servicio: Vercel Inc. (hosting), Neon Inc. (base de datos), Cloudinary Ltd.
            (almacenamiento y entrega de imágenes) y Google LLC (publicidad).
          </li>
          <li>
            <strong>Autoridades:</strong> cuando una ley, una orden judicial o un requerimiento de autoridad competente
            así lo exija.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'transferencias',
    title: 'Transferencias internacionales',
    content: (
      <p>
        Algunos de nuestros proveedores almacenan o procesan datos en servidores ubicados fuera de la Argentina,
        principalmente en los Estados Unidos y en Brasil. En esos casos exigimos que apliquen medidas de seguridad y
        confidencialidad adecuadas, conforme al artículo 12 de la Ley N.º 25.326 y la normativa complementaria. Al
        utilizar el Sitio prestás tu consentimiento para estas transferencias.
      </p>
    ),
  },
  {
    id: 'conservacion',
    title: 'Cuánto tiempo conservamos los datos',
    content: (
      <ul>
        <li>Consultas y mensajes de contacto: hasta 24 meses desde la última comunicación.</li>
        <li>Reseñas publicadas: mientras la reseña permanezca publicada o hasta que solicites su eliminación.</li>
        <li>Datos de autoescuelas del directorio: mientras la escuela figure en el directorio.</li>
        <li>Registros técnicos del servidor: por los plazos que fije nuestro proveedor de hosting por seguridad.</li>
      </ul>
    ),
  },
  {
    id: 'derechos',
    title: 'Tus derechos',
    content: (
      <>
        <p>
          Tenés derecho a acceder, rectificar, actualizar y suprimir tus datos personales, y a revocar tu
          consentimiento. Para ejercerlos, escribinos a{' '}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a> indicando tu nombre, el derecho que
          querés ejercer y un medio de contacto. Podemos pedirte que acredites tu identidad. Responderemos las
          solicitudes de acceso dentro de los 10 días corridos y las de rectificación, actualización o supresión dentro
          de los 5 días hábiles, conforme a los artículos 14 y 16 de la Ley N.º 25.326.
        </p>
        <p>
          El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma
          gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme
          lo establecido en el artículo 14, inciso 3 de la Ley N.º 25.326.
        </p>
        <p>
          La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la Ley N.º 25.326,
          tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus
          derechos por incumplimiento de las normas vigentes en materia de protección de datos personales. Más
          información en{' '}
          <a href="https://www.argentina.gob.ar/aaip" target="_blank" rel="noopener noreferrer">
            www.argentina.gob.ar/aaip
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'seguridad',
    title: 'Seguridad',
    content: (
      <p>
        Aplicamos medidas técnicas y organizativas razonables para proteger tus datos contra pérdida, acceso no
        autorizado, alteración o divulgación: conexiones cifradas mediante HTTPS, acceso restringido a la base de datos
        y al panel de administración, y proveedores con estándares de seguridad reconocidos. Ningún sistema es
        completamente infalible, por lo que no podemos garantizar una seguridad absoluta.
      </p>
    ),
  },
  {
    id: 'menores',
    title: 'Menores de edad',
    content: (
      <p>
        El Sitio está dirigido a personas interesadas en aprender a manejar. No recopilamos de forma intencional datos
        de menores de 13 años. Los menores de 18 años deben contar con la autorización de su madre, padre o tutor para
        enviarnos sus datos. Si sabés que un menor nos proporcionó datos sin esa autorización, escribinos y los
        eliminaremos.
      </p>
    ),
  },
  {
    id: 'cambios',
    title: 'Cambios en esta política',
    content: (
      <p>
        Podemos actualizar esta política para reflejar cambios en el Sitio o en la normativa. Publicaremos la versión
        vigente en esta página con su fecha de última actualización. Si los cambios son relevantes, lo informaremos de
        forma visible en el Sitio.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Política de privacidad"
      intro={
        <p>
          En Autoescuelas.ar respetamos tu privacidad. Esta política explica qué datos personales recopilamos cuando
          usás nuestro directorio de autoescuelas y escuelas de manejo, para qué los usamos, con quién los compartimos y
          cómo podés ejercer tus derechos. Complementa nuestros <Link href="/terminos">Términos y condiciones</Link> y
          nuestra <Link href="/cookies">Política de cookies</Link>.
        </p>
      }
      sections={sections}
    />
  )
}
