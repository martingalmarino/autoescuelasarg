"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FAQ } from '@/lib/types'
import { analyticsEvents } from '@/lib/analytics'

interface FAQAccordionProps {
  faqs: FAQ[]
}

const defaultFAQs: FAQ[] = [
  {
    id: '1',
    question: '¿Cómo funciona Autoescuelas.ar?',
    answer: 'Autoescuelas.ar es un directorio que te ayuda a encontrar las mejores escuelas de manejo en Argentina. Puedes buscar por ubicación, ver reseñas de otros estudiantes, comparar precios y contactar directamente con las autoescuelas que más te interesen.'
  },
  {
    id: '2',
    question: '¿Es gratis usar la plataforma?',
    answer: 'Sí, completamente gratis. No cobramos comisiones por usar nuestro directorio. Solo te ayudamos a encontrar la autoescuela perfecta para ti, sin costos adicionales.'
  },
  {
    id: '3',
    question: '¿Cómo sé si una autoescuela es confiable?',
    answer: 'Todas las autoescuelas en nuestra plataforma están verificadas y cuentan con las licencias correspondientes. Además, puedes leer las reseñas de otros estudiantes y ver las calificaciones para tomar la mejor decisión.'
  },
  {
    id: '4',
    question: '¿Puedo reservar clases directamente desde la plataforma?',
    answer: 'Por el momento, te ayudamos a encontrar y contactar con las autoescuelas. Una vez que encuentres la que te guste, puedes contactarlas directamente para reservar tus clases de manejo.'
  },
  {
    id: '5',
    question: '¿Qué tipos de licencias puedo obtener?',
    answer: 'Las autoescuelas en nuestra plataforma ofrecen cursos para obtener licencias de conducir de diferentes categorías: A (motos), B (autos), C (camiones), D (micros) y E (camiones con acoplado), según la normativa de cada provincia.'
  }
]

export default function FAQAccordion({ faqs = defaultFAQs }: FAQAccordionProps) {
  const handleValueChange = (value: string) => {
    if (value) {
      const faq = faqs.find(f => f.id === value)
      if (faq) {
        analyticsEvents.faqExpand(faq.id, faq.question)
      }
    }
  }

  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Preguntas frecuentes
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              Resolvemos las dudas más comunes sobre nuestro servicio
            </p>
          </div>

          <Accordion 
            type="single" 
            collapsible 
            className="space-y-3 sm:space-y-4"
            onValueChange={handleValueChange}
          >
            {faqs.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id}
                className="rounded-lg border bg-background px-4 sm:px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline text-sm sm:text-base">
                  <span className="font-medium text-foreground">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
