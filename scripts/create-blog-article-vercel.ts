// Script para crear un artículo de blog en la base de datos de Vercel
// Este script debe ejecutarse en el entorno de Vercel

const createBlogArticle = async () => {
  try {
    const response = await fetch('/api/admin/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Guía completa para obtener tu licencia de conducir en Argentina',
        slug: 'guia-completa-licencia-conducir-argentina',
        excerpt: 'Todo lo que necesitás saber para obtener tu licencia de conducir en Argentina: requisitos, pasos, costos y consejos útiles.',
        content: `
          <h2>¿Qué necesitás para obtener tu licencia de conducir?</h2>
          
          <p>Obtener tu licencia de conducir en Argentina es un proceso que requiere cumplir con ciertos requisitos y seguir los pasos establecidos por cada jurisdicción. Te contamos todo lo que necesitás saber.</p>

          <h3>Requisitos básicos</h3>
          <ul>
            <li><strong>Edad mínima:</strong> 17 años (con autorización de padres/tutores) o 18 años</li>
            <li><strong>Documentación:</strong> DNI, certificado de domicilio, certificado médico</li>
            <li><strong>Examen teórico:</strong> Conocimiento de normas de tránsito</li>
            <li><strong>Examen práctico:</strong> Demostración de habilidades de manejo</li>
          </ul>

          <h3>Tipos de licencias</h3>
          <p>En Argentina existen diferentes categorías de licencias según el tipo de vehículo que querés conducir:</p>
          
          <ul>
            <li><strong>Licencia A:</strong> Motocicletas</li>
            <li><strong>Licencia B:</strong> Automóviles particulares</li>
            <li><strong>Licencia C:</strong> Camiones</li>
            <li><strong>Licencia D:</strong> Colectivos</li>
            <li><strong>Licencia E:</strong> Acoplados</li>
          </ul>

          <h3>Pasos para obtener tu licencia</h3>
          <ol>
            <li><strong>Inscribite en una autoescuela:</strong> Buscá una escuela de manejo autorizada en tu zona</li>
            <li><strong>Realizá el curso teórico:</strong> Aprendé las normas de tránsito y señalización</li>
            <li><strong>Tomá clases prácticas:</strong> Practicá el manejo con un instructor calificado</li>
            <li><strong>Rendí el examen teórico:</strong> Evaluación de conocimientos sobre tránsito</li>
            <li><strong>Rendí el examen práctico:</strong> Demostración de habilidades de manejo</li>
            <li><strong>Obtené tu licencia:</strong> Una vez aprobados ambos exámenes</li>
          </ol>

          <h3>Costos aproximados</h3>
          <p>Los costos pueden variar según la provincia y la autoescuela, pero en general incluyen:</p>
          <ul>
            <li>Curso teórico: $15.000 - $25.000</li>
            <li>Clases prácticas: $8.000 - $12.000 por clase</li>
            <li>Exámenes: $5.000 - $8.000</li>
            <li>Licencia: $3.000 - $5.000</li>
          </ul>

          <h3>Consejos útiles</h3>
          <ul>
            <li>Elegí una autoescuela con buena reputación y instructores calificados</li>
            <li>Practicá regularmente, especialmente en diferentes condiciones de tráfico</li>
            <li>Estudiá las normas de tránsito y señalización</li>
            <li>Mantené la calma durante los exámenes</li>
            <li>Considerá tomar clases adicionales si sentís que necesitás más práctica</li>
          </ul>

          <p>Recordá que cada provincia tiene sus propias regulaciones y requisitos específicos. Te recomendamos consultar con la autoridad de tránsito local para obtener información actualizada.</p>
        `,
        featuredImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        metaTitle: 'Guía completa para obtener tu licencia de conducir en Argentina 2024',
        metaDescription: 'Descubrí todo lo que necesitás saber para obtener tu licencia de conducir en Argentina: requisitos, pasos, costos y consejos útiles para aprobar el examen.',
        isPublished: true,
        category: 'Guías',
        tags: ['licencia de conducir', 'autoescuela', 'examen de manejo', 'Argentina', 'guía paso a paso'],
        author: 'Autoescuelas.ar',
        readingTime: 8,
        isFeatured: true,
        sortOrder: 1
      }),
    });

    if (response.ok) {
      const article = await response.json();
      console.log('✅ Artículo creado exitosamente:', article.title);
      return article;
    } else {
      const error = await response.json();
      console.error('❌ Error al crear artículo:', error);
      throw new Error(error.error || 'Error desconocido');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
};

// Ejecutar solo si estamos en el navegador
if (typeof window !== 'undefined') {
  createBlogArticle();
}

export default createBlogArticle;
