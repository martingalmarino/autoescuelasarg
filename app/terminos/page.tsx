import Link from 'next/link'
import LegalPage, { LEGAL_CONTACT_EMAIL } from '@/components/LegalPage'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  titleVariants: ['Términos y condiciones'],
  description:
    'Condiciones de uso de Autoescuelas.ar, el directorio de autoescuelas y escuelas de manejo de Argentina: alcance del servicio, reseñas, responsabilidades y publicidad.',
  path: '/terminos',
})

const sections = [
  {
    id: 'aceptacion',
    title: 'Aceptación de los términos',
    content: (
      <p>
        Estos Términos y condiciones regulan el acceso y uso del sitio web www.autoescuelas.ar (en adelante, el
        &quot;Sitio&quot;), operado por Autoescuelas.ar. Al navegar o utilizar el Sitio aceptás estos términos, junto
        con nuestra <Link href="/privacidad">Política de privacidad</Link> y nuestra{' '}
        <Link href="/cookies">Política de cookies</Link>. Si no estás de acuerdo, te pedimos que no utilices el Sitio.
      </p>
    ),
  },
  {
    id: 'servicio',
    title: 'Descripción del servicio',
    content: (
      <>
        <p>
          Autoescuelas.ar es un directorio online e informativo que reúne autoescuelas y escuelas de manejo de la
          República Argentina. A través del Sitio podés buscar escuelas por provincia y ciudad, consultar sus datos de
          contacto, servicios, precios de referencia y opiniones, leer artículos de nuestro blog y enviar consultas.
        </p>
        <p>
          Autoescuelas.ar <strong>no es una autoescuela</strong>, no dicta clases de manejo ni otorga licencias de
          conducir. Las licencias son emitidas exclusivamente por los organismos públicos competentes de cada
          jurisdicción. Tampoco intervenimos en la contratación, el pago ni la prestación de los servicios que ofrecen
          las autoescuelas: cualquier acuerdo se celebra directamente entre vos y la escuela elegida.
        </p>
        <p>El uso del Sitio es gratuito para los usuarios que buscan una autoescuela.</p>
      </>
    ),
  },
  {
    id: 'informacion',
    title: 'Exactitud de la información',
    content: (
      <>
        <p>
          La información de las autoescuelas (direcciones, teléfonos, horarios, servicios, precios y fotos) proviene de
          las propias escuelas, de fuentes públicas o de nuestros usuarios. Hacemos esfuerzos razonables para mantenerla
          actualizada, pero no garantizamos que sea completa, exacta o vigente en todo momento.
        </p>
        <ul>
          <li>
            Los precios publicados son orientativos y pueden cambiar sin previo aviso. Confirmá siempre las condiciones
            directamente con la autoescuela antes de contratar.
          </li>
          <li>
            Los contenidos del blog y las preguntas frecuentes tienen fines informativos generales y no reemplazan la
            normativa vigente ni el asesoramiento de los organismos de tránsito de tu jurisdicción.
          </li>
          <li>
            La aparición de una escuela en el Sitio, o su posición en los listados, no implica una recomendación ni una
            garantía sobre la calidad de sus servicios.
          </li>
        </ul>
        <p>
          Si detectás un dato incorrecto, o sos responsable de una autoescuela y querés actualizar o dar de baja su
          ficha, escribinos desde la página de <Link href="/contacto">contacto</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'uso',
    title: 'Uso adecuado del Sitio',
    content: (
      <>
        <p>Al utilizar el Sitio te comprometés a:</p>
        <ul>
          <li>Brindar información verdadera al completar formularios o publicar opiniones.</li>
          <li>No utilizar el Sitio con fines ilícitos, fraudulentos o contrarios a estos términos.</li>
          <li>
            No enviar contenido ofensivo, discriminatorio, difamatorio, obsceno, que infrinja derechos de terceros o
            que contenga publicidad no autorizada o spam.
          </li>
          <li>
            No extraer de forma masiva o automatizada los contenidos del Sitio (scraping) ni intentar acceder a áreas
            restringidas, como el panel de administración.
          </li>
          <li>
            No realizar acciones que puedan dañar, sobrecargar o afectar el funcionamiento del Sitio, como introducir
            virus o código malicioso.
          </li>
          <li>No hacer clic de forma artificial ni incentivar clics en los anuncios publicados en el Sitio.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'resenas',
    title: 'Reseñas y contenido de los usuarios',
    content: (
      <>
        <p>
          Las opiniones y reseñas reflejan exclusivamente la experiencia y el punto de vista de quien las publica, y no
          representan la opinión de Autoescuelas.ar. Cada usuario es responsable del contenido que envía.
        </p>
        <p>
          Al publicar una reseña nos otorgás una licencia gratuita, no exclusiva y por tiempo indefinido para
          reproducirla y mostrarla en el Sitio. Nos reservamos el derecho de moderar, editar por razones de formato o
          eliminar, sin previo aviso, cualquier contenido que incumpla estos términos o que consideremos falso,
          engañoso o inapropiado.
        </p>
      </>
    ),
  },
  {
    id: 'autoescuelas',
    title: 'Autoescuelas que aparecen en el directorio',
    content: (
      <p>
        Las autoescuelas que solicitan aparecer en el Sitio o actualizar su información declaran que los datos que
        envían son verdaderos y que tienen derecho a publicarlos, incluidas las imágenes y logotipos. Autoescuelas.ar
        puede rechazar, editar o dar de baja fichas que contengan información incorrecta, que incumplan estos términos
        o a pedido de la propia escuela.
      </p>
    ),
  },
  {
    id: 'propiedad',
    title: 'Propiedad intelectual',
    content: (
      <p>
        El diseño del Sitio, los textos, artículos del blog, logotipos, la marca Autoescuelas.ar y el software son
        propiedad de Autoescuelas.ar o se usan con autorización de sus titulares, y están protegidos por la Ley N.º
        11.723 de Propiedad Intelectual y demás normas aplicables. No podés copiarlos, reproducirlos, distribuirlos ni
        modificarlos sin autorización previa y por escrito, salvo para uso personal y no comercial. Las marcas, nombres
        e imágenes de las autoescuelas pertenecen a sus respectivos titulares.
      </p>
    ),
  },
  {
    id: 'publicidad',
    title: 'Publicidad y enlaces externos',
    content: (
      <>
        <p>
          El Sitio se financia mediante publicidad, que puede ser mostrada por terceros como Google AdSense. Los
          anuncios son responsabilidad de sus anunciantes y su presencia no implica que recomendemos los productos o
          servicios anunciados. El uso de cookies publicitarias se explica en nuestra{' '}
          <Link href="/cookies">Política de cookies</Link>.
        </p>
        <p>
          El Sitio puede contener enlaces a sitios web de terceros, como las páginas de las autoescuelas o recursos
          externos. No controlamos esos sitios ni somos responsables de sus contenidos, políticas o prácticas.
        </p>
      </>
    ),
  },
  {
    id: 'responsabilidad',
    title: 'Limitación de responsabilidad',
    content: (
      <>
        <p>En la máxima medida permitida por la ley, Autoescuelas.ar no será responsable por:</p>
        <ul>
          <li>
            La calidad, seguridad, legalidad o cumplimiento de los servicios prestados por las autoescuelas, ni por los
            acuerdos, pagos o conflictos entre usuarios y escuelas.
          </li>
          <li>Errores, omisiones o desactualizaciones en la información publicada por terceros.</li>
          <li>
            Interrupciones, demoras o fallas técnicas del Sitio, o daños causados por virus u otros elementos dañinos
            que no se deban a nuestra culpa.
          </li>
          <li>Las decisiones que tomes basándote en la información del Sitio.</li>
        </ul>
        <p>
          Nada de lo dispuesto en estos términos limita los derechos que te corresponden como consumidor según la Ley
          N.º 24.240 de Defensa del Consumidor.
        </p>
      </>
    ),
  },
  {
    id: 'modificaciones',
    title: 'Modificaciones',
    content: (
      <p>
        Podemos modificar estos términos, así como el contenido, el diseño o las funciones del Sitio, en cualquier
        momento. La versión vigente es la publicada en esta página con su fecha de última actualización. El uso del
        Sitio después de un cambio implica la aceptación de los nuevos términos.
      </p>
    ),
  },
  {
    id: 'ley',
    title: 'Ley aplicable y jurisdicción',
    content: (
      <p>
        Estos términos se rigen por las leyes de la República Argentina. Cualquier controversia derivada del uso del
        Sitio será sometida a los tribunales ordinarios competentes de la República Argentina, sin perjuicio de los
        derechos que la normativa de defensa del consumidor reconoce a los usuarios para litigar en el tribunal de su
        domicilio.
      </p>
    ),
  },
  {
    id: 'contacto',
    title: 'Contacto',
    content: (
      <p>
        Si tenés preguntas sobre estos términos, escribinos a{' '}
        <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a> o usá nuestro{' '}
        <Link href="/contacto">formulario de contacto</Link>.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      title="Términos y condiciones"
      intro={
        <p>
          Te damos la bienvenida a Autoescuelas.ar. Antes de usar el Sitio, leé atentamente estos términos: explican
          qué podés esperar de nuestro directorio de autoescuelas, cuáles son tus responsabilidades y las nuestras.
        </p>
      }
      sections={sections}
    />
  )
}
